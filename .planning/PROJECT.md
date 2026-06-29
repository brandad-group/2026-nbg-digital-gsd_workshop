# PartyPayback

## What This Is

PartyPayback ist eine kleine, rein clientseitige Web-Anwendung, die die Ausgaben einer gemeinsamen Sommerparty fair auf alle Teilnehmenden verteilt. Man erfasst Personen und ihre bezahlten Beiträge; die App berechnet Gesamtkosten, fairen Anteil pro Person, Salden und konkrete Ausgleichszahlungen. Zielgruppe sind private Gruppen, die nach einer Feier unkompliziert klären wollen, wer wem wie viel zurückzahlt.

## Core Value

Eine fachlich korrekte, nachvollziehbare und gut getestete Ausgleichsrechnung — wenn alles andere wegfällt, müssen Salden und Ausgleichszahlungen stimmen.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Personen erfassen
- [ ] Ausgaben erfassen (zahlende Person, Beschreibung, Betrag)
- [ ] Gesamtkosten berechnen
- [ ] Fairen Anteil pro Person berechnen (gleichmäßig)
- [ ] Saldo pro Person berechnen
- [ ] Konkrete Ausgleichszahlungen vorschlagen (Greedy)
- [ ] Ergebnis verständlich auf einer Seite anzeigen
- [ ] Eingabevalidierung gemäß Fachregeln (keine negativen Beträge, jede Ausgabe braucht eine zahlende Person, mind. 2 Personen)

### Out of Scope

- Benutzerkonten / Login / Authentifizierung — V1 ist rein lokal, keine Identität nötig
- Datenbank / serverseitige Persistenz — bewusst In-Memory, hält die Demo schlank
- Mehrere Währungen — V1 rechnet nur in Euro
- Beleg-Upload / OCR / Fotoerkennung — außerhalb des Kernnutzens
- Zahlungsstatus-Tracking — V1 schlägt Ausgleich nur vor, verfolgt ihn nicht
- Unterschiedliche Kostenanteile / Beteiligung pro Person oder pro Ausgabe — V1 verteilt strikt gleichmäßig
- Mehrere Partys / gespeicherte Historie — eine Abrechnung pro Sitzung
- Minimale Transaktionszahl-Optimierung — nachvollziehbarer Greedy genügt, keine mathematische Optimierung

## Context

- **Workshop-Demo**: Wird in einem 90-minütigen Live-Workshop parallel von ~20 Teilnehmenden durch GSD realisiert. Prozess bewusst schlank halten, bei Unklarheit den einfacheren/schnelleren Weg wählen — ohne den Core Value zu opfern.
- **Toolchain bereits aufgesetzt**: `package.json` + `package-lock.json` (TypeScript, Vite, Vitest, `@fontsource/inter`) liegen vor; Dependencies wurden per `npm ci` als Pre-Work installiert. Kein `npm install`/`npm create`, keine Versionsänderungen. Neue Quellcode-Dateien (`index.html`, `src/**`) dürfen frei angelegt werden.
- **Zwei Bausteine genügen**: (A) framework-unabhängiger Berechnungskern inkl. Validierung + Tests; (B) Datenerfassung + minimale Oberfläche, die den Kern anbindet und das Ergebnis anzeigt.
- **Ausgleichsalgorithmus**: Greedy — größter Gläubiger gegen größten Schuldner — ist ausdrücklich ausreichend.

## Constraints

- **Tech stack**: TypeScript + Vite (Build/Dev), Vitest (Unit-Tests) — im PRD fixiert, nicht offen.
- **UI**: Vanilla DOM, kein UI-Framework (kein React/Vue/Svelte), kein Routing, keine State-Library — bewusst minimal, eine einzige Seite.
- **Dependencies**: Runtime-Deps auf absolutes Minimum. Keine externen CDNs zur Laufzeit; alles self-hosten/bündeln. Webfont nur via `@fontsource/*` (bereits `@fontsource/inter`).
- **Persistenz**: keine — rein clientseitig, In-Memory.
- **Fachregeln**: Beträge in Euro, auf 2 Nachkommastellen gerundet; gleichmäßiger Anteil für alle; keine negativen Beträge; jede Ausgabe braucht eine zahlende Person; mind. 2 Personen für eine sinnvolle Abrechnung; Personen dürfen 0 € gezahlt haben.
- **Timeline**: Workshop-Demo, ~90 Minuten — Scope und Doku knapp halten, kein Gold-Plating.
- **Testfokus**: Unit-Tests verpflichtend für den Berechnungskern (Gesamtkosten, fairer Anteil, Salden, Rundung, Ausgleichszahlungen); für Erfassung/Oberfläche genügt manuelle Sichtprüfung.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Zwei Phasen: Berechnungskern → UI (Horizontal Layers) | Spiegelt die zwei PRD-Bausteine; Kern ist UI-unabhängig testbar | — Pending |
| Greedy-Ausgleich statt min. Transaktionszahl | Nachvollziehbar und ausreichend; Optimierung wäre Gold-Plating | — Pending |
| Gleichmäßiger Anteil für alle, keine Gewichtung | PRD-Fachregel für V1; hält Logik einfach | — Pending |
| Vanilla DOM ohne Framework | PRD-Vorgabe; minimale Oberfläche, eine Seite | — Pending |
| Keine Persistenz (In-Memory) | PRD-Vorgabe; keine Konten/DB nötig | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-29 after initialization*
