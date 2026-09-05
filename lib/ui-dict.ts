import type { Locale } from "@/lib/i18n";

/**
 * Every string of site chrome, in one typed dictionary.
 *
 * WHY A DICTIONARY AND NOT A TRANSLATION LIBRARY. The site is fully static —
 * 44 prerendered pages, no runtime locale negotiation, no user-supplied
 * content. A library like next-intl or i18next would add a provider, a bundle
 * and a lookup at render time to solve a problem this file solves at compile
 * time, and none of their real features (plural rules driven by user data,
 * lazy-loaded namespaces, runtime locale switching) apply here. A machine
 * translation service would be worse still: the copy is the product, and a
 * tile setter is judged on whether he sounds like he knows the trade.
 *
 * WHY `Record<Locale, ...>` AND NOT `Partial<...>`. TypeScript then refuses to
 * compile when a locale is added or a key is missed, which is the only reliable
 * defence against the failure ADR-011 forbids: a page that is half Romanian and
 * half Russian. There is no fallback-to-Romanian path anywhere in this file, on
 * purpose — a silent fallback is exactly how that page gets shipped.
 *
 * REGISTER. The Russian is written for Chișinău, where roughly half the city
 * speaks it natively. It is trade Russian, not a gloss of the Romanian: «стяжка»
 * not «шапэ», «затирка» not «кит», «инсталляция» for the concealed cistern.
 * Where the Romanian is deliberately blunt, the Russian is blunt in the same
 * places — the tone is a sales asset and translating it flat would cost more
 * than leaving the page in Romanian.
 */

export interface UiDict {
  nav: {
    services: string;
    projects: string;
    process: string;
    pricing: string;
    caseStudy: string;
    contact: string;
    ariaPrimary: string;
    ariaMobile: string;
    ariaFooterPages: string;
    ariaLanguage: string;
    ariaBreadcrumb: string;
    footerHeading: string;
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
    skipToContent: string;
    home: string;
  };
  cta: {
    estimate: string;
    estimateShort: string;
    call: string;
    callNow: string;
    callAria: (phone: string) => string;
    message: string;
    orByPhone: string;
    seeProjects: string;
    noObligation: string;
    privacyLink: string;
    openPage: string;
    detailsAndSteps: string;
    seeAllWorks: (count: number) => string;
  };
  meta: {
    homeTitle: string;
    homeDescription: string;
    heroImageAlt: string;
  };
  home: {
    servicesKicker: string;
    servicesTitle: string;
    servicesIntro: string;
    servicesOutro: string;
    flagshipChallenge: string;
    flagshipApproach: string;
    flagshipResult: string;
    precisionKicker: string;
    precisionTitle: string;
    precisionIntro: string;
    processKicker: string;
    processTitle: string;
    processIntro: string;
    portfolioKicker: string;
    portfolioTitle: string;
    portfolioIntro: string;
    before: string;
    after: string;
    beforeAfter: string;
    similarProject: string;
    reviewsKicker: string;
    reviewsTitle: string;
    reviewsIntro: string;
    faqKicker: string;
    faqTitle: string;
    costFactors: string;
    contactKicker: string;
    contactTitle: string;
    contactIntro: string;
    contactStep1: string;
    contactStep2: string;
    contactStep3: string;
    bandTitle: string;
    bandBody: string;
  };
  landing: {
    bandTitle: string;
    bandBody: string;
    scopeTitle: string;
    galleryKicker: string;
    galleryTitle: string;
    galleryIntro: string;
    stepsKicker: string;
    stepsTitle: string;
    stepsIntro: string;
    pitfallsKicker: string;
    pitfallsTitle: string;
    pitfallsIntro: string;
    costKicker: string;
    costTitle: string;
    costIntro: string;
    costNote: string;
    faqKicker: string;
    faqTitle: string;
    relatedKicker: string;
    relatedTitle: string;
    contactTitle: string;
    contactIntro: (topic: string) => string;
  };
  hub: {
    title: string;
    description: string;
    kicker: string;
    listTitle: string;
    listIntro: string;
    pageCount: (n: number) => string;
    bandTitle: string;
    bandBody: string;
    formNote: string;
    formNoteLink: string;
    groups: { bathroom: string; tiling: string; exterior: string; before: string };
    groupNotes: { bathroom: string; tiling: string; exterior: string; before: string };
  };
  form: {
    /** Outcome states. */
    successTitle: string;
    successBody: string;
    successBodyTail: string;
    reference: string;
    undeliveredTitle: string;
    undeliveredBody: string;
    undeliveredTail: string;
    rateLimitedTitle: string;
    rateLimitedBody: string;
    invalidBanner: string;
    /** Fields. */
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHint: string;
    serviceLabel: string;
    preferenceLabel: string;
    localityLabel: string;
    localityPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    /** Consent, split so the privacy link sits inside the sentence. */
    consentPrefix: string;
    consentLink: string;
    consentSuffix: string;
    /** Actions. */
    submit: string;
    submitting: string;
    footnote: string;
    requiredMark: string;
  };
  journey: {
    priceKicker: string;
    priceOnRequest: string;
    includes: string;
    finalNote: string;
  };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    kicker: string;
    title: string;
    lead: string;
    version: (v: string) => string;
    controllerTitle: string;
    controllerBody: (entity: string, form: string, brand: string) => string;
    contactBody: string;
    contactOr: string;
    collectTitle: string;
    collectLead: string;
    collectItems: string[];
    collectNote: string;
    whyTitle: string;
    whyBody: string;
    whyNoMarketing: string;
    sharedTitle: string;
    sharedLead: string;
    sharedItems: string[];
    sharedNote: string;
    cookiesTitle: string;
    cookiesBody: string;
    cookiesFuture: string;
    retentionTitle: string;
    retentionBody: string;
    rightsTitle: string;
    rightsBody: string;
    rightsAuthority: string;
    backToForm: string;
    bandTitle: string;
    bandBody: string;
  };
  notFound: {
    kicker: string;
    title: string;
    body: string;
    back: string;
  };
  comingSoon: {
    kicker: string;
    title: string;
    body: string;
    cta: string;
  };
}

