/**
 * SOURCE OF TRUTH for owner-supplied real project media.
 *
 * Every entry maps ONE original file delivered by the owner
 * (docs/poze/poze reale/*.jpg, docs/poze/poza*.jpg) to ONE published asset
 * under public/images/proiecte/<project>/<file>.
 *
 * Rules honored (CLAUDE.md + docs/specs/16-MEDIA-VERCEL-BLOB.md):
 * - no invented locality, surface, duration or client name lives here;
 *   only what is VISIBLE in the frame is described.
 * - alt text describes the frame, in Romanian, without marketing claims.
 * - originals carry no EXIF/GPS (verified with scripts/_meta-probe.js).
 * - `focal` is the CSS object-position used for art direction when a tall
 *   9:20 phone frame is cropped into a 3:4 / 16:10 slot.
 *
 * Stage vocabulary: "inainte" | "proces" | "dupa".
 */

/** @typedef {"inainte"|"proces"|"dupa"} Stage */

export const SRC_NEW = "docs/poze/poze reale";
export const SRC_OLD = "docs/poze";
export const OUT_DIR = "public/images/proiecte";

/**
 * Projects, ordered by editorial strength.
 * `slug` becomes the directory name and the future case-study route segment.
 */
export const projects = [
  {
    slug: "baie-marmura-gri",
    title: "Renovare completă de baie — aspect marmură gri",
    // CONFIRM_OWNER: locality, surface, duration, client consent for a public case study.
    source: "new",
    photos: [
      { src: "2.jpg",  file: "01-inainte-demolare.jpg",              stage: "inainte", focal: "50% 40%",
        alt: "Baie de bloc în demolare: faianța veche desprinsă, moloz pe pardoseală și sac de resturi lângă bateria demontată." },
      { src: "11.jpg", file: "02-inainte-coloana-instalatii.jpg",     stage: "inainte", focal: "50% 45%",
        alt: "Baie golită la roșu, cu o coloană nouă din gips-carton verde ridicată peste traseele de instalații." },
      { src: "12.jpg", file: "03-inainte-suport-pregatit.jpg",        stage: "inainte", focal: "50% 45%",
        alt: "Pereți de baie curățați până la suport, cu urme de adeziv pieptănat și zone de mortar reparate înainte de placare." },
      { src: "5.jpg",  file: "04-proces-nisa-tehnica.jpg",            stage: "proces",  focal: "50% 35%",
        alt: "Nișă tehnică lăsată deschisă pentru apometru și tubulatura de ventilație, cu poliță placată și fixată cu bandă." },
      { src: "13.jpg", file: "05-proces-primele-randuri.jpg",         stage: "proces",  focal: "50% 50%",
        alt: "Primele plăci de format mare montate pe peretele băii, poziționate cu clipsuri de nivelare." },
      { src: "3.jpg",  file: "06-proces-placare-cu-nivelare.jpg",     stage: "proces",  focal: "50% 50%",
        alt: "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare." },
      { src: "10.jpg", file: "07-proces-rosturi-si-polita.jpg",       stage: "proces",  focal: "50% 50%",
        alt: "Detaliu de execuție: rost continuu între plăci, poliță placată și nișă de vizitare pentru apometru." },
      { src: "6.jpg",  file: "08-dupa-cabina-dus.jpg",                stage: "dupa",    focal: "50% 45%",
        alt: "Baie finalizată, cu cabină de duș semirotundă cu profile negre și pereți placați cu plăci aspect marmură gri." },
      { src: "8.jpg",  file: "09-dupa-ansamblu.jpg",                  stage: "dupa",    focal: "50% 50%",
        alt: "Vedere de ansamblu a băii finalizate: cabină de duș, lavoar cu mobilier alb și oglindă cu iluminare." },
      { src: "7.jpg",  file: "10-dupa-lavoar-si-oglinda.jpg",         stage: "dupa",    focal: "50% 45%",
        alt: "Zona de lavoar finalizată, cu oglindă iluminată, poliță placată și baterie neagră." },
      { src: "9.jpg",  file: "11-dupa-lavoar-si-cabina.jpg",          stage: "dupa",    focal: "50% 50%",
        alt: "Baie finalizată văzută dinspre ușă: cabină de duș cu geam decorat și mobilier de lavoar alb." },
      { src: "4.jpg",  file: "12-dupa-wc-si-boiler.jpg",              stage: "dupa",    focal: "50% 50%",
        alt: "Baie finalizată cu vas de toaletă, boiler electric montat pe perete și cabină de duș semirotundă." },
    ],
  },
  {
    slug: "baie-cada-placata",
    title: "Cadă placată în porțelan, cu muchii tăiate la 45°",
    source: "new",
    photos: [
      { src: "20.jpg", file: "01-cada-placata-ansamblu.jpg",          stage: "dupa",    focal: "50% 55%",
        alt: "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete." },
      { src: "16.jpg", file: "02-cada-placata-detaliu-muchii.jpg",    stage: "dupa",    focal: "50% 60%",
        alt: "Detaliu al căzii placate: muchie exterioară tăiată la 45°, fără profil metalic, și racord curat la peretele placat." },
      { src: "19.jpg", file: "03-nisa-wc-suspendat.jpg",              stage: "dupa",    focal: "50% 50%",
        alt: "Nișă placată pentru rezervor încastrat de WC suspendat, cu poliță din plăci și colțuri tăiate la 45°." },
    ],
  },
  {
    slug: "baie-marmura-alba",
    title: "Baie cu marmură albă și accent negru",
    source: "new",
    photos: [
      { src: "21.jpg", file: "01-inainte-structura-bruta.jpg",        stage: "inainte", focal: "50% 50%",
        alt: "Încăpere la structură brută: pereți din blocuri, planșeu de beton și materiale depozitate pe pardoseală." },
      { src: "23.jpg", file: "02-inainte-demolare-si-goluri.jpg",     stage: "inainte", focal: "50% 45%",
        alt: "Etapa de demolare: gol nou tăiat în perete între camera finisată și viitoarea baie la roșu." },
      { src: "22.jpg", file: "03-proces-hidroizolatie-si-incalzire.jpg", stage: "proces", focal: "50% 55%",
        alt: "Hidroizolație aplicată pe pardoseală și pereți, cu cablu de încălzire în pardoseală montat pe plasă și rigolă liniară." },
      { src: "25.jpg", file: "04-proces-rigola-si-pante.jpg",         stage: "proces",  focal: "50% 55%",
        alt: "Zonă umedă pregătită: hidroizolație continuă pe pardoseală și pe partea de jos a pereților, cu rigolă liniară montată la pantă." },
      { src: "24.jpg", file: "05-proces-cablu-incalzire.jpg",         stage: "proces",  focal: "50% 55%",
        alt: "Cablu de încălzire în pardoseală fixat pe plasă peste hidroizolație, înainte de turnarea șapei." },
      { src: "26.jpg", file: "06-dupa-zona-dus.jpg",                  stage: "dupa",    focal: "50% 50%",
        alt: "Baie finalizată în plăci albe aspect marmură, lucioase, cu zonă de duș fără prag și coloană pentru rezervor încastrat." },
      { src: "28.jpg", file: "07-dupa-ansamblu.jpg",                  stage: "dupa",    focal: "50% 50%",
        alt: "Vedere de ansamblu a băii placate cu porțelan alb aspect marmură, cu rigolă liniară în pardoseală." },
      { src: "27.jpg", file: "08-dupa-accent-marmura-neagra.jpg",     stage: "dupa",    focal: "50% 45%",
        alt: "Perete de accent din plăci aspect marmură neagră, în contrast cu placarea albă și rigola liniară din pardoseală." },
      { src: "29.jpg", file: "09-dupa-racord-la-tocul-usii.jpg",      stage: "dupa",    focal: "50% 45%",
        alt: "Racord curat între placarea albă aspect marmură și tocul ușii, cu perete de accent negru în plan secund." },
    ],
  },
  {
    slug: "baie-wc-suspendat",
    title: "Baie compactă cu WC suspendat, aspect beton",
    source: "new",
    photos: [
      { src: "17.jpg", file: "01-dupa-wc-suspendat.jpg",              stage: "dupa",    focal: "50% 50%",
        alt: "Baie compactă finalizată, cu plăci de format mare aspect beton, WC suspendat cu clapetă încastrată și nișă-poliță." },
    ],
  },
  {
    slug: "compartimentari-si-cuva-dus",
    title: "Compartimentări din BCA și cuvă de duș zidită",
    source: "new",
    photos: [
      { src: "14.jpg", file: "01-proces-cuva-dus-zidita.jpg",         stage: "proces",  focal: "50% 50%",
        alt: "Cuvă de duș zidită din blocuri BCA în jurul unei rigole liniare deja montate, pe șapă proaspătă." },
      { src: "15.jpg", file: "02-proces-compartimentare.jpg",         stage: "proces",  focal: "50% 45%",
        alt: "Compartimentare nouă din blocuri BCA, cu gol de ușă executat, într-un apartament la gri." },
      { src: "18.jpg", file: "03-proces-compartimentare-si-instalatii.jpg", stage: "proces", focal: "50% 45%",
        alt: "Pereți de compartimentare din BCA cu două goluri de ușă și lavoar provizoriu de șantier racordat alături." },
    ],
  },

  // ── Excepție aprobată de proprietar (D-008, 2026-08-19). ─────────────────────
  // Setul nou este 100% băi. Aceste două cadre sunt singura dovadă reală pentru
  // placări exterioare și rămân publicate DOAR pentru serviciul și categoria
  // "Exterior". Restul materialului vechi a fost retras din site.
  {
    slug: "fatada-si-scara-exterioara",
    title: "Fațadă ventilată și scară exterioară",
    source: "old",
    photos: [
      { src: "poza1.jpg", file: "01-fatada-si-scara.jpg",             stage: "dupa",    focal: "50% 50%",
        alt: "Fațadă și scară exterioară placate cu plăci porțelanate de format mare, cu trepte și contratrepte aliniate." },
      { src: "poza2.jpg", file: "02-proces-trepte-si-terasa.jpg",     stage: "proces",  focal: "50% 50%",
        alt: "Scară exterioară în curs de placare, cu plăci poziționate pe terasă și clipsuri de nivelare." },
    ],
  },
];

