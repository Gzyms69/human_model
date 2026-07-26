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

Dostępne Węzły Systemowe wraz z ich wiedzą naukową, psychologiczną i filozoficzną:
${nodesContext}

Istniejące Połączenia w Grafie:
${linksContext}
${formattedAnswersContext}
KRYTYCZNE ZASADY ANALIZY SYSTEMOWEJ:
1. **Dostępność i Przepływ**: Sytuacja to ciągła reakcja łańcuchowa po istniejących krawędziach grafu.
2. **BEZWZGLĘDNY OBOWIĄZEK JAŹNI / OBSERWATORA (m1)**: W KAŻDEJ analizie MUSISZ uwzględnić węzeł 'm1' (Jaźń / Obserwator). Wyjaśnij czy Jaźń/Obserwator zadziałała, czy też została wyparta przez automat.
3. **Głębokie Uzasadnienie (whyItHappened)**: Wykorzystaj przekazaną wiedzę naukową, psychologiczną i filozoficzną przypisaną do danego węzła i relacji. Wyjaśnij mechanicznie dlaczego ten węzeł aktywował się w tej sytuacji. Nie dawaj tu lifehacków.
4. **Lifehack (operationalLifehack)**: Wykorzystaj dedykowane lifehacki przypisane do aktywnych węzłów.

Wymogi odnośnie odpowiedzi (Wyłącznie surowy JSON):
{
  "summary": "Krótkie 2-3 zdaniowe podsumowanie mechaniki całej sytuacji, odwołujące się do naukowej podszewki zdarzenia.",
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"],
  "edgeExplanations": [
    { "fromNodeId": "m11", "toNodeId": "m7", "transitionText": "Opis przeniesienia impetu z uwzględnieniem typu relacji." }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia / Stan Metaboliczny",
      "trigger": "8h pracy",
      "whatHappened": "Wyczerpanie glukozy",
      "whyItHappened": "Kora czołowa utraciła paliwo metaboliczne do hamowania impulsów."
    }
  ],
  "observerRoleSummary": "Kluczowy podsumowujący opis roli Jaźni (m1) w tej sytuacji.",
  "rootCause": "Mechaniczna przyczyna źródłowa zdarzenia na poziomie systemowym.",
  "operationalLifehack": "Wskazówka operacyjna (Stoper) zapobiegająca powtórzeniu w przyszłości."
}
`;

  const candidateModels = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel)
  ];

  callbacks?.onLog?.(`Przygotowano kontekst grafu (${systemPrompt.length} znaków / ~${Math.round(systemPrompt.length / 3.5)} tokenów).`, 'info');

  let lastErrorMsg = '';

  for (const targetModel of candidateModels) {
    try {
      callbacks?.onLog?.(`Łączenie ze strumieniem OpenRouter SSE (Model: ${targetModel})...`, 'info');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

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
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Oto sytuacja do dekompozycji: "${userStory}"` }
          ],
          temperature: 0.2,
          stream: true,
          stream_options: { include_usage: true }
        }),
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);

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

      return result;
    } catch (err: any) {
      callbacks?.onLog?.(`Błąd podczas wywołania modelu ${targetModel}: ${err.message}`, 'warn');
      lastErrorMsg = err.message || 'Błąd połączenia ze strumieniem SSE';
    }
  }

  throw new Error(`Wszystkie próby połączenia nie powiodły się. Ostatni błąd: ${lastErrorMsg}`);
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

  const prompt = `Jesteś analitykiem behawioralnym w projekcie Human Model.
Węzły z pełnymi opisami naukowo-psychologicznymi:
${nodesContext}

Relacje:
${linksContext}

Wywiad: ${formattedAnswers}

Zwróć TYLKO czysty wygenerowany JSON:
{
  "summary": "Podsumowanie ze wskaźnikami naukowymi",
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"],
  "edgeExplanations": [
    { "fromNodeId": "m11", "toNodeId": "m7", "transitionText": "Opis przejścia" }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia",
      "trigger": "Wyzwalacz",
      "whatHappened": "Co się stało",
      "whyItHappened": "Dlaczego mechanicznie (nauka/psychologia)",
      "isSelfObserver": false
    }
  ],
  "observerRoleSummary": "Opis roli Jaźni",
  "rootCause": "Przyczyna źródłowa",
  "operationalLifehack": "Wskazówka"
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

  return result;
}