const ro: UiDict = {
  nav: {
    services: "Servicii",
    projects: "Proiecte",
    process: "Proces",
    pricing: "Cum calculăm",
    caseStudy: "Studiu de caz",
    contact: "Contact",
    ariaPrimary: "Navigație principală",
    ariaMobile: "Navigație mobilă",
    ariaFooterPages: "Footer — pagini",
    ariaLanguage: "Limbă",
    ariaBreadcrumb: "Breadcrumb",
    footerHeading: "Navigare",
    menuOpen: "Deschide meniul",
    menuClose: "Închide meniul",
    menuLabel: "Meniu",
    skipToContent: "Sari la conținut",
    home: "Acasă",
  },
  cta: {
    estimate: "Cere o estimare",
    estimateShort: "Cere ofertă",
    call: "Sună",
    callNow: "Sună acum",
    callAria: (phone) => `Sună la ${phone}`,
    message: "Mesaj",
    orByPhone: "Sau direct la telefon",
    seeProjects: "Vezi proiectele",
    noObligation:
      "Fără obligații. Datele tale sunt folosite doar ca să îți răspundem — vezi",
    privacyLink: "politica de confidențialitate",
    openPage: "Deschide",
    detailsAndSteps: "Detalii și etape",
    seeAllWorks: (count) => `Vezi toate cele ${count} lucrări`,
  },
  meta: {
    homeTitle: "SemiDom — montaj gresie, faianță și renovări de baie în Chișinău",
    homeDescription:
      "Montaj de gresie și faianță și renovări complete de baie în Chișinău și împrejurimi. " +
      "Pregătirea suportului, hidroizolație, placare cu sistem de nivelare și finisaje curate — cu fotografii din lucrări reale.",
    heroImageAlt:
      "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45°.",
  },
  home: {
    servicesKicker: "Ce executăm",
    servicesTitle: "Servicii de montaj gresie, faianță și renovări de baie",
    servicesIntro:
      "Lucrăm pe câteva direcții clare, fiecare cu standardul ei de pregătire, montaj și verificare.",
    servicesOutro:
      "Fiecare lucrare are pagina ei, cu ordinea reală de execuție și greșelile de evitat.",
    flagshipChallenge: "Provocare",
    flagshipApproach: "Abordare",
    flagshipResult: "Rezultat",
    precisionKicker: "Standardul nostru",
    precisionTitle: "Precizia se vede în detalii",
    precisionIntro:
      "Diferența dintre o lucrare bună și una premium stă în pregătire, aliniere și racorduri.",
    processKicker: "Cum lucrăm",
    processTitle: "Un proces predictibil, de la cerere la garanție",
    processIntro: "Știi în fiecare etapă ce urmează, ce decizi și ce livrăm.",
    portfolioKicker: "Portofoliu",
    portfolioTitle: "Lucrări executate în Chișinău",
    portfolioIntro:
      "Proiecte fotografiate la fața locului — de la pregătire și hidroizolație până la finisaj.",
    before: "Înainte",
    after: "După",
    beforeAfter: "Înainte → După",
    similarProject: "Cere un proiect similar",
    reviewsKicker: "Recenzii",
    reviewsTitle: "Ce spun clienții",
    reviewsIntro:
      "Publicăm recenzii doar cu sursă și consimțământ — fără texte inventate.",
    faqKicker: "Întrebări frecvente",
    faqTitle: "Răspunsuri la ce ne întreabă clienții",
    costFactors: "Factori de cost",
    contactKicker: "Contact",
    contactTitle: "Spune-ne despre spațiul tău",
    contactIntro:
      "Scrie-ne ce ai de placat sau de renovat. Revenim cu pașii următori și cu ce ne trebuie ca să putem estima corect.",
    contactStep1: "Ne spui serviciul și, dacă poți, suprafața aproximativă.",
    contactStep2: "Te sunăm ca să clarificăm detaliile și starea suportului.",
    contactStep3: "Programăm o evaluare la fața locului atunci când este necesar.",
    bandTitle: "Ai o baie sau o suprafață de placat?",
    bandBody:
      "Sună și spune-ne în două fraze despre ce e vorba, sau completează formularul. Îți spunem ce implică și de ce informații mai avem nevoie.",
  },
  landing: {
    bandTitle: "Spune-ne ce ai de făcut",
    bandBody:
      "Un telefon de două minute sau câteva rânduri în formular sunt de ajuns ca să știm dacă și cum putem ajuta.",
    scopeTitle: "Ce include lucrarea",
    galleryKicker: "Din lucrări executate",
    galleryTitle: "Fotografii de la fața locului",
    galleryIntro:
      "Inclusiv etapele de proces — partea care spune ceva despre execuție, nu doar despre rezultat.",
    stepsKicker: "Cum executăm",
    stepsTitle: "Ordinea în care se face, și de ce contează",
    stepsIntro:
      "Fiecare etapă închide definitiv o decizie. De aceea ordinea nu este o preferință.",
    pitfallsKicker: "De evitat",
    pitfallsTitle: "Greșelile care se plătesc mai târziu",
    pitfallsIntro:
      "Toate se văd după ani, nu la predare. De aceea le scriem aici, unde le poți folosi și dacă lucrarea o face altcineva.",
    costKicker: "Ce influențează costul",
    costTitle: "Ce trebuie să știm ca să dăm un număr",
    costIntro:
      "Nu publicăm un preț pe metru pătrat, pentru că un preț dat fără să fi văzut lucrarea se schimbă la prima vizită. Mai jos este exact ce cântărește, în ordinea impactului.",
    costNote: "Estimarea nu este o ofertă contractuală (ADR-012).",
    faqKicker: "Întrebări frecvente",
    faqTitle: "Ce ne întreabă oamenii",
    relatedKicker: "Continuă",
    relatedTitle: "Lucrări legate de aceasta",
    contactTitle: "Cere o estimare",
    contactIntro: (topic) =>
      `Scrie-ne câteva rânduri despre lucrare — ${topic} sau orice altceva din aceeași zonă. Revenim cu pașii următori și cu ce ne trebuie ca să estimăm corect.`,
  },
  hub: {
    title: "Servicii de montaj și renovare",
    description:
      "Toate lucrările pe care le executăm, fiecare cu etapele reale de execuție, greșelile de evitat și fotografii de la fața locului.",
    kicker: "Ce executăm",
    listTitle: "Alege lucrarea care te interesează",
    listIntro:
      "Fiecare pagină descrie ordinea reală de execuție și ce se strică atunci când ordinea nu este respectată.",
    pageCount: (n) => `${n} pagini`,
    bandTitle: "Nu ești sigur în ce categorie intră lucrarea ta?",
    bandBody:
      "Sună și spune-ne în două fraze ce ai de făcut, sau trimite formularul de pe pagina principală. Îți spunem noi ce implică.",
    formNote: "Formularul complet, cu toate câmpurile, este pe",
    formNoteLink: "pagina principală",
    groups: {
      bathroom: "Baie",
      tiling: "Placare",
      exterior: "Exterior",
      before: "Înainte să ceri o ofertă",
    },
    groupNotes: {
      bathroom:
        "De la o placare simplă până la o renovare completă, coordonată de o singură echipă.",
      tiling: "Montajul propriu-zis, pe formatele și materialele cu care lucrăm.",
      exterior:
        "Suprafețe expuse la îngheț, unde sistemul de montaj contează mai mult decât placa.",
      before: "Ce trebuie să știi ca să compari corect două oferte, inclusiv pe a noastră.",
    },
  },
  form: {
    successTitle: "Cererea a plecat spre noi.",
    successBody: "Revenim cu un răspuns la numărul lăsat. Dacă vrei mai repede, sună direct la",
    successBodyTail: ".",
    reference: "Referință",
    undeliveredTitle: "Nu am putut trimite cererea.",
    undeliveredBody:
      "A fost o problemă tehnică la trimitere, iar cererea ta nu a ajuns la noi. Te rugăm sună la",
    undeliveredTail: "— răspundem direct.",
    rateLimitedTitle: "Prea multe trimiteri într-un timp scurt",
    rateLimitedBody:
      "Formularul limitează numărul de trimiteri, așa că ultima nu a fost procesată. Mai încearcă peste câteva minute sau sună direct la",
    invalidBanner: "Mai sunt câteva câmpuri de corectat mai jos.",
    nameLabel: "Nume",
    namePlaceholder: "Ion Popescu",
    phoneLabel: "Telefon",
    phonePlaceholder: "069 123 456",
    phoneHint: "Îl folosim doar ca să revenim cu un răspuns.",
    serviceLabel: "Ce ai de făcut",
    preferenceLabel: "Cum preferi să te contactăm",
    localityLabel: "Localitate",
    localityPlaceholder: "Chișinău, sect. Botanica",
    emailLabel: "E-mail",
    emailPlaceholder: "opțional",
    messageLabel: "Detalii",
    messagePlaceholder: "Suprafața aproximativă, starea încăperii, termenul dorit…",
    consentPrefix: "Am citit",
    consentLink: "politica de confidențialitate",
    consentSuffix:
      "și sunt de acord să fiu contactat în legătură cu această cerere. Datele nu sunt folosite în alt scop și nu sunt transmise mai departe.",
    submit: "Trimite cererea",
    submitting: "Se trimite…",
    footnote: "Preferi să vorbești direct? Sună la",
    requiredMark: "obligatoriu",
  },
  journey: {
    priceKicker: "Preț orientativ",
    priceOnRequest: "La cerere",
    includes: "Include",
    finalNote: "Evaluarea finală depinde de suprafață și condiții.",
  },
  privacy: {
    metaTitle: "Politica de confidențialitate",
    metaDescription:
      "Ce date colectăm prin formularul de contact, în ce scop, cine le procesează, ce cookie-uri folosim și cât timp le păstrăm.",
    kicker: "Date personale",
    title: "Politica de confidențialitate",
    lead: "Această pagină explică ce date primim prin formularul de pe site, de ce le folosim, cine le mai vede, ce cookie-uri folosim și cât timp le păstrăm.",
    version: (v) => `Versiunea ${v}.`,
    controllerTitle: "Cine prelucrează datele",
    controllerBody: (entity, form, brand) =>
      `Operatorul datelor este ${entity} (${form}), care activează sub denumirea comercială ${brand}, în Republica Moldova.`,
    contactBody: "Ne poți contacta la",
    contactOr: "sau la",
    collectTitle: "Ce date colectăm",
    collectLead: "Doar ce completezi tu în formular:",
    collectItems: [
      "numele tău",
      "numărul de telefon",
      "adresa de e-mail, dacă o completezi (este opțională)",
      "localitatea, dacă o completezi",
      "serviciul pe care îl cauți și metoda de contact preferată",
      "detaliile pe care le scrii despre lucrare",
    ],
    collectNote:
      "Nu îți cerem adresa exactă, buletinul sau date de plată. Serverul care găzduiește site-ul înregistrează, ca orice server web, adresa IP a cererii; noi o folosim doar ca să limităm trimiterile automate, într-o formă criptată ireversibil, și nu o stocăm alături de datele tale.",
    whyTitle: "De ce le folosim",
    whyBody:
      "Ca să răspundem la cererea ta: să te sunăm, să clarificăm lucrarea și să îți dăm un interval de preț. Temeiul este consimțământul tău, exprimat prin bifa din formular, împreună cu pregătirea unui eventual contract, la cererea ta. Îți poți retrage consimțământul oricând, sunându-ne sau scriindu-ne.",
    whyNoMarketing:
      "Nu trimitem newslettere, nu facem marketing, nu profilăm și nu vindem datele nimănui.",
    sharedTitle: "Cine le mai vede",
    sharedLead:
      "Cererea îți ajunge la noi pe e-mail. Pentru asta folosim doi furnizori, care procesează datele strict în numele nostru:",
    sharedItems: [
      "Resend — serviciul care livrează e-mailul cu cererea ta. Serverele sale sunt în afara Republicii Moldova, în Statele Unite.",
      "Vercel — găzduirea site-ului, care păstrează pe termen scurt jurnale tehnice ale cererilor (inclusiv adresa IP).",
    ],
    sharedNote:
      "În rest, datele nu ajung la nimeni altcineva. Nu le transmitem altor meșteri, furnizori de materiale sau agenții de publicitate.",
    cookiesTitle: "Cookie-uri și tehnologii similare",
    cookiesBody:
      "Site-ul nu folosește cookie-uri. Nu avem cookie-uri de urmărire, de publicitate sau de analiză, nu folosim pixeli de remarketing și nu încărcăm scripturi din alte domenii. De aceea nu vezi nicio fereastră de consimțământ pentru cookie-uri: nu am avea pentru ce să ți-o cerem.",
    cookiesFuture:
      "Formularul folosește doar memoria paginii pe durata completării, care dispare când închizi fila. Dacă vom adăuga vreodată statistici de trafic, îți vom cere întâi acordul printr-un banner și vom actualiza această pagină înainte de a porni ceva.",
    retentionTitle: "Cât timp le păstrăm",
    retentionBody:
      "Păstrăm cererea cât timp discutăm despre lucrare și, dacă lucrarea se face, pe durata garanției. Dacă nu ajungem la o colaborare, ștergem mesajul din cutia poștală în cel mult 12 luni.",
    rightsTitle: "Drepturile tale",
    rightsBody:
      "Poți cere oricând să afli ce date avem despre tine, să le corectăm sau să le ștergem, să îți retragi consimțământul și să te opui folosirii lor. Ne suni la",
    rightsAuthority:
      "Dacă nu ești mulțumit de răspuns, te poți adresa Centrului Național pentru Protecția Datelor cu Caracter Personal al Republicii Moldova.",
    backToForm: "Înapoi la formularul de contact",
    bandTitle: "Ai o întrebare despre datele tale?",
    bandBody:
      "Sună-ne și rezolvăm. Pentru o cerere de lucrare, formularul complet este pe pagina principală.",
  },
  notFound: {
    kicker: "Eroare 404",
    title: "Pagina asta nu există",
    body: "Linkul este greșit sau pagina a fost mutată. Mergi la pagina principală sau sună-ne direct.",
    back: "Mergi la pagina principală",
  },
  comingSoon: {
    kicker: "Русская версия",
    title: "Versiunea în limba rusă urmează",
    body: "Conținutul în limba rusă se publică doar după traduceri verificate. Între timp, vezi varianta în limba română.",
    cta: "Mergi la versiunea RO",
  },
};

