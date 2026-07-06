export interface SubDomainInfo {
  psychology: string;
  philosophy: string;
  science: string;
}

export interface DomainNode {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  details: SubDomainInfo;
  practices: string[];
}

export interface HumanModel {
  title: string;
  description: string;
  domains: DomainNode[];
}

export const MIKRO_MODEL: HumanModel = {
  title: "Tu i Teraz (Mikro)",
  description: "Bieżąca dynamika Twojej świadomości w danym momencie. To tutaj zachodzi bezpośrednie doświadczenie życiowe oraz procesy samoregulacji.",
  domains: [
    {
      id: "m1",
      num: 1,
      title: "Jaźń / Obserwator",
      subtitle: "Przestrzeń w Twojej głowie. Miejsce, z którego patrzysz na świat, ale którym nie jesteś.",
      details: {
        psychology: "Myślisz, że jesteś swoimi myślami? Błąd. Zauważ, że kiedy czujesz złość, ktoś musi tę złość obserwować. Tym kimś jesteś Ty. Terapie takie jak IFS czy ACT nazywają to stanem czystego \"Ja\" (Self) – to kontekst dla wszystkiego, co się w Tobie dzieje. Nie jesteś chmurami, jesteś niebem, po którym płyną.",
        philosophy: "Buddyzm nazwał to Anatta – koncepcją, według której stałe ego to iluzja. Z kolei Edmund Husserl, twórca fenomenologii, mówił o \"czystym ego\", które potrafi zawiesić ocenę i po prostu przyglądać się własnemu doświadczeniu.",
        science: "Twój mózg na co dzień działa w trybie domyślnym (Sieć Wzbudzeń Podstawowych, DMN) – to ten nieustanny, głośny monolog w głowie. Medytacja i celowe skierowanie uwagi fizycznie wyciszają DMN. Kluczową rolę w poczuciu bycia \"tu i teraz\" odgrywa pień mózgu oraz wyspa, która nieustannie mapuje stan Twojego ciała."
      },
      practices: [
        "IFS Self-Inquiry: Kiedy czujesz silną emocję, zapytaj siebie: 'Jaka część mnie teraz krzyczy?' i zrób krok w tył. Zostań tylko obserwatorem.",
        "ACT Defuzja: Wyobraź sobie swoje myśli jako liście płynące na strumieniu. Nie musisz ich łowić. Po prostu patrz, jak przepływają.",
        "Skanowanie uwagi: Zamiast patrzeć na obiekt, skup się przez chwilę na samym procesie patrzenia."
      ]
    },
    {
      id: "m2",
      num: 2,
      title: "Wola / Funkcja Wykonawcza",
      subtitle: "Ten ułamek sekundy, w którym decydujesz, czy ulec impulsowi, czy zrobić to, co słuszne. Twoje wewnętrzne hamulce.",
      details: {
        psychology: "Znasz ten moment. Wiesz, że powinieneś pracować, ale Twoja ręka sama sięga po telefon. Psychologia uczy nas, że samokontrola to zasób, który się wyczerpuje. Im więcej decyzji podejmujesz, tym szybciej bateria siada. Gdy jest pusta, stery przejmuje autopilot.",
        philosophy: "Epiktet nazywał to Prohairesis – moralną wolą wyboru. To jedyna rzecz na świecie, która jest w 100% pod Twoją kontrolą. Możesz stracić majątek i zdrowie, ale nikt nie odbierze Ci tego ułamka sekundy między bodźcem a Twoją reakcją.",
        science: "Za ten wewnętrzny konflikt odpowiada kora przedczołowa – ewolucyjnie najmłodsza część mózgu. Dokładniej: obszar grzbietowo-boczny (dlPFC). To on musi wykonać ciężką pracę, aby fizycznie zahamować impuls wygenerowany głębiej, w układzie nagrody. Niewyspanie po prostu wyłącza ten obszar."
      },
      practices: [
        "Stoicka dychotomia kontroli: Kiedy masz problem, podziel go na dwie kolumny. Zapisz, na co masz wpływ, a co leży całkowicie poza Tobą. Skup się tylko na pierwszej grupie.",
        "Wstrzymanie reakcji (Gap practice): Zrób 5 sekund przerwy między bodźcem (np. powiadomieniem w telefonie) a reakcją. Poczuj ten opór.",
        "Jedno zadanie: Ustaw stoper na 20 minut głębokiej pracy i świadomie blokuj każdy odruch sprawdzenia czegokolwiek innego."
      ]
    },
    {
      id: "m3",
      num: 3,
      title: "Myśli",
      subtitle: "Głos w Twojej głowie. Kognitywny szum, interpretacje i ciągłe ocenianie rzeczywistości.",
      details: {
        psychology: "Twój mózg to maszyna do przewidywania. Często rzuca w Ciebie najgorszymi scenariuszami tylko po to, żeby Cię chronić. Terapia Poznawczo-Behawioralna (CBT) nazywa to zniekształceniami poznawczymi. Czytanie w myślach, katastrofizowanie, myślenie czarno-białe – to błędy w kodzie Twojego oprogramowania.",
        philosophy: "Kartezjusz stwierdził \"Myślę, więc jestem\". Ale dzisiaj wiemy, że myśli to tylko propozycje Twojego umysłu, a nie absolutna prawda. Immanuel Kant zauważył, że nigdy nie widzimy świata takim, jakim jest. Nakładamy na niego filtry i kategorie, które sami tworzymy.",
        science: "Myśl to fizyczny proces. To zsynchronizowane wyładowania neuronów w korze mózgowej, często w pasmach fal Beta i Gamma. Ta aktywność pożera ogromne ilości glukozy. Im bardziej się czymś martwisz, tym więcej energii fizycznie spalasz."
      },
      practices: [
        "Dziennik myśli: Zapisz jedną bolesną myśl. Znajdź w niej logiczny błąd (np. wyciąganie pochopnych wniosków) i napisz racjonalną alternatywę.",
        "Metoda Byron Katie: Kiedy dręczy Cię natrętna myśl, zapytaj bezlitośnie: 'Czy mam 100% pewności, że to prawda?'.",
        "Nadaj myśli formę: Zamiast walczyć z myślą, wyobraź ją sobie jako napis na billboardzie, który właśnie mijasz samochodem."
      ]
    },
    {
      id: "m4",
      num: 4,
      title: "Uczucia",
      subtitle: "Sygnały alarmowe z Twojego ciała. Kompas, który mówi Ci, czy Twoje granice są bezpieczne.",
      details: {
        psychology: "Emocje nie są Twoim wrogiem. To brutalnie szczere komunikaty o niezaspokojonych potrzebach. Złość informuje, że ktoś przekroczył Twoje granice. Smutek żąda czasu na regenerację. Problem pojawia się, gdy zamiast ich słuchać, próbujesz je stłumić.",
        philosophy: "Hume twierdził, że rozum to tylko niewolnik namiętności. I miał dużo racji. Myślimy, że podejmujemy logiczne decyzje, a tak naprawdę najpierw czujemy impuls z ciała, do którego później dopisujemy sprytną, racjonalną wymówkę.",
        science: "Uczucia rodzą się poniżej kory mózgowej. Ciało migdałowate w układzie limbicznym skanuje otoczenie w poszukiwaniu zagrożeń. Kiedy je znajdzie, natychmiast odpala reakcję fizjologiczną – szybsze bicie serca, pot, ścisk w żołądku. Zanim w ogóle uświadomisz sobie problem, Twoje ciało już jest w gotowości."
      },
      practices: [
        "Lokalizacja emocji: Kiedy czujesz złość lub lęk, zamknij oczy i znajdź to uczucie w ciele. Ucisk w klatce? Kamień w brzuchu? Skup na tym miejscu oddech.",
        "Przeciwne działanie: Jeśli czujesz paraliżujący lęk przed zrobieniem czegoś ważnego, podejmij najmniejszy możliwy krok w tym kierunku. Przerwij pętlę unikania.",
        "Nazywanie (Affect Labeling): Poczuj ulgę mówiąc wprost: 'Czuję teraz ogromny stres'. Zwykłe nazwanie emocji fizycznie zmniejsza aktywność ciała migdałowatego."
      ]
    },
    {
      id: "m5",
      num: 5,
      title: "Impulsy",
      subtitle: "Nagłe, krótkie strzały pożądania. Oprogramowanie z epoki kamienia łupanego w świecie taniej dopaminy.",
      details: {
        psychology: "Freud nazywał to Id – najstarszą częścią naszej psychiki, która domaga się natychmiastowej gratyfikacji. Chcę jeść, chcę spać, chcę przyjemności, teraz. To proste warunkowanie. Twój mózg nauczył się, że pewna akcja (np. scrollowanie) daje szybką ulgę.",
        philosophy: "Epikur uczył, jak cieszyć się życiem, ale ostrzegał przed ślepym podążaniem za impulsami. Dzielił potrzeby na naturalne i konieczne (woda, sen) oraz te, które są sztuczne i przynoszą więcej cierpienia niż pożytku. Stoicy uważali uleganie impulsom za formę dobrowolnego niewolnictwa.",
        science: "To czysta chemia. Oczekujesz nagrody? Układ dopaminergiczny (prążkowie i jądro półleżące) zalewa Cię dopaminą. Ten neuroprzekaźnik nie daje poczucia szczęścia. On daje pragnienie. Zmusza Cię do pościgu. Gdy zdobędziesz to, czego chciałeś, poziom dopaminy spada i czujesz pustkę."
      },
      practices: [
        "Surfing na pragnieniu (Urge Surfing): Kiedy masz ochotę na coś, czego próbujesz unikać, po prostu obserwuj to pragnienie. Zauważ, jak rośnie jak fala, osiąga szczyt i w końcu opada. Zwykle zajmuje to 10-15 minut.",
        "Reguła 10 minut: Jeśli bardzo chcesz ulec impulsowi, powiedz sobie: 'Zrobię to, ale za 10 minut'. Często sam upływ czasu wystarczy, aby ochota zniknęła.",
        "Śledzenie wyzwalaczy: Zadaj sobie pytanie: co wydarzyło się tuż przed tym, jak poczułem ten impuls? Zmęczenie? Stres? Nuda?"
      ]
    },
    {
      id: "m6",
      num: 6,
      title: "Zachowania",
      subtitle: "To, co faktycznie robisz. Jedyny dowód na to, kim naprawdę jesteś.",
      details: {
        psychology: "Nieważne, co myślisz ani co czujesz. Na zewnątrz widać tylko Twoje zachowanie. Psychologia behawioralna uczy, że robisz to, za co jesteś nagradzany (nawet jeśli nagrodą jest chwilowe uniknięcie stresu). Terapia ACT zachęca do działania w kierunku własnych wartości pomimo odczuwania strachu.",
        philosophy: "Arystoteles uważał, że cnoty nie zdobywa się przez myślenie, ale przez działanie. Stajesz się odważny, postępując odważnie. Pragmatycy, tacy jak William James, poszli dalej: prawda o Tobie kryje się w Twoich praktycznych, codziennych wyborach, a nie w deklaracjach.",
        science: "Twoje powtarzalne zachowania dosłownie rzeźbią Twój mózg. Zwoje podstawy automatyzują to, co robisz często, przenosząc to z kory czołowej do głębszych, \"tańszych w utrzymaniu\" rejonów mózgu. Tak powstaje nawyk."
      },
      practices: [
        "Działanie mimo wszystko: Wybierz jedną drobną rzecz zgodną z Twoimi wartościami (np. 15 minut ćwiczeń) i zrób ją dzisiaj niezależnie od tego, jak bardzo Ci się nie chce.",
        "Zasada podczepiania (Habit Stacking): Połącz nowy, pożądany nawyk z czynnością, którą i tak robisz codziennie (np. 'Zaraz po umyciu zębów wykonam rozciąganie').",
        "Bezlitosny audyt: Zapisz szczerze, ile czasu dzisiaj spędziłeś na działaniach celowych, a ile na odruchowych zapychaczach czasu."
      ]
    },
    {
      id: "m7",
      num: 7,
      title: "Wrażenia z ciała",
      subtitle: "Hardware przesyła raporty o błędach. Surowe dane z Twoich mięśni, jelit i skóry.",
      details: {
        psychology: "Ciało pamięta wszystko, nawet to, co umysł wyparł. Terapeuci pracujący z traumą, tacy jak Peter Levine, pokazują, że ignorowanie sygnałów z ciała prowadzi do przewlekłego stresu i chorób. Emocje to w dużej mierze fizjologia.",
        philosophy: "Maurice Merleau-Ponty argumentował, że nie \"masz\" ciała, ale \"jesteś\" ciałem. To Twój jedyny sposób zakotwiczenia w świecie. Całe Twoje postrzeganie rzeczywistości jest zapośredniczone przez mięśnie, kości i nerwy.",
        science: "Proces nazywa się interocepcją. Kora wyspy nieustannie monitoruje Twoje tętno, oddech i trawienie. Z kolei nerw błędny działa jak autostrada łącząca jelita z mózgiem. Kiedy Twoje ciało jest napięte, wysyła do mózgu sygnał: \"jesteśmy w niebezpieczeństwie\", nawet jeśli siedzisz na bezpiecznej kanapie."
      },
      practices: [
        "Wydłużony wydech: Zrób wdech na 4 sekundy i wydech na 8 sekund. Ten mechaniczny ruch obniża tętno i sygnalizuje układowi nerwowemu, że jesteś bezpieczny.",
        "Uziemienie: Kiedy odlatujesz w myśli, skup się na fizycznym ciężarze swojego ciała. Poczuj kontakt stóp z podłogą i pleców z krzesłem.",
        "Skanowanie napięć: Przeskanuj ciało od głowy w dół. Znajdź miejsce, w którym trzymasz największe napięcie (najczęściej kark, szczęka lub brzuch) i świadomie je rozluźnij."
      ]
    },
    {
      id: "m8",
      num: 8,
      title: "Bieżące Przekonania",
      subtitle: "Filtry na obiektywie Twojego umysłu. Ciche założenia, przez które oceniasz to, co się właśnie dzieje.",
      details: {
        psychology: "Nie reagujesz na to, co się wydarza, ale na Twoje wyobrażenie o tym wydarzeniu. Ktoś nie odpisuje na wiadomość. Jeden filtr mówi \"jest zajęty\", inny krzyczy \"na pewno mnie ignoruje\". To są Twoje schematy. Terapie poznawcze celują w te niewidzialne ramy i uczą je łamać.",
        philosophy: "Filozofia konstruktywistyczna twierdzi wprost: sami konstruujemy naszą rzeczywistość. Stoik Epiktet ujął to doskonalej tysiące lat temu: \"Ludzi nie niepokoją rzeczy, lecz ich własne opinie o rzeczach\".",
        science: "Przekonania to ugruntowane szlaki neuronowe. Reguła Hebba mówi: \"neurony, które odpalają razem, łączą się ze sobą\". Im częściej interpretujesz sytuację jako zagrożenie, tym grubszy i szybszy staje się ten konkretny kabel w Twoim mózgu."
      },
      practices: [
        "Wyłapanie filtru: Kiedy czujesz silny dyskomfort, dokończ zdanie: 'W tej chwili wierzę, że świat jest... / ludzie są...'. To zdemaskuje Twoje bieżące założenie.",
        "Elastyczna zamiana: Jeśli wierzę, że 'zawsze muszę być najlepszy', zamień to na 'chcę zrobić to dobrze, ale błędy to normalna informacja zwrotna'.",
        "Złamanie schematu: Jeśli bardzo boisz się oceny, zrób małą rzecz, która celowo Cię na nią narazi, i zobacz, że świat się nie wali."
      ]
    },
    {
      id: "m9",
      num: 9,
      title: "Czynniki Zewnętrzne",
      subtitle: "Twój pokój, biurko i światło, które wpada przez okno. Architektura Twoich decyzji.",
      details: {
        psychology: "Jesteśmy leniwi. W 90% przypadków dostosowujemy się do środowiska, w którym przebywamy, zamiast z nim walczyć. Kurt Lewin, ojciec psychologii społecznej, udowodnił, że zachowanie to funkcja osoby i jej otoczenia. Trudno o głębokie skupienie w pokoju pełnym bałaganu i krzykliwych kolorów.",
        philosophy: "Skrajny materializm i determinizm środowiskowy. Twierdzą one, że nie ma czegoś takiego jak całkowita wolna wola. Twoje myśli i nastroje to w dużej mierze odpowiedź na układ mebli i pogodę za oknem.",
        science: "Twoje zmysły bez przerwy bombardują mózg danymi. Światło niebieskie uderzające w siatkówkę rano wybudza Cię blokując melatoninę. Ten sam ekran w nocy oszukuje Twój mózg, że jest środek dnia. Zła jakość powietrza (wysokie CO2) w zamkniętym pokoju fizycznie obniża Twoje funkcje poznawcze."
      },
      practices: [
        "Oczyszczenie pola walki: Zanim zaczniesz trudne zadanie, uprzątnij biurko ze wszystkiego, co nie jest do niego potrzebne. Schowaj telefon do szuflady.",
        "Zarządzanie światłem: Wystaw twarz na słońce w pierwszych 30 minutach po przebudzeniu. Wieczorem używaj filtrów światła niebieskiego i przyciemnij żarówki.",
        "Kąpiel sensoryczna: Wyjdź na balkon, zamknij oczy na 2 minuty i skup się tylko na jednym zmyśle – np. temperaturze powietrza na skórze."
      ]
    },
    {
      id: "m10",
      num: 10,
      title: "Język i Wewnętrzny Dialog",
      subtitle: "Słowa, którymi do siebie gadasz. Narzędzia, które tną albo budują.",
      details: {
        psychology: "Mowa wewnętrzna to potężne narzędzie samoregulacji. Sposób, w jaki do siebie mówisz, bezpośrednio wpływa na poziom kortyzolu. Lew Wygotski zauważył, że dzieci najpierw mówią na głos, by kierować swoimi działaniami, a potem ten głos przenoszą do środka.",
        philosophy: "Wittgenstein pisał: \"Granice mojego języka oznaczają granice mojego świata\". Nie możesz myśleć o problemie precyzyjniej, niż pozwalają Ci na to słowa, którymi dysponujesz. Biedny język oznacza ograniczone myślenie.",
        science: "Wewnętrzny monolog fizycznie aktywuje ośrodki mowy w mózgu (ośrodki Broki i Wernickego). Co ciekawe, krytyczny i agresywny monolog wewnętrzny pobudza układ walki i ucieczki dokładnie tak samo, jak realne zagrożenie z zewnątrz."
      },
      practices: [
        "Odciążenie RAM-u: Zrób 'brain dump'. Pisz przez 5 minut bez przerwy wszystko, co masz w głowie, nie zważając na logikę ani ortografię. Wyrzuć to na zewnątrz.",
        "Rozmowa z przyjacielem: Złap się na tym, jak do siebie mówisz po porażce. Zmień ton na taki, jakiego użyłbyś rozmawiając z dobrym znajomym, który właśnie popełnił ten sam błąd.",
        "Z dystansu: Kiedy utkniesz w stresie, mów o sobie w trzeciej osobie (np. 'On teraz czuje duży niepokój'). To obniża ładunek emocjonalny o połowę."
      ]
    },
    {
      id: "m11",
      num: 11,
      title: "Zasoby Energetyczne",
      subtitle: "Twój fizjologiczny bak. Stan zmęczenia, głodu i wyczerpania baterii.",
      details: {
        psychology: "Twoja siła woli i optymizm to nie są magiczne cechy charakteru. To często po prostu kwestia tego, czy jesteś wyspany i czy zjadłeś dobry posiłek. Badania nad ego depletion (wyczerpywaniem się samokontroli) pokazują, że zmęczony człowiek to człowiek podatny na najgorsze impulsy.",
        philosophy: "Witalizm i higiena życia. Nie zbudujesz silnego umysłu na słabym i zaniedbanym ciele. Ignorowanie własnego zmęczenia to forma pychy.",
        science: "Brak snu sprawia, że kora przedczołowa odłącza się od ciała migdałowatego. Przestajesz logicznie hamować emocje. Ponadto mózg zużywa do 20% całej energii organizmu (ATP, glukoza). Kiedy zapas energii spada, mózg odcina najbardziej energochłonne procesy – racjonalne myślenie i powstrzymywanie się przed nagrodą."
      },
      practices: [
        "Audyt paliwa: 3 razy dziennie zapytaj siebie szczerze: na ile mam teraz energię w skali 1-10? Dostosuj plany do tej liczby.",
        "Taktyczna drzemka: Jeśli czujesz brutalny zjazd po południu, zamknij oczy na równe 20 minut. Nie dłużej, żeby nie spaść w głębokie fazy snu.",
        "Woda z solą rano: Wypij szklankę wody z małą szczyptą soli kłodawskiej tuż po przebudzeniu, aby uzupełnić nocną utratę elektrolitów."
      ]
    },
    {
      id: "m12",
      num: 12,
      title: "Stan Biochemiczny",
      subtitle: "Fabryka chemiczna w Twojej głowie. Koktajl hormonów, neuroprzekaźników i substancji, które wrzuciłeś w siebie.",
      details: {
        psychology: "Zmiana chemii w mózgu to często najszybszy sposób na zmianę nastroju. Psychofarmakologia wykorzystuje to lecząc depresję. Ale na co dzień sami się leczymy kawą, cukrem czy alkoholem, manipulując własnym stanem.",
        philosophy: "Skrajny redukcjonizm. Z tej perspektywy nie ma duszy, nie ma \"prawdziwego Ciebie\". Jesteś po prostu wynikiem reakcji chemicznych. Choć brzmi to pesymistycznie, daje też niesamowitą sprawczość – masz wpływ na swoje paliwo.",
        science: "Kortyzol i adrenalina budzą Cię do działania. Serotonina uspokaja i daje poczucie bezpieczeństwa w grupie. Dopamina każe szukać nagrody. Kofeina blokuje receptory adenozyny (sygnału zmęczenia). Zrozumienie, jak to działa, to podstawa obsługi własnego organizmu."
      },
      practices: [
        "Opóźniona kofeina: Nie pij kawy zaraz po wstaniu. Poczekaj 90-120 minut, aby naturalny proces usuwania adenozyny ze snu się zakończył. Unikniesz zjazdu o 14:00.",
        "Tani biohacking: Weź lodowaty prysznic przez 60 sekund rano. Gwarantuje to potężny, stabilny i długotrwały wyrzut dopaminy i noradrenaliny bez skutków ubocznych.",
        "Zarządzanie dopaminą: Zidentyfikuj swoje najtańsze źródła dopaminy (cukier, scrollowanie) i spróbuj odstawić je na 24 godziny, by przywrócić wrażliwość receptorów."
      ]
    },
    {
      id: "m13",
      num: 13,
      title: "Rezonans Interpersonalny",
      subtitle: "Sygnał Wi-Fi między ludźmi. Jak układ nerwowy innych wpływa na Twój i odwrotnie.",
      details: {
        psychology: "Nie jesteśmy odciętymi od siebie wyspami. Nasze nastroje zarażają się nawzajem. Terapeuci wiedzą, że wyciszenie pacjenta zaczyna się od wyciszenia własnego układu nerwowego. Jeśli Ty jesteś spokojny, osoba obok też zaczyna zwalniać. To się nazywa koregulacja.",
        philosophy: "Martin Buber mówił o relacji \"Ja-Ty\". Nie patrzysz na drugiego człowieka jak na obiekt (\"Ja-Ono\"), ale współdzielisz z nim przestrzeń istnienia. Jesteśmy zdefiniowani przez to, jak odnosimy się do innych.",
        science: "System neuronów lustrzanych sprawia, że nieświadomie naśladujemy mimikę i postawę osoby, z którą rozmawiamy. Teoria poliwagalna udowadnia, że twarz, głos i mikro-ruchy innych ludzi to dla nas najważniejsze sygnały, czy możemy czuć się bezpiecznie."
      },
      practices: [
        "Znajdź koregulację: Kiedy odczuwasz potężny stres, zadzwoń do kogoś, kto zawsze ma stabilny, spokojny głos. Twój układ nerwowy sam dostroi się do tej częstotliwości.",
        "Odzwierciedlenie: Słuchaj przez 3 minuty nie planując, co odpowiesz. Kiedy ktoś skończy, powiedz tylko: 'Brzmisz, jakby to było dla ciebie naprawdę trudne'.",
        "Neurocepcja na radarze: Zauważ moment, kiedy wchodzisz do pokoju pełnego ludzi i nagle zaciskasz żuchwę. To Twój układ nerwowy wyczuwa napięcie otoczenia."
      ]
    }
  ]
};

