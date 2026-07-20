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
  id: string;
  from: string;
  to: string;
  type: 'flow' | 'awareness' | 'override' | 'conflict';
  label: string;
  direction?: 'to' | 'from' | 'both';
  description: string;
  psychology: string;
  philosophy: string;
  science: string;
  lifehack: string;
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
    title: "Biochemia i Zasoby Metaboliczne",
    description: "Poziom sił witalnych, sen, nawodnienie oraz krążąca mieszanka hormonów i neuroprzekaźników (dopamina, kortyzol, kofeina). Biologiczne paliwo i regulator nastroju oraz samokontroli.",
    psychology: "Brak energii i odchylenia biochemiczne drastycznie obniżają odporność na lęk i złość, spychając umysł do odruchów nawykowych.",
    philosophy: "Materializm biologiczny – racjonalność i duch nie działają w próżni, lecz bezwzględnie wymagają sprawnego nośnika metabolicznego.",
    science: "Kora przedczołowa wymaga glukozy i tlenu, a poziom kortyzolu i dopaminy dyktuje próg wzbudzenia ciała migdałowatego.",
    lifehack: "Zasada HALT i audyt biochemiczny: nie podejmuj trudnych decyzji na głodzie i zmęczeniu, a przy przewlekłym spadku zrób badania krwi.",
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
  {
    id: 'm1-m2-override',
    from: 'm1',
    to: 'm2',
    type: 'override',
    direction: 'to',
    label: 'Świadomy Wybór Woli',
    description: 'To moment, w którym zatrzymujesz automatyzm i mówisz sobie: zaraz, nie muszę reagować odruchowo, sam wybiorę, co teraz zrobię.',
    psychology: 'Przejście z automatycznego reagowania na bodźce do celowego kierowania samokontrolą.',
    philosophy: 'Epiktet i pojęcie prohairesis – wewnętrzna przestrzeń wyboru leżąca między bodźcem a reakcją.',
    science: 'Aktywacja kory grzbietowo-bocznej (dlPFC) wyciszająca odruchy podkorowe.',
    lifehack: 'Przed reakcją policz w duchu do 3 i poczuj, że to Ty naciskasz przycisk akcji.'
  },
  {
    id: 'm1-m3-awareness',
    from: 'm1',
    to: 'm3',
    type: 'awareness',
    direction: 'to',
    label: 'Obserwacja Myśli',
    description: 'Patrzysz na swoje myśli jak na liście płynące rzeką – widzisz je, ale nie wskakujesz do wody.',
    psychology: 'Defuzja poznawcza (ACT). Rozdzielenie tożsamości od przepływających myśli.',
    philosophy: 'Fenomenologia Husserla – przyglądanie się zjawiskom w umyśle bez wydawania sądu.',
    science: 'Wyciszenie SIeci Wzbudzeń Podstawowych (DMN) na rzecz kory przedczołowej.',
    lifehack: 'Mów w duchu: Zauważam myśl, że... zamiast: Ja jestem...'
  },
  {
    id: 'm1-m4-awareness',
    from: 'm1',
    to: 'm4',
    type: 'awareness',
    direction: 'to',
    label: 'Obserwacja Afektu',
    description: 'Pozwalasz emocji być w ciele jak pogodzie za oknem – nie próbujesz jej zatrzymać, czekasz aż przejdzie.',
    psychology: 'Uważność emocjonalna i Radykalna Akceptacja (DBT).',
    philosophy: 'Spinoza – poznanie afektu bez oskarżania siebie o jego obecność.',
    science: 'Aktywacja kory przedczołowej redukuje reaktywność współczulną i umożliwia gaśnięcie afektu.',
    lifehack: 'Wizualizuj emocję jako falę – pozwól jej wzrosnąć i opadnąć bez oporu.'
  },
  {
    id: 'm1-m5-awareness',
    from: 'm1',
    to: 'm5',
    type: 'awareness',
    direction: 'to',
    label: 'Zauważenie Pragnienia',
    description: 'Patrzysz na nagłą ochotę sięgnięcia po telefon jak na falę na oceanie – wiesz, że sama opadnie.',
    psychology: 'Technika Urge Surfing z terapii uzależnień.',
    philosophy: 'Stoicka wstrzemięźliwość – obserwacja żądzy bez ulegania jej dyktatowi.',
    science: 'Przerwanie automatycznego sygnału z jądra półleżącego do obwodów ruchowych.',
    lifehack: 'Nastaw stoper na 3 minuty i obserwuj impuls – w większości przypadków sama opadnie.'
  },
  {
    id: 'm1-m6-awareness',
    from: 'm1',
    to: 'm6',
    type: 'awareness',
    direction: 'to',
    label: 'Uważność w Działaniu',
    description: 'Gdy zmywasz naczynia, po prostu zmywasz naczynia – jesteś w 100% obecny w tym, co robią Twoje dłonie.',
    psychology: 'Mindful Action – pełna obecność w prostej czynności fizycznej.',
    philosophy: 'Praktyka Zen – siekanie drewna i noszenie wody jako pełnia bycia.',
    science: 'Zwiększenie spójności sieci czuciowo-ruchowej z korą przedczołową.',
    lifehack: 'Skup się na dotyku i temperaturze wody podczas mycia rąk.'
  },
  {
    id: 'm1-m7-awareness',
    from: 'm1',
    to: 'm7',
    type: 'awareness',
    direction: 'to',
    label: 'Skanowanie Ciała',
    description: 'Sprawdzasz stan swojego ciała tak, jak kierowca sprawdza wskaźniki na desce rozdzielczej samochodu.',
    psychology: 'Body Scan – podstawa redukcji stresu opartej na uważności (MBSR).',
    philosophy: 'Merleau-Ponty – zamieszkiwanie własnego ciała.',
    science: 'Stymulacja kory wyspy (insula) przetwarzającej sygnały z wnętrza organizmu.',
    lifehack: 'Zamknij oczy i przeskanuj uwagę od czubka głowy do stóp.'
  },
  {
    id: 'm2-m1-flow',
    from: 'm2',
    to: 'm1',
    type: 'flow',
    direction: 'to',
    label: 'Odzyskanie Przytomności',
    description: 'Decydujesz się przestać pędzić i wziąć głęboki oddech, by rozejrzeć się, gdzie w ogóle jesteś.',
    psychology: 'Wyjście z automatycznego pilota na rzecz świadomej metakognicji.',
    philosophy: 'Husserlowskie epoche – zawieszenie biegu spraw na rzecz refleksji.',
    science: 'Przełączenie aktywacji z obwodów domyślnych na sieć kontroli wykonawczej.',
    lifehack: 'Ustaw cichy sygnał raz na 2 godziny z pytaniem: Co teraz robię i dlaczego?'
  },
  {
    id: 'm2-m3-override',
    from: 'm2',
    to: 'm3',
    type: 'override',
    direction: 'to',
    label: 'Przekierowanie Skupienia',
    description: 'Zamiast rozmyślać o przykrości sprzed tygodnia, zmuszasz umysł do skupienia się na pracy.',
    psychology: 'Kontrola uwagi w funkcjach wykonawczych.',
    philosophy: 'William James – cechą genialnej woli jest zdolność powracania uwagą do celu.',
    science: 'Grzbietowa kora przedczołowa wycisza niepotrzebne pętle myślowe.',
    lifehack: 'Gdy uciekasz myślami, wypowiedz głośno jedno słowo-klucz związane z zadaniem.'
  },
  {
    id: 'm2-m5-override',
    from: 'm2',
    to: 'm5',
    type: 'override',
    direction: 'to',
    label: 'Blokada Impulsu (PFC)',
    description: 'Widzisz ciastko, masz wielką ochotę je zjeść, ale zabraniasz sobie wyciągnięcia po nie ręki.',
    psychology: 'Hamowanie reakcji (Response Inhibition) – powstrzymanie odruchu.',
    philosophy: 'Stoicki imperatyw samokontroli nad ślepym pożądaniem.',
    science: 'Brzuszno-boczna kora przedczołowa (vlPFC) wysyła sygnał wyciszający prążkowie.',
    lifehack: 'Schowaj dłonie do kieszeni i odczekaj 5 sekund.'
  },
  {
    id: 'm2-m6-override',
    from: 'm2',
    to: 'm6',
    type: 'override',
    direction: 'to',
    label: 'Inicjacja Czynu',
    description: 'Nie masz ochoty wstać z łóżka, ale zrzucasz kołdrę i stawiasz stopy na podłodze.',
    psychology: 'Przełamywanie oporu inicjacji działania (aktywacja behawioralna).',
    philosophy: 'Zasadniczy akt woli u Bergsona.',
    science: 'Projekcje z dlPFC do dodatkowej kory ruchowej (SMA) uruchamiające ruch.',
    lifehack: 'Odlicz 5-4-3-2-1 i wykonaj ruch bez dyskusji z umysłem.'
  },
  {
    id: 'm2-m7-override',
    from: 'm2',
    to: 'm7',
    type: 'override',
    direction: 'to',
    label: 'Kontrola Oddechu',
    description: 'Czujesz stres, więc celowo zwalniasz oddech i rozluźniasz ramiona, by zmusić ciało do spokoju.',
    psychology: 'Celowa regulacja somatyczna top-down.',
    philosophy: 'Panowanie nad machiną ciała u Kartezjusza.',
    science: 'Świadoma praca przepony aktywuje włókna nerwu błędnego obniżające tętno.',
    lifehack: 'Zrób 3 oddechy: 4 sekundy wdech, 7 zatrzymanie, 8 wydech.'
  },
  {
    id: 'm2-m11-flow',
    from: 'm2',
    to: 'm11',
    type: 'flow',
    direction: 'to',
    label: 'Zużycie Paliwa Decyzyjnego',
    description: 'Im więcej trudnych decyzji podejmujesz w ciągu dnia, tym bardziej czujesz się wykończony wieczorem.',
    psychology: 'Teoria wyczerpywania się zasobów woli (Ego Depletion).',
    philosophy: 'Ekonomia sił duchowych u Nietzschego.',
    science: 'Spadek glukozy i gromadzenie się adenozyny w korze czołowej.',
    lifehack: 'Zmniejsz liczbę decyzji rano – przygotuj ubrania dzień wcześniej.'
  },
  {
    id: 'm3-m1-conflict',
    from: 'm3',
    to: 'm1',
    type: 'conflict',
    direction: 'to',
    label: 'Fuzja Poznawcza',
    description: 'Przerażająca myśl tak bardzo Cię straszy, że zapominasz, że to tylko myśl i traktujesz ją jak fakt.',
    psychology: 'Fuzja poznawcza (Cognitive Fusion) w terapii ACT.',
    philosophy: 'Zagubienie w świecie wyobrażeń (Spinoza).',
    science: 'Nadaktywność DMN przysłaniająca korę obwodową.',
    lifehack: 'Wyobraź sobie straszną myśl napisaną śmieszną czcionką.'
  },
  {
    id: 'm3-m4-flow',
    from: 'm3',
    to: 'm4',
    type: 'flow',
    direction: 'to',
    label: 'Pętla CBT (Myśl -> Uczucie)',
    description: 'Gdy pomyślisz szef mnie wywali, natychmiast czujesz ścisk w żołądku i strach.',
    psychology: 'Model A-B-C Becka w Terapii Poznawczo-Behawioralnej.',
    philosophy: 'Epiktet – zdarzenia nie mają wartości, dopóki umysł nie nada im sądu.',
    science: 'Sygnały glutaminergiczne z kory czołowej stymulujące ciało migdałowate.',
    lifehack: 'Sprawdź fakt: Czy mam dowody na tę myśl, czy to spekulacja?'
  },
  {
    id: 'm3-m6-override',
    from: 'm3',
    to: 'm6',
    type: 'override',
    direction: 'to',
    label: 'Realizacja Intencji',
    description: 'Przypominasz sobie muszę kupić chleb i skręcasz autem do sklepu.',
    psychology: 'Przekład planu poznawczego na skrypt wykonawczy.',
    philosophy: 'Kantowska koncepcja rozumu praktycznego.',
    science: 'Przekazywanie instrukcji z dlPFC do kory przedruchowej.',
    lifehack: 'Zapisz plan w formule krok-po-kroku na kartce.'
  },
  {
    id: 'm3-m7-flow',
    from: 'm3',
    to: 'm7',
    type: 'flow',
    direction: 'to',
    label: 'Psychosomatyka Stresu',
    description: 'Zamartwianie się sprawami sprawia, że po dwóch godzinach boli Cię kark i głowa.',
    psychology: 'Reakcja psychosomatyczna na przewlekłe ruminacje.',
    philosophy: 'Kartezjańska spójność substancji myślanej i rozciągłej.',
    science: 'Przewlekła aktywacja osi HPA wyrzuca kortyzol i obkurcza naczynia.',
    lifehack: 'Gdy zauważysz ruminacje, zrób 10 przysiadów.'
  },
  {
    id: 'm3-m8-flow',
    from: 'm3',
    to: 'm8',
    type: 'flow',
    direction: 'to',
    label: 'Krystalizacja Schematu',
    description: 'Powtarzanie sobie nigdy mi się nie uda sprawia, że po miesiącu zaczynasz w to głęboko wierzyć.',
    psychology: 'Utrwalanie ruminacji i wyuczona beznadziejność (Seligman).',
    philosophy: 'Nawyk myślowy jako druga natura (Arystoteles).',
    science: 'Długotrwałe wzmocnienie synaptyczne (LTP).',
    lifehack: 'Przerywaj ruminacje w zarodku – nie pozwalaj myśli krążyć dłużej niż minutę.'
  },
  {
    id: 'm4-m1-conflict',
    from: 'm4',
    to: 'm1',
    type: 'conflict',
    direction: 'to',
    label: 'Zalew Afektywny',
    description: 'Przytłaczająca fala gniewu lub lęku zdmuchuje perspektywę obserwatora.',
    psychology: 'Porwanie emocjonalne (Amygdala Hijack).',
    philosophy: 'Niewola namiętności u Spinozy.',
    science: 'Gwałtowny skok aktywności ciała migdałowatego odłączający PFC.',
    lifehack: 'Dotknij zimnej powierzchni lub przemyj twarz zimną wodą.'
  },
  {
    id: 'm4-m3-flow',
    from: 'm4',
    to: 'm3',
    type: 'flow',
    direction: 'to',
    label: 'Uzasadnienie Emocjonalne',
    description: 'Odczuwany lęk sprawia, że umysł dorabia katastroficzne scenariusze, by go wyjaśnić.',
    psychology: 'Błąd poznawczy emotional reasoning.',
    philosophy: 'Hume – rozum jest niewolnikiem namiętności.',
    science: 'Układ limbiczny wymusza spójność afektywną w korze czołowej.',
    lifehack: 'Powiedz: Czuję lęk, ale to nie oznacza, że istnieje zagrożenie.'
  },
  {
    id: 'm4-m5-flow',
    from: 'm4',
    to: 'm5',
    type: 'flow',
    direction: 'to',
    label: 'Zasilanie Impulsu',
    description: 'Intensywna złość błyskawicznie zamienia się w impuls do ataku lub uderzenia w stoł.',
    psychology: 'Wyzwolenie odruchu behawioralnego przez afekt.',
    philosophy: 'Spinozjański conatus napędzany afektem.',
    science: 'Układ limbiczny wyzwalający pobudzenie ruchowe w pniu mózgu.',
    lifehack: 'Działanie przeciwne z DBT – zrób celowo miękki krok wycofania.'
  },
  {
    id: 'm4-m6-flow',
    from: 'm4',
    to: 'm6',
    type: 'flow',
    direction: 'to',
    label: 'Motywacja Afektywna',
    description: 'Emocje przygotowują ciało do przytulenia kogoś lub ucieczki z miejsca zagrożenia.',
    psychology: 'Terapia EFT – emocje jako wektory motywacyjne.',
    philosophy: 'Afekt jako źródło wektora życiowego.',
    science: 'Aktywacja autonomicznogo układu nerwowego do działania.',
    lifehack: 'Zauważ, do jakiego czynu popycha Cię dana emocja.'
  },
  {
    id: 'm4-m7-flow',
    from: 'm4',
    to: 'm7',
    type: 'flow',
    direction: 'to',
    label: 'Somatyzacja Afektu',
    description: 'Smutek staje się ciężarem w klatce piersiowej, a lęk ściśniętym żołądkiem.',
    psychology: 'Terapia Somatic Experiencing (Peter Levine).',
    philosophy: 'Merleau-Ponty – przeżywające ciało.',
    science: 'Wyrzut kortyzolu i zmiana tonusu naczyniowego.',
    lifehack: 'Skieruj łagodną uwagę w punkt somatycznego napięcia.'
  },
  {
    id: 'm4-m10-conflict',
    from: 'm4',
    to: 'm10',
    type: 'conflict',
    direction: 'to',
    label: 'Aleksytymia (Paraliż Mowy)',
    description: 'Przytłaczająca emocja sprawia, że brakuje Ci słów, by opisać co czujesz.',
    psychology: 'Aleksytymia traumatyczna – brak słów dla afektu.',
    philosophy: 'Levinas – to co niewyrażalne w uderzeniu cierpienia.',
    science: 'Odłączenie funkcjonalne ciała migdałowatego od pola Broca.',
    lifehack: 'Opisz emocję kolorem lub metaforą, gdy brakuje słów.'
  },
  {
    id: 'm5-m2-conflict',
    from: 'm5',
    to: 'm2',
    type: 'conflict',
    direction: 'to',
    label: 'Przełamanie Woli (Pokusa)',
    description: 'Potężny skok ochoty wyłącza rozsądek i zmusza wolę do uległości.',
    psychology: 'Porażka samokontroli pod wpływem dopaminy.',
    philosophy: 'Schopenhauer – ślepy pęd wygrywający z intelektem.',
    science: 'Wyrzut dopaminy w jadrze półleżącym wyłącza kontrolę PFC.',
    lifehack: 'Zmień otoczenie – nie walcz z impulsem w jego zasięgu.'
  },
  {
    id: 'm5-m6-flow',
    from: 'm5',
    to: 'm6',
    type: 'flow',
    direction: 'to',
    label: 'Działanie Impulsywne',
    description: 'Sęgasz po telefon bez myślenia natychmiast, gdy poczujesz sekundę nudy.',
    psychology: 'Odruch automatyczny pominięty przez refleksję.',
    philosophy: 'Bezwolna determinacja fizyczna.',
    science: 'Bezpośredni szlak prążkowie-kora ruchowa.',
    lifehack: 'Stwórz tarcie – połóż telefon w drugim pokoju.'
  },
  {
    id: 'm6-m3-flow',
    from: 'm6',
    to: 'm3',
    type: 'flow',
    direction: 'to',
    label: 'Informacja Zwrotna z Działania',
    description: 'Zrobienie pierwszego kroku daje twardy dowód, który zmienia Twoje myślenie.',
    psychology: 'Eksperymenty behawioralne w CBT.',
    philosophy: 'Pragmatyzm Peirce a – prawda testowana w działaniu.',
    science: 'Kodowanie błędu predykcji dopaminergicznej po akcji.',
    lifehack: 'Traktuj działanie jako zbieranie danych, nie jako sprawdzian.'
  },
  {
    id: 'm6-m4-flow',
    from: 'm6',
    to: 'm4',
    type: 'flow',
    direction: 'to',
    label: 'Sprzężenie Zwrotne Ciała',
    description: 'Uśmiech i wyprostowana postawa po kilku chwilach poprawiają odczuwany nastrój.',
    psychology: 'Hipoteza sprzężenia zwrotnego postawy (Power Posing).',
    philosophy: 'William James – jest nam smutno, bo płaczemy.',
    science: 'Receptory mięśniowe wysyłające sygnał bezpieczeństwa do kory wyspy.',
    lifehack: 'Wyprostuj plecy i otwórz dłonie na 60 sekund.'
  },
  {
    id: 'm7-m4-flow',
    from: 'm7',
    to: 'm4',
    type: 'flow',
    direction: 'to',
    label: 'Interocepcja (Ciało -> Afekt)',
    description: 'Ściśnięty żołądek z powodu głodu zostaje zinterpretowany przez mózg jako lęk.',
    psychology: 'Teoria konstruowanych emocji (Barrett).',
    philosophy: 'Nietzsche – ciało jako wielki rozum.',
    science: 'Kora wyspy budująca afekt z sygnałów narządowych.',
    lifehack: 'Gdy czujesz niepokój, sprawdź najpierw czy nie jesteś po prostu głodny.'
  },
  {
    id: 'm8-m3-flow',
    from: 'm8',
    to: 'm3',
    type: 'flow',
    direction: 'to',
    label: 'Filtr Poznawczy (Schemat)',
    description: 'Głębokie przekonanie, że ludzie są wrodzy, sprawia że zwykły uśmiech uznajesz za kpinę.',
    psychology: 'Terapia Schematu (Young) i zniekształcenia poznawcze.',
    philosophy: 'Kantowskie kategorie rozumu filtrujące rzeczywistość.',
    science: 'Sztywne ścieżki synaptyczne faworyzujące znane interpretacje.',
    lifehack: 'Zapytaj: Z jakiej ukrytej reguły wyrosła ta myśl?'
  },
  {
    id: 'm9-m1-conflict',
    from: 'm9',
    to: 'm1',
    type: 'conflict',
    direction: 'to',
    label: 'Zawłaszczenie Uwagi',
    description: 'Głośny hałas lub powiadomienie bezczelnie wyrywają Cię z głębokiego skupienia.',
    psychology: 'Dystrakcja środowiskowa i skrajne przebodźcowanie.',
    philosophy: 'Presja fizyczna otoczenia.',
    science: 'Odruch orientacyjny wyzwalany przez jądra pnia mózgu.',
    lifehack: 'Włącz tryb nie przeszkadzać na czas głębokiej pracy.'
  },
  {
    id: 'm9-m6-flow',
    from: 'm9',
    to: 'm6',
    type: 'flow',
    direction: 'to',
    label: 'Afordancje Przestrzenne',
    description: 'Książka leżąca na poduszce zachęca do czytania, a telefon na biurku do rozpraszania.',
    psychology: 'Architektura wyboru w psychologii środowiskowej.',
    philosophy: 'Determinizm materialny otoczenia.',
    science: 'Bodźce wzrokowe aktywujące reprezentacje motoryczne.',
    lifehack: 'Ułatwiaj dobre zachowania i stawiaj przeszkody złym.'
  },
  {
    id: 'm10-m4-override',
    from: 'm10',
    to: 'm4',
    type: 'override',
    direction: 'to',
    label: 'Nazywanie Afektu (Affect Labeling)',
    description: 'Nazwanie emocji precyzyjnym słowem natychmiast obniża jej natężenie.',
    psychology: 'Affect Labeling w terapii poznawczej i ACT.',
    philosophy: 'Wittgenstein – granice języka granicami świata.',
    science: 'Pole Broca wyciszające ciało migdałowate.',
    lifehack: 'Zamiast jest źle powiedz: czuję rozczarowanie.'
  },
  {
    id: 'm11-m2-flow',
    from: 'm11',
    to: 'm2',
    type: 'flow',
    direction: 'to',
    label: 'Zasilanie Funkcji Wykonawczych',
    description: 'Sen i jedzenie dają kora czołowej siłę niezbędną do trzymania nerwów na wodzy.',
    psychology: 'Budżetowanie metaboliczne samokontroli.',
    philosophy: 'Materializm biologiczny.',
    science: 'Dopływ glukozy niezbędny dla pracy vlPFC.',
    lifehack: 'Nie podejmuj kluczowych ustaleń na zmęczeniu (HALT).'
  },
  {
    id: 'm11-m4-flow',
    from: 'm11',
    to: 'm4',
    type: 'flow',
    direction: 'to',
    label: 'Modulacja Biochemiczna',
    description: 'Poziom hormonów, glukozy i neuroprzekaźników dyktuje bazowy poziom nerwowości lub spokoju w danym dniu.',
    psychology: 'Biologiczne i metaboliczne podłoże zmienności nastroju i afektu.',
    philosophy: 'Redukcjonizm biologiczny.',
    science: 'Stężenie kortyzolu, dopaminy i glukozy stymulujące ciało migdałowate i korę czołową.',
    lifehack: 'Zrób pakiet badań krwi przy przewlekłym spadku nastroju lub energii.'
  },
  {
    id: 'm13-m7-flow',
    from: 'm13',
    to: 'm7',
    type: 'flow',
    direction: 'to',
    label: 'Koregulacja Somatyczna',
    description: 'Obecność spokojnej osoby wycisza kołatanie serca i układ nerwowy.',
    psychology: 'Teoria poliwagalna Stephena Porgesa.',
    philosophy: 'Relacja Ja-Ty u Martina Bubera.',
    science: 'Gałąź brzuszna nerwu błędnego obniżająca tętno.',
    lifehack: 'Szukaj spokojnego kontaktu wzrokowego w strefie stresu.'
  },
  {
    id: 'm9-m11-flow',
    from: 'm9',
    to: 'm11',
    type: 'flow',
    direction: 'to',
    label: 'Bio-rytm i Otoczenie',
    description: 'Gdy za oknem jest ciemno i ponuro przez całe tygodnie, Twoje ciało nie pyta o zdanie – produkuje mniej serotoniny i więcej melatoniny, a Ty czujesz, że po prostu brakuje Ci prądu.',
    psychology: 'Psychologia środowiskowa opisuje to jako sezonowe zaburzenie afektu (SAD) – stan, w którym środowisko fizyczne bezpośrednio obniża napęd życiowy.',
    philosophy: 'Determinizm materialny: organizm jest częścią przyrody i ulega jej cyklom, zanim kora mózgowa cokolwiek zdoła zaplanować.',
    science: 'Fotoperiod (ilość światła) dociera przez siatkówkę do jądra skrzyżowanego (SCN) i steruje syntezą melatoniny oraz kortyzolu w nadnerczach.',
    lifehack: 'Rano po przebudzeniu zapal jasne światło lub wyjdź na 10 minut na zewnątrz, żeby dać mózgowi sygnał do wyłączenia melatoniny.'
  },
  {
    id: 'm9-m7-flow',
    from: 'm9',
    to: 'm7',
    type: 'flow',
    direction: 'to',
    label: 'Nacisk i Temperatura Otoczenia',
    description: 'Ciasny kołnierzyk, szorstka metka w koszulce albo lodowaty wiatr natychmiast zmieniają to, co czujesz w ciele, zanim w ogóle pomyślisz, że coś jest nie tak.',
    psychology: 'Przeciążenie sensoryczne – powtarzalne, nieprzyjemne bodźce dotykowe podprogowo drenują zasoby uwagi i podnoszą napięcie mięśniowe.',
    philosophy: 'Fenomenologia Merleau-Ponty ego: ciało jest pierwszą powierzchnią styku ze światem zewnętrznym i odbiera go bezpośrednio.',
    science: 'Pobudzenie obwodowych receptorów czuciowych (mechanoreceptorów i termoreceptorów) wysyła sygnały do rdzenia kręgowego i kory czuciowej (S1).',
    lifehack: 'Usunięcie jednego irytującego bodźca fizycznego (np. zmiana ciasnego ubrania czy wyciszenie hałasu) błyskawicznie obniża bazowy poziom spięcia.'
  },
  {
    id: 'm9-m5-flow',
    from: 'm9',
    to: 'm5',
    type: 'flow',
    direction: 'to',
    label: 'Wyzwalacz Środowiskowy (Afordancja)',
    description: 'Zobaczenie chipsów leżących na wierzchu albo powiadomienia na ekranie wywołuje błyskawiczną ochotę sięgnięcia po nie, chociaż sekundę wcześniej wcale o tym nie myślałeś.',
    psychology: 'Teoria afordancji Gibsona i reaktywność na bodźce (Cue-Reactivity) – widok okazji wyzwala odruch chęci bez udziału rozsądku.',
    philosophy: 'Mądrość ludowa okazja czyni złodzieja – środowisko stawia przed człowiekiem pokusę, która sama ciągnie za sznurki zachowania.',
    science: 'Gwałtowny wyrzut dopaminy w jądrze półleżącym wywołany bodźcem wzrokowym generuje sygnał nagrody jeszcze przed reakcją kory czołowej.',
    lifehack: 'Nie walcz z silną wolą – schowaj wyzwalacz z oczu. Gdy znika bodziec wzrokowy, impuls opada o 80%.'
  },
  {
    id: 'm11-m7-both',
    from: 'm11',
    to: 'm7',
    type: 'flow',
    direction: 'both',
    label: 'Fizjologiczny Ślad Metabolizmu',
    description: 'Spadek cukru lub wypicie mocnej kawy daje natychmiastowe odczucie roztrzęsienia, drżenia rąk albo ciężkości w żołądku. I odwrotnie – intensywny wysiłek fizyczny zmienia skład biochemiczny krwi.',
    psychology: 'Interocepcja – zdolność umysłu do odczytywania wewnętrznych wskaźników fizjologicznych organizmu.',
    philosophy: 'Monizm cielesno-duchowy: metabolizm i wrażenia z ciała to nie dwie osobne rzeczy, lecz ten sam proces widziany z zewnątrz i od wewnątrz.',
    science: 'Kora wyspy (insula) odbiera sygnały o poziomie glukozy, lactatu i pH krwi, budując mapę odczuć somatycznych.',
    lifehack: 'Gdy czujesz dziwne roztrzęsienie w ciele, zanim uznasz to za lęk psychiczny, zjedz coś wartościowego lub wypij szklankę wody.'
  },
  {
    id: 'm11-m5-flow',
    from: 'm11',
    to: 'm5',
    type: 'flow',
    direction: 'to',
    label: 'Spadek Hamowania przy Wyczyszczonej Baterii',
    description: 'Kiedy jesteś niewyspany albo bardzo głodny, masz dziesięć razy mniej cierpliwości i ulegasz impulsom zjedzenia śmieciowego jedzenia lub wybuchnięcia gniewem.',
    psychology: 'Teoria ego depletion i brak zasobów metabolicznych do samokontroli.',
    philosophy: 'Nietzscheańska krytyka czystej woli: tak zwana słabość charakteru to często po prostu wyczerpanie biologiczne.',
    science: 'Spadek glukozy w korze grzbietowo-bocznej (dlPFC) uniemożliwia wysyłanie hamujących sygnałów GABA-ergicznych do obwodów nagrody.',
    lifehack: 'Gdy czujesz nagły, agresywny impuls ulegania nawykowi, sprawdź najpierw czy nie działa reguła HALT (Głód, Złość, Samotność, Zmęczenie).'
  },
  {
    id: 'm11-m3-both',
    from: 'm11',
    to: 'm3',
    type: 'flow',
    direction: 'both',
    label: 'Pętla Neurochemiczna Myśli i Stresu',
    description: 'Stan zapalny w ciele albo zjazd po stymulantach wywołuje czarne myśli i mgłę mózgową. Z kolei zamartwianie się w głowie natychmiast zalewa krew kortyzolem.',
    psychology: 'Biologiczna podstawa ruminacji – osłabienie elastyczności poznawczej pod wpływem obciążenia metabolicznego.',
    philosophy: 'Spinozjańska równoległość: porządek i połączenie myśli jest tym samym, co porządek i połączenie stanów ciała.',
    science: 'Proinflamacyjne cytokiny aktywują mikroglej w mózgu i zmieniają metabolizm tryptofanu, wywołując czarne scenariusze myślowe.',
    lifehack: 'Nie próbuj przegadać racjonalnie mgły mózgowej przy wyczerpaniu – zrób przerwę na sen lub lekki ruch, by zresetować biochemię.'
  },
  {
    id: 'm13-m5-flow',
    from: 'm13',
    to: 'm5',
    type: 'flow',
    direction: 'to',
    label: 'Wzbudzenie w Obecności Innych',
    description: 'Bliskość atrakcyjnej osoby albo przebywanie w nakręconym emocjonalnie tłumie natychmiast wyzwala automatyczne odruchy – chęć zbliżenia, rywalizacji albo ucieczki.',
    psychology: 'Impulsywność relacyjna i reakcje przywiązaniowe wyzwalane bodźcami społecznymi.',
    philosophy: 'Koncepcja mimetycznego pożądania René Girarda – nasze impulsy i pragnienia często rodzą się z podglądania innych ludzi.',
    science: 'Pobudzenie podwzgórza i układu limbicznego pod wpływem sygnałów niewerbalnych (wzrok, odległość fizyczna, zapach).',
    lifehack: 'W situacjach intensywnego napięcia społecznego zrób fizyczny krok w tył, by przerwać automatyczny odruch.'
  },
  {
    id: 'm13-m4-both',
    from: 'm13',
    to: 'm4',
    type: 'flow',
    direction: 'both',
    label: 'Zarażanie Afektem i Koregulacja',
    description: 'Gdy wchodzisz do pokoju, w którym ktoś jest wściekły albo przerażony, natychmiast czujesz ciężar w żołądku. I odwrotnie – Twój spokój potrafi wyciszyć kogoś w panice.',
    psychology: 'Zjawisko zarażania emocjonalnego (Emotional Contagion) oraz teoria koregulacji emocjonalnej.',
    philosophy: 'Relacja Ja-Ty Martina Bubera: autentyczne spotkanie z drugim człowiekiem zmienia bezpośrednio nasz wewnętrzny stan czucia.',
    science: 'Aktywacja brzusznej gałęzi nerwu błędnego oraz neuronów lustrzanych odczytujących wyraz twarzy i mikronapięcia u rozmówcy.',
    lifehack: 'Podczas trudnej rozmowy świadomie obniż ton głosu i zwolnij oddech – zmusisz układ nerwowy drugiej osoby do koregulacji.'
  },
  {
    id: 'm10-m3-both',
    from: 'm10',
    to: 'm3',
    type: 'flow',
    direction: 'both',
    label: 'Mowa Wewnętrzna i Słownik Myśli',
    description: 'Nie jesteś w stanie pomyśleć skomplikowanej analizy, jeśli nie znasz odpowiednich słów. Język podsuwa klocki, z których układasz swoje wewnętrzne narracje.',
    psychology: 'Koncepcja mowa wewnętrzna Lwa Wygotskiego – myślenie to po prostu cichy dialog z samym sobą.',
    philosophy: 'Wittgenstein: Granice mojego języka oznaczają granice mojego świata. Słowa budują geometrię myśli.',
    science: 'Sieci językowe (ośrodek Broca i Wernickego) ściśle współpracują z korą przedczołową przy generowaniu i porządkowaniu myśli.',
    lifehack: 'Poszerzaj słownictwo opisujące zjawiska wokół siebie. Im bardziej precyzyjne słowo wybierzesz, tym mniej chaotyczna będzie myśl.'
  },
  {
    id: 'm8-m1-awareness',
    from: 'm8',
    to: 'm1',
    type: 'awareness',
    direction: 'to',
    label: 'Okulary Uwagi Obserwatora',
    description: 'Gdy głęboko wierzysz, że jesteś niezdarą, Obserwator w Tobie natychmiast wyłapuje każdy twój potknięty krok, a całkowicie ignoruje momenty, gdy poradziłeś sobie świetnie.',
    psychology: 'Uwaga selektywna i błąd potwierdzenia (Confirmation Bias) – przekonania decydują o tym, na co w ogóle zwracasz uwagę.',
    philosophy: 'Kantyzm fenomenologiczny: nie widzimy rzeczy takimi, jakimi są, ale takimi, jakimi są nasze ramy pojęciowe.',
    science: 'Pętla ze wzgórza do kory wzrokowej i czuciowej, która przesyła do świadomej uwagi tylko sygnały zgodne z wewnętrznym modelem predykcyjnym.',
    lifehack: 'Gdy zauważysz, że stale wyłapujesz z otoczenia tylko negatywy, zapytywanie Obserwatora: Na co jeszcze teraz NIE zwracam uwagi? rozszerza pole świadomości.'
  }
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
    group: 'cognitive'
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
    group: 'executive'
  },
  {
    id: "ma10",
    title: "Czynnik Chaosu",
    description: "Niespodziewana losowość, czarne łabędzie, wypadki lub uśmiech losu, który brutalnie obala najtwardsze plany.",
    psychology: "Wzrost potraumatyczny. Paradoksalnie najtrudniejsze ciosy w strukturę wymuszają budowę o wiele stabilniejszej siły psychicznej.",
    philosophy: "Amor Fati - radykalna akceptacja rzeczywistości. Zdarzenia po prostu nadchodzą. To Ty nadajesz im destrukcyjne znaczenie.",
    science: "Termodynamika - żaden układ nie zachowa porządku w nieskończoność. Nie da się przewidzieć losu z powodu zbyt wielkiej liczby zmiennych.",
    lifehack: "Zawsze zachowuj margines błędu. W zasobach finansowych, emocjonalnych i czasowych licz się z anomalią.",
    group: 'awareness'
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
  {
    id: 'ma1-ma4-flow',
    from: 'ma1',
    to: 'ma4',
    type: 'flow',
    direction: 'to',
    label: 'Pamięć Komórkowa',
    description: 'Podłoże biologiczne koduje ślady po głębokim stresie w tkankach i ekspresji genów.',
    psychology: 'Epigenetyczne zakodowanie urazu w podatności komórkowej.',
    philosophy: 'Ciało jako żywy archiwista historii gatunkowej.',
    science: 'Modyfikacja metylacji DNA pod wpływem kortyzolu.',
    lifehack: 'Dbaj o bazowy stan biologiczny, by wspomóc leczenie urazów.'
  },
  {
    id: 'ma5-ma4-flow',
    from: 'ma5',
    to: 'ma4',
    type: 'flow',
    direction: 'to',
    label: 'Dziedziczenie Traum',
    description: 'Nierozwiązany uraz rodziców przekazywany jest dzieciom przez styl wychowania i biologię.',
    psychology: 'Trauma transgeneracyjna w psychoterapii systemowej.',
    philosophy: 'Dziedziczne obciążenia rodu.',
    science: 'Wpływ stresu rodzicielskiego na rozwój układu limbicznego niemowlęcia.',
    lifehack: 'Nazwij i przerwij szkodliwy schemat, by nie przekazać go dalej.'
  },
  {
    id: 'ma5-ma3-conflict',
    from: 'ma5',
    to: 'ma3',
    type: 'conflict',
    direction: 'both',
    label: 'Współdzielony Cień',
    description: 'Rodzinne wyparcia i milczące tabu zasilają indywidualny cień psychiczny.',
    psychology: 'Cień rodzinny w analizie jungowskiej.',
    philosophy: 'Niewidzialne lojalności rodowe.',
    science: 'Wzorzec nieświadomych mikroekspresji opiekunów w dzieciństwie.',
    lifehack: 'Zbadaj co w Twojej rodzinie było tematem zakazanym.'
  },
  {
    id: 'ma2-ma1-flow',
    from: 'ma2',
    to: 'ma1',
    type: 'flow',
    direction: 'to',
    label: 'Wektor Adaptacyjny',
    description: 'Klimat i jakość otoczenia bezpośrednio modyfikują funkcjonowanie Twojego organizmu.',
    psychology: 'Wpływ środowiska geograficznego na stan psychiczny.',
    philosophy: 'Determinizm geograficzny.',
    science: 'Synteza witaminy D3 i wpływ zanieczyszczeń na układ odpornościowy.',
    lifehack: 'Spędzaj minimum 20 minut dziennie na świeżym powietrzu.'
  },
  {
    id: 'ma8-ma11-flow',
    from: 'ma8',
    to: 'ma11',
    type: 'flow',
    direction: 'both',
    label: 'Infostruktura',
    description: 'Duch epoki tworzy technologię, która z kolei redefiniuje duch czasów.',
    psychology: 'Uzależnienie od bodźców cyfrowych w nowoczesności.',
    philosophy: 'Teoria mediów McLuhana – medium jest przekazem.',
    science: 'Przebudowa szlaków dopaminowych przez algorytmy sieciowe.',
    lifehack: 'Rób cyfrowy detoks raz w tygodniu.'
  },
  {
    id: 'ma8-ma5-flow',
    from: 'ma8',
    to: 'ma5',
    type: 'flow',
    direction: 'to',
    label: 'Ewolucja Ról Społecznych',
    description: 'Normy socjologiczne danych czasów dyktują podział ról w rodzinie i grupie.',
    psychology: 'Wpływ dyskursu kulturowego na tożsamość rolizowaną.',
    philosophy: 'Foucault – władza dyskursu nad zachowaniem jednostek.',
    science: 'Presja społeczna modulująca poziom hormonów przywiązania.',
    lifehack: 'Sprawdź, które ze swoich ról przyjąłeś bezrefleksyjnie ze społeczeństwa.'
  },
  {
    id: 'ma6-ma3-conflict',
    from: 'ma6',
    to: 'ma3',
    type: 'conflict',
    direction: 'both',
    label: 'Granice Poznania',
    description: 'Język i kultura próbują schwytać w słowa nieświadome pędy, tworząc napięcie.',
    psychology: 'Symbolizacja nieświadomego w psychoanalizie.',
    philosophy: 'Wittgenstein – to o czym nie można mówić, o tym należy milczeć.',
    science: 'Sprzężenie między korą językową a strukturami głębokimi mózgu.',
    lifehack: 'Nie próbuj każdego odczucia racjonalizować słowami.'
  },
  {
    id: 'ma7-ma5-conflict',
    from: 'ma7',
    to: 'ma5',
    type: 'conflict',
    direction: 'both',
    label: 'Rozpad Lojalności',
    description: 'Dojrzewanie i kryzys indywidualny zmuszają do zakwestionowania sztywnych reguł rodowych.',
    psychology: 'Indywiduacja według Junga – wychodzenie ze skryptu rodzinnego.',
    philosophy: 'Bunt egzystencjalny przeciw tradycji.',
    science: 'Przebudowa połączeń synaptycznych w korze przedczołowej u progu dojrzałości.',
    lifehack: 'Zaakceptuj fakt, że rozwój czasem wymaga niepoprawności wobec oczekiwań innych.'
  }
];
