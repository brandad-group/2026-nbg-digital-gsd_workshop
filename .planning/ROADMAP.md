# Roadmap: PartyPayback

## Overview

PartyPayback liefert in zwei zusammenhängenden Bausteinen: Zuerst entsteht der framework-unabhängige Berechnungskern, der Gesamtkosten, fairen Anteil, Salden und Greedy-Ausgleichszahlungen korrekt berechnet, die Fachregeln validiert und durch verpflichtende Vitest-Unit-Tests abgesichert ist. Darauf aufbauend folgt die Datenerfassung mit einer minimalen Vanilla-DOM-Oberfläche auf einer einzigen Seite, die den Kern anbindet und das Ergebnis verständlich anzeigt. Der Kern trägt den Core Value; die UI macht ihn bedienbar.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Berechnungskern** - Framework-unabhängige Ausgleichsrechnung inkl. Fachregel-Validierung und Vitest-Unit-Tests (completed 2026-06-29)
- [ ] **Phase 2: Erfassung & Oberfläche** - Eine Vanilla-DOM-Seite zum Erfassen von Personen/Ausgaben, die den Kern anbindet und das Ergebnis anzeigt

## Phase Details

### Phase 1: Berechnungskern

**Goal**: Eine UI-unabhängige, fachlich korrekte Ausgleichsrechnung, die aus Personen und Ausgaben Gesamtkosten, fairen Anteil, Salden und konkrete Greedy-Ausgleichszahlungen ableitet, dabei die Fachregeln durchsetzt und durch Unit-Tests abgesichert ist.
**Depends on**: Nothing (first phase)
**Requirements**: PERS-03, EXP-02, EXP-04, CALC-01, CALC-02, CALC-03, CALC-04, CALC-05
**Success Criteria** (what must be TRUE):

  1. Aus einer Liste von Personen und Ausgaben liefert der Kern Gesamtkosten, fairen Anteil pro Person und Saldo pro Person korrekt und auf zwei Nachkommastellen gerundet.
  2. Der Kern schlägt konkrete Ausgleichszahlungen per Greedy (größter Gläubiger gegen größten Schuldner) vor, deren Summe die Salden vollständig ausgleicht.
  3. Der Kern weist ungültige Eingaben gemäß Fachregeln ab: negative Beträge, Ausgaben ohne zugeordnete zahlende Person, weniger als zwei Personen (0 € ist zulässig).
  4. Verpflichtende Vitest-Unit-Tests decken Gesamtkosten, fairen Anteil, Salden, Rundung und Ausgleichszahlungen ab und laufen grün.

**Plans**: 1 plan
Plans:

- [x] 01-01-PLAN.md — Berechnungskern: Typen, Geld-Rundung, Fachregel-Validierung, Greedy-Settlement + Vitest-Unit-Tests

### Phase 2: Erfassung & Oberfläche

**Goal**: Eine minimale Vanilla-DOM-Oberfläche auf einer einzigen Seite, über die Nutzer Personen und Ausgaben erfassen und entfernen, den Berechnungskern anbinden und das Abrechnungsergebnis verständlich angezeigt bekommen.
**Depends on**: Phase 1
**Requirements**: PERS-01, PERS-02, EXP-01, EXP-03, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):

  1. Nutzer kann auf einer einzigen Seite (kein Routing) Personen mit Namen sowie Ausgaben mit zahlender Person, Beschreibung und Betrag hinzufügen und einzeln wieder entfernen.
  2. Nutzer sieht Gesamtkosten, fairen Anteil, Saldo pro Person und die vorgeschlagenen Ausgleichszahlungen verständlich angezeigt.
  3. Ungültige Eingaben (negativer Betrag, fehlende zahlende Person, weniger als zwei Personen) werden für den Nutzer nachvollziehbar abgewiesen.

**Plans**: 1 plan
Plans:

- [ ] 02-01-PLAN.md — Vanilla-DOM-Seite: HTML/CSS-Card-Layout, In-Memory-State, Kern-Anbindung, Live-Ergebnis-Anzeige und Validierungsfeedback

**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Berechnungskern | 1/1 | Complete   | 2026-06-29 |
| 2. Erfassung & Oberfläche | 0/1 | Not started | - |
