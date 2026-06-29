# Phase 2: Erfassung & Oberfläche - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Eine minimale Vanilla-DOM-Oberfläche auf **einer einzigen Seite** (kein Routing), über die Nutzer Personen und Ausgaben **erfassen und einzeln entfernen**, die den fertigen Berechnungskern aus Phase 1 anbindet und das Abrechnungsergebnis (Gesamtkosten, fairer Anteil, Saldo pro Person, Greedy-Ausgleichszahlungen) **verständlich mit Validierungsfeedback** anzeigt.

Liefert: PERS-01, PERS-02, EXP-01, EXP-03, UI-01, UI-02, UI-03.

Nicht in dieser Phase: jegliche Berechnungs-/Validierungslogik (vollständig in Phase 1 abgeschlossen), Persistenz, Login, Mehrwährung — siehe PROJECT.md "Out of Scope".

</domain>

<decisions>
## Implementation Decisions

### Seitenlayout & Struktur
- **D-01:** Einspaltige, **vertikal gestapelte** Single-Page-Struktur in fester Reihenfolge: Abschnitt *Personen* → Abschnitt *Ausgaben* → Abschnitt *Ergebnis*. Kein Routing, keine Tabs — bewusst eine durchscrollbare Seite. Responsiv per einfacher max-width-Zentrierung.

### Ergebnis-Trigger (Neuberechnung)
- **D-02:** Ergebnis wird **live/reaktiv** neu berechnet und gerendert — nach jeder Zustandsänderung (Person/Ausgabe hinzufügen oder entfernen). **Kein expliziter "Berechnen"-Button.** Bei jeder Mutation läuft ein Re-Render des betroffenen Bereichs.

### Validierungsfeedback
- **D-03:** Fachregelverstöße werden **kontextnah inline** dargestellt; der Ergebnisbereich zeigt statt Zahlen einen erklärenden Platzhalter. Die angezeigten Texte stammen direkt aus `ValidationError.message` des Kerns (nicht in der UI neu formuliert) — so bleiben Regel und Wortlaut Single-Source-of-Truth in Phase 1.
- **D-04:** Die UI nutzt vorzugsweise `validateSettlementInput(persons, expenses)` zum Anzeigen von Fehlern, ohne dass eine Exception nötig ist; `calculateSettlement` wird nur aufgerufen/angezeigt, wenn `ok: true`.

### Erfassen- & Entfernen-UX
- **D-05:** Personen: kleines Formular (Namensfeld + Hinzufügen) und darunter eine Liste; jede Zeile hat einen **Inline-Entfernen-Button (×)**.
- **D-06:** Ausgaben: Formular mit **zahlende Person als `<select>`** (befüllt aus den aktuell erfassten Personen), Beschreibung (Text) und Betrag (number, Euro). Liste der Ausgaben analog mit ×-Entfernen je Zeile.
- **D-07:** Betrags-Eingabe als `<input type="number">` mit `min="0"` und `step="0.01"`; die fachliche Ablehnung negativer Beträge bleibt aber serverseitig-äquivalent im Kern (EXP-04), die UI verlässt sich nicht allein auf das HTML-Attribut.

### Leer-/Initialzustand
- **D-08:** Solange weniger als 2 Personen / keine sinnvolle Abrechnung vorliegt, zeigt der Ergebnisbereich einen **freundlichen Platzhalter mit Handlungshinweis** (z. B. "Mindestens 2 Personen erfassen, um die Abrechnung zu sehen"), keine leere Fläche und keine Beispieldaten.

### Visueller Stil
- **D-09:** **Handgeschriebenes CSS** (eine Stylesheet-Datei, ins Bundle), Schrift **Inter via `@fontsource/inter`** (bereits Dependency, self-hosted — keine externen CDNs/Google Fonts). Helles, minimal-cleanes Card-Layout; klare Typo-Hierarchie; dezente Abstände/Radien. Kein UI-Framework, keine Utility-CSS-Lib.
- **D-10:** Salden visuell unterscheidbar: positiv (bekommt zurück) vs. negativ (muss zahlen) farblich/iconisch absetzen; Beträge konsistent mit 2 Nachkommastellen und Euro-Zeichen formatieren.

