export interface DomainNode {
  id: string;
  title: string;
  description: string;
  psychology: string;
  philosophy: string;
  science: string;
  lifehack: string;
  group?: string; // Do kolorowania
}

export interface DomainLink {
  from: string;
  to: string;
  type: 'flow' | 'awareness' | 'override' | 'conflict';
  label: string;
}

export const MIKRO_NODES: DomainNode[] = [
  {
    id: "m1",
    title: "Jaźń / Obserwator",
    description: "Zdolność do zatrzymania się i obserwowania tego, co czujesz i myślisz, zamiast ślepo za tym podążać. To punkt, z którego patrzysz na siebie z boku.",
    psychology: "Terapia Akceptacji i Zaangażowania (ACT) nazywa to stanem 'Ja-jako-kontekst'. To stabilna perspektywa, z której zauważasz swoje myśli i emocje, ale nie utożsamiasz się z nimi.",
    philosophy: "W buddyzmie odpowiada to pojęciu uważności i braku stałego ego (Anatta) – jesteśmy obserwatorem ciągle zmieniającego się strumienia. Edmund Husserl opisywał to jako 'czyste ego'.",
    science: "Zdolność do introspekcji zależy od Sieci Wzbudzeń Podstawowych (DMN - Default Mode Network) w mózgu.",
    lifehack: "Defuzja poznawcza. Zamiast 'Jestem wściekły', powiedz 'Zauważam w sobie uczucie wściekłości'. To tworzy realny dystans bez bycia śmiesznym.",
    group: 'awareness'
  },
  {
    id: "m2",
    title: "Wola / Funkcja Wykonawcza",
    description: "Zdolność do powstrzymania się przed natychmiastowym działaniem. To moment, w którym świadomie wybierasz, co zrobisz, zamiast reagować automatycznie.",
    psychology: "Psychologia poznawcza bada to jako funkcje wykonawcze, czyli naszą samokontrolę. Zgodnie z badaniami (tzw. ego depletion), samokontrola działa trochę jak mięsień.",
    philosophy: "Stoik Epiktet nazywał to prohairesis – moralnym wyborem. Uważał, że to jedyna rzecz na świecie, która jest w 100% pod naszą kontrolą.",
    science: "Ośrodkiem decyzyjnym jest kora przedczołowa (PFC). Jej działanie wymaga ogromnych ilości energii (glukozy i tlenu), żeby skutecznie wysyłać sygnały hamujące do układu limbicznego.",
    lifehack: "Wprowadź gap practice. Między zewnętrznym bodźcem a Twoją reakcją wymuś 5 sekund fizycznej pauzy. Przenosi to przetwarzanie do kory czołowej.",
    group: 'executive'
  },
  {
    id: "m3",
    title: "Myśli",
    description: "Ciągły wewnętrzny głos, który komentuje, ocenia i przewiduje wszystko dookoła. To po prostu hipotezy naszego mózgu, a nie obiektywne fakty.",
    psychology: "Terapia Poznawczo-Behawioralna (CBT) uczy, że nasze umysły często tworzą błędy poznawcze – katastrofizują lub próbują czytać w myślach innych.",
    philosophy: "Immanuel Kant udowodnił, że nigdy nie widzimy rzeczywistości takiej, jaka jest – zawsze filtrujemy ją przez nasze z góry ukształtowane kategorie rozumu.",
    science: "Myślenie to aktywność elektryczna kory mózgowej, widoczna w badaniach EEG jako fale Beta (logika) lub Gamma (łączenie informacji).",
    lifehack: "Złap myśl, która sprawia Ci ból i zadaj jedno bezlitosne pytanie: 'Czy mam 100% pewności, że to obiektywna prawda?'.",
    group: 'cognitive'
  },
  {
    id: "m4",
    title: "Uczucia",
    description: "Fizyczne sygnały płynące z ciała, informujące nas o bezpieczeństwie, stratach lub naruszeniu naszych granic. Wrodzony system wczesnego ostrzegania.",
    psychology: "Terapie takie jak EFT czy DBT kładą ogromny nacisk na emocje jako cenne informacje. Udawanie, że emocji nie ma, prowadzi do fizycznego rozregulowania ciała.",
    philosophy: "David Hume twierdził, że nasz rozum to tylko niewolnik namiętności – najpierw czujemy, a dopiero potem dorabiamy do tego racjonalne wytłumaczenia.",
    science: "Emocje wyzwalają się w ciele migdałowatym w ułamku sekundy, zanim zdążymy je świadomie przemyśleć.",
    lifehack: "Namierz fizyczną lokację. Emocja bez lokalizacji to abstrakcyjny lęk. Zidentyfikuj napięcie bezpośrednio w ciele i zacznij mechanicznie je rozluźniać.",
    group: 'emotional'
  },
  {
    id: "m5",
    title: "Impulsy",
    description: "Bardzo stare, silne pragnienia natychmiastowej nagrody lub ucieczki od bólu. Gwałtowne chęci zjedzenia czegoś słodkiego czy ucieczki od trudnej rozmowy.",
    psychology: "W psychoanalizie Freuda impulsy to 'Id' – dzika część nas domagająca się przyjemności tu i teraz.",
    philosophy: "Thomas Hobbes uważał, że człowiek z natury kieruje się tylko dwoma rzeczami: ucieczką od bólu i dążeniem do przyjemności.",
    science: "Impulsami steruje dopamina. Szlak nagrody zalewa mózg tym neuroprzekaźnikiem, wywołując agresywną chęć zdobycia nagrody.",
    lifehack: "Zastosuj 'Urge Surfing'. Gdy uderzy nagły impuls, wizualizuj go jako falę, która podnosi się, a następnie samoistnie opada w ciągu 90 do 180 sekund.",
    group: 'emotional'
  },
  {
    id: "m6",
    title: "Zachowania",
    description: "To, co fizycznie robimy. Jedyny punkt, w którym realnie wpływamy na otaczający nas świat.",
    psychology: "Behawioryści (np. B.F. Skinner) udowodnili, że to, co robimy, zależy bezpośrednio od nagród i kar. Terapia ACT uczy z kolei działania zgodnego z wartościami.",
    philosophy: "Pragmatyzm (William James) głosi, że nasze intencje i myśli same w sobie nie mają znaczenia – liczą się nasze widoczne, konkretne czyny.",
    science: "Gdy powtarzamy czynność setki razy, zwoje podstawy przejmują nad nią pałeczkę, tworząc nawyk, aby zaoszczędzić energię mózgu.",
    lifehack: "Podczepianie nawyków. Zamiast budować nawyk od zera, doklej go do czegoś, co i tak robisz codziennie (np. 'po umyciu zębów').",
    group: 'executive'
  },
  {
    id: "m7",
    title: "Wrażenia z ciała",
    description: "Surowe sygnały płynące z naszych mięśni, narządów wewnętrznych i oddechu. Sposób, w jaki ciało z nami rozmawia.",
    psychology: "Terapie skoncentrowane na ciele opierają się na fakcie, że ciało pamięta stres. Nierozwiązana trauma objawia się jako płytki oddech czy napięcie barków.",
    philosophy: "Maurice Merleau-Ponty twierdził, że nie 'mamy' ciała jak narzędzia – my 'jesteśmy' ciałem. To nasz podstawowy punkt styku ze światem.",
    science: "Kora wyspy bezustannie monitoruje narządy wewnętrzne. Teoria poliwagalna tłumaczy, jak nasz układ nerwowy ocenia bezpieczeństwo i dostraja napięcie.",
    lifehack: "Reset wagalny. Wykonaj wydech trwający dwukrotnie dłużej niż wdech. To mechanicznie obniża tętno i wyłącza reakcję stresową.",
    group: 'physiological'
  },
  {
    id: "m8",
    title: "Bieżące Przekonania",
    description: "Filtry, przez które patrzymy na świat. Milczące założenia o tym, jacy jesteśmy my sami i jacy są inni ludzie.",
    psychology: "Albert Ellis dowodził, że sztywne, bezwzględne przekonania ('muszę', 'zawsze') są głównym źródłem naszych problemów psychicznych.",
    philosophy: "Filozoficzny konstruktywizm opiera się na założeniu, że nigdy nie widzimy obiektywnego świata – my go stale konstruujemy w oparciu o to, w co już wierzymy.",
    science: "Kiedy w coś długo wierzymy, połączenia między neuronami wzmacniają się (reguła Hebba). Mózg wybiera starą ścieżkę, bo to oszczędza energię.",
    lifehack: "Gdy wyciągasz negatywne wnioski, zapytaj: 'Z jakiego milczącego założenia o świecie właśnie wyszedłem, że tak bardzo mnie to zabolało?'.",
    group: 'cognitive'
  },
  {
    id: "m9",
    title: "Czynniki Zewnętrzne",
    description: "Bezpośrednie otoczenie: Twój pokój, temperatura, przedmioty i ludzie w zasięgu wzroku.",
    psychology: "Kurt Lewin sformułował równanie: nasze zachowanie to zawsze wypadkowa naszej osoby i naszego środowiska. Ulegniesz, jeśli przebywasz w złym otoczeniu.",
    philosophy: "Determinizm uczy, że warunki fizyczne kształtują nie tylko to, co robimy, ale też to, jak myślimy.",
    science: "Światło, temperatura i dźwięk wywołują zmiany biochemiczne. Złe oświetlenie czy podwyższony poziom CO2 radykalnie obniżają sprawność.",
    lifehack: "Optymalizacja otoczenia. Schowaj rozpraszacze do szafy. Zrób tak, by właściwe zachowanie było najłatwiejszą opcją.",
    group: 'environmental'
  },
  {
    id: "m10",
    title: "Język i Dialog",
    description: "Słowa, jakich używasz do nazywania emocji. Twój wewnętrzny słownik, z którego układasz historię o swoim życiu.",
    psychology: "Rozwój cichej mowy wewnętrznej. To, jak do siebie mówisz (ostro czy łagodnie), potężnie wpływa na Twój stan w momentach stresu.",
    philosophy: "Ludwig Wittgenstein: 'Granice mojego języka oznaczają granice mojego świata'. Bez pojęć jesteśmy uwięzieni w chaosie odczuć.",
    science: "Precyzyjne określanie emocji aktywuje obszary językowe mózgu i fizjologicznie hamuje układ limbiczny (tzw. chłodzenie emocji).",
    lifehack: "Nazywaj emocje precyzyjnie. Im bogatsze słownictwo, tym niższy stres.",
    group: 'cognitive'
  },
  {
    id: "m11",
    title: "Zasoby Energetyczne",
    description: "Poziom sił witalnych – sen, jedzenie i regeneracja. Absolutna podstawa dla każdego logicznego myślenia.",
    psychology: "Brak energii drastycznie wycina funkcje samokontroli i opanowanie nerwów, spychając nas do zachowań nawykowych.",
    philosophy: "Nasza racjonalność nie działa w próżni. Wymaga mocnego biologicznego nośnika.",
    science: "W mózgu z biegiem dnia gromadzi się adenozyna wywołująca zmęczenie, wypłukiwana tylko w głębokim śnie. Kora czołowa z kolei pije potężne ilości glukozy.",
    lifehack: "Zasada HALT. Nie podejmuj życiowych decyzji kiedy jesteś Hungry (głodny), Angry, Lonely lub Tired (zmęczony).",
    group: 'physiological'
  },
  {
    id: "m12",
    title: "Stan Biochemiczny",
    description: "Mieszanka hormonów i zewnętrznych substancji (kofeina, alkohol), krążących aktualnie w krwiobiegu.",
    psychology: "Farmakoterapia uczy nas, że czasem bez fizycznego wyrównania np. poziomu dopaminy, żadna rozmowa terapeutyczna nie ruszy z miejsca.",
    philosophy: "Pragmatyczny biohacking korzysta z redukcjonizmu – poprawia jakość bycia poprzez precyzyjne interwencje w materię.",
    science: "Kofeina nie daje energii, jedynie blokuje receptory zmęczenia (adenozyny). Alkohol działa jak depresant hamujący ośrodkowy układ nerwowy.",
    lifehack: "Opóźnienie kofeiny o 90 minut od pobudki eliminuje popołudniowe zjazdy energetyczne.",
    group: 'physiological'
  },
  {
    id: "m13",
    title: "Rezonans Interpersonalny",
    description: "Zdolność układu nerwowego do sprzęgania się z układem innej osoby w celu wspólnego uspokojenia.",
    psychology: "Neurobiologia interpersonalna dowodzi, że bardzo trudno wyciszyć potężny stres w pojedynkę. Potrzebujemy bezpiecznej, spokojnej obecności (koregulacji).",
    philosophy: "Martin Buber i relacja 'Ja-Ty'. Autentyczne bycie z drugą osobą całkowicie transformuje nasze przeżywanie świata.",
    science: "Neurony lustrzane i nerw błędny bezustannie skanują twarz i ton głosu rozmówcy, decydując o trybie walki/ucieczki lub odpoczynku.",
    lifehack: "Zwolnij tempo mowy o 50% i obniż ton głosu podczas kłótni. Spokojny, wolny głos wymusza fizjologiczną koregulację u rozmówcy.",
    group: 'environmental'
  }
];

