# PartyPayback — Requirements

Source: `docs/plans/PRD_MVP_PartyPaypack.md`. V1-Scope für die Workshop-Demo.

## v1 Requirements

### Personen (PERS)
- [ ] **PERS-01**: Nutzer kann eine Person mit Namen zur Abrechnung hinzufügen
- [ ] **PERS-02**: Nutzer kann eine erfasste Person wieder entfernen
- [ ] **PERS-03**: System verhindert eine sinnvolle Abrechnung, solange weniger als zwei Personen erfasst sind

### Ausgaben (EXP)
- [ ] **EXP-01**: Nutzer kann eine Ausgabe mit zahlender Person, Beschreibung und Betrag (Euro) erfassen
- [ ] **EXP-02**: Jede Ausgabe ist genau einer erfassten, zahlenden Person zugeordnet
- [ ] **EXP-03**: Nutzer kann eine erfasste Ausgabe wieder entfernen
- [ ] **EXP-04**: System lehnt negative Beträge ab; 0 € ist zulässig (eine Person darf nichts bezahlt haben)

### Berechnung (CALC)
- [ ] **CALC-01**: System berechnet die Gesamtkosten als Summe aller Ausgaben
- [ ] **CALC-02**: System berechnet den fairen Anteil pro Person gleichmäßig (Gesamtkosten ÷ Personenzahl)
- [ ] **CALC-03**: System berechnet pro Person den Saldo (bezahlt minus fairer Anteil): positiv = bekommt Geld zurück, negativ = muss zahlen
- [ ] **CALC-04**: System rundet alle Geldbeträge auf zwei Nachkommastellen
- [ ] **CALC-05**: System schlägt konkrete Ausgleichszahlungen per Greedy-Verfahren vor (größter Gläubiger gegen größten Schuldner)

### Oberfläche (UI)
- [ ] **UI-01**: Nutzer erfasst Personen und Ausgaben auf einer einzigen Seite (kein Routing)
- [ ] **UI-02**: Nutzer sieht Gesamtkosten, fairen Anteil, Saldo pro Person und die vorgeschlagenen Ausgleichszahlungen verständlich angezeigt
- [ ] **UI-03**: Ungültige Eingaben (negativer Betrag, fehlende zahlende Person, < 2 Personen) werden für den Nutzer nachvollziehbar abgewiesen

## v2 / Deferred

(Keine — V1 ist bewusst der vollständige Workshop-Scope.)

## Out of Scope

- Benutzerkonten / Login / Authentifizierung — V1 ist rein lokal, keine Identität nötig
- Datenbank / serverseitige Persistenz — bewusst In-Memory
- Mehrere Währungen — V1 rechnet nur in Euro
- Beleg-Upload / OCR / Fotoerkennung — außerhalb des Kernnutzens
- Zahlungsstatus-Tracking — V1 schlägt Ausgleich nur vor
- Unterschiedliche Kostenanteile / Beteiligung pro Person oder pro Ausgabe — V1 verteilt strikt gleichmäßig
- Mehrere Partys / gespeicherte Historie — eine Abrechnung pro Sitzung
- Minimale Transaktionszahl-Optimierung — Greedy genügt, kein Gold-Plating

## Traceability

| REQ-ID | Phase |
|--------|-------|
| _(wird vom Roadmap-Schritt gefüllt)_ | |