### Claude's Discretion
- Konkrete Modulaufteilung (`index.html`, `src/main.ts`, ggf. `src/ui/*`) — vom Planner/Executor zu bestimmen; einzige harte Vorgabe: UI importiert ausschließlich aus dem Barrel `src/core/index.ts`.
- ID-Generierung für Person/Expense: `crypto.randomUUID()` (browser-nativ, keine Dependency) empfohlen, Detail aber frei.
- Exaktes Farbschema, Spacing-Skala und Mikro-Interaktionen offen — design-bewusst umsetzen, ohne Gold-Plating (90-min-Workshop-Budget beachten).
- Bei Bedarf an einem expliziten Design-Contract vor dem Bauen: optional `/gsd-ui-phase 2` (ROADMAP "UI hint: yes") — nicht verpflichtend.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Kern-API (das einzige Integrationsinterface der UI)
- `src/core/index.ts` — öffentliches Barrel; **einzige** erlaubte Importquelle für die UI. Exporte: Typen (`Person`, `Expense`, `PersonBalance`, `Transfer`, `SettlementResult`, `ValidationError`, `ValidationErrorCode`, `ValidationResult`); `calculateSettlement(persons, expenses): SettlementResult` (wirft `SettlementValidationError`); `validateSettlementInput(persons, expenses): ValidationResult`; `roundEuro`/`toCents`/`fromCents`.
- `src/core/types.ts` — Datenformen, die die UI für State und Anzeige nutzt (insb. `Person {id,name}`, `Expense {id,payerId,description,amount}`, `SettlementResult`).
- `src/core/validation.ts` — Wortlaut & Codes der Fachregel-Fehler (`TOO_FEW_PERSONS`, `NEGATIVE_AMOUNT`, `PAYER_NOT_REGISTERED`), die die UI 1:1 anzeigt.

### Anforderungen & Scope
- `.planning/REQUIREMENTS.md` — Phase-2-Requirements PERS-01/02, EXP-01/03, UI-01/02/03.
- `.planning/ROADMAP.md` §"Phase 2: Erfassung & Oberfläche" — Goal + 3 Success Criteria.
- `.planning/PROJECT.md` §Constraints + §Out of Scope — Tech-Stack-, UI- und Dependency-Vorgaben.
- `docs/plans/PRD_MVP_PartyPaypack.md` — ursprüngliches PRD (Quelle der Fachregeln).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Berechnungskern (`src/core/`, Phase 1 abgeschlossen, Tests grün):** vollständig fertige, getestete Logik. Die UI baut keine eigene Rechen-/Validierungslogik, sondern ruft `calculateSettlement` bzw. `validateSettlementInput` auf.
- **`@fontsource/inter`** ist bereits als Dependency installiert — per Import in den Bundle einbinden (self-hosted, CSP-konform).
- **Vite-Toolchain** (`npm run dev` / `build`) und `tsconfig.json` liegen vor; `index.html` als Vite-Entry ist neu anzulegen.

### Established Patterns
- **Barrel-Import-Disziplin:** UI importiert nur aus `src/core/index.ts` (so im Kern dokumentiert). Keine Direkt-Imports einzelner Kernmodule.
- **Single-Source-of-Truth für Fehlertexte:** Anzeige nutzt `ValidationError.message`, keine Duplikate in der UI.
- **Geld-Anzeige:** Beträge sind im Kern bereits auf 2 Nachkommastellen gerundet (`roundEuro`); Formatierung in der UI darf darauf vertrauen.

### Integration Points
- In-Memory-State der UI: zwei Arrays `Person[]` und `Expense[]`. Mutationen (add/remove) → Re-Render + Neuauswertung über den Kern.
- Anzeige-Mapping: `PersonBalance.personId` / `Transfer.fromId`/`toId` müssen für die Anzeige auf `Person.name` gemappt werden (UI-Aufgabe).
- Vite-Entry: neue `index.html` + TS-Entry, der das Inter-Stylesheet und das eigene CSS importiert.

</code_context>

<specifics>
## Specific Ideas

- Salden klar lesbar machen: "bekommt X € zurück" vs. "muss X € zahlen" statt nur signierter Zahl.
- Ausgleichszahlungen als gut lesbare Sätze/Zeilen: "A zahlt X € an B".
- Eingabe-Ergonomie: nach dem Hinzufügen Felder leeren und Fokus zurück ins erste Feld.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Mögliche spätere Themen (Persistenz, Mehrwährung, Zahlungsstatus, gewichtete Anteile) sind in PROJECT.md/REQUIREMENTS.md bereits explizit als Out of Scope geführt.

</deferred>

---

*Phase: 2-Erfassung & Oberfläche*
*Context gathered: 2026-06-29*
