import { MIKRO_NODES, MIKRO_LINKS, type DomainNode, type DomainLink } from './data';

export interface TraceStep {
  step: number;
  nodeId: string;
  title: string;
  trigger: string;
  whatHappened: string;
  whyItHappened: string;
}

export interface SituationAnalysisResult {
  summary: string;
  storyNodes: string[];
  storyEdges: Array<{ from: string; to: string; label?: string }>;
  steps: TraceStep[];
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
  Opis: ${n.description}
  Wskazówka: ${n.lifehack}`
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

  // If user provided a direct Google AI Studio API Key (starts with AIzaSy)
  if (trimmedKey.startsWith('AIzaSy')) {
    return analyzeWithGoogleDirect(userStory, trimmedKey);
  }

  const nodesContext = formatNodesContext(MIKRO_NODES);
  const linksContext = formatLinksContext(MIKRO_LINKS);

  const systemPrompt = `Jesteś światowej klasy analitykiem behawioralnym, neurobiologiem i psychologiem.
Twoim zadaniem jest przeanalizowanie realnej sytuacji z życia podanej przez użytkownika i dokładne odwzorowanie jej mechaniki przyczynowo-skutkowej na dostarczonym grafie systemowym ("Human Model").

Dostępne Węzły Systemowe (Używaj WYŁĄCZNIE tych ID węzłów):
${nodesContext}

Dostępne Połączenia w Grafie:
${linksContext}

ZASADY ANALIZY SYSTEMOWEJ (6 OSI ANALIZY):
1. **Biochemia i Fizjologia**: Identyfikuj stany metaboliczne (zmęczenie, spadek glukozy, przebodźcowanie, m11, m7).
2. **Otoczenie i Bodziec**: Co wywołało reakcję w środowisku (m9, rezonans, presja).
3. **Emocja i Ciało**: Fizyczna reakcja migdałkowata (m4, m7).
4. **Rama Poznawcza**: Automatyczne myśli i filtry przekonań (m3, m8).
5. **Impuls vs Funkcja Wykonawcza**: Zderzenie dopaminowej zachcianki z samokontrolą kory czołowej (m5, m2).
6. **Behawior i Pętla Zwrotna**: Wynikowe działanie (m6) i jego reakcja zwrotna.

Wymogi odnośnie odpowiedzi:
Zwróć TYLKO czysty obiekt JSON (bez znaczników markdown \`\`\`json, wyłącznie surowy JSON):
{
  "summary": "Krótkie 2-3 zdaniowe podsumowanie mechaniki tej sytuacji (co tak naprawdę się stało).",
  "storyNodes": ["m11", "m9", "m4", "m3", "m5", "m6"],
  "storyEdges": [
    { "from": "m11", "to": "m4", "label": "obniżony próg bodźca" },
    { "from": "m4", "to": "m3", "label": "wyzwolenie myśli" }
  ],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia / Stan Metaboliczny",
      "trigger": "8 godzin pracy, spadek glukozy",
      "whatHappened": "Wyczerpanie zasobów energetycznych kory przedczołowej.",
      "whyItHappened": "Układ nerwowy działał na rezerwach energetycznych."
    }
  ],
  "rootCause": "Główna przyczyna źródłowa zdarzenia (mechaniczna, nie moralna).",
  "operationalLifehack": "Konkretna, bezpłatna wskazówka operacyjna / stoper do natychmiastowego zastosowania następnym razem."
}
`;

  // Automatic Fallback Loop for OpenRouter
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
          { role: 'user', content: `Oto sytuacja życiowa do przeanalizowania: "${userStory}"` }
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

        console.warn(`OpenRouter model ${targetModel} returned status ${response.status}: ${parsedMsg}. Trying fallback...`);
        lastErrorMsg = `(${response.status}) ${parsedMsg}`;
        continue; // Try next model candidate
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) {
        console.warn(`OpenRouter model ${targetModel} returned empty content. Trying fallback...`);
        continue;
      }

      const cleanedJsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const result: SituationAnalysisResult = JSON.parse(cleanedJsonStr);
      
      const validNodeIds = new Set(MIKRO_NODES.map((n) => n.id));
      result.storyNodes = (result.storyNodes || []).filter((id) => validNodeIds.has(id));
      
      if (result.storyNodes.length === 0) {
        result.storyNodes = ['m11', 'm9', 'm4', 'm3', 'm5', 'm6'];
      }

      result.usedModel = targetModel;
      return result;
    } catch (err: any) {
      console.warn(`Failed model ${targetModel}:`, err);
      lastErrorMsg = err.message || 'Błąd połączenia';
    }
  }

  throw new Error(`Wszystkie próby połączenia z modelami AI nie powiodły się. Ostatni błąd: ${lastErrorMsg}`);
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
  "storyNodes": ["m11", "m9", "m4", "m3", "m5", "m6"],
  "storyEdges": [],
  "steps": [
    {
      "step": 1,
      "nodeId": "m11",
      "title": "Biochemia",
      "trigger": "Wyzwalacz",
      "whatHappened": "Co się stało",
      "whyItHappened": "Dlaczego"
    }
  ],
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
  result.usedModel = 'Google AI Studio (Gemini 1.5 Flash)';
  return result;
}
