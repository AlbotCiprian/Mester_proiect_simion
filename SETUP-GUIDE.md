# Configurare Claude Cowork + Claude Code — Meșter Teracotă Moldova

## 1. Directorul proiectului

Folosește un singur director local și un singur repository Git:

`C:\Users\Sebi\Desktop\Projects\Ciprian\Mester_Proiect_simion`

Atât Cowork, cât și Claude Code trebuie să lucreze pe acest director. Nu crea două copii independente ale proiectului.

## 2. Structura recomandată

```text
Mester_Proiect_simion/
├── CLAUDE.md
├── CLAUDE.local.md                 # opțional, local, gitignored
├── .claude/
│   ├── settings.json
│   ├── settings.local.json         # opțional, local, gitignored
│   ├── rules/
│   │   ├── frontend-public.md
│   │   ├── admin.md
│   │   ├── api-data.md
│   │   ├── security.md
│   │   ├── seo-accessibility.md
│   │   └── testing.md
│   └── agents/
│       ├── product-architect.md
│       ├── frontend-creative-director.md
│       ├── security-reviewer.md
│       └── seo-reviewer.md
├── docs/
│   ├── specs/                      # fișierele 00–28 ale pachetului
│   ├── research/                   # MASTER_PROMPT (brief) și deep-research-report.md
│   └── work/
│       ├── STATUS.md
│       ├── DECISIONS.md
│       └── HANDOFFS.md
├── app/                            # va apărea la implementare
├── components/                     # va apărea la implementare
├── lib/                            # va apărea la implementare
└── prisma/                         # va apărea la implementare
```

## 3. Unde muți documentele existente

1. Păstrează `CLAUDE.md` la rădăcina proiectului.
2. Mută fișierele numerotate `00-README.md`–`28-MASTER-IMPLEMENTATION-PLAN.md` în `docs/specs/`.
3. Mută brief-ul inițial și raportul de research în `docs/research/`.
4. Copiază directorul `.claude/` din acest pachet la rădăcina proiectului.
5. Copiază `docs/work/` din acest pachet.
6. Adaugă liniile din `.gitignore.additions` în `.gitignore`.

## 4. Configurarea Cowork

În Cowork, selectează proiectul local existent și setează drept Context exact directorul `Mester_Proiect_simion`.

În panoul **Instructions**, copiază conținutul din `COWORK-INSTRUCTIONS.md`.

Nu încărca separat toate cele 29 de fișiere dacă directorul proiectului este deja în Context. Cowork le poate citi din folder când sarcina o cere.

### Rolul Cowork

Cowork este coordonatorul de produs, documentație, research, UX, QA și handoff. El trebuie să:

- analizeze specificațiile;
- pregătească planuri și checklist-uri;
- mențină `docs/work/STATUS.md` și `docs/work/HANDOFFS.md`;
- facă audituri cross-module;
- pregătească task-uri exacte pentru Claude Code;
- verifice rezultatele implementării.

Cowork nu modifică sursa aplicației decât atunci când îi ceri explicit.

## 5. Configurarea Claude Code

Pornește Claude Code din rădăcina repository-ului. La prima sesiune:

1. Rulează `/memory` și verifică dacă `CLAUDE.md` și regulile din `.claude/rules/` sunt încărcate.
2. Rulează `/doctor` dacă o configurație nu este recunoscută.
3. Pornește în Plan mode pentru task-uri noi.
4. Cere implementarea unui singur modul sau milestone per sesiune.
5. După implementare, cere un review separat și actualizarea `docs/work/STATUS.md`.

Nu folosi un singur prompt pentru întreaga platformă.

## 6. Fluxul de lucru recomandat

1. **Cowork:** clarifică obiectivul, citește specificațiile și produce handoff-ul.
2. **Tu:** aprobi scope-ul și criteriile de acceptare.
3. **Claude Code:** implementează într-un branch sau worktree dedicat.
4. **Claude Code reviewer:** rulează testele și auditul.
5. **Cowork:** compară rezultatul cu specificația și actualizează statusul.
6. **Tu:** aprobi commit-ul, PR-ul și deploy-ul.

## 7. Reguli de siguranță

- Nu oferi acces la întreg Desktop-ul; oferă numai folderul proiectului.
- Nu pune secrete reale în fișiere citibile de agent.
- Nu permite deploy Production, push sau migration deploy fără confirmare explicită.
- Păstrează repository-ul în Git și fă commit-uri mici.
- Cowork Memory este ajutor operațional, nu sursa de adevăr. Deciziile permanente trebuie scrise în fișierele versionate.
