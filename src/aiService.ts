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

function formatNodesContext(nodes: DomainNode[]): string {
  return nodes
    .map((n) => {
      let text = `- ID: "${n.id}" | Nazwa: "${n.title}" | Grupa: ${n.group || 'brak'}\n  Opis: ${n.description}`;
      if (n.psychology) text += `\n  Psychologia: ${n.psychology}`;
      if (n.philosophy) text += `\n  Filozofia: ${n.philosophy}`;
      if (n.science) text += `\n  Nauka: ${n.science}`;
      if (n.lifehack) text += `\n  Stoper/Lifehack: ${n.lifehack}`;
      return text;
    })
    .join('\n\n');
}

function formatLinksContext(links: DomainLink[]): string {
  return links
    .map((l) => {
      let text = `- Relacja: ${l.from} -> ${l.to} [Typ: ${l.type}, Etykieta: "${l.label}"] (${l.description})`;
      if (l.psychology) text += ` | Psychologia: ${l.psychology}`;
      if (l.philosophy) text += ` | Filozofia: ${l.philosophy}`;
      if (l.science) text += ` | Nauka: ${l.science}`;
      if (l.lifehack) text += ` | Lifehack: ${l.lifehack}`;
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
Zadaj dokładnie 3 bardzo konkretne, celowane pytania doprecyzowujące, które pozwolą odkryć tło i mechanikę (np. dlaczego doszło do impulsu, co działo się w ciele, jak zareagowała druga strona).

Zwróć TYLKO czysty obiekt JSON:
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
    callbacks?.onLog?.(`Wykryto bezpośredni klucz Google AI Studio (Gemini Flash API)...`, 'info');
    const res = await analyzeWithGoogleDirect(userStory, userAnswers, trimmedKey, callbacks);
    res.initialStory = userStory;
    res.interviewAnswers = userAnswers;
    res.createdAt = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    return res;
  }

  const nodesContext = formatNodesContext(MIKRO_NODES);
  const linksContext = formatLinksContext(MIKRO_LINKS);

  let formattedAnswersContext = '';
  if (userAnswers && Object.keys(userAnswers).length > 0) {
    formattedAnswersContext = '\nDodatkowe fakty i wyjaśnienia udzielone przez użytkownika w wywiadzie:\n' +
      Object.entries(userAnswers)
        .map(([q, a]) => `- Pytanie: "${q}" -> Odpowiedź: "${a}"`)
        .join('\n') + '\n';
  }

  const systemPrompt = `Jesteś światowej klasy analitykiem behawioralnym i twórcą systemu "Human Model".
Twoim zadaniem jest dokładna dekompozycja sytuacji z życia użytkownika na ciągły, nieprzerwany przepływ przyczynowo-skutkowy po grafie systemowym.

BEZWZGLĘDNE ZASADY JĘZYKOWE I JAKOŚCIOWE (KRYTYCZNE):
1. **100% JĘZYK POLSKI**: Wszystkie polska tekstu w wygenerowanym obiekcie JSON MUSZĄ być bezwzględnie w języku polskim. Absolutny zakaz używania języka angielskiego w polach transitionText, whyItHappened, summary, rootCause itp. (Zabronione angielskie frazy takie jak: "Metabolic depletion", "Somatic tension", "Emotions fuel", "Overwhelming thoughts", "Loss of observer", "Impulse overwhelms", "Depleted willpower").
2. **GŁĘBOKOŚĆ NAUKOWA I BRAK LENISTWA**: Pole "whyItHappened" w KAŻDYM kroku MUSI zawierać MINIMUM 2 PEŁNE ZDANIA wyczerpującego uzasadnienia z użyciem pojęć z neurobiologii, psychologii i biologii (np. kora przedczołowa/PFC, ciało migdałowate, DMN, deplecja glukozy, adenozyna, kortyzol, dopamina, osie HPA, defuzja poznawcza, układ limbiczny).
3. **Przepływ po Grafie**: Sytuacja to ciągła reakcja łańcuchowa po istniejących krawędziach grafu.
4. **Obowiązek Jaźni / Obserwatora (m1)**: W KAŻDEJ analizie MUSISZ uwzględnić węzeł 'm1' (Jaźń / Obserwator). Wyjaśnij mechanicznie, czy Jaźń zadziałała, czy uległa fuzji/przytłoczeniu przez automat.

Dostępne Węzły Systemowe wraz z ich wiedzą naukową, psychologiczną i filozoficzną:
${nodesContext}

Istniejące Połączenia w Grafie:
${linksContext}
${formattedAnswersContext}
PRZYKŁADOWA WZORCOWA STRUKTURA I POZIOM SZCZEGÓŁOWOŚCI (FEW-SHOT):
{
  "summary": "Długotrwałe wyczerpanie metaboliczne i brak snu doprowadziły do spadku energii w kórze czołowej. Osłabiona samokontrola sprawiła, że aktywowane w ciele napięcie i narastający gniew przejęły sterowanie zachowaniem, co doprowadziło do impulsywnej decyzji o zerwaniu.",
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"],
  "edgeExplanations": [
    {
      "fromNodeId": "m11",
      "toNodeId": "m7",
      "transitionText": "Wyczerpanie metaboliczne obniża poziom glukozy, wywołując somatyczne sygnały stresu w ciele."
    },
    {
      "fromNodeId": "m7",
      "toNodeId": "m4",
      "transitionText": "Napięcie w ciele aktywuje silny negatywny afekt i narastające emocje."
    },
    {
      "fromNodeId": "m4",
      "toNodeId": "m3",
      "transitionText": "Silne emocje zasilają katastroficzne myśli i fuzję poznawczą."
    },
    {
      "fromNodeId": "m3",
      "toNodeId": "m1",
      "transitionText": "Przytłaczające myśli osłabiają metakognitywną perspektywę Obserwatora."
    },
    {
      "fromNodeId": "m1",
      "toNodeId": "m5",
      "transitionText": "Utrata dystansu Obserwatora pozwala na dominację impulsywnych pragnień."
    },
    {
      "fromNodeId": "m5",
      "toNodeId": "m2",
      "transitionText": "Gwałtowny impuls przełamuje kontrolę wykonawczą i osłabia samokontrolę."
    },
    {
      "fromNodeId": "m2",
      "toNodeId": "m6",
      "transitionText": "Wyczerpana wola prowadzi bezpośrednio do reaktywnego działania w relacji."
    }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia / Stan Metaboliczny",
      "trigger": "8h intensywnej pracy bez przerwy",
      "whatHappened": "Spadek glukozy i akumulacja adenozyny w mózgu",
      "whyItHappened": "Kora przedczołowa utraciła kluczowe paliwo metaboliczne niezbędne do aktywnego hamowania impulsów i regulowania afektu. Spadek poziomu ATP obniża próg aktywacji układu współczulnego."
    }
  ],
  "observerRoleSummary": "Jaźń (m1) uległa fuzji z przepływem emocjonalnym z powodu metabolicznego przeciążenia kory przedczołowej.",
  "rootCause": "Mechaniczna przyczyna źródłowa: wyczerpanie zasobów metabolicznych kory czołowej osłabiło hamowanie limbiczne, uwalniając reaktywny impuls.",
  "operationalLifehack": "Wprowadź 5-sekundową fizyczną pauzę (Gap Practice) oraz uzupełnij nawodnienie i glukozę przed podjęciem wiążącej decyzji."
}

Wymogi odnośnie odpowiedzi: Wyłącznie czysty, surowy obiekt JSON zgodny z powyższym wzorcem i zasadami 100% języka polskiego.
`;

  const reasoningEffort = localStorage.getItem('human_model_reasoning_effort') || 'medium';

  const candidateModels = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel)
  ];

  callbacks?.onLog?.(`Przygotowano kontekst grafu (${systemPrompt.length} znaków / ~${Math.round(systemPrompt.length / 3.5)} tokenów).`, 'info');

  let lastErrorMsg = '';

  for (const targetModel of candidateModels) {
    try {
      const payloadObject = {
        model: targetModel,
        models: candidateModels,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Oto sytuacja do dekompozycji: "${userStory}"` }
        ],
        temperature: 0.2,
        stream: true,
        include_reasoning: true,
        reasoning: { effort: reasoningEffort },
        stream_options: { include_usage: true }
      };

      callbacks?.onRequestPayload?.(payloadObject);
      callbacks?.onLog?.(`Łączenie ze strumieniem OpenRouter SSE (Model: ${targetModel}, Reasoning Effort: ${reasoningEffort})...`, 'info');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const fetchStartTime = Date.now();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
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

        callbacks?.onLog?.(`Błąd połączenia z modelem ${targetModel} (${response.status}): ${parsedMsg}`, 'warn');
        lastErrorMsg = `(${response.status}) ${parsedMsg}`;
        continue;
      }

      callbacks?.onLog?.(`Połączenie SSE zaakceptowane (200 OK). Rozpoczynam odczyt tokenów i myśli AI...`, 'success');

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
                if (!firstTokenTime) {
                  firstTokenTime = Date.now();
                  callbacks?.onProviderInfo?.({
                    provider: parsed.provider || 'OpenRouter Auto Provider',
                    model: parsed.model || targetModel,
                    ttftMs: firstTokenTime - fetchStartTime
                  });
                }

                if (delta.reasoning) {
                  rawReasoning += delta.reasoning;
                  callbacks?.onReasoning?.(delta.reasoning);
                }

                if (delta.content) {
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

      callbacks?.onLog?.(`Strumień zamknięty (${Math.round((Date.now() - startTime) / 1000)}s). Weryfikacja struktury JSON...`, 'info');

      if (!rawContent.trim()) {
        callbacks?.onLog?.(`Pusta treść z modelu ${targetModel}. Próbuję kolejny model...`, 'warn');
        continue;
      }

      const result: SituationAnalysisResult = cleanJsonResponse(rawContent);
      callbacks?.onLog?.(`Analiza zakończona sukcesem! Sparsowano węzły i relacje śladu.`, 'success');
      
      const validNodeIds = new Set(MIKRO_NODES.map((n) => n.id));
      const rawNodes = (result.storyNodes || []).filter((id) => validNodeIds.has(id));

      const pathExp = expandPathToValidGraphEdges(rawNodes);
      result.storyNodes = pathExp.expandedNodes;
      result.matchedLinks = pathExp.matchedLinks;
      result.usedModel = targetModel;
      result.initialStory = userStory;
      result.interviewAnswers = userAnswers;
      result.createdAt = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

      result.steps = patchStepsToCoverExpandedNodes(result.steps || [], result.storyNodes);

      return sanitizeAnalysisResult(result);
    } catch (err: any) {
      callbacks?.onLog?.(`Błąd podczas wywołania modelu ${targetModel}: ${err.message}`, 'warn');
      lastErrorMsg = err.message || 'Błąd połączenia ze strumieniem SSE';
    }
  }

  throw new Error(`Wszystkie próby połączenia nie powiodły się. Ostatni błąd: ${lastErrorMsg}`);
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
  const nodesContext = formatNodesContext(MIKRO_NODES);
  const linksContext = formatLinksContext(MIKRO_LINKS);

  let formattedAnswers = '';
  if (userAnswers) {
    formattedAnswers = JSON.stringify(userAnswers);
  }

  callbacks?.onLog?.(`Wysyłanie bezpośredniego zapytania do Google AI Studio REST API...`, 'info');

  const prompt = `Jesteś światowej klasy analitykiem behawioralnym w projekcie Human Model.
Wszystkie opisy, podsumowania i relacje w wygenerowanym obiekcie JSON MUSZĄ być w 100% w języku polskim. Absolutny zakaz używania języka angielskiego!

Węzły z pełnymi opisami naukowo-psychologicznymi:
${nodesContext}

Relacje:
${linksContext}

Wywiad: ${formattedAnswers}

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
      "trigger": "Wyzwalacz",
      "whatHappened": "Co się stało",
      "whyItHappened": "Minimum 2 pełne zdania naukowego uzasadnienia z neurobiologii/psychologii po polsku",
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

  const pathExp = expandPathToValidGraphEdges(rawNodes);
  result.storyNodes = pathExp.expandedNodes;
  result.matchedLinks = pathExp.matchedLinks;
  result.steps = patchStepsToCoverExpandedNodes(result.steps || [], result.storyNodes);
  result.usedModel = 'Google AI Studio (Gemini 1.5 Flash)';

  return sanitizeAnalysisResult(result);
}
