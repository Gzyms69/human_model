import { MIKRO_NODES, MIKRO_LINKS, type DomainNode, type DomainLink } from './data';
import { expandPathToValidGraphEdges } from './graphPathfinder';

export interface TraceStep {
  step: number;
  nodeId: string;
  title: string;
  trigger: string;
  whatHappened: string;
  whyItHappened: string;
  isSelfObserver?: boolean;
}

export interface EdgeExplanation {
  fromNodeId: string;
  toNodeId: string;
  transitionText: string;
}

export interface SituationAnalysisResult {
  initialStory?: string;
  interviewAnswers?: Record<string, string>;
  createdAt?: string;
  summary: string;
  storyNodes: string[];
  matchedLinks: DomainLink[];
  edgeExplanations: EdgeExplanation[];
  steps: TraceStep[];
  observerRoleSummary: string;
  rootCause: string;
  operationalLifehack: string;
  usedModel?: string;
}

export interface StreamCallbacks {
  onLog?: (msg: string, type?: 'info' | 'warn' | 'error' | 'success') => void;
  onToken?: (chunk: string) => void;
  onReasoning?: (thought: string) => void;
  onRawSseChunk?: (rawSse: string) => void;
  onRequestPayload?: (payload: object) => void;
  onProviderInfo?: (info: { provider?: string; model?: string; ttftMs?: number }) => void;
  onMetrics?: (metrics: { promptTokens: number; completionTokens: number; speedTokSec: number; durationMs: number }) => void;
}

const DEFAULT_API_KEY = '';
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemma-4-31b-it:free';

const FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'openrouter/free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'openai/gpt-oss-20b:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free'
];

function formatNodesCompact(nodes: DomainNode[]): string {
  return nodes
    .map((n) => `- Węzeł "${n.id}" (${n.title}): ${n.description}`)
    .join('\n');
}

function formatLinksCompact(links: DomainLink[]): string {
  return links
    .map((l) => `- Relacja: ${l.from} -> ${l.to} [Etykieta: "${l.label}"]`)
    .join('\n');
}

function formatActiveNodes3D(activeNodes: DomainNode[]): string {
  return activeNodes
    .map((n) => {
      let text = `=== WĘZEŁ ${n.id} ("${n.title}") ===\n- Opis: ${n.description}`;
      if (n.science) text += `\n- PERSPEKTYWA NAUKOWA / NEUROBIOLOGIA: ${n.science}`;
      if (n.psychology) text += `\n- PERSPEKTYWA PSYCHOLOGICZNA: ${n.psychology}`;
      if (n.philosophy) text += `\n- PERSPEKTYWA FILOZOFICZNA: ${n.philosophy}`;
      return text;
    })
    .join('\n\n');
}

function formatActiveLinks3D(activeLinks: DomainLink[]): string {
  return activeLinks
    .map((l) => {
      let text = `=== KRAWĘDŹ ${l.from} -> ${l.to} [${l.label}] ===\n- Opis: ${l.description}`;
      if (l.science) text += ` | Nauka: ${l.science}`;
      if (l.psychology) text += ` | Psychologia: ${l.psychology}`;
      if (l.philosophy) text += ` | Filozofia: ${l.philosophy}`;
      return text;
    })
    .join('\n');
}

function cleanJsonResponse(raw: string): any {
  let cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
  return JSON.parse(cleaned);
}