export const MIKRO_LINKS: DomainLink[] = [
  // 1. AWARENESS (Fenomenologia) - Cienkie, podświetlające z Jaźni, bez masy
  { from: 'm1', to: 'm3', type: 'awareness', label: 'Obserwacja' },
  { from: 'm1', to: 'm4', type: 'awareness', label: 'Obserwacja' },
  { from: 'm1', to: 'm6', type: 'awareness', label: 'Obserwacja' },
  { from: 'm1', to: 'm5', type: 'awareness', label: 'Zauważenie pragnienia' },
  { from: 'm1', to: 'm7', type: 'awareness', label: 'Skanowanie Ciała' },
  
  // 2. FLOW (Pętle determinizmu i wymiany danych CBT)
  { from: 'm3', to: 'm4', type: 'flow', label: 'Pętla CBT (Myśl -> Uczucie)' },
  { from: 'm4', to: 'm6', type: 'flow', label: 'Pętla CBT (Uczucie -> Działanie)' },
  { from: 'm6', to: 'm3', type: 'flow', label: 'Informacja zwrotna' },
  
  { from: 'm8', to: 'm3', type: 'flow', label: 'Schemat Poznawczy (Filtr)' },
  { from: 'm10', to: 'm3', type: 'flow', label: 'Kategoryzacja' },
  
  { from: 'm4', to: 'm7', type: 'flow', label: 'Interocepcja' },
  { from: 'm7', to: 'm5', type: 'flow', label: 'Wyzwolenie napięcia' },
  { from: 'm9', to: 'm7', type: 'flow', label: 'Presja fizyczna' },
  { from: 'm13', to: 'm7', type: 'flow', label: 'Koregulacja układu' },
  
  { from: 'm11', to: 'm2', type: 'flow', label: 'Budżet Energetyczny' },
  { from: 'm12', to: 'm4', type: 'flow', label: 'Odchylenie chemiczne' },

  // 3. OVERRIDE (Akt woli stoików, przełamanie kory czołowej)
  { from: 'm2', to: 'm5', type: 'override', label: 'Hamowanie (PFC)' },
  { from: 'm2', to: 'm6', type: 'override', label: 'Świadomy akt' },

  // 4. CONFLICT (Dysonans, ujemna sprężyna)
  { from: 'm8', to: 'm5', type: 'conflict', label: 'Dysonans Wewnętrzny' },
  { from: 'm10', to: 'm4', type: 'conflict', label: 'Aleksytymia (Brak słów)' },

  // --- ZAAWANSOWANE POWIĄZANIA EKO-NEURO-SOCJOLOGICZNE ---
  // Ze Środowiska (Czynniki Zewn. / Rezonans):
  { from: 'm9', to: 'm6', type: 'flow', label: 'Afordancje (Blokady/Zaproszenia)' },
  { from: 'm9', to: 'm3', type: 'flow', label: 'Torowanie (Priming przestrzenny)' },
  { from: 'm9', to: 'm1', type: 'conflict', label: 'Zawłaszczenie Uwagi' },
  { from: 'm13', to: 'm5', type: 'flow', label: 'Instynkt Stada' },
  { from: 'm13', to: 'm4', type: 'flow', label: 'Zaraźliwość Afektywna' },

  // Z Ciała i Biochemii (Budżet energetyczny):
  { from: 'm11', to: 'm4', type: 'flow', label: 'Podatność (Zmęczenie = lęk)' },
  { from: 'm12', to: 'm5', type: 'flow', label: 'Hiperstymulacja (Dopamina)' },
  { from: 'm12', to: 'm1', type: 'conflict', label: 'Rozpad Ego (DMN)' },

  // Sprzężenia Zwrotne i Dysonanse Poznawcze:
  { from: 'm2', to: 'm11', type: 'flow', label: 'Wyczerpanie decyzyjne (Ego Depletion)' },
  { from: 'm2', to: 'm3', type: 'override', label: 'Przekierowanie Uwagi' },
  { from: 'm3', to: 'm7', type: 'conflict', label: 'Rozdźwięk traumatyczny' },
  { from: 'm3', to: 'm7', type: 'flow', label: 'Psychosomatyka' },
  { from: 'm4', to: 'm8', type: 'flow', label: 'Uzasadnienie Emocjonalne' },

  // Potęga Języka:
  { from: 'm10', to: 'm4', type: 'override', label: 'Nazywanie Afektu (Affect Labeling)' },
  { from: 'm10', to: 'm8', type: 'flow', label: 'Relatywizm Językowy' }
];


