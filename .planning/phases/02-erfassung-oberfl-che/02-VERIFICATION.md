---
phase: 02-erfassung-oberflaeche
verified: 2026-06-29T16:32:14Z
status: human_needed
score: 3/3 must-haves verified (automated evidence)
behavior_unverified: 3
overrides_applied: 0
behavior_unverified_items:
  - truth: "Nutzer kann auf einer einzigen durchscrollbaren Seite eine Person mit Namen hinzufügen und einzeln per ×-Button entfernen."
    test: "npm run dev öffnen, Person hinzufügen via Formular, per × entfernen."
    expected: "Person erscheint in der Liste, × entfernt sie sofort ohne Reload; Payer-Select in Ausgaben-Formular aktualisiert sich live."
    why_human: "State-Transition (add/remove Person → Live-Re-Render aller drei Bereiche) kann Grep nicht beobachten; nur im laufenden Browser verifizierbar."
  - truth: "Nutzer sieht nach jeder Mutation live Gesamtkosten, fairen Anteil, Saldo pro Person und vorgeschlagene Ausgleichszahlungen."
    test: "npm run dev, mindestens 2 Personen und 1 Ausgabe erfassen; Ergebnisbereich beobachten."
    expected: "Gesamtkosten, fairer Anteil, farblich unterschiedene Salden ('bekommt X € zurück' / 'muss X € zahlen') und Ausgleichszahlungen als lesbare Sätze ('A zahlt X € an B') werden ohne Seitenreload live angezeigt."
    why_human: "Render-Korrektheit und visuelle Saldo-Farbgebung sind Laufzeitverhalten im DOM."
  - truth: "Ungültige Eingaben werden mit dem Wortlaut aus ValidationError.message abgewiesen; der Ergebnisbereich zeigt Platzhalter statt Zahlen."
    test: "npm run dev: (a) negativen Betrag eingeben, (b) Ausgabe mit nicht mehr vorhandener zahlender Person, (c) nur 1 Person erfassen und Ausgabe hinzufügen."
    expected: "(a) Fehlermeldung im Ausgaben-Fehlercontainer, Ergebnisbereich Platzhalter; (b) PAYER_NOT_REGISTERED-Text im Ausgaben-Fehlercontainer; (c) Platzhalter-Text aus TOO_FEW_PERSONS-Nachricht des Kerns im Ergebnisbereich."
    why_human: "Validierungs-Feedback-Flow und Platzhalter-Anzeige sind nur im Browser beobachtbar."
human_verification:
  - test: "Person hinzufügen und per × entfernen (Live-Re-Render)"
    expected: "Person erscheint und verschwindet sofort; Payer-Select synchron aktualisiert; Ergebnisbereich aktualisiert sich ohne 'Berechnen'-Button."
    why_human: "DOM-Mutation und Subscribe-Pattern-Reaktion nur im laufenden Browser prüfbar."
  - test: "Ausgabe erfassen, Ergebnisbereich mit korrekten Werten prüfen"
    expected: "Gesamtkosten, fairer Anteil, Salden (farblich unterschieden), Ausgleichszahlungen als 'A zahlt X € an B' korrekt angezeigt."
    why_human: "Render-Output und visuelle Darstellung nur im Browser verifizierbar."
  - test: "Validierungsfeedback für negative Beträge, fehlende zahlende Person und < 2 Personen"
    expected: "Fehlermeldungen direkt aus ValidationError.message (Kern-Wortlaut) kontextnah angezeigt; Ergebnisbereich zeigt Platzhalter statt Zahlen."
    why_human: "Visuelles Validierungs-Feedback und Platzhalter-Wechsel nur im laufenden Browser beobachtbar."
---

# Phase 02: Erfassung & Oberfläche — Verification Report

