# Media Architecture — Vercel Blob

## Scope

- imagini proiecte;
- before/after;
- imagini servicii și articole;
- video scurt aprobat;
- atașamente lead private/controlate;
- logo, OG și documente publice.

## Public vs private

- media de portofoliu publicată: publică/cacheabilă;
- lead attachments: private sau acces cu URL semnat/controlat;
- draft media: nu trebuie indexată și nu apare în feed-uri publice;
- documente interne: nu se folosesc în același namespace public.

## Naming convention

```text
public/projects/{projectId}/{assetId}-{variant}.{ext}
public/services/{serviceId}/{assetId}.{ext}
public/articles/{articleId}/{assetId}.{ext}
private/leads/{leadId}/{assetId}.{ext}
private/drafts/{entity}/{entityId}/{assetId}.{ext}
```

Nu se bazează autorizarea pe obscuritatea pathname-ului.

## Metadata în PostgreSQL

- provider/key/pathname;
- mime real;
- size și dimensions;
- checksum;
- visibility;
- alt text/caption per locale;
- focal point;
- consent state;
- uploadedBy și timestamps;
- usage/reference count;
- lifecycle state.

## Upload flow

1. utilizatorul cere token/upload intent;
2. serverul validează tip, limită, context și permisiune;
3. upload direct către Blob;
4. serverul verifică rezultatul și creează `MediaAsset`;
5. entitatea referențiază asset-ul;
6. job/cron curăță upload-urile orfane.

## Image pipeline

- originalul este păstrat doar dacă este justificat;
- output WebP/AVIF și responsive sizes prin pipeline Next/image sau proces controlat;
- dimensiuni explicite pentru prevenirea CLS;
- LCP image are prioritate și poster optimizat;
- restul lazy-loaded;
- GIF/video greu este evitat pentru motion decorativ.

## Security

- allowlist MIME/extensions;
- magic-byte validation;
- limite per fișier și total;
- numele original nu controlează pathname-ul;
- strip EXIF/GPS pentru public;
- acces privat verificat server-side;
- SVG upload blocat sau sanitizat strict;
- documentele pot necesita scanare malware înainte de utilizare.

## Lifecycle

- draft orphan → cleanup după grace period;
- published asset → ștergere blocată dacă este referențiat;
- replacement → vechiul asset rămâne până la confirmarea revalidării;
- lead attachment → retenție conform lead policy;
- backup strategy documentată separat de Blob lifecycle.

## Cost control

- limite media în admin;
- compresie și rezoluție maxime rezonabile;
- usage dashboard;
- avertizare pentru video;
- provider adapter pentru migrare viitoare dacă usage/cost justifică.

## Acceptance criteria

- upload direct și progresiv;
- niciun attachment privat nu are URL public permanent neprotejat;
- orphan cleanup funcționează;
- alt text și consent sunt obligatorii la publish;
- ștergerea nu rupe proiecte publice.