export const MAKRO_NODES: DomainNode[] = [
  {
    id: "ma1",
    title: "Fundament Biologiczny",
    description: "Nasz fizyczny punkt wyjścia. Zestaw genów, organizm i narządy, które mocno dyktują nasze bazowe możliwości.",
    psychology: "Nasze mózgi ewolucyjnie to nadal mózgi łowców-zbieraczy, które gubią się w nowoczesności, co psychiatria nazywa zaburzeniami lękowymi.",
    philosophy: "Ciało to nasz kotwica. Jesteśmy bezwzględnie podlegli biologii ewolucyjnej, zmęczeniu i upływowi czasu.",
    science: "Geny decydują o wrażliwości na kortyzol. Telomery o czasie życia. Wrodzony hardware naszej maszyny.",
    lifehack: "Nie naprawiaj psychiki, dopóki nie sprawdzisz biologii. Raz w roku rób panel badań fizjologicznych.",
    group: 'physiological'
  },
  {
    id: "ma2",
    title: "Środowisko Geograficzne",
    description: "Klimat, miasto lub wieś. Betonoza czy zieleń. Twarde fizyczne parametry Twojego życia.",
    psychology: "Brak kontaktu z zielenią i zatłoczenie to stały stresor wywołujący agresję i zmęczenie uwagowe.",
    philosophy: "Determinizm geograficzny dowodził, że warunki terenowe wręcz kształtują prawa i obyczaje ludzkie.",
    science: "Zanieczyszczenie powierza i brak światła drastycznie modulują układ odpornościowy i syntezę witamin.",
    lifehack: "Przestrzeń kształtuje psychikę. Reguluj światło, unikaj hałasu ulicy w sypialni, uciekaj w zieleń.",
    group: 'environmental'
  },
  {
    id: "ma3",
    title: "Nieświadomość i Obrona",
    description: "Wyparte emocje i wspomnienia, których wolimy nie dostrzegać, oraz sprytne wymówki chroniące nasze ego.",
    psychology: "Zjawisko Cienia (C.G. Jung). Uciekanie od własnej agresji przez rzutowanie jej (projekcję) na otoczenie.",
    philosophy: "Obnażenie iluzji ludzkiej racjonalności. Ludźmi rządzą potężne pędy, do których intelekt tylko szuka wymówek.",
    science: "Potencjał gotowości powstaje w pniu mózgu przed świadomą decyzją. Mózg ukrywa przed nami większość swojej pracy.",
    lifehack: "Audyt irytacji. 'Jaki wyparty aspekt mojego cienia odzwierciedla człowiek, który doprowadza mnie do szału?'.",
    group: 'cognitive'
  },
  {
    id: "ma4",
    title: "Pamięć Somatyczna (Trauma)",
    description: "Zapisane w mięśniach i powięziach ślady po ogromnym stresie z przeszłości, który nie został uregulowany.",
    psychology: "Ekstremalny lęk zamraża się w ciele (Bessel van der Kolk). Objawia się ciągłym trybem walki bez wyraźnego powodu.",
    philosophy: "Przeszłość nie mija (Bergson) - wnika w teraźniejszość, bezustannie koloryzując to, jak odbieramy chwilę obecną.",
    science: "Trauma wyłącza hipokamp (rejestrator czasu), a aktywuje ciało migdałowate. Wtedy lęk jest przeżywany, a nie tylko wspominany.",
    lifehack: "Manualne uwalnianie powięzi. Rutyny TRE czy odpowiedni masaż zrzucają z ciała zgromadzone mechaniczne napięcie.",
    group: 'physiological'
  },
  {
    id: "ma5",
    title: "Matryca Systemowa",
    description: "Bagaż rodzinny. Niewidzialne zasady, role (bohater, kozioł ofiarny) przekazywane przez drzewo genealogiczne.",
    psychology: "Terapia systemowa dowodzi, że problem jednostki to tylko wyraz problemu całej nierozwiązanej struktury rodzinnej.",
    philosophy: "Relacje władzy, historia i uwarunkowania determinują to, na ile możemy w ogóle uznać się za niezależne jednostki.",
    science: "Pierwsze miesiące z opiekunami kalibrują nerw błędny i poziomy oksytocyny - to fundament przywiązania.",
    lifehack: "Genogram uświadomiony. Wypisz destrukcyjne tradycje Twojego rodu i świadomie je odrzuć.",
    group: 'environmental'
  },
  {
    id: "ma6",
    title: "Matryca Językowa (Membrana)",
    description: "Zbiór pojęć, metafor i konstrukcji. To przez nie interpretujesz swoje życie i cierpienie.",
    psychology: "Kultura i język zawężają zakres akceptowalnych zachowań. Nie czujemy tego, czego nie potrafimy nazwać.",
    philosophy: "Język to dom bycia. Tworzy sferę wokół nas (membranę), oddzielając nasz rdzeń od surowej, niewyrażalnej zewnętrzności.",
    science: "Neurolingwistyka pokazuje, że gramatyka wpływa na kategoryzowanie zdarzeń i postrzeganie winy.",
    lifehack: "Zmień główne metafory. Gdy życie to 'poligon', podświadomość wchodzi w wieczny tryb oblężenia.",
    group: 'cognitive' // W renderingu dostanie customowy wygląd membrany!
  },
  {
    id: "ma7",
    title: "Kryzysy Rozwojowe",
    description: "Naturalne, bolesne momenty przejścia do następnego etapu dojrzałości. Rozpad starego układu.",
    psychology: "Erik Erikson opisał osiem kryzysów w życiu człowieka. Ominięcie choćby jednego prowadzi do ciężkiej stagnacji w dorosłości.",
    philosophy: "Dialektyka rozwoju. Stara teza musi ulec rozbiciu, by pojawiła się nowsza, silniejsza synteza. Rozpacz to punkt zwrotny.",
    science: "Zsynchronizowane z gigantycznym przycinaniem synaptycznym (np. u nastolatków kora mózgowa przebudowuje się z chaosu).",
    lifehack: "Sprawdź, na jakim etapie kryzysu dekady jesteś. To zdejmuje lęk, bo uświadamia, że ten proces jest naturalny.",
    group: 'cognitive'
  },
  {
    id: "ma8",
    title: "Zeitgeist (Duch Czasu)",
    description: "Panujące w Twojej epoce mody, narracje o sukcesie i zbiorowe lęki. Powietrze socjologiczne, którym oddychasz.",
    psychology: "Współczesne media pompują nierealne wzorce i narcyzm. Problemy psychologiczne mocno zmieniają się z pokolenia na pokolenie.",
    philosophy: "Foucault: epoka nakłada ciche ramy na to, kto jest uważany za normalnego, a o czym w ogóle nie wolno na poważnie dyskutować.",
    science: "Memetyka i algorytmy uwagowe. Idee wirusują społeczeństwo szybciej niż choroby biologiczne.",
    lifehack: "Odetnij powiadomienia z serwisów informacyjnych. Wyrwanie się z ciągłej gorączki medialnej to zysk absolutny.",
    group: 'environmental'
  },
  {
    id: "ma9",
    title: "Wektor Egzystencjalny (Atraktor)",
    description: "Twój nadrzędny cel, sens albo misja. Grawitacyjna siła wybiegająca w przyszłość, która chroni przed pustką.",
    psychology: "Logoterapia udowadnia, że człowiek obciążony mocnym poczuciem celu zniesie każde 'jak' przeżycia. Brak 'po co' spycha w nałogi.",
    philosophy: "Zadanie wyznaczenia sensu w świecie bezwzględnej wolności (egzystencjalizm).",
    science: "Obecność celu wiąże się ze zwiększoną plastycznością przedczołową i niższym ryzkiem otępienia w podeszłym wieku.",
    lifehack: "Zrób rygorystyczny 'Test Pogrzebu'. Bolesne, ale natychmiast układa wartości życiowe w hierarchię.",
    group: 'executive' // W renderingu dostanie customową grawitację!
  },
  {
    id: "ma10",
    title: "Czynnik Chaosu",
    description: "Niespodziewana losowość, czarne łabędzie, wypadki lub uśmiech losu, który brutalnie obala najtwardsze plany.",
    psychology: "Wzrost potraumatyczny. Paradoksalnie najtrudniejsze ciosy w strukturę wymuszają budowę o wiele stabilniejszej siły psychicznej.",
    philosophy: "Amor Fati - radykalna akceptacja rzeczywistości. Zdarzenia po prostu nadchodzą. To Ty nadajesz im destrukcyjne znaczenie.",
    science: "Termodynamika - żaden układ nie zachowa porządku w nieskończoność. Nie da się przewidzieć losu z powodu zbyt wielkiej liczby zmiennych.",
    lifehack: "Zawsze zachowuj margines błędu. W zasobach finansowych, emocjonalnych i czasowych licz się z anomalią.",
    group: 'awareness' // W renderingu dostanie customowy ruch wolnego elektronu!
  },
  {
    id: "ma11",
    title: "Technosfera i Sieć",
    description: "Nasze zrośnięcie z technologią. Urządzenia pełniące rolę zewnętrznych pamięci i procesorów naszego mózgu.",
    psychology: "FOMO i zjawisko atrofii umiejętności koncentracji głębokiej na rzecz płytkiego skanowania informacji.",
    philosophy: "Teoria rozszerzonego umysłu. Nasz smartfon jest dziś przedłużeniem naszego ciała w takim samym sensie, jak laska dla niewidomego.",
    science: "Ciągły multitasking pije glukozę, wypalając układ nerwowy i uodparniając szlaki dopaminowe na subtelne przyjemności.",
    lifehack: "Sypialnia wolna od prądu. Telefon wymusza gotowość poznawczą; bez niego ratujesz głębokie fazy snu.",
    group: 'environmental'
  }
];

