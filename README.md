# PartyPayback

![KI kann Code – aber auch den richtigen? „Get Shit Done" statt Prompt-Chaos — Session beim Nürnberg Digital Festival, von BRANDAD](docs/assets/key-visual.png)

**PartyPayback** ist eine kleine, rein clientseitige Web-App, die die Ausgaben einer
gemeinsamen Sommerparty fair auf alle Teilnehmenden verteilt. Man erfasst Personen und
ihre bezahlten Beiträge — die App berechnet Gesamtkosten, fairen Anteil pro Person,
Salden und konkrete Ausgleichszahlungen.

Dieses Repo ist das **Ergebnis eines Live-Workshops** beim Nürnberg Digital Festival:
„KI kann Code – aber auch den richtigen? **Get Shit Done** statt Prompt-Chaos". Die
komplette App — vom PRD über Planung bis zum getesteten Code — wurde live mit
[GSD](https://github.com/glittercowboy/gsd) (Get Shit Done) gebaut.

## 📄 Handout zur Session

Die Präsentationsfolien liegen als PDF im Repo — ideal zum Nachschlagen, wie der
GSD-Workflow Schritt für Schritt abgelaufen ist:

> **▶ [docs/handout/2026-BRANDAD-NbgDigital-GSD-Workshop.pdf](docs/handout/2026-BRANDAD-NbgDigital-GSD-Workshop.pdf)**

## Was die App kann

- Personen anlegen und ihre gezahlten Beiträge erfassen (auch 0 €)
- **Gesamtkosten** und **fairen Anteil** pro Person berechnen
- **Salden** ermitteln: wer hat zu viel, wer zu wenig gezahlt
- **Ausgleichszahlungen** vorschlagen: konkret „wer zahlt wem wie viel zurück"
- Live-Aktualisierung im Browser, ohne Speichern oder Server

**Core Value:** eine fachlich korrekte, nachvollziehbare und gut getestete
Ausgleichsrechnung. Der Berechnungskern ist mit Vitest abgedeckt.

## Loslegen

```bash
npm ci          # Abhängigkeiten deterministisch aus dem Lockfile
npm run dev     # Dev-Server starten
npm test        # Unit-Tests des Berechnungskerns
```

Weitere Skripte: `npm run build` (Production-Build), `npm run typecheck`,
`npm run test:watch`, `npm run test:coverage`.

## Tech Stack & Constraints

- **TypeScript + Vite** (Build/Dev), **Vitest** (Unit-Tests) — im PRD fixiert.
- **Vanilla DOM**, kein UI-Framework, kein Routing, keine State-Library — eine einzige Seite.
- **Keine Persistenz**, rein clientseitig, In-Memory.
- **Keine externen CDNs zur Laufzeit** — Webfont self-hosted via `@fontsource/inter`.

## Projektstruktur

```
src/core/      Berechnungskern (Geld, Salden, Settlement) — mit Tests
src/ui/        State, Formatierung, DOM-Rendering
src/main.ts    App-Entry
docs/handout/  Präsentationsfolien (PDF)
docs/plans/    PRD (Input für GSD)
.planning/     GSD-Planungsartefakte (Roadmap, Phasen, Specs)
```