**Phase Goal:** Eine minimale Vanilla-DOM-Oberfläche auf einer einzigen Seite, über die Nutzer Personen und Ausgaben erfassen und entfernen, den Berechnungskern anbinden und das Abrechnungsergebnis verständlich angezeigt bekommen.
**Verified:** 2026-06-29T16:32:14Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Nutzer kann auf einer einzigen Seite Personen hinzufügen und per × entfernen | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Code present and wired; state transition only verifiable in browser |
| 2 | Nutzer sieht live Gesamtkosten, fairen Anteil, Saldo pro Person und Ausgleichszahlungen | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Code present and wired; render output only verifiable in browser |
| 3 | Ungültige Eingaben werden mit Kern-Wortlaut abgewiesen, Ergebnisbereich zeigt Platzhalter | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Code present and wired; UI validation flow only verifiable in browser |

**Score:** 3/3 truths present and wired (behavior-unverified: 3 — live DOM behavior requires browser)

**Note on scoring:** Per project constraints (CLAUDE.md), the UI layer has no automated unit tests by explicit decision. The three automated gates (`npm run typecheck`, `npm run build`, `npm test`) all exit 0. Code presence and wiring are fully verified at levels 1–3. Runtime behavior requires human verification per Step 3 classification.

### ROADMAP Success Criteria Coverage