const ru: UiDict = {
  nav: {
    services: "Услуги",
    projects: "Работы",
    process: "Как работаем",
    pricing: "Как считаем",
    caseStudy: "Разбор проекта",
    contact: "Контакты",
    ariaPrimary: "Основная навигация",
    ariaMobile: "Мобильная навигация",
    ariaFooterPages: "Подвал — страницы",
    ariaLanguage: "Язык",
    ariaBreadcrumb: "Хлебные крошки",
    footerHeading: "Навигация",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    menuLabel: "Меню",
    skipToContent: "Перейти к содержимому",
    home: "Главная",
  },
  cta: {
    estimate: "Получить оценку",
    estimateShort: "Оставить заявку",
    call: "Позвонить",
    callNow: "Позвонить",
    callAria: (phone) => `Позвонить по номеру ${phone}`,
    message: "Написать",
    orByPhone: "Или сразу по телефону",
    seeProjects: "Смотреть работы",
    noObligation:
      "Ни к чему не обязывает. Ваши данные нужны только для ответа — см.",
    privacyLink: "политику конфиденциальности",
    openPage: "Открыть",
    detailsAndSteps: "Этапы и детали",
    seeAllWorks: (count) => `Все ${count} видов работ`,
  },
  meta: {
    homeTitle: "SemiDom — укладка плитки и ремонт ванных комнат в Кишинёве",
    homeDescription:
      "Укладка напольной и настенной плитки и полный ремонт ванных комнат в Кишинёве и пригородах. " +
      "Подготовка основания, гидроизоляция, укладка с системой выравнивания и чистая отделка — с фотографиями реальных работ.",
    heroImageAlt:
      "Ванна в коробе, полностью облицованная плиткой под мрамор, с запилом углов под 45°.",
  },
  home: {
    servicesKicker: "Что мы делаем",
    servicesTitle: "Укладка плитки и ремонт ванных комнат",
    servicesIntro:
      "Работаем по нескольким чётким направлениям, у каждого свой стандарт подготовки, укладки и проверки.",
    servicesOutro:
      "У каждого вида работ есть своя страница: реальный порядок исполнения и ошибки, которых стоит избежать.",
    flagshipChallenge: "Задача",
    flagshipApproach: "Решение",
    flagshipResult: "Результат",
    precisionKicker: "Наш стандарт",
    precisionTitle: "Точность видна в деталях",
    precisionIntro:
      "Разница между хорошей работой и работой премиум-уровня — в подготовке, выравнивании и примыканиях.",
    processKicker: "Как мы работаем",
    processTitle: "Предсказуемый процесс: от заявки до гарантии",
    processIntro: "На каждом этапе вы знаете, что дальше, что решаете вы и что сдаём мы.",
    portfolioKicker: "Портфолио",
    portfolioTitle: "Работы, выполненные в Кишинёве",
    portfolioIntro:
      "Проекты сняты на объекте — от подготовки и гидроизоляции до финишной отделки.",
    before: "До",
    after: "После",
    beforeAfter: "До → После",
    similarProject: "Хочу так же",
    reviewsKicker: "Отзывы",
    reviewsTitle: "Что говорят клиенты",
    reviewsIntro:
      "Публикуем отзывы только с источником и согласием — ничего придуманного.",
    faqKicker: "Частые вопросы",
    faqTitle: "Ответы на то, о чём спрашивают чаще всего",
    costFactors: "Что влияет на цену",
    contactKicker: "Контакты",
    contactTitle: "Расскажите о своём объекте",
    contactIntro:
      "Напишите, что нужно облицевать или отремонтировать. Ответим, какие следующие шаги и какая информация нужна для точной оценки.",
    contactStep1: "Вы называете услугу и, если знаете, примерную площадь.",
    contactStep2: "Мы звоним, чтобы уточнить детали и состояние основания.",
    contactStep3: "При необходимости назначаем осмотр на объекте.",
    bandTitle: "Есть ванная или поверхность под облицовку?",
    bandBody:
      "Позвоните и опишите задачу в двух фразах или заполните форму. Скажем, что это значит по работам и какая информация нам ещё нужна.",
  },
  landing: {
    bandTitle: "Расскажите, что нужно сделать",
    bandBody:
      "Двух минут по телефону или нескольких строк в форме достаточно, чтобы понять, можем ли мы помочь и как именно.",
    scopeTitle: "Что входит в работу",
    galleryKicker: "Из выполненных работ",
    galleryTitle: "Фотографии с объекта",
    galleryIntro:
      "В том числе этапы процесса — именно они говорят об исполнении, а не только готовый кадр.",
    stepsKicker: "Как выполняем",
    stepsTitle: "В каком порядке это делается и почему порядок важен",
    stepsIntro:
      "Каждый этап окончательно закрывает одно решение. Поэтому порядок — не вопрос предпочтений.",
    pitfallsKicker: "Чего избегать",
    pitfallsTitle: "Ошибки, за которые платят потом",
    pitfallsIntro:
      "Все они проявляются через годы, а не при сдаче. Поэтому мы пишем о них здесь — они пригодятся, даже если работу делает кто-то другой.",
    costKicker: "Что влияет на стоимость",
    costTitle: "Что нам нужно знать, чтобы назвать цифру",
    costIntro:
      "Мы не публикуем цену за квадратный метр: цена, названная без осмотра, меняется на первом же выезде. Ниже — что именно влияет на стоимость, в порядке значимости.",
    costNote: "Оценка не является публичной офертой (ADR-012).",
    faqKicker: "Частые вопросы",
    faqTitle: "О чём нас спрашивают",
    relatedKicker: "Дальше",
    relatedTitle: "Смежные работы",
    contactTitle: "Получить оценку",
    contactIntro: (topic) =>
      `Напишите пару строк о работе — ${topic} или что-то близкое. Ответим, какие следующие шаги и что нужно для точной оценки.`,
  },
  hub: {
    title: "Услуги по укладке и ремонту",
    description:
      "Все работы, которые мы выполняем: реальные этапы исполнения, ошибки, которых стоит избежать, и фотографии с объекта.",
    kicker: "Что мы делаем",
    listTitle: "Выберите работу, которая вас интересует",
    listIntro:
      "На каждой странице — реальный порядок исполнения и что ломается, когда этот порядок нарушают.",
    pageCount: (n) => `${n} страниц`,
    bandTitle: "Не уверены, к какой категории относится ваша задача?",
    bandBody:
      "Позвоните и опишите её в двух фразах или отправьте форму с главной страницы. Мы скажем, что это за работа.",
    formNote: "Полная форма со всеми полями — на",
    formNoteLink: "главной странице",
    groups: {
      bathroom: "Ванная",
      tiling: "Облицовка",
      exterior: "Наружные работы",
      before: "Перед тем как просить смету",
    },
    groupNotes: {
      bathroom:
        "От простой облицовки до полного ремонта, который ведёт одна бригада.",
      tiling: "Сама укладка — по форматам и материалам, с которыми мы работаем.",
      exterior:
        "Поверхности под морозом, где система монтажа важнее самой плитки.",
      before: "Что нужно знать, чтобы корректно сравнить две сметы, включая нашу.",
    },
  },
  form: {
    successTitle: "Заявка ушла к нам.",
    successBody:
      "Перезвоним на указанный номер. Если нужно быстрее — звоните напрямую:",
    successBodyTail: ".",
    reference: "Номер обращения",
    undeliveredTitle: "Не удалось отправить заявку.",
    undeliveredBody:
      "Произошла техническая ошибка при отправке, и ваша заявка до нас не дошла. Пожалуйста, позвоните:",
    undeliveredTail: "— ответим сразу.",
    rateLimitedTitle: "Слишком много отправок за короткое время",
    rateLimitedBody:
      "Форма ограничивает число отправок, поэтому последняя не была обработана. Попробуйте через несколько минут или позвоните напрямую:",
    invalidBanner: "Ниже осталось несколько полей, которые нужно поправить.",
    nameLabel: "Имя",
    namePlaceholder: "Иван Попеску",
    phoneLabel: "Телефон",
    phonePlaceholder: "069 123 456",
    phoneHint: "Нужен только для того, чтобы перезвонить с ответом.",
    serviceLabel: "Что нужно сделать",
    preferenceLabel: "Как удобнее связаться",
    localityLabel: "Населённый пункт",
    localityPlaceholder: "Кишинёв, сектор Ботаника",
    emailLabel: "E-mail",
    emailPlaceholder: "необязательно",
    messageLabel: "Подробности",
    messagePlaceholder: "Примерная площадь, состояние помещения, желаемые сроки…",
    consentPrefix: "Я прочитал(а)",
    consentLink: "политику конфиденциальности",
    consentSuffix:
      "и согласен(на) на то, чтобы со мной связались по этой заявке. Данные не используются для других целей и не передаются третьим лицам.",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    footnote: "Удобнее поговорить сразу? Звоните:",
    requiredMark: "обязательно",
  },
  journey: {
    priceKicker: "Ориентировочная цена",
    priceOnRequest: "По запросу",
    includes: "Входит",
    finalNote: "Окончательная оценка зависит от площади и условий.",
  },
  privacy: {
    metaTitle: "Политика конфиденциальности",
    metaDescription:
      "Какие данные мы получаем через форму на сайте, зачем, кто их обрабатывает, какие используются cookie и сколько мы их храним.",
    kicker: "Персональные данные",
    title: "Политика конфиденциальности",
    lead: "На этой странице объясняется, какие данные мы получаем через форму на сайте, зачем они нужны, кто ещё их видит, какие cookie мы используем и сколько времени их храним.",
    version: (v) => `Версия ${v}.`,
    controllerTitle: "Кто обрабатывает данные",
    controllerBody: (entity, form, brand) =>
      `Оператор данных — ${entity} (${form}), работающий под коммерческим названием ${brand}, в Республике Молдова.`,
    contactBody: "Связаться с нами можно по телефону",
    contactOr: "или по адресу",
    collectTitle: "Какие данные мы собираем",
    collectLead: "Только то, что вы сами заполняете в форме:",
    collectItems: [
      "ваше имя",
      "номер телефона",
      "адрес e-mail, если вы его укажете (поле необязательное)",
      "населённый пункт, если вы его укажете",
      "услугу, которая вас интересует, и предпочтительный способ связи",
      "подробности о работе, которые вы напишете",
    ],
    collectNote:
      "Мы не запрашиваем точный адрес, паспортные или платёжные данные. Сервер, на котором работает сайт, как и любой веб-сервер, фиксирует IP-адрес запроса; мы используем его только для ограничения автоматических отправок, в необратимо зашифрованном виде, и не храним рядом с вашими данными.",
    whyTitle: "Зачем они нужны",
    whyBody:
      "Чтобы ответить на вашу заявку: позвонить, уточнить объём работ и назвать диапазон стоимости. Основание — ваше согласие, выраженное галочкой в форме, вместе с подготовкой возможного договора по вашему запросу. Согласие можно отозвать в любой момент, позвонив или написав нам.",
    whyNoMarketing:
      "Мы не рассылаем новости, не занимаемся маркетингом, не строим профили и никому не продаём данные.",
    sharedTitle: "Кто ещё их видит",
    sharedLead:
      "Заявка приходит к нам по электронной почте. Для этого мы используем двух поставщиков услуг, которые обрабатывают данные строго от нашего имени:",
    sharedItems: [
      "Resend — сервис, который доставляет письмо с вашей заявкой. Его серверы находятся за пределами Республики Молдова, в Соединённых Штатах.",
      "Vercel — хостинг сайта, который недолго хранит технические журналы запросов (включая IP-адрес).",
    ],
    sharedNote:
      "Больше данные не попадают ни к кому. Мы не передаём их другим мастерам, поставщикам материалов или рекламным агентствам.",
    cookiesTitle: "Cookie и схожие технологии",
    cookiesBody:
      "Сайт не использует cookie. У нас нет ни отслеживающих, ни рекламных, ни аналитических cookie, мы не используем пиксели ремаркетинга и не загружаем скрипты с других доменов. Поэтому вы и не видите окна согласия на cookie: нам просто не о чем вас спрашивать.",
    cookiesFuture:
      "Форма использует только память страницы на время заполнения, и она исчезает, когда вы закрываете вкладку. Если мы когда-нибудь добавим статистику посещений, мы сначала спросим вашего согласия через баннер и обновим эту страницу, прежде чем что-то запускать.",
    retentionTitle: "Сколько мы их храним",
    retentionBody:
      "Мы храним заявку, пока обсуждаем работу, и, если работа выполняется, в течение гарантийного срока. Если сотрудничество не состоится, мы удаляем письмо из почтового ящика не позднее чем через 12 месяцев.",
    rightsTitle: "Ваши права",
    rightsBody:
      "Вы можете в любой момент узнать, какие данные о вас у нас есть, потребовать их исправления или удаления, отозвать согласие и возразить против их использования. Позвоните нам по номеру",
    rightsAuthority:
      "Если ответ вас не устроит, вы можете обратиться в Национальный центр по защите персональных данных Республики Молдова.",
    backToForm: "Вернуться к форме обратной связи",
    bandTitle: "Есть вопрос о ваших данных?",
    bandBody:
      "Позвоните — разберёмся. Для заявки на работу полная форма находится на главной странице.",
  },
  notFound: {
    kicker: "Ошибка 404",
    title: "Такой страницы нет",
    body: "Ссылка неверная или страница была перемещена. Перейдите на главную или позвоните нам.",
    back: "На главную",
  },
  comingSoon: {
    // Never rendered once RU is published; kept so the type stays total.
    kicker: "Русская версия",
    title: "Русская версия готовится",
    body: "Пока доступна версия на румынском языке.",
    cta: "Открыть версию на румынском",
  },
};

const dictionaries: Record<Locale, UiDict> = { ro, ru };

/** The chrome dictionary for a locale. Total by construction — no fallback. */
export function ui(locale: Locale): UiDict {
  return dictionaries[locale];
}