export async function generateClarifyingQuestions(
  userStory: string,
  customApiKey?: string,
  customModel?: string,
  callbacks?: StreamCallbacks
): Promise<string[]> {
  const apiKey = customApiKey || localStorage.getItem('human_model_openrouter_key') || DEFAULT_API_KEY;
  const requestedModel = customModel || localStorage.getItem('human_model_openrouter_model') || DEFAULT_MODEL;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Brak klucza API. Zaloguj się lub podaj klucz API w ustawieniach.');
  }

  const trimmedKey = apiKey.trim();
  const prompt = `Jesteś analitykiem behawioralnym. Użytkownik podał opis sytuacji ze swojego dnia: "${userStory}".
Zadaj dokładnie 3 bardzo konkretne, celowane pytania doprecyzowujące w języku polskim, które pozwolą odkryć tło i mechanikę (np. dlaczego doszło do impulsu, co działo się w ciele, jak zareagowała druga strona).

Zwróć TYLKO czysty obiekt JSON po polsku:
{
  "questions": [
    "Pytanie 1?",
    "Pytanie 2?",
    "Pytanie 3?"
  ]
}`;

  const candidateModels = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel)
  ];

  callbacks?.onLog?.(`Inicjalizacja generowania pytań doprecyzowujących dla wstępnego opisu...`, 'info');

  for (const targetModel of candidateModels) {
    try {
      callbacks?.onLog?.(`Połączenie z modelem: ${targetModel}...`, 'info');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://humanmodel.app',
          'X-Title': 'Human Model AI Tracer'
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        callbacks?.onLog?.(`Model ${targetModel} zwrócił kod ${response.status}. Przejście do kolejnego...`, 'warn');
        continue;
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) continue;

      const parsed = cleanJsonResponse(raw);
      if (Array.isArray(parsed.questions) && parsed.questions.length >= 3) {
        callbacks?.onLog?.(`Pomyślnie wygenerowano 3 pytania doprecyzowujące!`, 'success');
        return parsed.questions.slice(0, 3);
      }
    } catch (err: any) {
      callbacks?.onLog?.(`Model ${targetModel} nie odpowiedział: ${err.message}`, 'warn');
    }
  }

  callbacks?.onLog?.(`Wykorzystanie zapasowych pytań uniwersalnych.`, 'info');
  return [
    'Czy ta reakcja pojawiła się nagle, czy napięcie narastało już od dłuższego czasu?',
    'Jak zareagowało Twoje ciało i druga strona w momencie kulminacji?',
    'Czy pojawił się moment pauzy Obserwator (m1), czy impuls natychmiast przejął kontrolę?'
  ];
}

async function callOpenRouterApiStream(
  apiKey: string,
  candidateModels: string[],
  systemPrompt: string,
  userContent: string,
  callbacks?: StreamCallbacks
): Promise<{ rawContent: string; usedModel: string }> {
  const reasoningEffort = localStorage.getItem('human_model_reasoning_effort') || 'medium';
  let lastErrorMsg = '';

  for (const targetModel of candidateModels) {
    try {
      const payloadObject = {
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.2,
        stream: true,
        include_reasoning: true,
        reasoning: { effort: reasoningEffort },
        stream_options: { include_usage: true }
      };

      callbacks?.onRequestPayload?.(payloadObject);
      callbacks?.onLog?.(`Połączenie SSE (Model: ${targetModel}, Reasoning: ${reasoningEffort})...`, 'info');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const fetchStartTime = Date.now();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://humanmodel.app',
          'X-Title': 'Human Model AI Tracer'
        },
        body: JSON.stringify(payloadObject),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMsg = errorText;
        try {
          const errJson = JSON.parse(errorText);
          if (errJson.error?.message) parsedMsg = errJson.error.message;
        } catch {}

        callbacks?.onLog?.(`Błąd modelu ${targetModel} (${response.status}): ${parsedMsg}`, 'warn');
        lastErrorMsg = `(${response.status}) ${parsedMsg}`;
        continue;
      }

      callbacks?.onLog?.(`Połączenie SSE zaakceptowane (200 OK). Odczyt strumienia...`, 'success');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Nie udało się utworzyć czytnika strumienia.');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let rawContent = '';
      let rawReasoning = '';
      let inThinkBlock = false;
      let promptTokens = Math.round(systemPrompt.length / 3.5);
      let completionTokens = 0;
      const startTime = Date.now();
      let firstTokenTime = 0;
      let providerDetected = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const decodedChunk = decoder.decode(value, { stream: true });
        buffer += decodedChunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;

          callbacks?.onRawSseChunk?.(trimmed);

          if (trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);

              if (!providerDetected && (parsed.provider || parsed.model)) {
                providerDetected = true;
                callbacks?.onProviderInfo?.({
                  provider: parsed.provider || 'OpenRouter Auto Provider',
                  model: parsed.model || targetModel,
                  ttftMs: firstTokenTime ? firstTokenTime - fetchStartTime : Date.now() - fetchStartTime
                });
              }

              if (parsed.usage) {
                if (parsed.usage.prompt_tokens) promptTokens = parsed.usage.prompt_tokens;
                if (parsed.usage.completion_tokens) completionTokens = parsed.usage.completion_tokens;
              }

              const delta = parsed.choices?.[0]?.delta;
              if (delta) {
                if (delta.reasoning) {
                  rawReasoning += delta.reasoning;
                  callbacks?.onReasoning?.(delta.reasoning);
                }

                if (delta.content) {
                  if (!firstTokenTime) firstTokenTime = Date.now();

                  let contentChunk = delta.content;

                  if (contentChunk.includes('<think>')) {
                    inThinkBlock = true;
                    const parts = contentChunk.split('<think>');
                    if (parts[0]) {
                      rawContent += parts[0];
                      callbacks?.onToken?.(parts[0]);
                    }
                    if (parts[1]) {
                      rawReasoning += parts[1];
                      callbacks?.onReasoning?.(parts[1]);
                    }
                  } else if (inThinkBlock && contentChunk.includes('</think>')) {
                    const parts = contentChunk.split('</think>');
                    rawReasoning += parts[0];
                    callbacks?.onReasoning?.(parts[0]);
                    inThinkBlock = false;
                    if (parts[1]) {
                      rawContent += parts[1];
                      callbacks?.onToken?.(parts[1]);
                    }
                  } else if (inThinkBlock) {
                    rawReasoning += contentChunk;
                    callbacks?.onReasoning?.(contentChunk);
                  } else {
                    rawContent += contentChunk;
                    callbacks?.onToken?.(contentChunk);
                  }

                  const durationSec = Math.max((Date.now() - (firstTokenTime || startTime)) / 1000, 0.1);
                  const estimatedCompletionTok = Math.round(rawContent.length / 4);
                  const speedTokSec = Math.round(estimatedCompletionTok / durationSec);

                  callbacks?.onMetrics?.({
                    promptTokens,
                    completionTokens: completionTokens || estimatedCompletionTok,
                    speedTokSec: Math.max(speedTokSec, 1),
                    durationMs: Date.now() - startTime
                  });
                }
              }
            } catch {}
          }
        }
      }

      if (rawContent.trim()) {
        return { rawContent, usedModel: targetModel };
      }
    } catch (err: any) {
      callbacks?.onLog?.(`Błąd zapytania dla ${targetModel}: ${err.message}`, 'warn');
      lastErrorMsg = err.message || 'Błąd SSE';
    }
  }

  throw new Error(`Wszystkie modele nie powiodły się. Ostatni błąd: ${lastErrorMsg}`);
}