export const MAKRO_MODEL: HumanModel = {
  title: "Całe Życie (Makro)",
  description: "Długofalowe struktury, uwarunkowania i historia, które kształtują Twoją teraźniejszość. To tutaj leży hardware Twojego organizmu i oprogramowanie kulturowo-historyczne.",
  domains: [
    {
      id: "ma1",
      num: 1,
      title: "Fundament Biologiczny",
      subtitle: "Kod źródłowy Twojego organizmu. Geny, choroby i hardware, z którym przyszedłeś na świat.",
      details: {
        psychology: "Temperament to nie wymysł. Część z nas rodzi się z układem nerwowym, który reaguje szybko i mocno, inni są naturalnie odporni. Zrozumienie, że niektóre lęki lub skłonności są wrodzone, zdejmuje ogromny ciężar winy.",
        philosophy: "Jesteśmy ogniwem w miliardowym łańcuchu ewolucji. Nasze instynkty nie służą do tego, żebyśmy byli szczęśliwi. Zostały zaprojektowane do tego, żebyśmy przetrwali w dżungli i przekazali geny.",
        science: "Geny ładują broń, ale to środowisko pociąga za spust. Epigenetyka dowodzi, że to, jak żyjesz, włącza i wyłącza określone segmenty Twojego DNA. Dodatkowo liczy się fizjologia długoterminowa: starzenie komórkowe i gospodarka hormonalna, która dyktuje rytm całych dekad."
      },
      practices: [
        "Rutynowy serwis: Podchodź do siebie jak do drogiego sprzętu. Raz w roku wykonaj pełny panel badań: krew, hormony, markery stanu zapalnego.",
        "Znajomość maszyny: Poznaj wady fabryczne swojej rodziny (choroby serca, skłonności do uzależnień). Dostosuj do tego swoją prewencję.",
        "Zabezpieczenie mitochondriów: Rób regularnie trening w strefie 2 (lekki pot, ale możesz rozmawiać). To podstawa pod zdrowie metaboliczne na lata."
      ]
    },
    {
      id: "ma2",
      num: 2,
      title: "Środowisko Geograficzne i Ekologiczne",
      subtitle: "Krajobraz i powietrze, w którym zanurzasz swój organizm każdego dnia.",
      details: {
        psychology: "Przestrzeń, w której żyjesz, formatuje Twój stan umysłu. Brak zieleni, hałas i betonowe blokowiska drastycznie podnoszą poziom stresu u dorosłych i agresji u dzieci. Z drugiej strony, kontakt z naturą fizycznie łagodzi objawy lękowe.",
        philosophy: "Determinizm geograficzny mówi, że pogoda kształtuje wręcz charaktery całych narodów. Nie jesteś osobnym bytem zawieszonym w próżni. Jesteś fragmentem ekosystemu, w którym przebywasz.",
        science: "Zanieczyszczenie powietrza (PM 2.5) przenika do krwiobiegu, obniżając sprawność mózgu na stałe. Brak kontaktu z naturalnym środowiskiem wyjaławia Twój mikrobiom jelitowy. Długie, szare zimy uderzają w syntezę witaminy D i prowadzą do depresji sezonowej (SAD)."
      },
      practices: [
        "Dawka zieleni: Zafunduj sobie przynajmniej raz w tygodniu kilkugodzinny reset w lesie lub na łonie natury, bez powiadomień w telefonie.",
        "Filtracja bazy: Kontroluj jakość powietrza w swoim domu. W sezonie grzewczym filtr HEPA w sypialni to nie luksus, tylko biologiczna konieczność.",
        "Kompensacja sezonowa: Reaguj na zmiany pór roku. Dobierz odpowiednią dawkę witaminy D i zainwestuj w lampę do terapii światłem, gdy dni stają się krótkie."
      ]
    },
    {
      id: "ma3",
      num: 3,
      title: "Nieświadomość i Mechanizmy Obronne",
      subtitle: "Cienie w piwnicy. Części Ciebie, których nie chcesz widzieć, a które po cichu pociągają za sznurki.",
      details: {
        psychology: "Freud odkrył mroczny kontynent w naszej głowie. Rzeczy trudne i bolesne wypieramy. Ale one nie znikają – zmieniają się w lęki, fobie lub mechanizmy obronne. Kiedy coś w sobie nienawidzimy, projektujemy to na innych, krytykując ich za to, czego sami się u siebie boimy.",
        philosophy: "Zanim wymyślono psychoanalizę, filozofowie pisali o ukrytych potęgach i \"woli\", która rządzi nami poza barierą rozumu. Nie jesteśmy racjonalnymi gospodarzami we własnym domu.",
        science: "Decyzja zapada w Twoim mózgu na ułamki sekund przed tym, zanim uświadomisz ją sobie jako \"własny\" wybór. Pamięć ukryta (proceduralna i emocjonalna) działa poza świadomością. Nawet jeśli nie pamiętasz zdarzenia, Twój mózg reaguje obronnie na podobne bodźce."
      },
      practices: [
        "Dziennik snów: Połóż notatnik obok łóżka. Zapisuj sny zaraz po obudzeniu. Szukaj ukrytych, powtarzających się motywów.",
        "Namierzanie projekcji: Kiedy jakaś osoba wyjątkowo Cię irytuje bez racjonalnego powodu, zapytaj: Czego ta osoba we mnie dotyka? Jaki wyparty aspekt mojego cienia w niej widzę?",
        "Weryfikacja wymówek: Złap się na tym, kiedy mądrze i logicznie tłumaczysz (racjonalizujesz) złą decyzję podjętą ze strachu."
      ]
    },
    {
      id: "ma4",
      num: 4,
      title: "Pamięć i Zapisy Somatyczne",
      subtitle: "Twój wewnętrzny twardy dysk. Traumy i zamrożone napięcia zakodowane w powięziach.",
      details: {
        psychology: "Ciało pamięta. Głęboka trauma to nie tylko trudne wspomnienie w głowie. To uwięziona energia w układzie nerwowym. Rozmowa o traumie to za mało – trzeba pracować bezpośrednio z ciałem, by uwolnić zablokowane reakcje ucieczki lub walki.",
        philosophy: "Przeszłość nigdy nie znika. Henri Bergson mówił, że historia stale trwa w naszej teraźniejszości. Nosimy w sobie ciężar każdej podjętej decyzji i każdego doznanego bólu.",
        science: "Gdy dzieje się coś drastycznego, ciało migdałowate zapisuje emocję, ale hipokamp (odpowiedzialny za tworzenie spójnej opowieści) wyłącza się ze stresu. Dlatego trauma powraca w formie nagłych błysków i zjawisk w ciele, a nie uporządkowanej historii. Wiemy też o epigenetycznym dziedziczeniu traumy – stres wojny potrafi zostawić ślad u potomstwa."
      },
      practices: [
        "Zrzut napięcia (TRE): Zainteresuj się ćwiczeniami wywołującymi neurogenne drżenia w ciele. Pozwalają one zrzucić głęboki stres nagromadzony w mięśniach miednicy i kręgosłupa.",
        "Mapa bólu: Narysuj zarys sylwetki i zaznacz kolorem, gdzie zazwyczaj kumuluje się ból, kiedy przechodzisz ciężki okres. Znajdź swój 'słaby punkt' i zacznij z nim łagodnie pracować.",
        "Terapia somatyczna: Zrozum, że niektórych przewlekłych lęków nie wygadasz u psychologa. Musisz poczuć w ciele, że zagrożenie minęło."
      ]
    },
    {
      id: "ma5",
      num: 5,
      title: "Matryca Systemowa",
      subtitle: "System operacyjny wyniesiony z domu. Niewidzialne nici lojalności i ról rodzinnych.",
      details: {
        psychology: "Nie funkcjonujesz jako jednostka. Jesteś elementem systemu rodzinnego. Wchodzisz w narzucone role – np. ratownika w rodzinie, czy niewidzialnego dziecka. Często w dorosłości nieświadomie powielamy błędy rodziców, z poczucia dziwnej lojalności.",
        philosophy: "Strukturalizm uczy, że to struktura rzuca na nas swoje prawa, a my tylko odgrywamy przypisane funkcje. Nie wybieramy kultury i rodziny, w której się rodzimy, a to one określają horyzont naszych możliwości.",
        science: "U ssaków opieka i przywiązanie to kwestia silnych neurochemicznych więzi opartych m.in. o oksytocynę. Co więcej, wzorce radzenia sobie ze stresem potrafią przechodzić z rodzica na dziecko poprzez naśladownictwo we wczesnych fazach rozwoju (neurony lustrzane)."
      },
      practices: [
        "Wyrysowanie genogramu: Zrób drzewo genealogiczne trzy pokolenia wstecz. Poszukaj powtarzalnych wzorców, problemów i relacji. Gdzie te problemy odbijają się w Tobie?",
        "Identyfikacja narzuconej roli: Zastanów się, jaką rolę grałeś jako dziecko (dobry uczeń, mediator, klaun) i w jakich sytuacjach stresowych wcielasz się w nią obecnie w pracy.",
        "Odetnij powrozy: Znajdź jeden destrukcyjny nawyk w swoim życiu, który bezmyślnie odziedziczyłeś po rodzicach. Nazwij go na głos i podejmij decyzję, że na Tobie ten łańcuch się kończy."
      ]
    },
    {
      id: "ma6",
      num: 6,
      title: "Matryca Językowa i Struktura Symboliczna",
      subtitle: "Kulturowe i językowe klatki. Kod, przez który postrzegasz to, co możliwe.",
      details: {
        psychology: "Myślisz używając języka i metafor, które ktoś kiedyś dla Ciebie wymyślił. Lacan zauważył, że od małego musimy wejść w świat gotowych pojęć (Porządek Symboliczny), tracąc z oczu nasze najgłębsze, autentyczne ja. Twoje pragnienia są w dużej mierze zaprogramowane przez innych.",
        philosophy: "Martin Heidegger twierdził, że \"Język jest domem bytu\". Z kolei strukturalizm udowadnia, że społeczeństwo trzyma nas w ryzach właśnie przez to, jak nazywamy rzeczy. Zmiana definicji potrafi zrewolucjonizować życie całego pokolenia.",
        science: "Hipoteza relatywizmu językowego przypomina, że struktura gramatyki danego narodu uczy go specyficznego postrzegania przestrzeni, czasu czy relacji. Do tego memetyka pokazuje, jak nośne, agresywne hasła krążą między umysłami jak biologiczne wirusy."
      },
      practices: [
        "Audyt metafor: Sprawdź, jak nazywasz swoje życie. Czy jest ciągłą 'walką'? A może 'grą'? Zmień metaforę, a zmieni się Twoje podejście.",
        "Wyjdź poza bańkę: Zacznij uczyć się języka o zupełnie innej gramatyce, by dostrzec nowe koncepcje. Czytaj teksty kultur, które myślą inaczej niż my.",
        "Budowanie słownika: Im precyzyjniejszy język, tym precyzyjniejsza myśl. Różnica między odczuwaniem złości, frustracji a oburzenia to kwestia nazwania tego, co czujesz."
      ]
    },
    {
      id: "ma7",
      num: 7,
      title: "Kryzysy Rozwojowe",
      subtitle: "Ewolucyjne trzęsienia ziemi. Zaprogramowane zderzenia, które przesuwają Cię do kolejnego etapu.",
      details: {
        psychology: "Życie to seria przewidywalnych kryzysów. Erik Erikson rozpisał to na stadia. Bunt nastolatka to budowa tożsamości. Kryzys wieku średniego to rozrachunek tego, co osiągnęliśmy. Każdy etap ma zadanie, które musisz przejść, inaczej utkniesz i zaczniesz gnić mentalnie.",
        philosophy: "Kierkegaard, ojciec egzystencjalizmu, traktował kryzys lęku jako bramę do przebudzenia. Z kolei heglowska dialektyka opiera się na ciągłym niszczeniu status quo, z którego wyłania się coś głębszego. Rozwój zawsze wymaga zniszczenia starej wersji.",
        science: "Struktura mózgu dojrzewa latami. Fale intensywnego 'przycinania synaps' zachodzą w dzieciństwie i nastolęctwie, ale reorganizacja trwa całe życie. Z kolei gwałtowne zmiany środowiska i presji wymuszają drastyczne aktualizacje naszych zachowań adaptacyjnych."
      },
      practices: [
        "Gdzie teraz jesteś?: Sprawdź, na jakim etapie rozwoju u Eriksona obecnie jesteś. Jakie jest zadanie krytyczne Twojej dekady życia i czego się obawiasz?",
        "Dziennik zmiany: W czasie kryzysu (np. bolesne rozstanie lub utrata pracy) nie szukaj tylko ucieczki w komfort. Zapisuj co czujesz i zastanów się, jakie stare przyzwyczajenia muszą właśnie obumrzeć.",
        "Własne rytuały: Zamknij trudny rozdział celowym gestem. Skasuj stare notatki, wyjedź sam na weekend. Przeprowadź celowe pożegnanie."
      ]
    },
    {
      id: "ma8",
      num: 8,
      title: "Zeitgeist (Duch Czasu)",
      subtitle: "Ciśnienie epoki. Niewidzialny szum narracyjny, w którym żyje całe Twoje pokolenie.",
      details: {
        psychology: "Psychologia historyczno-kulturowa wyjaśnia, że wyższe funkcje psychiczne zawdzięczamy narzędziom, których używamy. Kiedyś głównym narzędziem była książka i długopis. Dziś to ekran i szybki zastrzyk złości ze scrollowania politycznych przepychanek. Ten szum infekuje umysł.",
        philosophy: "Foucault wprowadził koncepcję episteme – ramy myślowej, która w danej epoce narzuca, co jest rozsądne i racjonalne. Jesteśmy przekonani, że nasze problemy i wartości to nasz osobisty wybór, podczas gdy często jesteśmy po prostu trybikami Ducha Dziejów.",
        science: "Makrosocjologia potwierdza, że nastroje społeczne to siły, którym bardzo trudno się opierać. Narzędzia cyfrowe bezlitośnie żerują na ludzkiej skłonności do porównywania się z resztą stada, co bezpośrednio napędza epidemię zaburzeń nastroju."
      },
      practices: [
        "Dieta informacyjna: Zetnij z konsumpcji codzienny, trujący szum wiadomości politycznych o 80%. One żyją z Twojego oburzenia. Czytaj raczej pogłębione książki, które przetrwały próbę czasu.",
        "Zrozumienie pokolenia: Dostrzeż uwarunkowania swojego rocznika. Gen Z? Millenialsi? Jakie zbiorowe niepokoje przelewasz na swoje prywatne życie?",
        "Kontrola diety mentalnej: Bądź bezlitosnym kuratorem treści. Ideologia z memów staje się Twoją filozofią, jeśli odpowiednio długo na nie patrzysz."
      ]
    },
    {
      id: "ma9",
      num: 9,
      title: "Wektor Egzystencjalny",
      subtitle: "Kompas na całe dziesięciolecia. Zrozumienie, dlaczego w ogóle tu jesteś i po co rano wstajesz.",
      details: {
        psychology: "Jeśli masz \"po co\" żyć, zniesiesz prawie każde \"jak\". Tak twierdził Viktor Frankl, twórca logoterapii, opierając się na doświadczeniu z obozów koncentracyjnych. Brak sensu to największy, ukryty zabójca we współczesnym świecie.",
        philosophy: "Sartre uważał, że człowiek rodzi się jako puste naczynie. Ty wybierasz, czym to naczynie napełnisz. Odbiera to wymówki, ale nakłada wielką odpowiedzialność. Nietzsche pisał o wykuwaniu własnych wartości i pokonywaniu własnych słabości.",
        science: "Sieci dopaminergiczne uwielbiają pościg, ale ewolucja zaprojektowała nas do pościgu za celami długofalowymi, które angażują zrównoważoną korę czołową, a nie za szybkimi nagrodami. Ludzie mający jasny cel dożywają późniejszego wieku i rzadziej cierpią na otępienie na starość."
      },
      practices: [
        "Odkryj swoje Ikigai: Szukaj punktu wspólnego: co lubisz robić, w czym jesteś niezły, co rozwiązuje problemy innych i za co mogą zapłacić.",
        "Test własnego pogrzebu: Napisz sam sobie pożegnalne przemówienie. Za co chcesz być pamiętany przez pięć najbliższych Ci osób? Porównaj to z tym, co robisz dzisiaj.",
        "Przegląd wektora: Wyznacz cztery główne wartości życiowe. Raz na kwartał usiądź w ciszy i zadaj pytanie: czy mój grafik z ostatnich tygodni odzwierciedla te wartości?"
      ]
    },
    {
      id: "ma10",
      num: 10,
      title: "Czynnik Chaosu",
      subtitle: "Uderzenie losu. Przypadki, załamania i cała reszta, której nie ma na Twoich pięknych listach zadań.",
      details: {
        psychology: "Kiedy plany rozpadają się na kawałki, jedni wpadają w paraliż, a inni doświadczają tzw. potraumatycznego wzrostu. Różnica tkwi w rezyliencji (odporności psychicznej) oraz elastyczności założeń. Sztywni i perfekcyjni łamią się najszybciej.",
        philosophy: "Taleb zdefiniował Antykruchość. Kruche jest to, co od ciosu pęka. Odporne – to, co go wytrzymuje. Antykruche – to, co staje się silniejsze pod wpływem losowych ciosów układu. Stoicy kochali pojęcie Amor Fati: umiłuj swój los ze wszystkimi jego porażkami, bo nie wygrasz z entropią wszechświata.",
        science: "Systemy termodynamiczne dążą z czasem do nieporządku (entropii). Teoria złożoności podpowiada, że w gęstej sieci jeden zbieg okoliczności potrafi przebudować całe środowisko. Nie jesteś w stanie uchronić się przed czarnymi łabędziami."
      },
      practices: [
        "Stoicka wizualizacja (Premeditatio Malorum): Przeznacz rano dwie minuty na wyobrażenie sobie najgorszych rzeczy, jakie mogą dzisiaj nie wyjść. Zaakceptuj je z wyprzedzeniem.",
        "Budowanie antykruchości: Nie polegaj na jednym systemie. Zdywersyfikuj dochód, znajomości, umiejętności techniczne. Bądź jak hydra – gdy odetną jedną głowę, musi wyrosnąć kolejna.",
        "Margines błędu: Każdy projekt, zwłaszcza finansowy czy inżynieryjny, obarcz buforem na 'nieoczekiwany chaos'. Rzadko się pomylisz zakładając, że coś potrwa dłużej i będzie trudniejsze."
      ]
    },
    {
      id: "ma11",
      num: 11,
      title: "Technosfera i Umysł Rozszerzony",
      subtitle: "Twój cyfrowy sobowtór. Urządzenia, które nie są już w kieszeni, ale stały się przedłużeniem Twojego układu nerwowego.",
      details: {
        psychology: "Płacisz uwagą za dostęp. Niestety, mechanizmy uzależniające znane ze slotów w kasynach przeniesiono 1:1 do designu mediów społecznościowych. Kradzież uwagi skutkuje cyfrowym otępieniem i lękiem przed odłączeniem (FOMO).",
        philosophy: "Filozoficzna Teoria Umysłu Rozszerzonego (Andy Clark) proponuje, że granice Twojego mózgu nie kończą się na czaszce. Jeśli notatnik czy smartfon wykonują procesy poznawcze za Ciebie, są fizycznie częścią Twojego umysłu. Kiedy oddajesz je w ręce korporacji reklamowych, oddajesz im ster.",
        science: "Zjawisko outsourcingu pamięci (\"efekt Google\") to fakt. Skoro wiesz, gdzie znaleźć informację, hipokamp uznaje, że nie ma sensu jej zapisywać w pamięci długotrwałej. Neuroplastyczność to miecz obosieczny – stajemy się biegli w skanowaniu milionów danych, ale tracimy zdolność do utrzymania głębokiego czytania z ze zrozumieniem."
      },
      practices: [
        "Strefy czyste: Łóżko tylko do spania. Wywal urządzenia ekranowe z sypialni, to brutalnie podniesie jakość nocnej regeneracji układu nerwowego.",
        "Świadome użycie AI: Nie zlecaj maszynom omijania problemów poznawczych. Używaj AI do pogłębiania procesu. Rozmawiaj ze sztuczną inteligencją, zadawaj jej pytania, zamiast kazać generować gotowce, które niszczą Twój krytycyzm.",
        "Dopaminowy twardy reset: Zarządź jeden weekend w miesiącu bez dostępu do WiFi, powiadomień i prądu. Nuda jest kluczowym, zagłodzonym stanem, z którego bierze się ludzka innowacja."
      ]
    }
  ]
};
