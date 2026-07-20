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

const DEFAULT_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
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

export async function analyzeSituation(
  userStory: string,
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
    return analyzeWithGoogleDirect(userStory, trimmedKey);
  }

  const nodesContext = formatNodesContext(MIKRO_NODES);
  const linksContext = formatLinksContext(MIKRO_LINKS);

  const systemPrompt = `Jesteś światowej klasy analitykiem behawioralnym i twórcą systemu "Human Model".
Twoim zadaniem jest dokładna dekompozycja sytuacji z życia użytkownika na ciągły, nieprzerwany przepływ przyczynowo-skutkowy po grafie.

Dostępne Węzły Systemowe:
${nodesContext}

Istniejące Połączenia w Grafie (Używaj relacji między tymi węzłami):
${linksContext}

KRYTYCZNE ZASADY ANALIZY SYSTEMOWEJ:
1. **Dostępność i Przepływ**: Sytuacja to ciągła reakcja łańcuchowa.
2. **BEZWZGLĘDNY OBOWIĄZEK JAŹNI / OBSERWATORA (m1)**: W KAŻDEJ analizie MUSISZ uwzględnić węzeł 'm1' (Jaźń / Obserwator). Wyjaśnij czy Jaźń/Obserwator zadziałała (pauza, zauważenie emocji), czy też została zablokowana i zepchnięta przez automat biochemiczny (m11) i impuls (m5).
3. **Opis Przejść Między Węzłami (edgeExplanations)**: Opisz dokładnie jak stan jednego węzła przechodzi w stan drugiego węzła.

Wymogi odnośnie odpowiedzi (Wyłącznie surowy JSON):
{
  "summary": "Krótkie 2-3 zdaniowe podsumowanie mechaniki całej sytuacji.",
  "storyNodes": ["m11", "m7", "m4", "m3", "m1", "m5", "m2", "m6"],
  "edgeExplanations": [
    { "fromNodeId": "m11", "toNodeId": "m7", "transitionText": "Wyczerpanie metaboliczne wywołało spadek napięcia i odczuwalne spięcie w klatce piersiowej." },
    { "fromNodeId": "m7", "toNodeId": "m4", "transitionText": "Sygnał somatyczny został zinterpretowany przez układ limbiczny jako bezpośredni afekt frustracji." },
    { "fromNodeId": "m4", "toNodeId": "m3", "transitionText": "Silne uczucie wyzwoliło katastroficzną myśl o bezsensie relacji." },
    { "fromNodeId": "m3", "toNodeId": "m1", "transitionText": "Obserwator (m1) został osłabiony i nie zdołał dokonać defuzji poznawczej." },
    { "fromNodeId": "m1", "toNodeId": "m5", "transitionText": "Brak uważności Jaźni pozwolił impulsowi ucieczkowemu na zdominowanie systemu." },
    { "fromNodeId": "m5", "toNodeId": "m2", "transitionText": "Impuls pokonał osłabioną kontrolę wykonawczą kory przedczołowej." },
    { "fromNodeId": "m2", "toNodeId": "m6", "transitionText": "Przejście decyzji w natychmiastowe zachowanie werbalne (zerwanie)." }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia / Stan Metaboliczny",
      "trigger": "Cały tydzień pracy bez odpoczynku",
      "whatHappened": "Brak glukozy i zmęczenie układu nerwowego.",
      "whyItHappened": "Kora czołowa utraciła paliwo do samokontroli."
    },
    {
      "step": 5,
      "nodeId": "m1",
      "title": "Jaźń / Obserwator",
      "trigger": "Pojawienie się burzy emocjonalnej",
      "whatHappened": "Jaźń zlała się z myślą (brak dystansu Ja-jako-kontekst).",
      "whyItHappened": "Brak pauzy 5-sekundowej sprawił, że Obserwator pozostał uśpiony.",
      "isSelfObserver": true
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
          'HTTP-Referer': 'https://humanmodel.local',
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
      
      // Filter valid node IDs
      const validNodeIds = new Set(MIKRO_NODES.map((n) => n.id));
      const rawNodes = (result.storyNodes || []).filter((id) => validNodeIds.has(id));

      // EXPAND PATH TO VALID DIRECT GRAPH EDGES USING PATHFINDER (BFS)
      const pathExp = expandPathToValidGraphEdges(rawNodes);
      result.storyNodes = pathExp.expandedNodes;
      result.matchedLinks = pathExp.matchedLinks;
      result.usedModel = targetModel;

      // Ensure steps list covers expanded nodes
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
      whyItHappened: nodeDef?.lifehack || 'Przekazanie impetu reakcji.',
      isSelfObserver: nodeId === 'm1'
    };
  });
}

async function analyzeWithGoogleDirect(userStory: string, apiKey: string): Promise<SituationAnalysisResult> {
  const nodesContext = formatNodesContext(MIKRO_NODES);
  const linksContext = formatLinksContext(MIKRO_LINKS);

  const prompt = `Jesteś analitykiem behawioralnym w projekcie Human Model.
Węzły:
${nodesContext}
Relacje:
${linksContext}

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
      "whyItHappened": "Dlaczego",
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
