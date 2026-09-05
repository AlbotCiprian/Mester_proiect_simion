import type { PhotoKey } from "@/lib/landing-photos";

/**
 * The fifteen topic pages under /ro/servicii/.
 *
 * WHAT THESE ARE NOT: doorway pages. `.claude/rules/seo-accessibility.md`
 * forbids them verbatim, and D-010 already refused a request for keyword URLs
 * that redirect to the homepage. Every page here answers a different question
 * with different technical substance, shows different photographs of work that
 * was actually done, and can be read start to finish by someone who will never
 * hire us and still be worth their time. That is the test each one has to pass.
 *
 * WHAT THEY MAY NOT CONTAIN (CLAUDE.md, non-negotiable):
 *  - no price, no price range, no "de la X lei". Page 15 explains what DRIVES
 *    the cost precisely so that no number has to be invented;
 *  - no warranty period, no response time, no "peste N proiecte";
 *  - no named locality we cannot evidence. "Chișinău și împrejurimi" is the
 *    owner's own phrasing and is as specific as we may be;
 *  - no review, no rating, no client name or address.
 *
 * `query` records the search intent each page was written for. It is internal —
 * it is never rendered, and it exists so a later editor can tell whether a
 * rewrite still serves the same reader.
 */

export interface LandingBlock {
  title: string;
  body: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingPage {
  slug: string;
  /** Internal only. Never rendered. */
  query: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  /** Lead paragraphs. The first one is also the page summary in JSON-LD. */
  intro: string[];
  /** Scope: what the work concretely includes. */
  includes: string[];
  /** Execution order. This is the part a competitor cannot copy from a catalogue. */
  steps: LandingBlock[];
  /** The mistakes that cost money later. The reason to read the page. */
  pitfalls: LandingBlock[];
  /** What we have to see before anyone can put a number on the work. */
  costFactors?: string[];
  gallery: PhotoKey[];
  faqs: LandingFaq[];
  /** Slugs of sibling pages. Two-way links are checked by tests/landing.test.ts. */
  related: string[];
}

export const landingPages: LandingPage[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: "montaj-gresie-faianta",
    query: "montaj gresie faianta chisinau",
    h1: "Montaj gresie și faianță în Chișinău",
    metaTitle: "Montaj gresie și faianță în Chișinău",
    metaDescription:
      "Montaj de gresie și faianță executat cu suport pregătit, nivel laser și rosturi calibrate. Vezi etapele, greșelile care se plătesc mai târziu și fotografii din lucrări reale.",
    kicker: "Serviciul de bază",
    intro: [
      "Montajul de gresie și faianță se judecă după trei lucruri pe care le vezi abia la final: dacă rostul curge continuu dintr-un perete în altul, dacă plăcile sună plin când le bați cu degetul și dacă muchiile sunt drepte fără să fie ascunse sub profile. Toate trei se decid înainte ca prima placă să atingă peretele.",
      "Lucrăm pe pereți și pardoseli, în băi, bucătării, holuri și spații tehnice, cu formate de la 30×60 până la plăci mari de peste un metru. Pregătim suportul, trasăm modulația, montăm cu sistem de nivelare și verificăm pe parcurs — nu la sfârșit, când nimic nu se mai poate corecta ieftin.",
      "Fotografiile de mai jos sunt din lucrări executate de noi, inclusiv cadrele din timpul montajului. Etapa de proces spune mai mult despre calitate decât fotografia finală, pentru că finalul arată bine și când dedesubt e făcut prost.",
    ],
    includes: [
      "verificarea și pregătirea suportului: curățare, amorsare, reparații locale, nivelare",
      "trasarea modulației și stabilirea rândului de plecare, ca să nu rămână fâșii subțiri în locuri vizibile",
      "montaj cu adeziv potrivit formatului și suportului, cu pieptene corect ales",
      "sistem de nivelare pe formatele mari, pentru a elimina denivelările între plăci",
      "tăieturi, decupaje pentru prize, țevi și ventilații, muchii la 45° acolo unde se cere",
      "rostuire, etanșare cu silicon în colțuri și la racorduri, curățare finală",
    ],
    steps: [
      {
        title: "Suportul, înainte de orice",
        body: "Peretele se curăță până la material sănătos, se repară zonele desprinse și se amorsează. Un adeziv bun aplicat pe un suport prăfuit se desprinde împreună cu praful. Aici se pierde cel mai des o lucrare.",
      },
      {
        title: "Trasare și rând de plecare",
        body: "Măsurăm încăperea și calculăm unde cad rosturile, ca fâșiile tăiate să ajungă în colțuri și în spatele obiectelor, nu în mijlocul peretelui din fața ușii. Rândul de plecare se trasează cu laser, nu după pardoseală — pardoselile vechi rareori sunt orizontale.",
      },
      {
        title: "Montaj cu control continuu",
        body: "Adezivul se pieptănă pe o direcție, iar placa se preseaza astfel încât să nu rămână goluri de aer sub ea. Pe formatele mari aplicăm adeziv și pe spatele plăcii. Nivelul se verifică la fiecare rând, nu la final.",
      },
      {
        title: "Rostuire și etanșare",
        body: "Rostuim după ce adezivul a făcut priză, nu în aceeași zi. În colțuri, la racordul perete–pardoseală și în jurul căzii se pune silicon, nu chit de rost: acolo materialul trebuie să se poată mișca fără să crape.",
      },
    ],
    pitfalls: [
      {
        title: "Adeziv pieptănat în două direcții",
        body: "Rămân buzunare de aer sub placă. Placa sună a gol, iar în timp crapă exact acolo unde calci. Se vede doar peste ani, când reparația costă cât montajul.",
      },
      {
        title: "Rândul de plecare luat după pardoseală",
        body: "Dacă pardoseala are pantă, tot peretele urcă strâmb și abaterea se acumulează până la tavan. Se trasează cu laser și se acceptă că ultimul rând de jos se taie.",
      },
      {
        title: "Chit de rost în colțuri",
        body: "Colțul este exact locul în care structura lucrează. Chitul rigid crapă în prima iarnă, apa intră prin fisură și lucrarea se strică din interior.",
      },
    ],
    gallery: ["griSuport", "griPrimeleRanduri", "griNivelare", "griRosturi", "griAnsamblu"],
    faqs: [
      {
        q: "Cât durează montajul într-o baie de bloc?",
        a: "Depinde de suprafață, de formatul plăcii și de câte lucrări ascunse sunt sub ea. O baie care are nevoie doar de placare merge mult mai repede decât una la care se reface hidroizolația și traseele. Îți spunem un interval după ce vedem încăperea sau câteva fotografii.",
      },
      {
        q: "Se poate monta gresie peste gresia veche?",
        a: "Tehnic se poate, dacă vechea placare este perfect aderentă, plană și amorsată corespunzător. Practic, într-o baie de bloc rareori merită: pierzi câțiva centimetri de înălțime, nu poți verifica hidroizolația de dedesubt și moștenești orice problemă existentă.",
      },
      {
        q: "Cine cumpără materialele?",
        a: "De obicei le cumpără beneficiarul, pentru că plăcile sunt o alegere estetică și prețul lor variază enorm. Îți spunem cantitatea necesară, inclusiv rezerva pentru tăieturi, și ce tip de adeziv și chit se potrivesc alegerii tale.",
      },
      {
        q: "Cât material trebuie comandat în plus?",
        a: "Rezerva depinde de geometria încăperii și de model. La o placare dreaptă, fără decor, rezerva uzuală este mică; la montaj diagonal, la formate mari sau la plăci cu tipar care trebuie continuat, rezerva crește. Îți calculăm noi cantitatea înainte să comanzi.",
      },
    ],
    related: ["placi-format-mare", "renovare-baie-la-cheie", "cat-costa-montajul-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: "renovare-baie-la-cheie",
    query: "renovare baie la cheie chisinau",
    h1: "Renovare baie la cheie în Chișinău",
    metaTitle: "Renovare baie la cheie în Chișinău",
    metaDescription:
      "Renovare completă de baie: demolare, instalații, hidroizolație, placare și montaj sanitar, coordonate de o singură echipă. Etape, decizii și fotografii din lucrări reale.",
    kicker: "Proiect complet",
    intro: [
      "„La cheie” înseamnă că intri într-o baie funcțională și că nu ai coordonat tu nimic între timp. Practic, înseamnă o singură echipă responsabilă de la demolare până la ultimul silicon, în loc de patru meșteri care se așteaptă unul pe altul și dau vina unul pe altul.",
      "O renovare de baie are un lanț de decizii care se blochează reciproc: unde stă rigola decide panta, panta decide hidroizolația, hidroizolația decide când se toarnă șapa, șapa decide când se poate placa, iar poziția rezervorului încastrat decide unde cad rosturile pe peretele din fața ușii. Dacă ordinea se strică, se plătește de două ori.",
      "Mai jos sunt etapele reale, în ordinea în care le executăm, cu fotografii de pe șantier — inclusiv fazele urâte, pe care nu le mai vede nimeni după ce se pun plăcile.",
    ],
    includes: [
      "demolarea finisajelor vechi, evacuarea molozului și protejarea căilor de acces",
      "compartimentări noi din BCA sau gips-carton, când se schimbă geometria încăperii",
      "trasee noi de apă rece, apă caldă și canalizare, cu probe de presiune înainte de închidere",
      "coloane și nișe tehnice pentru apometru, ventilație și rezervor încastrat",
      "hidroizolație în zonele umede, pante și rigolă sau sifon de pardoseală",
      "șapă, placare pereți și pardoseală, rostuire și etanșări",
      "montajul obiectelor sanitare, al bateriilor și al mobilierului de baie",
    ],
    steps: [
      {
        title: "01 — Demolare și evacuare",
        body: "Se scoate tot până la suport sănătos. Aici se descoperă ce nu se vedea: țevi corodate, șape crăpate, planșee cu diferențe de nivel. Preferăm să afle beneficiarul acum, nu după ce s-a plăcat.",
      },
      {
        title: "02 — Compartimentări și instalații",
        body: "Se ridică pereții noi, se trag traseele și se lasă vizibile până la proba de presiune. O îmbinare care pierde se repară în cinci minute cât timp este la vedere și costă o baie întreagă după placare.",
      },
      {
        title: "03 — Coloane și nișe tehnice",
        body: "Apometrul și robinetele trebuie să rămână accesibile. Le închidem în coloană cu nișă de vizitare placată, nu le zidim definitiv — o baie frumoasă în care nu poți ajunge la robinet este o baie prost gândită.",
      },
      {
        title: "04 — Hidroizolație și pante",
        body: "Se aplică hidroizolație continuă pe pardoseală și pe partea de jos a pereților, cu bandă în colțuri și la trecerile de țevi. Panta către rigolă se face acum, în șapă, nu compensată din grosimea adezivului.",
      },
      {
        title: "05 — Placare",
        body: "Se trasează modulația pentru toată încăperea deodată, astfel încât rostul să curgă de pe pardoseală pe perete și în jurul nișelor. Se montează cu sistem de nivelare, cu muchii la 45° la colțurile expuse.",
      },
      {
        title: "06 — Montaj sanitar și predare",
        body: "Obiecte, baterii, mobilier, siliconare finală, curățenie. Verificăm scurgerile cu apă înainte de a pleca și explicăm ce se întreține și cum.",
      },
    ],
    pitfalls: [
      {
        title: "Rigola aleasă după ce s-a turnat șapa",
        body: "Fiecare model de rigolă are altă înălțime de montaj și altă poziție a racordului. Aleasă târziu, ori nu intră, ori obligă la o pantă vizibil greșită.",
      },
      {
        title: "Rezervorul încastrat cumpărat în ultima clipă",
        body: "Cadrul rezervorului stabilește adâncimea coloanei și implicit lățimea nișei. Dacă vine după ce s-a construit coloana, coloana se reface.",
      },
      {
        title: "Ventilația uitată",
        body: "O baie etanșă, fără evacuare funcțională, adună condens pe plăci și mucegai în rosturi indiferent cât de bine este placată. Ventilația se rezolvă în etapa de instalații, nu la final.",
      },
    ],
    costFactors: [
      "suprafața reală de placat, pereți plus pardoseală, nu suprafața camerei",
      "câte lucrări ascunse intră: trasee, compartimentări, hidroizolație, șapă",
      "formatul plăcii și dacă tiparul trebuie continuat între suprafețe",
      "duș cu cuvă zidită și rigolă față de cabină prefabricată",
      "starea reală a suportului, care se vede abia după demolare",
    ],
    gallery: ["griInainte", "griColoana", "albaHidro", "griNivelare", "griAnsamblu", "griLavoar"],
    faqs: [
      {
        q: "Pot locui în apartament pe durata lucrărilor?",
        a: "Dacă este singura baie, va fi nefolosibilă câteva săptămâni bune. Mulți beneficiari rămân în locuință și își organizează altfel programul; alții preferă să se mute pe durata etapelor cu praf. Îți spunem din prima ce interval este cel mai greu.",
      },
      {
        q: "Trebuie să schimb și țevile?",
        a: "Dacă sunt vechi, din metal, și oricum se demolează finisajul peste ele, este momentul. A reface o baie nouă peste țevi la sfârșitul vieții lor înseamnă a le sparge peste câțiva ani.",
      },
      {
        q: "Cine se ocupă de instalatorul și electricianul?",
        a: "Coordonăm noi lucrările care intră în renovare, ca să nu ajungi tu intermediarul între meserii. Ceea ce nu executăm îți spunem clar dinainte, ca să nu apară surprize la mijloc de proiect.",
      },
      {
        q: "Ce se întâmplă dacă apare ceva neprevăzut după demolare?",
        a: "Îți arătăm pe loc ce am găsit și ce implică, înainte să continuăm. O lucrare ascunsă descoperită la demolare este normală într-un bloc vechi; ce nu este normal este să afli despre ea abia pe factură.",
      },
    ],
    related: ["reparatie-baie", "hidroizolatie-baie", "montaj-wc-suspendat"],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: "reparatie-baie",
    query: "reparatii baie apartament",
    h1: "Reparație baie în apartament",
    metaTitle: "Reparație baie în apartament — Chișinău",
    metaDescription:
      "Reparație de baie în apartamente de bloc: ce se poate repara punctual, ce merită refăcut complet și cum se decide între cele două. Exemple din lucrări executate.",
    kicker: "Bloc și apartament",
    intro: [
      "Cele mai multe cereri de reparație a băii încep la fel: o placă sună a gol, un rost s-a înnegrit, silicon-ul din jurul căzii s-a desprins sau apare o pată pe tavanul vecinului de dedesubt. Întrebarea reală nu este cum se repară, ci dacă merită reparat punctual sau refăcut.",
      "Răspunsul depinde aproape întotdeauna de un singur lucru: există hidroizolație funcțională sub placare sau nu. Dacă există, o reparație locală ține ani. Dacă nu există — cazul obișnuit în blocurile construite înainte ca hidroizolația să fie o practică curentă — orice reparație locală este o amânare plătită.",
      "Pagina asta îți dă criteriile după care decidem, ca să poți evalua situația singur înainte să ne suni.",
    ],
    includes: [
      "diagnostic la fața locului: unde intră apa, de unde vine și cât s-a extins",
      "înlocuirea plăcilor desprinse sau crăpate, cu potrivire de ton pe cât permite stocul",
      "refacerea rosturilor înnegrite și a etanșărilor cu silicon",
      "reparația zonei din jurul căzii, al cabinei sau al rigolei",
      "refacerea locală a hidroizolației, când zona afectată este delimitabilă",
      "refacere completă, când diagnosticul arată că reparația punctuală nu ține",
    ],
    steps: [
      {
        title: "Ce se aude și ce se vede",
        body: "Bătute cu degetul, plăcile desprinse sună a gol. Dacă sună a gol doar câteva, este o problemă locală de aderență. Dacă sună a gol o zonă întreagă, suportul a cedat și placarea nouă va face același lucru.",
      },
      {
        title: "De unde vine apa",
        body: "O pată pe tavanul vecinului nu vine mereu din locul de deasupra ei. Apa circulă prin șapă până găsește o trecere. Verificăm racordurile, rigola, silicon-ul și traseele înainte să spargem ceva.",
      },
      {
        title: "Reparație sau refacere",
        body: "Reparăm punctual când suportul este sănătos, hidroizolația există și găsim plăci compatibile. Recomandăm refacerea când lipsește hidroizolația, când zona afectată se extinde sau când plăcile nu se mai găsesc și peticul s-ar vedea din ușă.",
      },
      {
        title: "Execuție și verificare cu apă",
        body: "După reparație, zona se testează cu apă înainte de a fi declarată terminată. O reparație de baie care nu a fost udată în prezența meșterului nu a fost verificată.",
      },
    ],
    pitfalls: [
      {
        title: "Silicon peste silicon vechi",
        body: "Cordonul nou nu aderă la cel vechi. Se desprinde în câteva luni și apa intră exact pe unde credeai că ai reparat. Vechiul se îndepărtează complet, suprafața se degresează și se usucă.",
      },
      {
        title: "Chit de rost folosit ca reparație de etanșare",
        body: "Chitul nu este etanș la apă sub presiune și nu este elastic. Rostul înnegrit se curăță și se reface, dar racordurile și colțurile rămân sarcina siliconului.",
      },
      {
        title: "Placa desprinsă lipită înapoi cu adeziv peste adezivul vechi",
        body: "Fără curățarea completă a patului vechi, placa iese a doua oară, de obicei mai repede. Se curăță până la suport și se reia corect.",
      },
    ],
    gallery: ["griInainte", "griSuport", "albaRigola", "griRosturi"],
    faqs: [
      {
        q: "Se poate schimba o singură placă fără să se strice vecinele?",
        a: "Da, dacă se taie întâi rostul de jur împrejur și placa se sparge controlat din centru spre margini. Riscul real nu este placa vecină, ci hidroizolația de dedesubt, dacă există.",
      },
      {
        q: "Rosturile s-au înnegrit. Se curăță sau se schimbă?",
        a: "Dacă negrul este superficial se curăță. Dacă chitul s-a fărâmițat sau este permanent umed, problema nu este chitul, ci apa care ajunge în spatele lui — și acolo trebuie căutată.",
      },
      {
        q: "Curge la vecinul de jos. Cât de urgent este?",
        a: "Urgent. Închide alimentarea zonei suspecte și sună. Cu cât apa circulă mai mult prin șapă și planșeu, cu atât zona care trebuie desfăcută la final este mai mare.",
      },
      {
        q: "Mai găsim plăci identice cu cele existente?",
        a: "Rar, dacă au trecut câțiva ani — producătorii schimbă seriile și chiar aceeași referință diferă de la un lot la altul. De aceea recomandăm mereu păstrarea unei rezerve la orice placare nouă.",
      },
    ],
    related: ["renovare-baie-la-cheie", "hidroizolatie-baie", "montaj-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 04 */
  {
    slug: "hidroizolatie-baie",
    query: "hidroizolatie baie",
    h1: "Hidroizolație în baie, sub placare",
    metaTitle: "Hidroizolație în baie — cum se face corect",
    metaDescription:
      "Hidroizolația din baie se face sub placare, nu la finisaj: unde se aplică, cum se tratează colțurile și trecerile de țevi, și de ce plăcile singure nu sunt o barieră de apă.",
    kicker: "Lucrarea invizibilă",
    intro: [
      "Placa ceramică nu absoarbe apă, dar rostul dintre plăci și adezivul de sub ele o absorb. Într-o zonă de duș, apa trece prin rost în câteva minute și ajunge la suport. De aceea bariera reală de apă nu este placarea, ci stratul de sub ea — și este singurul strat pe care nu îl mai poți verifica după ce lucrarea este gata.",
      "Hidroizolația se aplică pe pardoseală și pe pereți, cel puțin în zonele umede, cu bandă elastică în colțuri, la racordul perete–pardoseală și la fiecare trecere de țeavă. Apoi se placează peste ea. Nu are alt moment în care să poată fi făcută.",
      "Este partea de lucrare pe care nimeni nu o vede și pe care se economisește cel mai des. Fotografiile de mai jos sunt exact din această etapă, la lucrări executate de noi.",
    ],
    includes: [
      "pregătirea și amorsarea suportului, astfel încât membrana să adere",
      "aplicarea hidroizolației în două straturi, în zonele umede și pe pardoseala întreagă",
      "bandă elastică în toate colțurile și la racordul perete–pardoseală",
      "manșete la trecerile de țevi și la punctele de scurgere",
      "racordarea corectă a hidroizolației la flanșa rigolei sau a sifonului",
      "pante executate în șapă, către punctul de scurgere",
    ],
    steps: [
      {
        title: "Suport curat, plan, amorsat",
        body: "Membrana lichidă copiază suportul. Pe praf nu aderă, iar peste o fisură activă se rupe. Zonele slabe se repară întâi, apoi se amorsează.",
      },
      {
        title: "Colțurile și trecerile, întâi",
        body: "Infiltrațiile dintr-o baie pornesc aproape întotdeauna din colțuri și din jurul țevilor, nu din mijlocul peretelui. Acolo se pune bandă elastică și manșete înglobate în primul strat, înainte de a acoperi suprafețele mari.",
      },
      {
        title: "Două straturi, în cruce",
        body: "Al doilea strat se aplică perpendicular pe primul, după uscarea completă a celui dintâi. Un singur strat gros nu echivalează cu două subțiri: gros înseamnă doar că se fisurează la uscare.",
      },
      {
        title: "Pante și scurgere",
        body: "Panta se execută în șapă, către rigolă sau sifon, și se verifică turnând apă înainte de placare. O pantă compensată din grosimea adezivului în timpul montajului nu este o pantă, este o speranță.",
      },
    ],
    pitfalls: [
      {
        title: "Hidroizolație doar pe pardoseală",
        body: "Într-un duș, apa lovește peretele. Dacă membrana se oprește la nivelul pardoselii, apa intră prin rosturile de pe perete și coboară pe spatele hidroizolației, adică exact acolo unde nu o mai oprește nimic.",
      },
      {
        title: "Bandă lipsă în colțul dintre pereți",
        body: "Colțul este locul unde structura se mișcă cel mai mult. Membrana rigidă din colț crapă la prima variație de temperatură și fisura este invizibilă sub placă.",
      },
      {
        title: "Placare peste membrana neuscată",
        body: "Membrana prinsă sub adeziv înainte de a fi uscată nu polimerizează corect. Rămâne moale, se desprinde împreună cu placarea și nu mai izolează nimic.",
      },
    ],
    gallery: ["albaHidro", "albaRigola", "albaCablu", "cuvaDus"],
    faqs: [
      {
        q: "Este obligatorie hidroizolația într-o baie de bloc?",
        a: "Într-o baie nouă sau refăcută complet, o considerăm obligatorie — costul ei este mic față de o infiltrație la vecinul de dedesubt. Dacă cineva îți propune să placheze direct peste șapă într-o zonă de duș, întreabă-l de ce.",
      },
      {
        q: "Plăcile de gresie nu sunt deja impermeabile?",
        a: "Placa în sine, da. Rostul dintre plăci și adezivul de sub ele, nu. Apa nu trece prin placă, trece pe lângă ea.",
      },
      {
        q: "Cât timp trebuie să treacă între hidroizolație și placare?",
        a: "Până la uscarea completă, conform produsului folosit, și verificată la fața locului, nu după ceas. Graba de aici este cea mai scumpă grabă dintr-o baie.",
      },
      {
        q: "Se poate adăuga hidroizolație fără să desfac placarea?",
        a: "Nu. Hidroizolația stă sub placare prin definiție. Există tratamente de suprafață pentru rosturi, dar sunt paliative, nu înlocuitori.",
      },
    ],
    related: ["dus-fara-prag-cuva-zidita", "renovare-baie-la-cheie", "incalzire-in-pardoseala"],
  },

  /* ------------------------------------------------------------------ 05 */
  {
    slug: "dus-fara-prag-cuva-zidita",
    query: "dus fara prag rigola liniara",
    h1: "Duș fără prag, cu cuvă zidită și rigolă liniară",
    metaTitle: "Duș fără prag cu rigolă liniară — execuție",
    metaDescription:
      "Duș la nivelul pardoselii, cu cuvă zidită și rigolă liniară: cum se stabilesc pantele, unde se pune hidroizolația și ce decizii trebuie luate înainte de șapă.",
    kicker: "Zona umedă",
    intro: [
      "Un duș fără prag arată simplu și este cea mai pretențioasă zonă dintr-o baie. Nu are margine care să oprească apa; tot ce o ține înăuntru sunt panta și hidroizolația. Dacă una dintre ele este greșită, apa pleacă în cameră sau, mai rău, în planșeu.",
      "Alternativa executată corect este cuva zidită: un volum construit din blocuri, hidroizolat și placat, cu rigola integrată la pantă. Se poate face de la nivelul pardoselii sau ușor ridicat, în funcție de câtă înălțime permite planșeul și de unde poate ieși scurgerea.",
      "Deciziile care nu mai pot fi schimbate ulterior se iau toate înainte de turnarea șapei. Le enumerăm mai jos, ca să le poți lua în cunoștință de cauză.",
    ],
    includes: [
      "zidirea cuvei din blocuri, cu geometria și înălțimea stabilite pe teren",
      "poziționarea rigolei liniare sau a sifonului, cu racord la canalizare",
      "pante executate în șapă, verificate cu apă înainte de placare",
      "hidroizolație continuă pe cuvă, pardoseală și pereții zonei de duș",
      "racordarea hidroizolației la flanșa rigolei",
      "placare cu tăieturi la pantă și rosturi aliniate cu restul încăperii",
    ],
    steps: [
      {
        title: "Unde poate ajunge scurgerea",
        body: "Traseul de canalizare are nevoie de pantă proprie. Poziția rigolei nu este o alegere estetică liberă: se stabilește împreună cu punctul în care se poate racorda, altfel scurgerea este leneșă și zona rămâne udă.",
      },
      {
        title: "Cuva, zidită și verificată",
        body: "Blocurile se zidesc în jurul rigolei deja poziționate. Se verifică geometria și se lasă loc pentru grosimea hidroizolației, a șapei de pantă și a plăcii — trei straturi care se adună.",
      },
      {
        title: "Pantă înainte de hidroizolație",
        body: "Panta se face în șapă, nu în adezivul de montaj. Se toarnă apă și se urmărește dacă întreaga suprafață se golește. Abia apoi se hidroizolează.",
      },
      {
        title: "Placare la pantă",
        body: "Pe o pantă, plăcile mari trebuie tăiate sau alese într-un format care urmează căderea fără să facă baltă. Rostul se aliniază cu restul pardoselii, ca zona de duș să nu pară o inserție.",
      },
    ],
    pitfalls: [
      {
        title: "Rigola cumpărată după turnarea șapei",
        body: "Fiecare model are altă înălțime de montaj. Cumpărată târziu, ori nu intră în grosimea disponibilă, ori impune o pantă exagerată care se vede.",
      },
      {
        title: "Pantă prea mică",
        body: "Sub o anumită cădere apa stagnează, rămân urme de calcar și zona nu se usucă niciodată complet. Panta se verifică cu apă, nu cu ochiul.",
      },
      {
        title: "Hidroizolația neracordată la rigolă",
        body: "Membrana trebuie să intre sub flanșa rigolei. Dacă se oprește lângă ea, apa care coboară pe sub placă ocolește complet izolația și intră în șapă.",
      },
    ],
    gallery: ["cuvaDus", "albaRigola", "albaHidro", "albaDus", "albaAnsamblu"],
    faqs: [
      {
        q: "Duș fără prag sau cabină prefabricată?",
        a: "Cabina este mai ieftină și mai rapidă, dar se vede ca un obiect adăugat și are un cadru care se curăță greu. Cuva zidită costă mai mult și cere execuție corectă, dar face parte din încăpere și nu are limită de formă.",
      },
      {
        q: "Rigolă liniară sau sifon central?",
        a: "Rigola liniară permite pantă pe o singură direcție, ceea ce înseamnă tăieturi mai simple și plăci mari fără compromis. Sifonul central cere pantă pe patru direcții și arată bine doar la formate mici.",
      },
      {
        q: "Se poate face duș fără prag într-un bloc vechi?",
        a: "Depinde de câtă înălțime există între planșeu și cota finită a pardoselii și de unde poate ieși scurgerea. Măsurăm asta la fața locului înainte să promitem ceva.",
      },
      {
        q: "Apa nu iese din zona de duș dacă nu are prag?",
        a: "Nu, dacă panta este corect executată și zona este suficient de mare. Apa merge în jos; problema apare doar când panta este insuficientă sau inversată local.",
      },
    ],
    related: ["hidroizolatie-baie", "placare-cada-baie", "renovare-baie-la-cheie"],
  },

  /* ------------------------------------------------------------------ 06 */
  {
    slug: "placare-cada-baie",
    query: "placare cada baie gresie",
    h1: "Cadă zidită și placată, cu muchii la 45°",
    metaTitle: "Placarea căzii de baie — cadă zidită și placată",
    metaDescription:
      "Cadă îmbrăcată complet în plăci, cu muchii tăiate la 45° și tipar continuat de pe perete. Cum se construiește, unde se lasă vizitarea și ce se etanșează cu silicon.",
    kicker: "Detaliu de execuție",
    intro: [
      "O cadă îmbrăcată în plăci se citește ca un volum dintr-un singur material. Efectul nu vine din placă, ci din două decizii: muchiile se taie la 45° în loc să fie acoperite cu profil metalic, iar plăcile se selectează astfel încât desenul să curgă de pe perete pe cant și mai departe pe blat.",
      "Sub aspectul frumos există un obiect tehnic: o cadă are sifon, preaplin și racorduri care se defectează. Dacă o zidești complet, prima intervenție înseamnă demolare. De aceea orice cadă placată corect are o vizitare — camuflată, dar reală.",
      "Fotografiile de mai jos sunt dintr-o lucrare executată de noi, inclusiv detaliul de muchie.",
    ],
    includes: [
      "structura de susținere din blocuri sau profile, dimensionată pe cadă",
      "hidroizolație pe structură și racord la peretele placat",
      "vizitare pentru sifon și racorduri, integrată în placare",
      "tăieturi la 45° pe muchiile expuse, fără profil metalic",
      "selecția plăcilor pentru continuitatea tiparului între perete, cant și blat",
      "etanșare cu silicon la racordul cadă–placare",
    ],
    steps: [
      {
        title: "Structura, dimensionată pe cadă",
        body: "Se măsoară cada montată și racordată, nu din catalog. Se lasă joc pentru straturi și se verifică accesul la sifon înainte de a închide ceva.",
      },
      {
        title: "Vizitarea, decisă din start",
        body: "Alegem unde cade panoul de acces astfel încât să pice pe un rost, nu în mijlocul unei plăci. Bine plasat, nu se observă; prost plasat, sare în ochi din ușă.",
      },
      {
        title: "Muchii la 45°",
        body: "Cele două plăci care formează colțul se taie fiecare la 45° și se îmbină. Cere plăci de calitate constantă și tăiere precisă, pentru că muchia rezultată este subțire și iartă foarte puțin.",
      },
      {
        title: "Tipar continuu și etanșare",
        body: "Plăcile se aleg din stoc pentru ca venele să continue peste colț. La final, racordul dintre cadă și placare se face cu silicon, niciodată cu chit de rost.",
      },
    ],
    pitfalls: [
      {
        title: "Cadă zidită complet, fără acces",
        body: "La prima scurgere de la sifon se sparge placarea. Vizitarea costă nimic în etapa de proiectare și o lucrare întreagă mai târziu.",
      },
      {
        title: "Muchie la 45° pe placă de calitate slabă",
        body: "Plăcile cu miez neomogen se ciobesc la tăiere și muchia rezultată se sparge la prima lovitură. Pe astfel de plăci, profilul metalic este alegerea onestă.",
      },
      {
        title: "Chit de rost între cadă și placă",
        body: "Cada se mișcă atunci când intri în ea, plină cu apă. Chitul rigid crapă în câteva săptămâni, apa intră în structură și lucrarea putrezește din interior.",
      },
    ],
    gallery: ["cadaAnsamblu", "cadaMuchii", "cadaNisaWc"],
    faqs: [
      {
        q: "Cadă placată sau cadă acrilică la vedere?",
        a: "Cada acrilică este mai ieftină și mai rapidă. Cea placată integrează cada în încăpere, permite o poliță sau o treaptă și rezistă mult mai bine în timp la lovituri și la curățare.",
      },
      {
        q: "Muchie la 45° sau profil metalic?",
        a: "Muchia la 45° arată mai bine și nu adună murdărie într-un canal metalic, dar cere plăci potrivite și execuție precisă. Profilul este mai tolerant și rămâne o soluție corectă acolo unde placa nu permite altceva.",
      },
      {
        q: "Se poate placa peste o cadă acrilică existentă?",
        a: "Nu direct pe cadă. Se construiește o structură independentă în jurul ei, care preia greutatea placării, iar cada rămâne liberă să lucreze.",
      },
      {
        q: "Cât de mare trebuie să fie panoul de vizitare?",
        a: "Suficient cât să ajungi la sifon și la racorduri cu mâna și cu o cheie. Îl dimensionăm în funcție de poziția reală a sifonului, nu la o măsură standard.",
      },
    ],
    related: ["montaj-gresie-faianta", "teracota", "renovare-baie-la-cheie"],
  },

  /* ------------------------------------------------------------------ 07 */
  {
    slug: "montaj-wc-suspendat",
    query: "montaj wc suspendat rezervor incastrat",
    h1: "Montaj WC suspendat și nișă placată",
    metaTitle: "Montaj WC suspendat cu rezervor încastrat",
    metaDescription:
      "WC suspendat cu rezervor încastrat: cum se dimensionează coloana, unde cad rosturile pe peretele placat și de ce cadrul se cumpără înainte de a construi ceva.",
    kicker: "Sanitar încastrat",
    intro: [
      "Un WC suspendat curăță vizual toată încăperea: pardoseala rămâne continuă, se spală ușor și baia pare mai mare. Costul acestei simplități este că rezervorul, racordurile și cadrul metalic trebuie să dispară într-o coloană — și coloana aceea devine peretele cel mai vizibil din baie.",
      "De aceea montajul unui WC suspendat este, în cea mai mare parte, o problemă de placare: unde cade rostul pe coloană, cum se aliniază clapeta cu tiparul plăcii, unde se termină polița de deasupra și cum se racordează coloana la peretele lateral.",
      "Ordinea este strictă: cadrul se cumpără, apoi se construiește. Invers nu funcționează niciodată.",
    ],
    includes: [
      "montajul cadrului metalic și fixarea lui în structură",
      "racordarea la apă și canalizare, cu probă înainte de închidere",
      "coloana de mascare, dimensionată pe cadrul real",
      "nișă-poliță deasupra, când adâncimea permite",
      "trasarea modulației astfel încât clapeta să cadă centrat pe plăci",
      "placare cu colțuri la 45° și decupaj precis pentru clapetă",
    ],
    steps: [
      {
        title: "Cadrul, întâi",
        body: "Cadrul se alege și se aduce înainte de a se construi orice. Adâncimea lui stabilește adâncimea coloanei, iar poziția clapetei stabilește unde trebuie să cadă rostul.",
      },
      {
        title: "Fixare și probă",
        body: "Cadrul se ancorează în perete și în pardoseală — un WC suspendat susține greutatea unui om pe consolă. Racordurile se probează cu presiune înainte de a fi acoperite.",
      },
      {
        title: "Coloana și polița",
        body: "Coloana se închide la o adâncime care lasă loc de poliță deasupra. Este spațiul cel mai util dintr-o baie mică și se pierde doar dacă nimeni nu s-a gândit la el din timp.",
      },
      {
        title: "Placare centrată pe clapetă",
        body: "Modulația se trasează pornind de la clapetă, ca decupajul să nu taie o placă asimetric. Colțurile coloanei se execută la 45°, ca volumul să pară dintr-o bucată.",
      },
    ],
    pitfalls: [
      {
        title: "Coloana construită înainte de a avea cadrul",
        body: "Fiecare producător are altă adâncime și altă poziție a racordului. Coloana construită „la o măsură obișnuită” se demolează când vine cadrul.",
      },
      {
        title: "Clapeta care cade peste un rost",
        body: "Rama clapetei taie rostul într-un loc arbitrar și se vede din prima. Se rezolvă la trasare, gratis; după placare, deloc.",
      },
      {
        title: "Fixare doar în gips-carton",
        body: "Cadrul trebuie ancorat în structura portantă și în pardoseală. Prins doar în placa de gips, se desprinde — cu tot cu vasul de toaletă.",
      },
    ],
    gallery: ["wcSuspendat", "cadaNisaWc", "griNisa", "albaDus"],
    faqs: [
      {
        q: "Se poate monta WC suspendat într-un apartament de bloc?",
        a: "Da, în majoritatea cazurilor. Ce trebuie verificat este dacă racordul la coloana de canalizare poate fi mutat la înălțimea cerută de cadru și dacă peretele permite ancorarea.",
      },
      {
        q: "Ce se întâmplă dacă rezervorul încastrat se strică?",
        a: "Toate componentele care se pot defecta sunt accesibile prin deschiderea clapetei. Nu se demolează nimic — cu condiția ca montajul să fi fost făcut cu cadru original și clapetă compatibilă.",
      },
      {
        q: "Cât spațiu pierd cu coloana?",
        a: "Adâncimea depinde de cadru. În schimb, spațiul de deasupra coloanei devine poliță utilă, iar pardoseala liberă face încăperea să pară mai mare decât era.",
      },
      {
        q: "Susține un WC suspendat greutatea unui adult?",
        a: "Cadrele sunt dimensionate pentru asta, cu o marjă serioasă. Condiția este ancorarea corectă în structură — acolo se decide, nu în specificația vasului.",
      },
    ],
    related: ["renovare-baie-la-cheie", "placi-format-mare", "montaj-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 08 */
  {
    slug: "teracota",
    query: "teracota mester chisinau",
    h1: "Teracotă și plăci ceramice decorative",
    metaTitle: "Meșter teracotă și plăci ceramice — Chișinău",
    metaDescription:
      "Lucrări de teracotă și placări ceramice decorative: selecția tiparului, alinierea pe module și racordurile curate. Ce cerem înainte de a începe și cum se execută.",
    kicker: "Ceramică decorativă",
    intro: [
      "Teracota și placarea ceramică decorativă se deosebesc de o placare obișnuită printr-un singur lucru: aici tiparul contează mai mult decât suprafața. Plăcile nu sunt interschimbabile, iar ordinea în care sunt puse decide dacă lucrarea arată intenționat sau întâmplător.",
      "De aceea începem prin a așeza plăcile pe jos și a le selecta, înainte de a amesteca adezivul. Se aleg tonurile, se stabilește sensul desenului și se elimină bucățile care sparg ritmul. Este o oră de lucru care schimbă complet rezultatul.",
      "Executăm lucrări de teracotă și placări ceramice decorative pe suprafețe interioare. Fotografiile de mai jos arată calitatea execuției ceramice — muchii tăiate la 45°, racorduri curate, rosturi continue — și descriu exact ce se vede în cadru.",
    ],
    includes: [
      "evaluarea suportului și a compatibilității lui cu materialul ales",
      "selecția și presortarea plăcilor pe ton și pe tipar, înainte de montaj",
      "trasarea modulației, ca desenul să fie centrat pe suprafața vizibilă",
      "montaj cu adeziv potrivit materialului și cu rost calibrat",
      "muchii și racorduri executate curat, la 45° acolo unde se cere",
      "rostuire în tonul ales și curățare fără agresarea suprafeței",
    ],
    steps: [
      {
        title: "Ce fel de material este, de fapt",
        body: "Teracota, ceramica smălțuită și porțelanul se comportă diferit: absorb altfel, cer alt adeziv și se taie altfel. Verificăm materialul înainte să alegem sistemul de montaj, nu invers.",
      },
      {
        title: "Presortare pe ton și tipar",
        body: "Plăcile se scot din cutii și se așază pe jos, în ordinea în care vor fi montate. Diferențele de lot se distribuie, nu se ascund într-un colț.",
      },
      {
        title: "Modulație centrată",
        body: "Suprafața decorativă se trasează astfel încât tăieturile să ajungă la margini, iar desenul să rămână simetric pe zona pe care o vede toată lumea.",
      },
      {
        title: "Rost și finisaj",
        body: "Rostul se alege în raport cu materialul: prea îngust pe o placă cu margini neregulate scoate în evidență fiecare abatere. Culoarea chitului schimbă percepția întregului tipar și se decide împreună cu beneficiarul.",
      },
    ],
    pitfalls: [
      {
        title: "Montaj direct din cutie",
        body: "Loturile diferă. Fără presortare, apar zone vizibil mai închise sau mai deschise, iar remedierea înseamnă demontare.",
      },
      {
        title: "Adeziv nepotrivit materialului",
        body: "Materialele cu absorbție mare cer alt sistem decât porțelanul. Adezivul universal aplicat peste tot este motivul obișnuit pentru care o placare decorativă se desprinde.",
      },
      {
        title: "Rost prea îngust pe material neregulat",
        body: "Pe plăci cu margini artizanale, rostul îngust transformă fiecare milimetru de abatere într-un defect vizibil. Rostul potrivit face lucrarea să pară intenționată.",
      },
    ],
    gallery: ["cadaMuchii", "cadaAnsamblu", "albaAccentNegru", "griRosturi"],
    faqs: [
      {
        q: "Executați și montaj de teracotă pe sobe?",
        a: "Spune-ne exact ce ai: tip de sobă, starea ei și materialul de care dispui. Ne uităm la situație și îți spunem direct dacă este o lucrare pe care o luăm sau nu — preferăm asta unei promisiuni generale.",
      },
      {
        q: "Aduceți voi materialul?",
        a: "De regulă îl alege beneficiarul, pentru că este o decizie estetică. Te ajutăm cu calculul cantității, cu rezerva necesară și cu ce adeziv și chit se potrivesc materialului ales.",
      },
      {
        q: "Se poate continua un tipar existent cu material nou?",
        a: "Rar identic. Se poate însă gândi o soluție care să pară intenționată — o zonă de accent, o schimbare de modul — în loc de un petic care încearcă să treacă neobservat și nu reușește.",
      },
      {
        q: "De ce fotografiile arată ceramică, nu teracotă?",
        a: "Pentru că astea sunt fotografiile pe care le avem din lucrări proprii, iar noi nu publicăm imagini care nu ne aparțin. Descrierea fiecărei fotografii spune exact ce se vede în ea.",
      },
    ],
    related: ["montaj-gresie-faianta", "placi-format-mare", "mester-gresie-faianta-chisinau"],
  },

  /* ------------------------------------------------------------------ 09 */
  {
    slug: "placare-terasa",
    query: "placare terasa gresie exterior",
    h1: "Placare terasă cu plăci porțelanate",
    metaTitle: "Placare terasă — plăci porțelanate de exterior",
    metaDescription:
      "Placare de terasă rezistentă la îngheț: pante, rosturi de dilatare, adezivi și chituri pentru exterior. De ce o placare de interior mutată afară crapă în prima iarnă.",
    kicker: "Exterior",
    intro: [
      "O terasă nu este o cameră fără acoperiș. Materialul se dilată la soare și se contractă noaptea, apa intră în rost și îngheață iarna, iar dacă nu are pe unde să iasă, ridică placa de pe suport. Aceste trei fenomene nu există în interior și sunt singurul motiv pentru care o placare de exterior se face altfel.",
      "Concret: placă de exterior, rezistentă la îngheț și antiderapantă; adeziv flexibil de clasă potrivită; pantă reală către evacuare; rosturi de dilatare care împart suprafața; și chit care rămâne elastic. Dacă lipsește oricare dintre ele, lucrarea are un termen de expirare.",
      "Executăm placări exterioare pe terase, balcoane și platforme. Fotografiile arată o lucrare de exterior executată de noi.",
    ],
    includes: [
      "verificarea suportului, a pantei existente și a modului în care se evacuează apa",
      "corectarea pantei cu șapă, când este insuficientă sau inversată",
      "hidroizolație sub placare acolo unde dedesubt există spațiu locuibil",
      "montaj cu adeziv flexibil, cu acoperire completă pe spatele plăcii",
      "rosturi de dilatare pe câmp și rosturi perimetrale la pereți",
      "rostuire cu chit pentru exterior și etanșarea racordurilor",
    ],
    steps: [
      {
        title: "Unde pleacă apa",
        body: "Se stabilește întâi punctul de evacuare și panta necesară către el. O terasă fără pantă acumulează apă, iar apa acumulată care îngheață desprinde placarea de la primul ciclu.",
      },
      {
        title: "Acoperire completă sub placă",
        body: "În exterior, adezivul trebuie să acopere integral spatele plăcii. Fiecare gol rămas se umple cu apă, iar apa îngheață și lucrează ca o pană.",
      },
      {
        title: "Rosturi de dilatare",
        body: "Suprafața se împarte în câmpuri, cu rosturi elastice între ele și pe tot perimetrul, lângă pereți. Fără ele, dilatarea nu are unde să se ducă și placarea se umflă.",
      },
      {
        title: "Chit elastic și etanșări",
        body: "Chitul de exterior trebuie să rămână elastic și rezistent la îngheț. Racordurile cu pereții și cu elementele metalice se fac cu silicon, nu cu chit.",
      },
    ],
    pitfalls: [
      {
        title: "Placă de interior montată afară",
        body: "Absoarbe apă, apa îngheață, placa se exfoliază. Se vede după prima iarnă și nu se repară — se reface.",
      },
      {
        title: "Placare lipită direct de perete, fără rost perimetral",
        body: "Suprafața nu are unde să se dilate și împinge în pereți. Rezultatul este placare umflată pe mijloc, uneori cu zgomot audibil când cedează.",
      },
      {
        title: "Pantă „compensată din adeziv”",
        body: "Grosimea neuniformă de adeziv sub placă înseamnă priză neuniformă și goluri. Panta se face în suport, nu în stratul de montaj.",
      },
    ],
    gallery: ["trepteTerasa", "fatadaScara"],
    faqs: [
      {
        q: "Se poate placa peste o terasă existentă?",
        a: "Dacă suportul este sănătos, aderent și are pantă corectă, da. Dacă vechea placare sună a gol sau apa stagnează, se desface — altfel construiești peste o problemă.",
      },
      {
        q: "Ce plăci sunt potrivite pentru terasă?",
        a: "Porțelan de exterior, cu absorbție foarte redusă și cu o clasă de antiderapare potrivită unei suprafețe care va fi udă. Nu conta pe aspect: două plăci care arată identic pot avea comportamente complet diferite la îngheț.",
      },
      {
        q: "Este nevoie de hidroizolație sub terasă?",
        a: "Obligatoriu dacă dedesubt există spațiu locuibil sau tehnic. Pe o platformă la sol, prioritatea este panta și evacuarea corectă a apei.",
      },
      {
        q: "De ce crapă rosturile la terase?",
        a: "Aproape întotdeauna pentru că lipsesc rosturile de dilatare sau pentru că s-a folosit chit rigid. Materialul se mișcă; dacă nu are unde, se rupe pe cea mai slabă linie.",
      },
    ],
    related: ["placare-scari-trepte", "placare-fatada", "placi-format-mare"],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    slug: "placare-scari-trepte",
    query: "placare scari trepte exterioare",
    h1: "Placare scări și trepte exterioare",
    metaTitle: "Placare scări și trepte exterioare",
    metaDescription:
      "Placarea treptelor: cum se calculează înălțimea egală, ce muchie se alege, ce clasă antiderapantă are sens afară și cum se evacuează apa de pe fiecare treaptă.",
    kicker: "Exterior",
    intro: [
      "La o scară, greșelile nu sunt doar estetice. Ochiul nu observă o treaptă cu doi centimetri mai înaltă decât celelalte, dar piciorul o observă întotdeauna — și de obicei prin împiedicare. De aceea prima operație la placarea unei scări nu este montajul, ci recalcularea înălțimilor.",
      "A doua problemă este muchia. Este locul care se lovește, se calcă și se udă, și este singurul detaliu al scării pe care îl vede toată lumea. Se poate rezolva cu placă cu nas, cu tăietură la 45° sau cu profil, fiecare cu compromisurile ei.",
      "A treia este apa: fiecare treaptă are nevoie de o pantă mică spre exterior, altfel apa stă pe ea și iarna îngheață exact pe suprafața pe care calci.",
    ],
    includes: [
      "măsurarea scării și recalcularea înălțimilor, ca toate treptele să fie egale",
      "corectarea suportului acolo unde diferențele sunt prea mari pentru stratul de montaj",
      "alegerea soluției de muchie: nas, tăietură la 45° sau profil",
      "montaj cu adeziv flexibil, cu acoperire completă",
      "pantă mică pe fiecare treaptă, pentru evacuarea apei",
      "rostuire cu chit de exterior și etanșarea racordurilor laterale",
    ],
    steps: [
      {
        title: "Recalcularea înălțimilor",
        body: "Se măsoară fiecare treaptă în starea existentă și se distribuie diferențele pe toată scara, astfel încât după placare înălțimile să fie egale. Este partea de care depinde dacă scara se urcă natural sau nu.",
      },
      {
        title: "Muchia, decisă înainte de comandă",
        body: "Placa cu nas trebuie comandată ca atare; tăietura la 45° cere plăci care suportă operația. Decizia se ia înainte de a cumpăra materialul, nu la montaj.",
      },
      {
        title: "Contratreapta întâi, apoi treapta",
        body: "Se montează contratreapta, apoi treapta care o acoperă la muchie. Ordinea inversă lasă o linie orizontală vizibilă exact la nivelul ochiului celui care urcă.",
      },
      {
        title: "Pantă și rosturi laterale",
        body: "Fiecare treaptă primește o cădere mică spre exterior. Lateralele, unde scara se racordează cu zidul sau cu balustrada, se etanșează elastic.",
      },
    ],
    pitfalls: [
      {
        title: "Trepte inegale după placare",
        body: "Se întâmplă când placarea se pune peste treptele existente fără recalculare. Diferența se acumulează și ultima treaptă iese complet din ritm.",
      },
      {
        title: "Muchie fără suport de material",
        body: "O muchie tăiată dintr-o placă subțire, montată în consolă peste gol, se sparge la prima lovitură. Muchia trebuie susținută pe toată lungimea ei.",
      },
      {
        title: "Suprafață lucioasă afară",
        body: "O placă frumoasă și lucioasă pe o scară exterioară devine periculoasă la prima ploaie. Clasa antiderapantă nu este un detaliu de catalog, este condiția de siguranță.",
      },
    ],
    gallery: ["fatadaScara", "trepteTerasa"],
    faqs: [
      {
        q: "Se poate placa o scară de beton turnată strâmb?",
        a: "Da, dar corectarea se face în suport, cu mortar, înainte de placare. Diferențele mari nu se pot ascunde în stratul de adeziv fără să apară alte probleme.",
      },
      {
        q: "Ce se folosește la muchie?",
        a: "Depinde de placă și de buget. Placa cu nas arată cel mai bine, tăietura la 45° este eleganta dacă materialul o permite, profilul metalic este cel mai tolerant și cel mai vizibil.",
      },
      {
        q: "Cât rezistă o placare de scară exterioară?",
        a: "Depinde aproape complet de trei lucruri: placă rezistentă la îngheț, adeziv flexibil cu acoperire completă și evacuarea apei. Cu toate trei, ani mulți; fără una dintre ele, câteva ierni.",
      },
      {
        q: "Se poate placa iarna?",
        a: "Adezivii au temperaturi minime de aplicare și de priză. Sub ele, montajul nu leagă corect, indiferent cum arată în ziua următoare.",
      },
    ],
    related: ["placare-terasa", "placare-fatada", "montaj-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 11 */
  {
    slug: "placare-fatada",
    query: "placare fatada placi portelanate",
    h1: "Placare fațadă cu plăci porțelanate",
    metaTitle: "Placare fațadă cu plăci porțelanate de format mare",
    metaDescription:
      "Placarea fațadei cu porțelan de format mare: cerințele de suport, adezivul, rosturile de dilatare și de ce greutatea plăcii schimbă complet sistemul de montaj.",
    kicker: "Exterior",
    intro: [
      "O fațadă placată cu porțelan de format mare este cea mai pretențioasă lucrare de placare care există, din trei motive simple: plăcile sunt grele, sunt montate la înălțime și sunt expuse la variații de temperatură mult mai mari decât orice suprafață din interior.",
      "Consecința este că sistemul de montaj contează mai mult decât placa. O placă mare lipită cu adeziv nepotrivit pe un suport care nu a fost verificat nu cade imediat — cade peste câțiva ani, singură, de la înălțime.",
      "Executăm placări exterioare de fațadă și socluri. Înainte de orice ofertă verificăm suportul, pentru că el decide dacă lucrarea este posibilă în forma dorită.",
    ],
    includes: [
      "verificarea suportului: portanță, planeitate, aderență, fisuri active",
      "amorsare și, unde este cazul, corectarea planeității înainte de montaj",
      "alegerea adezivului în funcție de format, greutate și expunere",
      "montaj cu acoperire completă pe spatele plăcii, cu dublă aplicare",
      "rosturi de dilatare pe câmpuri și rosturi la schimbările de plan",
      "rostuire cu chit pentru exterior și etanșarea racordurilor cu tâmplăria",
    ],
    steps: [
      {
        title: "Suportul decide sistemul",
        body: "Un perete de beton sănătos, un perete termoizolat și un perete de blocuri se comportă complet diferit sub greutatea unei plăci mari. Verificarea suportului este prima etapă și, uneori, cea care schimbă soluția.",
      },
      {
        title: "Adeziv pe ambele fețe",
        body: "La format mare se aplică adeziv atât pe suport cât și pe spatele plăcii, ca să nu rămână goluri. Un gol la fațadă înseamnă apă, îngheț și o zonă care își pierde aderența în timp.",
      },
      {
        title: "Câmpuri și rosturi",
        body: "Suprafața se împarte în câmpuri delimitate de rosturi elastice, iar la fiecare schimbare de plan se lasă rost. O fațadă întinsă, montată ca o singură suprafață rigidă, se fisurează pe diagonală.",
      },
      {
        title: "Racorduri cu tâmplăria",
        body: "În jurul ferestrelor și ușilor, racordul se etanșează elastic. Este locul prin care apa intră în spatele placării dacă este tratat ca un rost obișnuit.",
      },
    ],
    pitfalls: [
      {
        title: "Format mare montat cu adeziv standard",
        body: "Adezivul trebuie ales pentru greutatea și formatul plăcii, nu pentru că era pe raft. La fațadă, o alegere greșită are consecințe de siguranță, nu doar estetice.",
      },
      {
        title: "Placare peste o fisură activă",
        body: "Fisura continuă să lucreze și taie placarea exact pe traseul ei. Se tratează suportul întâi; altfel lucrarea nouă doar ascunde problema câteva luni.",
      },
      {
        title: "Rost perimetral lipsă",
        body: "Fără rost la marginile suprafeței, dilatarea împinge în tâmplărie și în colțuri. Se vede ca plăci ridicate sau ca fisuri la 45° în colțurile golurilor.",
      },
    ],
    gallery: ["fatadaScara", "trepteTerasa"],
    faqs: [
      {
        q: "Se poate placa peste termoizolație?",
        a: "Doar cu un sistem gândit pentru asta și dimensionat pentru greutatea plăcii. Nu este o placare obișnuită executată pe alt suport, este alt sistem — și se stabilește înainte, nu la montaj.",
      },
      {
        q: "Ce dimensiune maximă de placă se poate folosi la fațadă?",
        a: "Nu există un răspuns universal: depinde de suport, de sistemul de montaj și de înălțime. Cu cât placa este mai mare, cu atât toleranța la greșeli este mai mică.",
      },
      {
        q: "Cât durează o fațadă placată?",
        a: "Cu suport pregătit corect, adeziv potrivit și rosturi de dilatare, foarte mult. Aproape toate cedările premature vin din suport sau din lipsa rosturilor, nu din placă.",
      },
      {
        q: "Se poate lucra pe timp rece?",
        a: "Adezivii au un interval de temperatură pentru aplicare și priză. Programăm lucrările de exterior în funcție de el, pentru că nu este o recomandare, ci o condiție.",
      },
    ],
    related: ["placare-terasa", "placare-scari-trepte", "placi-format-mare"],
  },

  /* ------------------------------------------------------------------ 12 */
  {
    slug: "incalzire-in-pardoseala",
    query: "incalzire in pardoseala sub gresie",
    h1: "Încălzire în pardoseală sub gresie",
    metaTitle: "Încălzire în pardoseală sub gresie — montaj",
    metaDescription:
      "Cablu de încălzire sub gresie: ordinea corectă a straturilor, poziția senzorului, de ce nu se pornește imediat și ce nu trebuie acoperit niciodată cu mobilier fix.",
    kicker: "Confort",
    intro: [
      "Gresia este rece pentru că este un bun conducător termic — exact însușirea care o face materialul ideal pentru încălzire în pardoseală. Un cablu sub placă transformă defectul cel mai reclamat al unei băi într-un avantaj, cu un consum mult mai mic decât se așteaptă majoritatea oamenilor.",
      "Montajul are o ordine care nu se poate schimba: hidroizolație, cablu fixat pe plasă, șapă sau pat de adeziv, apoi placare. Senzorul de temperatură se pune într-un tub, între două trasee de cablu, ca să poată fi înlocuit fără să se spargă pardoseala.",
      "Fotografiile de mai jos sunt exact din această etapă, la o lucrare executată de noi.",
    ],
    includes: [
      "verificarea suprafeței efectiv încălzibile, fără zonele acoperite de mobilier fix",
      "montajul cablului pe plasă, peste hidroizolație, cu pas constant",
      "tubul de protecție pentru senzorul de temperatură, accesibil pentru înlocuire",
      "măsurarea rezistenței cablului înainte și după turnare",
      "înglobarea completă în șapă sau în pat de adeziv, fără goluri de aer",
      "placarea peste și punerea în funcțiune după uscarea completă",
    ],
    steps: [
      {
        title: "Ce suprafață se încălzește de fapt",
        body: "Cablul nu se montează sub cadă, sub mobilierul fix sau sub coloana rezervorului. Suprafața utilă este mai mică decât camera și se stabilește înainte de a comanda kitul.",
      },
      {
        title: "Peste hidroizolație, nu sub ea",
        body: "Ordinea este hidroizolație, apoi cablu. Invers, orice intervenție viitoare la cablu trece prin bariera de apă.",
      },
      {
        title: "Senzorul în tub",
        body: "Senzorul se introduce într-un tub, la mijloc între două trasee. Este singura componentă care se defectează mai des decât cablul și, montat în tub, se schimbă fără a demola nimic.",
      },
      {
        title: "Măsurare și punere în funcțiune",
        body: "Rezistența se măsoară înainte de turnare și după, ca o eventuală deteriorare să fie localizată în timp util. Sistemul se pornește abia după uscarea completă a șapei și a adezivului.",
      },
    ],
    pitfalls: [
      {
        title: "Pornirea sistemului prea devreme",
        body: "Uscarea forțată a șapei sau a adezivului produce tensiuni și fisuri, iar fisurile ajung în placare. Se așteaptă termenul complet, oricât de tentant ar fi.",
      },
      {
        title: "Senzor montat direct în șapă",
        body: "Când se defectează — și se defectează — se sparge pardoseala ca să fie înlocuit. Tubul de protecție costă aproape nimic la montaj.",
      },
      {
        title: "Goluri de aer în jurul cablului",
        body: "Cablul trebuie înglobat complet. Un gol de aer înseamnă supraîncălzire locală și îmbătrânire accelerată exact în punctul acela.",
      },
    ],
    gallery: ["albaCablu", "albaHidro", "albaAnsamblu"],
    faqs: [
      {
        q: "Consumă mult?",
        a: "Într-o baie, suprafața utilă este mică și sistemul funcționează cu termostat, deci pornește puțin. Consumul real depinde de izolația încăperii, de programul termostatului și de temperatura pe care o alegi.",
      },
      {
        q: "Se poate monta doar în zona de circulație?",
        a: "Da, și de multe ori este alegerea rezonabilă. Nu are sens să încălzești suprafața de sub cadă sau de sub mobilier.",
      },
      {
        q: "Merge cu orice tip de placă?",
        a: "Cu gresie și porțelan, foarte bine. Materialele cu rezistență termică mare izolează cablul de încăpere și reduc eficiența sistemului.",
      },
      {
        q: "Ce se întâmplă dacă se defectează cablul?",
        a: "Un cablu înglobat corect are o durată de viață lungă. Dacă totuși apare o defecțiune, se localizează cu aparatură și se intervine punctual — motiv în plus ca traseul să fie documentat cu fotografii înainte de turnare, ceea ce facem oricum.",
      },
    ],
    related: ["hidroizolatie-baie", "renovare-baie-la-cheie", "montaj-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 13 */
  {
    slug: "placi-format-mare",
    query: "montaj placi format mare 120x60",
    h1: "Montaj plăci de format mare",
    metaTitle: "Montaj plăci de format mare (120×60 și peste)",
    metaDescription:
      "Plăci de format mare: de ce cer suport mult mai plan, ce înseamnă decalajul corect între rânduri, cum se evită denivelările și când formatul mare nu este alegerea potrivită.",
    kicker: "Formate mari",
    intro: [
      "Formatul mare a devenit standardul pentru că reduce numărul de rosturi și face o încăpere mică să pară mai mare. Ce se spune mai rar este că o placă de 120×60 nu iartă nimic: fiecare abatere a suportului se transformă într-o denivelare vizibilă între două plăci vecine, iar suprafața mare face ca lumina razantă să o scoată în evidență.",
      "Practic, formatul mare mută efortul din montaj în pregătire. Suportul trebuie să fie mult mai plan decât pentru o placă de 30×60, adezivul trebuie aplicat pe ambele fețe, iar decalajul dintre rânduri nu poate fi jumătate de placă, pentru că plăcile mari au o ușoară curbură naturală.",
      "Fotografiile de mai jos arată montaj de format mare cu sistem de nivelare, la lucrări executate de noi.",
    ],
    includes: [
      "verificarea planeității suportului și nivelarea lui înainte de montaj",
      "trasarea modulației, pentru ca tăieturile să cadă în locuri neutre",
      "adeziv aplicat atât pe suport cât și pe spatele plăcii",
      "sistem de nivelare pe toată suprafața, nu doar în zonele problematice",
      "decalaj între rânduri sub o treime de placă, nu la jumătate",
      "tăieturi și decupaje executate cu scule pentru format mare",
    ],
    steps: [
      {
        title: "Planeitatea, măsurată nu estimată",
        body: "Se verifică suportul cu dreptar și se corectează abaterile. La format mare nu există „compensez din adeziv” — grosimea neuniformă de adeziv înseamnă priză neuniformă și, în timp, plăci sparte.",
      },
      {
        title: "Modulația pentru toată încăperea",
        body: "Cu plăci mari, o tăietură prost plasată domină întreaga suprafață. Se calculează dinainte unde cade fiecare rost, inclusiv trecerea de pe pardoseală pe perete.",
      },
      {
        title: "Adeziv pe ambele fețe",
        body: "Se pieptănă suportul pe o direcție și se aplică un strat subțire și pe spatele plăcii. Așa se elimină golurile de aer, care la format mare sunt cauza obișnuită a fisurilor.",
      },
      {
        title: "Nivelare pe toată suprafața",
        body: "Clipsurile de nivelare se pun pe fiecare îmbinare, nu selectiv. Un colț ridicat cu o jumătate de milimetru la o placă de 120 cm se vede de la ușă când bate lumina.",
      },
    ],
    pitfalls: [
      {
        title: "Decalaj la jumătate de placă",
        body: "Plăcile mari au o ușoară bombare pe mijloc. Cu decalaj la jumătate, mijlocul bombat al unei plăci ajunge lângă capătul plat al vecinei și rezultă o denivelare pe care nimeni nu o mai poate corecta.",
      },
      {
        title: "Montaj de unul singur",
        body: "O placă mare se manevrează în doi, cu ventuze. Manipulată greșit, se fisurează invizibil la montaj și crapă vizibil peste câteva luni.",
      },
      {
        title: "Format mare într-o încăpere mică și complicată",
        body: "Într-o baie mică plină de decupaje, o parte mare din material ajunge deșeu, iar tăieturile domină aspectul. Uneori formatul mediu este pur și simplu alegerea mai bună — și o spunem când e cazul.",
      },
    ],
    gallery: ["griPrimeleRanduri", "griNivelare", "wcSuspendat", "albaAnsamblu"],
    faqs: [
      {
        q: "Format mare într-o baie mică — are sens?",
        a: "Uneori da, pentru că reduce rosturile și extinde vizual spațiul. Alteori nu, dacă încăperea are multe decupaje și nișe, iar rezultatul devine o colecție de tăieturi. Ne uităm la planul concret înainte să recomandăm.",
      },
      {
        q: "Cât material se pierde la tăieturi?",
        a: "Mai mult decât la formatele mici, pentru că o tăietură scoate din uz o bucată mare. Calculăm cantitatea și rezerva pe încăperea ta, înainte de comandă.",
      },
      {
        q: "Se poate monta format mare pe gips-carton?",
        a: "Da, dacă structura este dimensionată pentru greutate, cu pas de montanți redus și, de regulă, dublă placare. Nu pe o structură standard gândită pentru zugrăveală.",
      },
      {
        q: "Ce rost se lasă la plăci mari?",
        a: "Rostul minim depinde de placă și de rectificare, dar rost zero nu există: materialul trebuie să aibă unde să se miște. Rostul foarte îngust cere plăci rectificate și un suport foarte plan.",
      },
    ],
    related: ["montaj-gresie-faianta", "placare-fatada", "cat-costa-montajul-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 14 */
  {
    slug: "mester-gresie-faianta-chisinau",
    query: "mester gresie faianta chisinau",
    h1: "Meșter gresie și faianță în Chișinău",
    metaTitle: "Meșter gresie și faianță în Chișinău",
    metaDescription:
      "Cum alegi un meșter de gresie și faianță: ce fotografii să ceri, ce întrebări separă un profesionist de restul și cum lucrăm noi. Fotografii din lucrări reale.",
    kicker: "Cum lucrăm",
    intro: [
      "Cel mai greu lucru la angajarea unui meșter de gresie și faianță este că nu poți verifica lucrarea decât după ce este gata, iar atunci este prea târziu și prea scump să o refaci. Toate deciziile care contează — suportul, hidroizolația, panta, modulația — sunt invizibile în fotografia finală.",
      "De aceea pagina asta nu încearcă să te convingă. Îți dă întrebările pe care merită să le pui oricui, inclusiv nouă, și îți spune cum răspundem noi la ele.",
      "Lucrăm în Chișinău și împrejurimi, pe băi, apartamente și lucrări exterioare. Fotografiile de pe site sunt din lucrări proprii, inclusiv etapele de proces — pe care le publicăm tocmai pentru că sunt partea verificabilă.",
    ],
    includes: [
      "montaj gresie și faianță pe pereți și pardoseli, formate mici și mari",
      "renovări complete de baie, coordonate de la demolare la montaj sanitar",
      "hidroizolație, pante, cuve de duș zidite și rigole liniare",
      "compartimentări, coloane tehnice și nișe de vizitare",
      "placări exterioare: terase, trepte, scări, fațade",
      "plăci ceramice decorative și teracotă",
    ],
    steps: [
      {
        title: "Cere fotografii din timpul lucrării, nu doar finale",
        body: "Oricine poate arăta o baie frumoasă. Puțini pot arăta hidroizolația aplicată, banda din colțuri și panta verificată cu apă. Noi le publicăm pe site tocmai pentru asta.",
      },
      {
        title: "Întreabă ce se întâmplă cu suportul",
        body: "Un răspuns bun descrie curățarea, reparațiile locale și amorsarea. Un răspuns de genul „se pune direct” spune tot ce trebuie să știi despre ce urmează.",
      },
      {
        title: "Întreabă unde se pune silicon și unde chit",
        body: "Colțurile, racordul perete–pardoseală și marginea căzii se etanșează cu silicon. Cine spune că peste tot merge chit va reveni la tine peste un an.",
      },
      {
        title: "Cere claritate despre ce nu este inclus",
        body: "Cele mai multe conflicte pe șantier nu vin din ce s-a promis, ci din ce s-a presupus. Spunem din start ce intră și ce nu, ca să nu discutăm despre asta la mijlocul lucrării.",
      },
    ],
    pitfalls: [
      {
        title: "Prețul cel mai mic la metru pătrat",
        body: "Prețul pe metru nu spune nimic fără scopul lucrării. Cel mai ieftin ofertant este de obicei cel care nu a inclus pregătirea suportului, hidroizolația și tăieturile speciale.",
      },
      {
        title: "Nicio fotografie proprie",
        body: "Dacă toate imaginile arată ca dintr-un catalog, probabil sunt dintr-un catalog. O echipă care lucrează are telefonul plin de poze de pe șantier.",
      },
      {
        title: "„Facem tot”, fără nicio limită",
        body: "Nimeni nu face tot. O echipă serioasă îți spune ce nu ia, iar asta este de fapt un semn bun.",
      },
    ],
    gallery: ["griInainte", "griNivelare", "griAnsamblu", "albaHidro", "cadaAnsamblu", "fatadaScara"],
    faqs: [
      {
        q: "În ce zone lucrați?",
        a: "În Chișinău și împrejurimi. Pentru lucrări în afara acestei zone, întreabă-ne concret — depinde de amploarea lucrării și de perioadă.",
      },
      {
        q: "Cum decurge prima discuție?",
        a: "Ne spui ce ai de făcut și, dacă poți, trimiți câteva fotografii ale spațiului. Clarificăm serviciul și suprafața aproximativă, apoi programăm o evaluare la fața locului atunci când este necesar.",
      },
      {
        q: "Dați ofertă fără să vedeți încăperea?",
        a: "Putem da un interval orientativ după fotografii și dimensiuni, dar o ofertă fermă cere evaluare la fața locului. Ce se află sub finisajul vechi nu se vede în nicio fotografie.",
      },
      {
        q: "Lucrați și pe suprafețe mici?",
        a: "Spune-ne despre ce e vorba. Unele lucrări mici sunt exact tipul de intervenție în care experiența contează cel mai mult; altele nu au sens ca deplasare separată și îți spunem asta direct.",
      },
    ],
    related: ["montaj-gresie-faianta", "renovare-baie-la-cheie", "cat-costa-montajul-gresie-faianta"],
  },

  /* ------------------------------------------------------------------ 15 */
  {
    slug: "cat-costa-montajul-gresie-faianta",
    query: "pret montaj gresie faianta",
    h1: "Cât costă montajul de gresie și faianță",
    metaTitle: "Cât costă montajul de gresie și faianță — factorii reali",
    metaDescription:
      "De ce prețul pe metru pătrat nu spune nimic singur, ce factori schimbă costul unei placări și ce informații trebuie să dai ca să primești o ofertă care nu se schimbă pe parcurs.",
    kicker: "Cum se calculează",
    intro: [
      "Nu vei găsi pe pagina asta un preț pe metru pătrat, și motivul nu este comercial. Un preț pe metru dat fără să fi văzut încăperea este o cifră care se schimbă la prima vizită — iar când se schimbă, tu ești deja pe șantier, cu baia demolată și cu opțiuni puține.",
      "Ce poți găsi aici este harta completă a factorilor care mișcă acel număr, în ordinea impactului. Cu ea poți compara corect două oferte, chiar dacă niciuna nu este a noastră, și poți vedea imediat care dintre ele a omis ceva.",
      "Regula practică: două oferte se compară doar dacă acoperă același scop. Un preț pe metru mai mic care nu include pregătirea suportului nu este mai ieftin, este alt serviciu.",
    ],
    includes: [
      "suprafața reală de placat — pereți plus pardoseală, nu suprafața camerei",
      "starea suportului: cât trebuie curățat, reparat și nivelat înainte de montaj",
      "formatul plăcii: cele mari cer mai multă pregătire, cele mici mai multă manoperă",
      "complexitatea geometriei: nișe, coloane, decupaje, muchii la 45°",
      "lucrări ascunse: hidroizolație, pante, șapă, trasee, compartimentări",
      "accesul: etaj, lift, distanța de evacuare a molozului",
      "materialul ales și cantitatea de rezervă pe care o impune modelul",
    ],
    steps: [
      {
        title: "Suprafața reală, nu cea din act",
        body: "O baie de 4 m² poate avea 25 m² de placat, pentru că pereții se pun la socoteală. Orice comparație între oferte începe de la aceeași suprafață măsurată la fel.",
      },
      {
        title: "Ce este sub finisajul vechi",
        body: "Este singurul factor care nu se poate estima din fotografii. De aceea o ofertă fermă cere evaluare la fața locului, iar o ofertă dată din fotografii rămâne un interval.",
      },
      {
        title: "Geometria, nu doar metrii",
        body: "Douăzeci de metri pătrați drepți și douăzeci de metri pătrați plini de nișe, coloane și decupaje sunt două lucrări diferite, cu același număr pe hârtie.",
      },
      {
        title: "Ce spui tu, ca oferta să nu se schimbe",
        body: "Dimensiunile încăperii, câteva fotografii pe toate laturile, ce vrei să rămână și ce se demolează, dacă se schimbă poziția obiectelor sanitare și ce material ai ales sau intenționezi să alegi.",
      },
    ],
    pitfalls: [
      {
        title: "Compararea a două oferte cu scopuri diferite",
        body: "Cea mai frecventă greșeală. Cere fiecărui ofertant lista a ceea ce NU este inclus; diferența dintre oferte apare acolo, nu în preț.",
      },
      {
        title: "Materialul lăsat pe ultima sută de metri",
        body: "Placa aleasă târziu blochează șantierul, iar termenul de livrare nu ține cont de planificarea ta. Alegerea materialului este o etapă, nu un detaliu.",
      },
      {
        title: "Rezerva de material subestimată",
        body: "Când se termină plăcile la ultimul metru, lotul nou aproape sigur diferă ca ton. Rezerva se calculează la comandă, nu se improvizează la final.",
      },
    ],
    costFactors: [
      "suprafața reală măsurată pe pereți și pardoseală",
      "starea suportului descoperită la demolare",
      "formatul plăcii și tiparul de continuat",
      "numărul de decupaje, nișe, coloane și muchii speciale",
      "lucrările ascunse incluse: hidroizolație, pante, șapă, instalații",
      "accesul la etaj și evacuarea molozului",
    ],
    gallery: ["griInainte", "griSuport", "griNivelare", "griAnsamblu"],
    faqs: [
      {
        q: "De ce nu publicați un preț pe metru pătrat?",
        a: "Pentru că ar fi o cifră care se schimbă la prima vizită. Preferăm să îți spunem exact ce influențează costul și să dăm un număr după ce știm despre ce lucrare vorbim.",
      },
      {
        q: "Pot primi un interval orientativ fără vizită?",
        a: "Da, pe baza dimensiunilor și a câtorva fotografii. Este orientativ prin definiție: ce se află sub finisajul vechi nu apare în nicio fotografie.",
      },
      {
        q: "Materialele intră în preț?",
        a: "De obicei materialul de finisaj îl cumperi tu, pentru că este o alegere personală cu variații mari de preț. Îți spunem cantitatea, rezerva și ce adeziv și chit se potrivesc.",
      },
      {
        q: "Ce se întâmplă dacă apar lucrări neprevăzute?",
        a: "Îți arătăm ce am găsit înainte să continuăm și discutăm ce implică. Nicio lucrare suplimentară nu se execută fără să știi de ea.",
      },
    ],
    related: ["montaj-gresie-faianta", "renovare-baie-la-cheie", "mester-gresie-faianta-chisinau"],
  },
];

/** Slug -> page. */
export const landingBySlug: Map<string, LandingPage> = new Map(
  landingPages.map((page) => [page.slug, page]),
);

export function findLandingPage(slug: string): LandingPage | undefined {
  return landingBySlug.get(slug);
}

/** Every landing path, for the sitemap and for generateStaticParams. */
export const landingSlugs: string[] = landingPages.map((page) => page.slug);
