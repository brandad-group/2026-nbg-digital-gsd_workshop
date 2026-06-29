---
phase: 02-erfassung-oberfl-che
plan: "01"
subsystem: ui
tags: [vanilla-dom, vite, css, state-management, rendering]
status: complete

dependency_graph:
  requires: [01-01-SUMMARY]
  provides: [index.html, src/main.ts, src/ui/state.ts, src/ui/format.ts, src/ui/render.ts, src/styles.css]
  affects: []

tech_stack:
  added:
    - "@fontsource/inter (self-hosted via npm, kein CDN)"
  patterns:
    - "Subscribe-Pattern für Live-Re-Render (kein Berechnen-Button)"
    - "Barrel-Disziplin: UI importiert ausschließlich aus src/core/index.ts"
    - "DOM-API-only Rendering (textContent statt innerHTML — T-02-01)"
    - "Intl.NumberFormat de-DE für Euro-Formatierung"

key_files:
  created:
    - index.html
    - src/main.ts
    - src/ui/state.ts
    - src/ui/format.ts
    - src/ui/render.ts
    - src/styles.css
  modified: []

decisions:
  - "D-02: Live-Re-Render via Subscribe-Pattern, kein Berechnen-Button"
  - "D-03/D-04: Fehlertexte direkt aus ValidationError.message, validateSettlementInput steuert Anzeige"
  - "T-02-01: textContent statt innerHTML überall wo User-Daten ins DOM fließen"
  - "D-09: Inter via @fontsource/inter ins Bundle — keine externen CDNs (BRANDAD-CSP)"

metrics:
  duration_minutes: 15
  completed_date: "2026-06-29"
  tasks_completed: 3
  tasks_total: 3
  files_created: 6
  files_modified: 0
---

# Phase 02 Plan 01: Erfassung & Oberfläche Summary

**One-liner:** Vanilla-DOM Single-Page-UI über Subscribe-Pattern live gegen den getesteten Berechnungskern gebunden, mit handgeschriebenem Card-Layout und Inter via @fontsource.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | HTML-Gerüst und CSS-Card-Layout | 2851a8e | index.html, src/styles.css, package.json, tsconfig.json, vite.config.ts, .gitignore |
| 2 | In-Memory-State, Formatierung, DOM-Rendering | c3e87cd | src/ui/state.ts, src/ui/format.ts, src/ui/render.ts |
| 3 | App-Entry verdrahten, Bundle-Imports, Live-Re-Render | 2d385f4 | src/main.ts |

## What Was Built

**index.html** — Vite-Entry mit drei Sektionen (Personen → Ausgaben → Ergebnis), allen 11 stabilen IDs (`person-form`, `person-name`, `person-list`, `person-error`, `expense-form`, `expense-payer`, `expense-description`, `expense-amount`, `expense-list`, `expense-error`, `result`), `<input type="number" min="0" step="0.01">` für Beträge.

**src/styles.css** — Handgeschriebenes Card-Layout mit CSS-Variablen, Inter font-family (kein @import/CDN), Saldo-Farbklassen `balance--positive` / `balance--negative` / `balance--neutral`, result-placeholder-Klasse.

**src/ui/state.ts** — Zwei private Arrays `Person[]`/`Expense[]`, Getter geben Kopien zurück, IDs via `crypto.randomUUID()`, Subscribe-Pattern. Beim Entfernen einer Person werden Ausgaben bewusst NICHT mitgelöscht (Kern meldet PAYER_NOT_REGISTERED).

**src/ui/format.ts** — `formatEuro` via `Intl.NumberFormat('de-DE', {style:'currency',...})`, `formatBalance` (positiv/negativ/neutral-Text), `nameOf` ID→Name-Mapping.

**src/ui/render.ts** — `renderPersons`, `renderExpenses`, `renderResult`. Ausschließlich Barrel-Imports. Fehler-Kategorisierung: TOO_FEW_PERSONS → Ergebnisbereich-Platzhalter, NEGATIVE_AMOUNT/PAYER_NOT_REGISTERED → Ausgaben-Fehlercontainer. `calculateSettlement` nur bei `ok:true`.

**src/main.ts** — Importiert `@fontsource/inter` und `./styles.css` als erste Statements (Bundle, self-hosted). Formulare mit `preventDefault`, Feldleerung und Fokus-Rückgabe nach Hinzufügen. `subscribe(render)` für Live-Re-Render, initiales `render()` auf Seitenstart.

## Verification Results

- `npm run typecheck` exit 0
- `npm run build` exit 0 (Inter-Schrift gebündelt als woff2/woff-Assets)
- Barrel-Disziplin: kein UI-Modul importiert direkt aus `core/types`, `core/validation`, `core/settlement`, `core/money`
- Keine externen URLs in index.html, src/styles.css, src/main.ts (data:-URI für SVG-Pfeil im Select ist inline, kein externer Egress)

## Deviations from Plan

None — Plan executed exactly as written.

## Known Stubs

None — alle Daten werden live aus dem In-Memory-State via den Kern berechnet.

## Threat Flags

Keine neuen unbekannten Bedrohungsflächen. T-02-01 (XSS via innerHTML) wurde plangemäß mitigiert: alle User-Daten fließen ausschließlich via `textContent` ins DOM.

## Self-Check

## Self-Check: PASSED

- FOUND: index.html
- FOUND: src/main.ts
- FOUND: src/ui/state.ts
- FOUND: src/ui/format.ts
- FOUND: src/ui/render.ts
- FOUND: src/styles.css
- FOUND commit: 2851a8e
- FOUND commit: c3e87cd
- FOUND commit: 2d385f4