/**
 * Owner-supplied walkthrough clip (docs/poze/poze reale/1.MP4).
 * Source: 480x848, 31.7s, 30fps, H.264 + AAC, carries a `creation_time` and
 * Core Media handler strings — all stripped on export (spec 29 §16 MUST 5).
 * Only the last third is used: it pans down onto the tiled shower tray.
 */
export const walkthrough = {
  src: "1.MP4",
  startSeconds: 24,
  durationSeconds: 7.5,
  posterAtSeconds: 7.2, // relative to the trimmed clip
  outDir: "public/media/tur",
  mp4: "tur-baie-finisata.mp4",
  poster: "tur-baie-finisata-poster.webp",
  alt: "Tur filmat printr-o baie finalizată: pereți placați cu plăci aspect travertin și cuvă de duș zidită și placată, cu rigolă liniară.",
};

/**
 * Hero stills (spec 29). No video: the owner's only clip is 480 px wide, which
 * cannot fill a full-window desktop stage — see docs/work/DECISIONS.md D-006.
 * Both breakpoints use the same project so the art direction stays coherent.
 */
export const heroStills = {
  outDir: "public/media/hero",
  source: `${OUT_DIR}/baie-cada-placata/01-cada-placata-ansamblu.jpg`, // 960x1280
  // Each variant emits AVIF and WebP. AVIF is listed first in the <picture>, so
  // a browser that supports it never downloads the WebP. The hero is the LCP
  // element and the only image on the critical path.
  desktop: { base: "hero-cada-placata-desktop", width: 1600, height: 900, focalY: 0.55 },
  mobile: { base: "hero-cada-placata-mobile", width: 720, height: 1280, focalY: 0.5 },
  alt: "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45°.",
};

export const allPhotos = projects.flatMap((p) =>
  p.photos.map((ph) => ({
    ...ph,
    project: p.slug,
    projectTitle: p.title,
    srcDir: p.source === "new" ? SRC_NEW : SRC_OLD,
    out: `${OUT_DIR}/${p.slug}/${ph.file}`,
    url: `/images/proiecte/${p.slug}/${ph.file}`,
  })),
);