export async function analyzeSituation(
  userStory: string,
  userAnswers?: Record<string, string>,
  customApiKey?: string,
  customModel?: string,
  callbacks?: StreamCallbacks
): Promise<SituationAnalysisResult> {
  const apiKey = customApiKey || localStorage.getItem('human_model_openrouter_key') || DEFAULT_API_KEY;
  const requestedModel = customModel || localStorage.getItem('human_model_openrouter_model') || DEFAULT_MODEL;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Brak klucza API. Podaj klucz OpenRouter lub Google AI Studio w ustawieniach panelu AI.');
  }

  const trimmedKey = apiKey.trim();

  if (trimmedKey.startsWith('AIzaSy')) {
    callbacks?.onLog?.(`Wykryto klucz Google AI Studio (Gemini REST API)...`, 'info');
    const res = await analyzeWithGoogleDirect(userStory, userAnswers, trimmedKey, callbacks);
    res.initialStory = userStory;
    res.interviewAnswers = userAnswers;
    res.createdAt = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    return res;
  }

  const candidateModels = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel)
  ];

  let formattedAnswersContext = '';
  if (userAnswers && Object.keys(userAnswers).length > 0) {
    formattedAnswersContext = '\nFakty z wywiadu doprecyzowującego:\n' +
      Object.entries(userAnswers)
        .map(([q, a]) => `- Pytanie: "${q}" -> Odpowiedź: "${a}"`)
        .join('\n') + '\n';
  }

  // ==========================================
  // ETAP 1: Fast Path Finder (~600 tokenów)
  // ==========================================
  callbacks?.onLog?.(`[ETAP 1/3]: Wyznaczanie ścieżki przyczynowo-skutkowej w grafie...`, 'info');

  const compactNodes = formatNodesCompact(MIKRO_NODES);
  const compactLinks = formatLinksCompact(MIKRO_LINKS);

  const stage1Prompt = `Jesteś szybkim nawigatorem po grafie "Human Model".
Twoim celem jest wyznaczenie sekwencji węzłów (storyNodes), po których przebiegła sytuacja użytkownika.

Dostępne Węzły:
${compactNodes}

Dozwolone Przejścia:
${compactLinks}
${formattedAnswersContext}
Wymogi:
1. ZAWSZE dołącz węzeł 'm1' (Jaźń / Obserwator) na odpowiednim etapie ścieżki.
2. Ścieżka powinna mieć od 5 do 8 kroków.
3. Wyłącznie czysty JSON w języku polskim:
{
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"]
}`;

  const stage1Result = await callOpenRouterApiStream(
    trimmedKey,
    candidateModels,
    stage1Prompt,
    `Oto sytuacja użytkownika do analizy: "${userStory}"`,
    callbacks
  );

  const parsedStage1 = cleanJsonResponse(stage1Result.rawContent);
  const validNodeIds = new Set(MIKRO_NODES.map((n) => n.id));
  const rawNodes = (parsedStage1.storyNodes || []).filter((id: string) => validNodeIds.has(id));

  // Graph path verification & expansion via deterministic pathfinder
  const pathExp = expandPathToValidGraphEdges(rawNodes.length > 0 ? rawNodes : ['m11', 'm7', 'm4', 'm3', 'm1', 'm5', 'm2', 'm6']);
  const storyNodes = pathExp.expandedNodes;
  const matchedLinks = pathExp.matchedLinks;

  callbacks?.onLog?.(`[ETAP 1/3 Sukces]: Ścieżka wyznaczona (${storyNodes.join(' -> ')}).`, 'success');

  // ==========================================
  // ETAP 2: Trójwymiarowa Dekompozycja Kroków (Psychologia + Filozofia + Nauka)
  // ==========================================
  callbacks?.onLog?.(`[ETAP 2/3]: Trójwymiarowa dekompozycja naukowa, psychologiczna i filozoficzna...`, 'info');

  const activeNodesDefs = MIKRO_NODES.filter((n) => storyNodes.includes(n.id));
  const activeNodes3D = formatActiveNodes3D(activeNodesDefs);
  const activeLinks3D = formatActiveLinks3D(matchedLinks);

  const stage2Prompt = `Jesteś światowej klasy analitykiem behawioralnym.
Wyznaczono następującą sekwencję w grafie: ${storyNodes.join(' -> ')}.

Oto DEDYKOWANA WIEDZA w 3 WYMIARACH (Nauka, Psychologia, Filozofia) wyłącznie dla aktywnych węzłów i relacji:
${activeNodes3D}

${activeLinks3D}
${formattedAnswersContext}
BEZWZGLĘDNE NAKAZY TRÓJWYMIAROWEJ DEKOMPOZYCJI (100% POLSKI):
1. Wszystkie pola MUSZĄ być w 100% w języku polskim. Zero anglicyzmów w opisie przejść czy kroków!
2. Dla KAŻDEGO węzła w sekwencji (${storyNodes.join(', ')}) podaj obiekt w "steps":
   - "trigger": konkretny wyzwalacz krok po kroku.
   - "whatHappened": co się fizycznie/psychicznie stało.
   - "whyItHappened": Głębokie uzasadnienie łączące w 3 wyczerpujących wymiarach:
     * Wymiar Naukowy (Neurobiologia/Biochemia, np. PFC, DMN, ciało migdałowate, glukoza, adenozyna).
     * Wymiar Psychologiczny (Mechanizmy poznawcze/emocjonalne, np. ACT, CBT, fuzja, ego depletion).
     * Wymiar Filozoficzny (Egzystencja, np. Stoicyzm, Anatta, Husserl, Spinoza, Kant).
3. W "edgeExplanations" dla każdego przejścia podaj "transitionText" w języku polskim.

Zwróć TYLKO czysty JSON:
{
  "edgeExplanations": [
    { "fromNodeId": "m11", "toNodeId": "m7", "transitionText": "Wyczerpanie metaboliczne obniża poziom glukozy, wywołując somatyczne sygnały stresu w ciele." }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia / Stan Metaboliczny",
      "trigger": "8h intensywnej pracy bez przerwy",
      "whatHappened": "Spadek glukozy i akumulacja adenozyny w mózgu",
      "whyItHappened": "Nauka: Kora przedczołowa utraciła ATP niezbędne do hamowania impulsów. Psychologia: Wyczerpanie samokontroli (ego depletion) uniemożliwia regulację afektu. Filozofia: Materializm biologiczny – racjonalność i wola bezwzględnie wymagają sprawnego nośnika metabolicznego."
    }
  ]
}`;

  const stage2Result = await callOpenRouterApiStream(
    trimmedKey,
    candidateModels,
    stage2Prompt,
    `Oto sytuacja: "${userStory}"`,
    callbacks
  );

  const parsedStage2 = cleanJsonResponse(stage2Result.rawContent);
  callbacks?.onLog?.(`[ETAP 2/3 Sukces]: Zdekomponowano trójwymiarowo wszystkie kroki.`, 'success');

  // ==========================================
  // ETAP 3: Meta-Synteza Jaźni (m1), Root Cause i Lifehacki
  // ==========================================
  callbacks?.onLog?.(`[ETAP 3/3]: Meta-synteza roli Jaźni (m1), przyczyny źródłowej i Stoperów...`, 'info');

  const activeLifehacks = activeNodesDefs
    .map((n) => `- ${n.title}: ${n.lifehack}`)
    .join('\n');

  const stage3Prompt = `Jesteś mistrzem syntezy systemu "Human Model".
Oto wygenerowane kroki dekompozycji: ${JSON.stringify(parsedStage2.steps || [])}.

Dostępne Stopery / Lifehacki dla aktywnych węzłów:
${activeLifehacks}

Zbuduj końcowe wnioski w 100% po polsku:
1. "summary": Krótkie 2-3 zdaniowe podsumowanie całej mechaniki sytuacji po polsku.
2. "observerRoleSummary": Szegółowy opis roli i stanu Jaźni / Obserwatora (m1) w tej sytuacji.
3. "rootCause": Mechaniczna przyczyna źródłowa zdarzenia na poziomie systemowym.
4. "operationalLifehack": Praktyczna wskazówka (Stoper / Lifehack) zapobiegająca powtórzeniu w przyszłości.

Zwróć TYLKO czysty JSON:
{
  "summary": "...",
  "observerRoleSummary": "...",
  "rootCause": "...",
  "operationalLifehack": "..."
}`;

  const stage3Result = await callOpenRouterApiStream(
    trimmedKey,
    candidateModels,
    stage3Prompt,
    `Sytuacja: "${userStory}"`,
    callbacks
  );

  const parsedStage3 = cleanJsonResponse(stage3Result.rawContent);
  callbacks?.onLog?.(`[ETAP 3/3 Sukces]: Generowanie pełnego śladu zakończone!`, 'success');

  const rawSteps: TraceStep[] = parsedStage2.steps || [];
  const steps = patchStepsToCoverExpandedNodes(rawSteps, storyNodes);

  const finalResult: SituationAnalysisResult = {
    initialStory: userStory,
    interviewAnswers: userAnswers,
    createdAt: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    summary: parsedStage3.summary || 'Podsumowanie mechaniczne sytuacji.',
    storyNodes: storyNodes,
    matchedLinks: matchedLinks,
    edgeExplanations: parsedStage2.edgeExplanations || [],
    steps: steps,
    observerRoleSummary: parsedStage3.observerRoleSummary || 'Jaźń (m1) uległa fuzji z impulsem.',
    rootCause: parsedStage3.rootCause || 'Wyczerpanie metaboliczne osłabiło samokontrolę.',
    operationalLifehack: parsedStage3.operationalLifehack || 'Zastosuj 5-sekundową pauzę (Gap Practice).',
    usedModel: stage2Result.usedModel
  };

  return sanitizeAnalysisResult(finalResult);
}

