---
phase: 01-berechnungskern
verified: 2026-06-29T18:06:30Z
status: passed
score: 4/4 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification: false
---

# Phase 1: Berechnungskern — Verifikationsbericht

**Phasenziel:** Eine UI-unabhängige, fachlich korrekte Ausgleichsrechnung, die aus Personen und Ausgaben Gesamtkosten, fairen Anteil, Salden und konkrete Greedy-Ausgleichszahlungen ableitet, dabei die Fachregeln durchsetzt und durch Unit-Tests abgesichert ist.

**Verifiziert:** 2026-06-29T18:06:30Z
**Status:** PASSED
**Re-Verifikation:** Nein — initiale Verifikation

---

## Ziel-Erreichung

### Beobachtbare Wahrheiten

| # | Wahrheit | Status | Nachweis |
|---|----------|--------|----------|
| 1 | Aus Personen + Ausgaben liefert der Kern Gesamtkosten, fairen Anteil und Saldo pro Person korrekt, gerundet auf zwei Nachkommastellen (CALC-01, CALC-02, CALC-03, CALC-04). | ✓ VERIFIED | `calculateTotalCost`, `calculateFairShare`, `calculateBalances`, `calculateTransfers` in settlement.ts; alle Geldwerte laufen durch `roundEuro` in money.ts. Tests `calculateTotalCost` (3), `calculateFairShare` (3), `calculateBalances` (3) grün; Integration-Test "alle Geldwerte höchstens 2 Nachkommastellen" grün. |
| 2 | Der Kern schlägt Greedy-Ausgleichszahlungen vor (größter Gläubiger gegen größten Schuldner), deren Summe die Salden vollständig ausgleicht (CALC-05). | ✓ VERIFIED | `calculateTransfers` in settlement.ts (Cent-Arithmetik, sortierte Gläubiger/Schuldner-Listen). Beispiel A (1 Transfer P2→P1, 50 €), Beispiel B (2 Transfers P3→P1 40 €, P2→P1 10 €) und zwei Reconciliation-Tests (Transfersumme = positive Salden; nach Anwendung jeder Saldo = 0) grün. |
| 3 | Der Kern weist ungültige Eingaben gemäß Fachregeln ab: negative Beträge, Ausgabe ohne erfasste zahlende Person, weniger als zwei Personen; 0 € ist zulässig (PERS-03, EXP-02, EXP-04). | ✓ VERIFIED | `validateSettlementInput` in validation.ts; `calculateSettlement` ruft Validierung vor jeder Berechnung auf und wirft `SettlementValidationError` bei Verstoß. Tests: TOO_FEW_PERSONS (0 und 1 Person), NEGATIVE_AMOUNT, PAYER_NOT_REGISTERED, 0 € zulässig, mehrere gleichzeitige Fehler (sammelt alle). SettlementValidationError-Tests in calculateSettlement-Describe grün. |
| 4 | Vitest-Unit-Tests decken Gesamtkosten, fairen Anteil, Salden, Rundung und Ausgleichszahlungen ab und laufen grün. | ✓ VERIFIED | `npx vitest run` → 40 Tests in 3 Dateien, Exit 0. `npx tsc --noEmit` → Exit 0 (kein Typfehler). |

**Ergebnis: 4/4 Wahrheiten verifiziert**

---

### Erforderliche Artefakte

| Artefakt | Erwartet | Status | Details |
|----------|----------|--------|---------|
| `src/core/types.ts` | Datentypen Person, Expense, PersonBalance, Transfer, SettlementResult, ValidationError, ValidationErrorCode, ValidationResult | ✓ VERIFIED | Alle 7 Typen/Interfaces vorhanden; nur Deklarationen, keine Laufzeitlogik. |
| `src/core/money.ts` | roundEuro, toCents, fromCents | ✓ VERIFIED | Alle drei Funktionen implementiert; Cent-Arithmetik korrekt; kein DOM-Zugriff. |
| `src/core/validation.ts` | validateSettlementInput mit ValidationError-Ergebnis | ✓ VERIFIED | Prüft PERS-03, EXP-04, EXP-02; sammelt alle Fehler (bricht nicht ab); deutsche Fehlermeldungen. |
| `src/core/settlement.ts` | calculateSettlement + Hilfsfunktionen | ✓ VERIFIED | Alle vier Hilfsfunktionen exportiert; SettlementValidationError-Klasse vorhanden; Validierung wird vor jeder Berechnung durchgesetzt. |
| `src/core/index.ts` | Barrel-Modul — nur Re-Exports | ✓ VERIFIED | Enthält ausschließlich `export … from` — keine Logik. Alle öffentlichen Typen und Funktionen re-exportiert. |
| `src/core/money.test.ts` | Vitest-Specs für roundEuro, toCents, fromCents | ✓ VERIFIED | 11 Tests, grün. Deckt roundEuro (5), toCents (3), fromCents (3) ab. |
| `src/core/validation.test.ts` | Vitest-Specs für validateSettlementInput | ✓ VERIFIED | 8 Tests, grün. Deckt alle Fachregelcodes und Mehrfach-Fehler ab. |
| `src/core/settlement.test.ts` | Vitest-Specs für Settlement und Greedy | ✓ VERIFIED | 21 Tests, grün. Beispiele A und B, Reconciliation (Summe und Nullsaldo), Integration mit SettlementValidationError. |