export const MAKRO_LINKS: DomainLink[] = [
  // Rdzeń Epigenetyczny
  { from: 'ma1', to: 'ma4', type: 'flow', label: 'Pamięć Komórkowa (Epigenetyka)' },
  // Wpływy systemowe
  { from: 'ma5', to: 'ma4', type: 'flow', label: 'Dziedziczenie Traum' },
  { from: 'ma5', to: 'ma3', type: 'flow', label: 'Współdzielony Cień' },
  { from: 'ma2', to: 'ma1', type: 'flow', label: 'Wektor fizjologiczny (Adaptacja)' },
  
  // Wpływ kultury (zewnątrz)
  { from: 'ma8', to: 'ma11', type: 'flow', label: 'Infostruktura' },
  { from: 'ma8', to: 'ma5', type: 'flow', label: 'Ewolucja ról społecznych' },
  
  // Językowa membrana
  { from: 'ma6', to: 'ma3', type: 'conflict', label: 'Granice poznania (Kategoryzacja)' },
  
  // Rozwój i Kryzysy
  { from: 'ma7', to: 'ma5', type: 'conflict', label: 'Rozpad lojalności' },
  
  // (Atraktor i Chaos nie potrzebują tu sztywnych linków z 'flow', bo są sterowane przez customową grawitację)
];
