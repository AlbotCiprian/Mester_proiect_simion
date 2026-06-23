# CRM Lead Pipeline

## Pipeline recomandat

1. Nou
2. De contactat
3. Contactat
4. Evaluare programată
5. Evaluat
6. Ofertă transmisă
7. Negociere
8. Acceptat
9. În lucru
10. Finalizat
11. Pierdut
12. Spam

## Reguli de status

- status change creează istoric cu actor și timestamp;
- `Pierdut` necesită motiv;
- `Spam` exclude lead-ul din KPI comercial, dar păstrează audit minim;
- `Finalizat` poate declanșa workflow de recenzie și proiect publicabil;
- nu se șterg lead-uri doar pentru a „curăța” dashboard-ul.

## SLA

Valori `CONFIRM_OWNER`:

- lead nou în program: contact în maximum X minute/ore;
- lead în afara programului: până la ora Y în următoarea zi lucrătoare;
- follow-up după ofertă: interval X zile.

Dashboard-ul evidențiază SLA, dar nu trimite automat mesaje agresive.

## Lead scoring orientativ

Scorul ajută prioritizarea, nu respinge automat:

- zonă deservită;
- serviciu prioritar;
- imagini atașate;
- suprafață/timeline complet;
- buget sau complexitate;
- sursă referral/partener;
- urgență.

Scorul și motivele trebuie vizibile administratorului.

## Lead record

- identitate și contact;
- canal preferat;
- serviciu/localitate;
- project reference;
- detalii tehnice;
- media;
- source/UTM/landing page;
- consent version;
- status/priority/owner;
- notes și next action;
- notification delivery state;
- timestamps.

## Follow-up

P1:

- task și reminder;
- template de mesaj, dar trimitere controlată;
- „no response” sequence cu limite;
- reminder evaluare;
- request review după finalizare;
- Telegram alert pentru lead nou/SLA.

## Reporting

- lead-uri per sursă/serviciu/localitate;
- timp până la contact;
- calificare;
- evaluare → ofertă;
- ofertă → acceptat;
- pierderi pe motiv;
- venit estimat per sursă, dacă este introdus manual.

## Privacy

- acces least privilege;
- export auditat;
- retenție configurabilă;
- ștergere/anonymizare la cerere conform politicii validate;
- notes fără date excesive sau sensibile nerelevante.

## Acceptance criteria

- nicio schimbare de status fără istoric;
- filtre și export respectă permisiunile;
- UTM și landing page sunt păstrate;
- KPI nu numără spam ca lead comercial;
- PII nu ajunge în analytics.