---

### Schlüsselverbindungen (Key Links)

| Von | Zu | Via | Status | Details |
|-----|----|-----|--------|---------|
| `settlement.ts` | `validation.ts` | `validateSettlementInput` vor Berechnung | ✓ WIRED | Zeile 164–167: Aufruf und Wurfpfad bestätigt. |
| `settlement.ts` | `money.ts` | `roundEuro`, `toCents`, `fromCents` | ✓ WIRED | Alle drei Helfer importiert und an jeder Geldoperation genutzt (Zeilen 42, 50, 78–79, 84, 91, 113–114, 118–119, 137). |
| `index.ts` | alle Kernmodule | Re-Exports | ✓ WIRED | Alle Typen, Funktionen und SettlementValidationError erreichbar. |

---

### Verhaltens-Spotchecks

| Verhalten | Befehl | Ergebnis | Status |
|-----------|--------|----------|--------|
| Alle 40 Tests grün | `npx vitest run` | 40 passed, Exit 0 | ✓ PASS |
| Kein TypeScript-Fehler | `npx tsc --noEmit` | kein Output, Exit 0 | ✓ PASS |

---

### Anforderungsabdeckung

| REQ-ID | Quelle (PLAN) | Beschreibung | Status | Nachweis |
|--------|--------------|--------------|--------|---------|
| PERS-03 | 01-01-PLAN.md | Mindestens 2 Personen für Abrechnung | ✓ ERFÜLLT | `validateSettlementInput` TOO_FEW_PERSONS; 2 Tests in validation.test.ts |
| EXP-02 | 01-01-PLAN.md | Ausgabe braucht erfasste zahlende Person | ✓ ERFÜLLT | PAYER_NOT_REGISTERED in validation.ts; Test in validation.test.ts |
| EXP-04 | 01-01-PLAN.md | Negative Beträge ungültig, 0 € zulässig | ✓ ERFÜLLT | NEGATIVE_AMOUNT-Prüfung (`amount < 0`); 0-€-Test grün |
| CALC-01 | 01-01-PLAN.md | Gesamtkosten = Summe aller Ausgaben | ✓ ERFÜLLT | `calculateTotalCost`; 3 Tests inkl. leere Liste und Float |
| CALC-02 | 01-01-PLAN.md | Fairer Anteil gleichmäßig (÷ Personenzahl) | ✓ ERFÜLLT | `calculateFairShare`; 3 Tests inkl. 100÷3=33.33 |
| CALC-03 | 01-01-PLAN.md | Saldo = bezahlt minus fairer Anteil | ✓ ERFÜLLT | `calculateBalances`; Saldensumme exakt 0, Test grün |
| CALC-04 | 01-01-PLAN.md | Rundung auf 2 Nachkommastellen | ✓ ERFÜLLT | `roundEuro` durchgängig genutzt; 5 Tests in money.test.ts |
| CALC-05 | 01-01-PLAN.md | Greedy-Transfers (größter gegen größten) | ✓ ERFÜLLT | `calculateTransfers`; Beispiele A+B, 2 Reconciliation-Tests grün |

Alle 8 Anforderungs-IDs aus dem PLAN sind abgedeckt. Laut REQUIREMENTS.md Traceability-Tabelle gehören PERS-01, PERS-02, EXP-01, EXP-03, UI-01, UI-02, UI-03 zu Phase 2 — diese sind hier nicht zu erwarten und korrekt nicht enthalten.

---

### Anti-Pattern-Scan

| Datei | Muster | Befund |
|-------|--------|--------|
| src/core/*.ts | TBD / FIXME / XXX / TODO / PLACEHOLDER | Keine gefunden |
| src/core/*.ts | DOM/Browser-API (document, window, HTML) | Keine — einziger Treffer ist ein Kommentar in index.ts der explizit das Fehlen benennt |
| src/core/*.ts | return null / return [] / leere Stubs | Keine — alle Funktionen liefern berechnete Werte |

Keine Blocker, keine Warnungen.

---

### Menschliche Verifikation erforderlich

Keine — alle Must-Haves sind automatisiert verifiziert. Die Fachlogik ist rein rechnerisch und vollständig durch Vitest abgedeckt.

---

## Zusammenfassung

Alle vier Success Criteria aus ROADMAP.md und alle 8 Anforderungs-IDs aus dem PLAN sind nachweislich erfüllt:

- **Gesamtkosten, fairer Anteil und Salden** werden korrekt und cent-genau berechnet (CALC-01–04).
- **Greedy-Transfers** gleichen die Salden vollständig aus; Reconciliation durch zwei Integrationstests bestätigt (CALC-05).
- **Fachregeln** (PERS-03, EXP-02, EXP-04) werden vor jeder Berechnung geprüft; ungültige Eingaben erzeugen niemals ein Teilergebnis.
- **40 Vitest-Tests** laufen grün, `tsc --noEmit` ist sauber.
- **Kein DOM/UI-Code** in `src/core/` — die Phase ist vollständig framework-unabhängig.

Die Phase ist bereit für Phase 2 (UI-Integration über `src/core/index.ts`).

---

_Verifiziert: 2026-06-29T18:06:30Z_
_Prüfer: Claude (gsd-verifier)_
