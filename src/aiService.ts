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

const DEFAULT_API_KEY = '';
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';

const FALLBACK_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'openai/gpt-oss-20b:free',
  'cohere/north-mini-code:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'google/gemma-4-31b-it:free',
  'google/gemini-2.5-flash'
];

function formatNodesContext(nodes: DomainNode[]): string {
  return nodes
    .map(
      (n) =>
        `- ID: "${n.id}" | Nazwa: "${n.title}" | Grupa: ${n.group || 'brak'}
  Opis: ${n.description}`
    )
    .join('\n');
}

function formatLinksContext(links: DomainLink[]): string {
  return links
    .map(
      (l) =>
        `- Relacja: ${l.from} -> ${l.to} [Typ: ${l.type}, Etykieta: "${l.label}"] (${l.description})`
    )
    .join('\n');
}

export async function generateClarifyingQuestions(
  userStory: string,
  customApiKey?: string,
  customModel?: string
): Promise<string[]> {
  const apiKey = customApiKey || localStorage.getItem('human_model_openrouter_key') || DEFAULT_API_KEY;
  const requestedModel = customModel || localStorage.getItem('human_model_openrouter_model') || DEFAULT_MODEL;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Brak klucza API.');
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

  for (const targetModel of candidateModels) {
    try {
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
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) continue;

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) continue;

      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed.questions) && parsed.questions.length >= 3) {
        return parsed.questions.slice(0, 3);
      }
    } catch {}
  }

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
  customModel?: string
): Promise<SituationAnalysisResult> {
  const apiKey = customApiKey || localStorage.getItem('human_model_openrouter_key') || DEFAULT_API_KEY;
  const requestedModel = customModel || localStorage.getItem('human_model_openrouter_model') || DEFAULT_MODEL;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Brak klucza API. Podaj klucz OpenRouter lub Google AI Studio w ustawieniach panelu AI.');
  }

  const trimmedKey = apiKey.trim();

  if (trimmedKey.startsWith('AIzaSy')) {
    const res = await analyzeWithGoogleDirect(userStory, userAnswers, trimmedKey);
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
Twoim zadaniem jest dokładna dekompozycja sytuacji z życia użytkownika na ciągły, nieprzerwany przepływ przyczynowo-skutkowy po grafie.

Dostępne Węzły Systemowe:
${nodesContext}

Istniejące Połączenia w Grafie:
${linksContext}
${formattedAnswersContext}
KRYTYCZNE ZASADY ANALIZY SYSTEMOWEJ:
1. **Dostępność i Przepływ**: Sytuacja to ciągła reakcja łańcuchowa.
2. **BEZWZGLĘDNY OBOWIĄZEK JAŹNI / OBSERWATORA (m1)**: W KAŻDEJ analizie MUSISZ uwzględnić węzeł 'm1' (Jaźń / Obserwator). Wyjaśnij czy Jaźń/Obserwator zadziałała, czy też została wyparta przez automat.
3. **Opis Mechaniki Kroku (whyItHappened)**: Opisz DOKŁADNIE dlaczego ten konkretny węzeł aktywował się w tej sytuacji. NIE DAWAJ TU PORAD ANI LIFEHACKÓW. Porady dajesz WYŁĄCZNIE w sekcji operationalLifehack!

Wymogi odnośnie odpowiedzi (Wyłącznie surowy JSON):
{
  "summary": "Krótkie 2-3 zdaniowe podsumowanie mechaniki całej sytuacji.",
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"],
  "edgeExplanations": [
    { "fromNodeId": "m11", "toNodeId": "m7", "transitionText": "Opis przeniesienia impetu." }
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
  "rootCause": "Mechaniczna przyczyna źródłowa zdarzenia.",
  "operationalLifehack": "Wskazówka operacyjna (Stoper) zapobiegająca powtórzeniu w przyszłości."
}
`;

  const candidateModels = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel)
  ];

  let lastErrorMsg = '';

  for (const targetModel of candidateModels) {
    try {
      const requestBody = {
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Oto sytuacja do dekompozycji: "${userStory}"` }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://humanmodel.app',
          'X-Title': 'Human Model AI Tracer'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMsg = errorText;
        try {
          const errJson = JSON.parse(errorText);
          if (errJson.error?.message) parsedMsg = errJson.error.message;
        } catch {}

        console.warn(`Model ${targetModel} error ${response.status}: ${parsedMsg}`);
        lastErrorMsg = `(${response.status}) ${parsedMsg}`;
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) continue;

      const cleanedJsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const result: SituationAnalysisResult = JSON.parse(cleanedJsonStr);
      
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
      console.warn(`Error on model ${targetModel}:`, err);
      lastErrorMsg = err.message || 'Connection error';
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
  apiKey?: string
): Promise<SituationAnalysisResult> {
  const nodesContext = formatNodesContext(MIKRO_NODES);
  const linksContext = formatLinksContext(MIKRO_LINKS);

  let formattedAnswers = '';
  if (userAnswers) {
    formattedAnswers = JSON.stringify(userAnswers);
  }

  const prompt = `Jesteś analitykiem behawioralnym w projekcie Human Model.
Węzły:
${nodesContext}
Relacje:
${linksContext}
Wywiad: ${formattedAnswers}

Zwróć TYLKO wygenerowany JSON:
{
  "summary": "Podsumowanie",
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
      "whyItHappened": "Dlaczego mechanicznie",
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
    throw new Error(`Błąd Google AI Studio (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawContent) throw new Error('Otrzymano pustą odpowiedź z Google AI Studio');

  const cleanedJsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
  const result: SituationAnalysisResult = JSON.parse(cleanedJsonStr);

  const validNodeIds = new Set(MIKRO_NODES.map((n) => n.id));
  const rawNodes = (result.storyNodes || []).filter((id) => validNodeIds.has(id));

  const pathExp = expandPathToValidGraphEdges(rawNodes);
  result.storyNodes = pathExp.expandedNodes;
  result.matchedLinks = pathExp.matchedLinks;
  result.steps = patchStepsToCoverExpandedNodes(result.steps || [], result.storyNodes);
  result.usedModel = 'Google AI Studio (Gemini 1.5 Flash)';

  return result;
}