function sanitizeAnalysisResult(result: SituationAnalysisResult): SituationAnalysisResult {
  if (!result) return result;

  if (Array.isArray(result.edgeExplanations)) {
    result.edgeExplanations = result.edgeExplanations.map((edge) => {
      let text = edge.transitionText || '';
      const isEnglish = (
        /\b(Metabolic depletion|reduces glucose|Somatic tension|activates|Emotions fuel|Overwhelming thoughts|Loss of observer|Impulse overwhelms|Depleted willpower|relational action|impulsive|observer's|executive control|somatic stress)\b/i.test(text)
      );

      if (isEnglish) {
        const linkDef = MIKRO_LINKS.find((l) => l.from === edge.fromNodeId && l.to === edge.toNodeId);
        if (linkDef) {
          text = linkDef.label ? `${linkDef.label}: ${linkDef.description}` : linkDef.description;
        } else {
          const fromNode = MIKRO_NODES.find((n) => n.id === edge.fromNodeId);
          const toNode = MIKRO_NODES.find((n) => n.id === edge.toNodeId);
          text = `Przeniesienie sygnału z ${fromNode?.title || edge.fromNodeId} do ${toNode?.title || edge.toNodeId}.`;
        }
      }

      return {
        ...edge,
        transitionText: text
      };
    });
  }

  return result;
}

function patchStepsToCoverExpandedNodes(rawSteps: TraceStep[], expandedNodes: string[]): TraceStep[] {
  const stepsMap = new Map<string, TraceStep>();
  rawSteps.forEach((s) => stepsMap.set(s.nodeId, s));

  return expandedNodes.map((nodeId, idx) => {
    const nodeDef = MIKRO_NODES.find((n) => n.id === nodeId);
    const existing = stepsMap.get(nodeId);

    if (existing) {
      return {
        ...existing,
        step: idx + 1,
        isSelfObserver: nodeId === 'm1'
      };
    }

    return {
      step: idx + 1,
      nodeId: nodeId,
      title: nodeDef?.title || nodeId,
      trigger: 'Ogniwo pośrednie przepływu systemowego',
      whatHappened: nodeDef?.description || 'Przeniesienie sygnału w układowym ciągu przyczynowym.',
      whyItHappened: `Aktywacja układu na poziomie ${nodeDef?.title || nodeId} w reakcji na narastające napięcie.`,
      isSelfObserver: nodeId === 'm1'
    };
  });
}

async function analyzeWithGoogleDirect(
  userStory: string,
  userAnswers?: Record<string, string>,
  apiKey?: string,
  callbacks?: StreamCallbacks
): Promise<SituationAnalysisResult> {
  const compactNodes = formatNodesCompact(MIKRO_NODES);
  const compactLinks = formatLinksCompact(MIKRO_LINKS);

  let formattedAnswers = '';
  if (userAnswers) {
    formattedAnswers = JSON.stringify(userAnswers);
  }

  callbacks?.onLog?.(`Wysyłanie zapytania do Google AI Studio REST API (Gemini 1.5 Flash)...`, 'info');

  const prompt = `Jesteś światowej klasy analitykiem behawioralnym w projekcie Human Model.
WSZYSTKIE opisy i wyjaśnienia w wygenerowanym obiekcie JSON MUSZĄ być w 100% w języku polskim!

Węzły:
${compactNodes}

Krawędzie:
${compactLinks}

Wywiad: ${formattedAnswers}

Wymogi odnośnie kroków:
Dla każdego kroku pole "whyItHappened" MUSI zawierać 3 wymiary po polsku:
- Wymiar Naukowy (Neurobiologia/Biochemia)
- Wymiar Psychologiczny (Mechanizmy afektu/samokontroli)
- Wymiar Filozoficzny (Egzystencja/Samoświadomość)

Zwróć TYLKO czysty wygenerowany JSON:
{
  "summary": "Naukowe 2-3 zdaniowe podsumowanie mechaniki całej sytuacji po polsku",
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"],
  "edgeExplanations": [
    { "fromNodeId": "m11", "toNodeId": "m7", "transitionText": "Opis przeniesienia sygnału po polsku" }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia / Stan Metaboliczny",
      "trigger": "8h pracy",
      "whatHappened": "Spadek glukozy w mózgu",
      "whyItHappened": "Wymiar Naukowy: Kora czołowa utraciła ATP niezbędne do hamowania impulsów. Wymiar Psychologiczny: Wyczerpanie woli (ego depletion) uniemożliwia regulację emocji. Wymiar Filozoficzny: Wola i racjonalność wymagają sprawnego nośnika biologicznego.",
      "isSelfObserver": false
    }
  ],
  "observerRoleSummary": "Opis roli Jaźni po polsku",
  "rootCause": "Przyczyna źródłowa po polsku",
  "operationalLifehack": "Wskazówka (Stoper) po polsku"
}

Sytuacja: "${userStory}"`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    callbacks?.onLog?.(`Błąd Google AI Studio (${response.status}): ${errText}`, 'error');
    throw new Error(`Błąd Google AI Studio (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawContent) throw new Error('Otrzymano pustą odpowiedź z Google AI Studio');

  callbacks?.onLog?.(`Otrzymano odpowiedź z Google AI Studio. Parsowanie JSON...`, 'success');

  const result: SituationAnalysisResult = cleanJsonResponse(rawContent);

  const validNodeIds = new Set(MIKRO_NODES.map((n) => n.id));
  const rawNodes = (result.storyNodes || []).filter((id) => validNodeIds.has(id));

  const pathExp = expandPathToValidGraphEdges(rawNodes.length > 0 ? rawNodes : ['m11', 'm7', 'm4', 'm3', 'm1', 'm5', 'm2', 'm6']);
  result.storyNodes = pathExp.expandedNodes;
  result.matchedLinks = pathExp.matchedLinks;
  result.steps = patchStepsToCoverExpandedNodes(result.steps || [], result.storyNodes);
  result.usedModel = 'Google AI Studio (Gemini 1.5 Flash)';

  return sanitizeAnalysisResult(result);
}
