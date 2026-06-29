---
status: testing
phase: 02-erfassung-oberfl-che
source: [02-VERIFICATION.md]
started: 2026-06-29T16:33:00Z
updated: 2026-06-29T16:33:00Z
---

## Current Test

number: 1
name: Person hinzufügen und per × entfernen (Live-Re-Render)
expected: |
  Person erscheint sofort in der Liste und verschwindet sofort beim ×-Klick (ohne Reload);
  der Zahler-Select im Ausgaben-Formular aktualisiert sich live; der Ergebnisbereich
  aktualisiert sich ohne "Berechnen"-Button.
awaiting: user response

## Tests

### 1. Person hinzufügen und per × entfernen (Live-Re-Render)
expected: Person erscheint und verschwindet sofort; Payer-Select synchron aktualisiert; Ergebnisbereich aktualisiert sich ohne "Berechnen"-Button.
result: [pending]

### 2. Ausgabe erfassen, Ergebnisbereich mit korrekten Werten prüfen
expected: Gesamtkosten, fairer Anteil, Salden (farblich unterschieden: "bekommt X € zurück" / "muss X € zahlen") und Ausgleichszahlungen als lesbare Sätze ("A zahlt X € an B") werden live korrekt angezeigt.
result: [pending]

### 3. Validierungsfeedback für negative Beträge, fehlende zahlende Person und < 2 Personen
expected: Fehlermeldungen direkt aus ValidationError.message (Kern-Wortlaut) kontextnah angezeigt; Ergebnisbereich zeigt Platzhalter statt Zahlen. (a) negativer Betrag → Fehler im Ausgaben-Fehlercontainer; (b) fehlende zahlende Person → PAYER_NOT_REGISTERED-Text; (c) nur 1 Person → TOO_FEW_PERSONS-Platzhalter im Ergebnisbereich.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
