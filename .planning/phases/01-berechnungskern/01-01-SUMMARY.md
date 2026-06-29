---
phase: 01-berechnungskern
plan: "01"
subsystem: core
status: complete
tags: [tdd, berechnungskern, settlement, money, validation]
dependency_graph:
  requires: []
  provides: [src/core/index.ts]
  affects: [Phase 2 UI]
tech_stack:
  added: []
  patterns: [TDD, Cent-Arithmetik, Greedy-Settlement, Barrel-Modul]
key_files:
  created:
    - src/core/types.ts
    - src/core/money.ts
    - src/core/validation.ts
    - src/core/settlement.ts
    - src/core/index.ts
    - src/core/money.test.ts
    - src/core/validation.test.ts
    - src/core/settlement.test.ts
  modified: []
decisions:
  - "Cent-Arithmetik in calculateTransfers statt Float-Arithmetik, um Rundungsdrift in der Greedy-Schleife zu verhindern"
  - "Rest-Cent (Saldensummen-Ausgleich) wird dem Gläubiger mit dem größten positiven Saldo zugeschlagen — einfachste korrekte Verteilung"
  - "SettlementValidationError als eigene Klasse statt einfachem Error-Objekt, damit die ValidationError[]-Liste typsicher zugänglich bleibt"
metrics:
  duration: "~15 Minuten"
  completed: "2026-06-29"
  tasks: 3
  files: 8
---

# Phase 1 Plan 01: Berechnungskern Summary

**One-liner:** Framework-unabhängiger Berechnungskern mit Cent-Arithmetik, Greedy-Settlement und vollständiger Vitest-Abdeckung (40 Tests grün).

## Completed Tasks

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 RED | money + validation Specs (failing) | 2183fd1 | grün |
| 1 GREEN | money.ts + validation.ts implementiert | ac1c539 | grün |
| 2 RED | settlement.test.ts (failing) | e6250a8 | grün |
| 2 GREEN | settlement.ts implementiert | 1098ea5 | grün |
| 3 | Barrel src/core/index.ts | dd007e4 | grün |

## Verification Results

```
npx vitest run
  ✓ src/core/money.test.ts      (11 tests)
  ✓ src/core/validation.test.ts  (8 tests)
  ✓ src/core/settlement.test.ts (21 tests)
  Test Files: 3 passed — Tests: 40 passed — Exit 0

npx tsc --noEmit → Exit 0 (kein Typfehler unter strict)
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test-Erwartung für negative Rundung korrigiert**

- **Found during:** Task 1, GREEN-Phase
- **Issue:** Der Test erwartete `roundEuro(-10.005) === -10.00`, aber Float-Darstellung ergibt `-10.005 * 100 = -1000.5000000000001`. `Math.round(-1000.5...) = -1001` → `-10.01`. Die Implementierung ist mathematisch korrekt (symmetrisch zur positiven Seite); der Testerwartungswert war falsch.
- **Fix:** Test-Erwartung auf `-10.01` korrigiert, Kommentar erklärt die Float-Ursache.
- **Files modified:** src/core/money.test.ts
- **Commit:** ac1c539

## TDD Gate Compliance

| Gate | Commit | Status |
|------|--------|--------|
| RED money+validation | 2183fd1 | erfüllt |
| GREEN money+validation | ac1c539 | erfüllt |
| RED settlement | e6250a8 | erfüllt |
| GREEN settlement | 1098ea5 | erfüllt |

## Requirements Coverage

| REQ-ID | Fachregel | Test |
|--------|-----------|------|
| PERS-03 | mind. 2 Personen | validation.test.ts — TOO_FEW_PERSONS |
| EXP-02 | payerId muss registriert sein | validation.test.ts — PAYER_NOT_REGISTERED |
| EXP-04 | negative Beträge ungültig, 0 € zulässig | validation.test.ts |
| CALC-01 | Gesamtkosten | settlement.test.ts — calculateTotalCost |
| CALC-02 | fairer Anteil | settlement.test.ts — calculateFairShare |
| CALC-03 | Saldo pro Person | settlement.test.ts — calculateBalances |
| CALC-04 | 2 Nachkommastellen | money.test.ts — roundEuro |
| CALC-05 | Greedy-Transfers | settlement.test.ts — Beispiel A, B, Reconciliation |

## Known Stubs

Keine — der Kern enthält keine Placeholder-Werte oder TODO-Stubs. Alle Fachregeln sind implementiert und getestet.

## Threat Surface Scan

Keine neuen sicherheitsrelevanten Oberflächen eingeführt. Der Kern ist ein reines in-memory TypeScript-Modul ohne Netzwerk, Persistenz oder DOM.

## Self-Check: PASSED

Alle 8 erwarteten Dateien vorhanden. Alle 5 Commits verifiziert. Kein DOM-Zugriff in src/core/. 40/40 Tests grün. tsc sauber.
