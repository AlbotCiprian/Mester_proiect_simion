/**
 * The 30 published owner photographs, keyed, with the alt text from
 * `scripts/media-catalog.mjs`.
 *
 * One registry so a caption cannot drift from the frame it describes: the
 * landing pages reference a key, never a path plus a hand-typed alt. If a photo
 * is ever republished under a different name, this file is the only edit.
 */

export interface Photo {
  src: string;
  alt: string;
  /** CSS object-position. The sources are 576x1280 portraits; centre-cropping
   *  a 4:3 or 16:9 slot out of one loses the subject without this. */
  focal?: string;
}

const P = "/images/proiecte";

export const photos = {
  /* --- Baie marmura gri: renovare completa de apartament, 12 cadre --- */
  griInainte: {
    src: `${P}/baie-marmura-gri/01-inainte-demolare.jpg`,
    alt: "Baie de bloc în demolare: faianța veche desprinsă, moloz pe pardoseală și sac de resturi lângă bateria demontată.",
    focal: "50% 40%",
  },
  griColoana: {
    src: `${P}/baie-marmura-gri/02-inainte-coloana-instalatii.jpg`,
    alt: "Baie golită la roșu, cu o coloană nouă din gips-carton verde ridicată peste traseele de instalații.",
  },
  griSuport: {
    src: `${P}/baie-marmura-gri/03-inainte-suport-pregatit.jpg`,
    alt: "Pereți de baie curățați până la suport, cu urme de adeziv pieptănat și zone de mortar reparate înainte de placare.",
  },
  griNisa: {
    src: `${P}/baie-marmura-gri/04-proces-nisa-tehnica.jpg`,
    alt: "Nișă tehnică lăsată deschisă pentru apometru și tubulatura de ventilație, cu poliță placată și fixată cu bandă.",
    focal: "50% 35%",
  },
  griPrimeleRanduri: {
    src: `${P}/baie-marmura-gri/05-proces-primele-randuri.jpg`,
    alt: "Primele plăci de format mare montate pe peretele băii, poziționate cu clipsuri de nivelare.",
  },
  griNivelare: {
    src: `${P}/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg`,
    alt: "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
  },
  griRosturi: {
    src: `${P}/baie-marmura-gri/07-proces-rosturi-si-polita.jpg`,
    alt: "Detaliu de execuție: rost continuu între plăci, poliță placată și nișă de vizitare pentru apometru.",
  },
  griCabina: {
    src: `${P}/baie-marmura-gri/08-dupa-cabina-dus.jpg`,
    alt: "Baie finalizată, cu cabină de duș semirotundă cu profile negre și pereți placați cu plăci aspect marmură gri.",
    focal: "50% 45%",
  },
  griAnsamblu: {
    src: `${P}/baie-marmura-gri/09-dupa-ansamblu.jpg`,
    alt: "Vedere de ansamblu a băii finalizate: cabină de duș, lavoar cu mobilier alb și oglindă cu iluminare.",
  },
  griLavoar: {
    src: `${P}/baie-marmura-gri/10-dupa-lavoar-si-oglinda.jpg`,
    alt: "Zona de lavoar finalizată, cu oglindă iluminată, poliță placată și baterie neagră.",
  },
  griLavoarCabina: {
    src: `${P}/baie-marmura-gri/11-dupa-lavoar-si-cabina.jpg`,
    alt: "Baie finalizată văzută dinspre ușă: cabină de duș cu geam decorat și mobilier de lavoar alb.",
  },
  griWcBoiler: {
    src: `${P}/baie-marmura-gri/12-dupa-wc-si-boiler.jpg`,
    alt: "Baie finalizată cu vas de toaletă, boiler electric montat pe perete și cabină de duș semirotundă.",
  },

  /* --- Cada zidita si placata, 3 cadre --- */
  cadaAnsamblu: {
    src: `${P}/baie-cada-placata/01-cada-placata-ansamblu.jpg`,
    alt: "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
    focal: "50% 55%",
  },
  cadaMuchii: {
    src: `${P}/baie-cada-placata/02-cada-placata-detaliu-muchii.jpg`,
    alt: "Detaliu al căzii placate: muchie exterioară tăiată la 45°, fără profil metalic, și racord curat la peretele placat.",
    focal: "50% 55%",
  },
  cadaNisaWc: {
    src: `${P}/baie-cada-placata/03-nisa-wc-suspendat.jpg`,
    alt: "Nișă placată pentru rezervor încastrat de WC suspendat, cu poliță din plăci și colțuri tăiate la 45°.",
  },

  /* --- Baie marmura alba: de la structura bruta la finisaj, 9 cadre --- */
  albaBruta: {
    src: `${P}/baie-marmura-alba/01-inainte-structura-bruta.jpg`,
    alt: "Încăpere la structură brută: pereți din blocuri, planșeu de beton și materiale depozitate pe pardoseală.",
  },
  albaDemolare: {
    src: `${P}/baie-marmura-alba/02-inainte-demolare-si-goluri.jpg`,
    alt: "Etapa de demolare: gol nou tăiat în perete între camera finisată și viitoarea baie la roșu.",
  },
  albaHidro: {
    src: `${P}/baie-marmura-alba/03-proces-hidroizolatie-si-incalzire.jpg`,
    alt: "Hidroizolație aplicată pe pardoseală și pereți, cu cablu de încălzire în pardoseală montat pe plasă și rigolă liniară.",
    focal: "50% 55%",
  },
  albaRigola: {
    src: `${P}/baie-marmura-alba/04-proces-rigola-si-pante.jpg`,
    alt: "Zonă umedă pregătită: hidroizolație continuă pe pardoseală și pe partea de jos a pereților, cu rigolă liniară montată la pantă.",
  },
  albaCablu: {
    src: `${P}/baie-marmura-alba/05-proces-cablu-incalzire.jpg`,
    alt: "Cablu de încălzire în pardoseală fixat pe plasă peste hidroizolație, înainte de turnarea șapei.",
  },
  albaDus: {
    src: `${P}/baie-marmura-alba/06-dupa-zona-dus.jpg`,
    alt: "Baie finalizată în plăci albe aspect marmură, lucioase, cu zonă de duș fără prag și coloană pentru rezervor încastrat.",
  },
  albaAnsamblu: {
    src: `${P}/baie-marmura-alba/07-dupa-ansamblu.jpg`,
    alt: "Vedere de ansamblu a băii placate cu porțelan alb aspect marmură, cu rigolă liniară în pardoseală.",
  },
  albaAccentNegru: {
    src: `${P}/baie-marmura-alba/08-dupa-accent-marmura-neagra.jpg`,
    alt: "Perete de accent din plăci aspect marmură neagră, în contrast cu placarea albă și rigola liniară din pardoseală.",
    focal: "50% 45%",
  },
  albaToc: {
    src: `${P}/baie-marmura-alba/09-dupa-racord-la-tocul-usii.jpg`,
    alt: "Racord curat între placarea albă aspect marmură și tocul ușii, cu perete de accent negru în plan secund.",
  },

  /* --- Baie compacta cu WC suspendat --- */
  wcSuspendat: {
    src: `${P}/baie-wc-suspendat/01-dupa-wc-suspendat.jpg`,
    alt: "Baie compactă finalizată, cu plăci de format mare aspect beton, WC suspendat cu clapetă încastrată și nișă-poliță.",
    focal: "50% 45%",
  },

  /* --- Compartimentari si cuva de dus zidita --- */
  cuvaDus: {
    src: `${P}/compartimentari-si-cuva-dus/01-proces-cuva-dus-zidita.jpg`,
    alt: "Cuvă de duș zidită din blocuri BCA în jurul unei rigole liniare deja montate, pe șapă proaspătă.",
  },
  compartimentare: {
    src: `${P}/compartimentari-si-cuva-dus/02-proces-compartimentare.jpg`,
    alt: "Compartimentare nouă din blocuri BCA, cu gol de ușă executat, într-un apartament la gri.",
  },
  compartimentareInstalatii: {
    src: `${P}/compartimentari-si-cuva-dus/03-proces-compartimentare-si-instalatii.jpg`,
    alt: "Pereți de compartimentare din BCA cu două goluri de ușă și lavoar provizoriu de șantier racordat alături.",
  },

  /* --- Exterior --- */
  fatadaScara: {
    src: `${P}/fatada-si-scara-exterioara/01-fatada-si-scara.jpg`,
    alt: "Fațadă și scară exterioară placate cu plăci porțelanate de format mare, cu trepte și contratrepte aliniate.",
  },
  trepteTerasa: {
    src: `${P}/fatada-si-scara-exterioara/02-proces-trepte-si-terasa.jpg`,
    alt: "Scară exterioară în curs de placare, cu plăci poziționate pe terasă și clipsuri de nivelare.",
  },
} as const;

export type PhotoKey = keyof typeof photos;

/**
 * Accessor rather than direct indexing.
 *
 * `as const` is what makes PhotoKey a union of the real keys, but it also makes
 * every entry its own literal type — and an entry with no `focal` then has no
 * `focal` property at all, so `photos[key].focal` fails to compile. Widening
 * here, once, keeps both the key safety and a usable value type.
 */
export function photo(key: PhotoKey): Photo {
  return photos[key];
}