| SC | Criterion | Automated Evidence | Status |
|----|-----------|-------------------|--------|
| SC-1 | Personen und Ausgaben auf einer Seite hinzufügen und einzeln entfernen | index.html: Formulare mit stabilen IDs; render.ts: renderPersons/renderExpenses mit onRemove-Callback; state.ts: addPerson/removePerson/addExpense/removeExpense mit notify() | ⚠️ WIRED, browser-verify |
| SC-2 | Gesamtkosten, fairer Anteil, Saldo pro Person, Ausgleichszahlungen verständlich angezeigt | render.ts:194–267 ruft calculateSettlement bei ok:true; formatBalance: "bekommt X € zurück" / "muss X € zahlen"; Transfers: "A zahlt X € an B" | ⚠️ WIRED, browser-verify |
| SC-3 | Ungültige Eingaben nachvollziehbar abgewiesen | render.ts:155–191 ruft validateSettlementInput; err.message direkt in expenseError (NEGATIVE_AMOUNT/PAYER_NOT_REGISTERED); TOO_FEW_PERSONS → result-placeholder | ⚠️ WIRED, browser-verify |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Vite-Entry, 11 stabile IDs, module-script | ✓ VERIFIED | Alle 11 IDs vorhanden; `<script type="module" src="/src/main.ts">`; lang="de"; `<input type="number" min="0" step="0.01">` für expense-amount |
| `src/main.ts` | App-Entry, Bundle-Imports, Form-Wiring, Subscribe | ✓ VERIFIED | `import '@fontsource/inter'` als erste Zeile; `import './styles.css'`; preventDefault auf beiden Formularen; subscribe(render); initiales render() |
| `src/ui/state.ts` | In-Memory-State, Getter, Mutationen, Subscribe | ✓ VERIFIED | Private Person[]/Expense[]; crypto.randomUUID(); notify() nach jeder Mutation; Getter geben Kopien zurück |
| `src/ui/format.ts` | formatEuro, formatBalance, nameOf | ✓ VERIFIED | Intl.NumberFormat de-DE; formatBalance mit korrekten Texten (zurück/zahlen/ausgeglichen); nameOf mit ID-Fallback |
| `src/ui/render.ts` | renderPersons, renderExpenses, renderResult | ✓ VERIFIED | Alle drei Funktionen vollständig; calculateSettlement nur bei ok:true; err.message direkt angezeigt |
| `src/styles.css` | Card-Layout, CSS-Variablen, Saldo-Farbklassen, kein CDN | ✓ VERIFIED | balance--positive/negative/neutral; result-placeholder; CSS-Variablen; data:-URI für SVG-Chevron (inline, kein Egress) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/ui/state.ts` | `src/core/index.ts` (Barrel) | `import type { Person, Expense } from '../core/index'` | ✓ WIRED | Zeile 12; kein Direkt-Import aus types/validation/settlement/money |
| `src/ui/format.ts` | `src/core/index.ts` (Barrel) | `import type { Person } from '../core/index'` | ✓ WIRED | Zeile 7; kein Direkt-Import |
| `src/ui/render.ts` | `src/core/index.ts` (Barrel) | `import { validateSettlementInput, calculateSettlement, type Person, type Expense } from '../core/index'` | ✓ WIRED | Zeilen 11–16; Barrel-Disziplin eingehalten |
| `src/main.ts` | `@fontsource/inter` | `import '@fontsource/inter'` (erste Zeile) | ✓ WIRED | Self-hosted, ins Bundle gezogen; Build erzeugt woff2/woff-Assets |
| `render.ts:validateSettlementInput` | `render.ts:calculateSettlement` | `if (!validation.ok) { ... return } calculateSettlement(...)` | ✓ WIRED | calculateSettlement wird nur bei ok:true aufgerufen (Zeilen 157–194) |
| `state.ts:notify()` | `main.ts:render()` | `subscribe(render)` in main.ts | ✓ WIRED | main.ts Zeile 118; render() wird nach jeder Mutation ausgelöst |
| `render.ts:renderPersons` | `state.ts:removePerson` | onRemove-Callback `(id) => removePerson(id)` in main.ts | ✓ WIRED | main.ts Zeilen 59–61 |
| `render.ts:renderExpenses` | `state.ts:removeExpense` | onRemove-Callback `(id) => removeExpense(id)` in main.ts | ✓ WIRED | main.ts Zeilen 63–65 |

### Barrel-Disziplin (Critical Constraint)

Kein UI-Modul importiert direkt aus `core/types`, `core/validation`, `core/settlement` oder `core/money`:

```
grep -rn "from.*core/types|from.*core/validation|from.*core/settlement|from.*core/money" src/ui/
(no output — clean)
```

Alle Core-Imports in der UI laufen ausschließlich über `src/core/index.ts`.

### BRANDAD-/CSP-Constraint-Prüfung

| Check | Result |
|-------|--------|
| Externe CDN-URLs in index.html | Keine (nur `data:`-URI in styles.css für SVG-Chevron — inline, kein Egress) |
| Externe URLs in src/styles.css | Keine (data:-URI ist self-contained) |
| Externe URLs in src/main.ts | Keine |
| @fontsource/inter im Bundle | ✓ Build erzeugt 14 woff/woff2-Asset-Dateien |
| Google Fonts / fonts.googleapis.com | Nicht vorhanden |

### Automated Gate Results

| Command | Exit Code | Result |
|---------|-----------|--------|
| `npm run typecheck` | 0 | PASS — TypeScript typsauber |
| `npm run build` | 0 | PASS — Vite-Bundle inkl. Inter-Schrift (woff2/woff) |
| `npm test` | 0 | PASS — 40 Vitest-Tests (Phase 1 Berechnungskern) alle grün |

### Requirements Coverage

| REQ-ID | Phase-2? | Description | Status | Evidence |
|--------|----------|-------------|--------|----------|
| PERS-01 | ✓ | Person mit Namen hinzufügen | ✓ SATISFIED | state.ts:addPerson; main.ts Form-Handler; render.ts:renderPersons |
| PERS-02 | ✓ | Person entfernen | ✓ SATISFIED | state.ts:removePerson; render.ts: ×-Button mit onRemove-Callback |
| EXP-01 | ✓ | Ausgabe mit zahlender Person, Beschreibung, Betrag erfassen | ✓ SATISFIED | state.ts:addExpense; render.ts:renderExpenses mit Payer-Select |
| EXP-03 | ✓ | Ausgabe entfernen | ✓ SATISFIED | state.ts:removeExpense; render.ts: ×-Button mit onRemove-Callback |
| UI-01 | ✓ | Einzige Seite, kein Routing | ✓ SATISFIED | index.html: eine Seite, kein Router; kein window.location in codebase |
| UI-02 | ✓ | Gesamtkosten, Anteil, Saldo, Ausgleich verständlich angezeigt | ✓ SATISFIED (code) | render.ts:194–267; formatBalance; formatEuro; Transfer-Sätze — Laufzeitprüfung ausstehend |
| UI-03 | ✓ | Ungültige Eingaben nachvollziehbar abgewiesen | ✓ SATISFIED (code) | render.ts:155–191; err.message direkt aus Kern; Platzhalter bei ok:false — Laufzeitprüfung ausstehend |

**Orphaned Requirements Check:** PERS-03, EXP-02, EXP-04 sind per REQUIREMENTS.md Traceability Phase 1 zugeordnet und in Phase 1 abgedeckt — keine Waisen für Phase 2.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | — | — | No issues found |

- Keine TBD/FIXME/XXX/TODO/HACK-Marker in phasenrelevanten Dateien
- Kein `innerHTML` mit User-Daten (textContent durchgängig verwendet — T-02-01 mitigiert)
- Kein `return null`/`return []`/Stub-Pattern in Renderlogik
- Kein externer CDN-Egress

### Behavioral Spot-Checks

Gemäß Project-Constraint (CLAUDE.md): Die UI-Schicht wird durch manuelle Sichtprüfung verifiziert — keine automatisierten UI-Unit-Tests (explizite Projektentscheidung). Alle drei automatisierten Gates (`typecheck`, `build`, `test`) bestanden.

Behavior-dependent truths (Truths 1–3) sind als ⚠️ PRESENT_BEHAVIOR_UNVERIFIED klassifiziert — Code ist vorhanden und verdrahtet, aber die State-Transitions, der Subscribe-Re-Render-Flow und das Validierungs-Feedback sind ausschließlich im laufenden Browser beobachtbar.

### Human Verification Required

#### 1. Live-Re-Render: Personen und Ausgaben erfassen und entfernen

**Test:** `npm run dev` öffnen. Person "Alice" hinzufügen, dann "Bob". Jeweils via ×-Button entfernen. Ausgabe mit Alice als Zahlerin, Beschreibung und Betrag erfassen.
**Expected:** Personen erscheinen sofort in der Liste; × entfernt sie sofort ohne Seitenreload; Payer-Select synchronisiert sich live bei Personen-Änderungen; Ausgabe erscheint in der Ausgaben-Liste. Kein "Berechnen"-Button nötig.
**Why human:** Subscribe-Pattern + DOM-Mutation ist Laufzeitverhalten, nicht statisch verifizierbar.

#### 2. Ergebnisanzeige: Gesamtkosten, Saldo, Ausgleichszahlungen

**Test:** Mindestens 2 Personen und 1 Ausgabe erfassen. Ergebnisbereich ("Abrechnung"-Sektion) beobachten.
**Expected:** Gesamtkosten und fairer Anteil als Euro-Werte; Saldo pro Person farblich unterschieden ("bekommt X € zurück" grün, "muss X € zahlen" rot, "ist ausgeglichen" neutral); Ausgleichszahlungen als "A zahlt X € an B". Alles auf einer Seite ohne Routing.
**Why human:** Render-Output und Saldo-Farbgebung (CSS-Klassen balance--positive/negative/neutral) nur visuell prüfbar.

#### 3. Validierungsfeedback: negativer Betrag, fehlende zahlende Person, < 2 Personen

**Test:** (a) Nur 1 Person, Ausgabe hinzufügen → Ergebnisbereich prüfen. (b) 2 Personen, Ausgabe mit negativem Betrag (−5) eingeben, falls HTML-Attribut dies zulässt. (c) Person nach Erfassen einer Ausgabe entfernen.
**Expected:** (a) Platzhalter aus TOO_FEW_PERSONS-Meldung des Kerns im Ergebnisbereich (nicht "Beispieldaten"). (b) NEGATIVE_AMOUNT-Fehlermeldung im Ausgaben-Fehlercontainer (Kern-Wortlaut), Ergebnisbereich zeigt Platzhalter. (c) PAYER_NOT_REGISTERED im Ausgaben-Fehlercontainer.
**Why human:** Validierungs-Flow und Platzhalter-Anzeige sind Laufzeitverhalten; render.ts zeigt bei NEGATIVE_AMOUNT/PAYER_NOT_REGISTERED einen generischen Hinweis im Ergebnisbereich ("Bitte die Eingabefehler bei den Ausgaben korrigieren.") — zu prüfen, ob das die Anforderung "nachvollziehbar abgewiesen" erfüllt (der Kern-Wortlaut steht im Fehler-Container, nicht im result-div).

---

_Verified: 2026-06-29T16:32:14Z_
_Verifier: Claude (gsd-verifier)_
