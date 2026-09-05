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
