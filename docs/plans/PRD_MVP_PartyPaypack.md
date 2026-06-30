**PartyPayback**

Wir möchten ein kleines Greenfield Projekt namens **PartyPayback** starten.

PartyPayback ist eine einfache Anwendung für ein sehr bekanntes Alltagsproblem: Freundinnen und Freunde treffen sich zur Sommerparty. Alle bringen etwas mit. Eine Person sorgt für Salate, eine andere für Getränke, jemand bringt Grillgut mit, jemand anderes Nachtisch, Eiswürfel oder diese eine Spezialsoße, von der vorher niemand wusste, dass sie lebensnotwendig ist.

Manches war vorher grob abgesprochen. Manches entsteht spontan. Manche bringen mehr mit als geplant, andere finden vielleicht nicht alles im Supermarkt, und am Ende wird es trotzdem genau das, was es werden sollte: eine richtig gute gemeinsame Feier.

Am nächsten Tag bleibt aber eine kleine Frage übrig: **Wer bekommt eigentlich noch Geld zurück?**

Niemand soll auf hohen Ausgaben sitzen bleiben, nur weil sie oder er besonders viel organisiert oder bezahlt hat. Gleichzeitig soll die Abrechnung einfach genug sein, damit sie auch dann noch funktioniert, wenn der Kopf nach gutem Essen, langen Gesprächen und vielleicht ein paar Getränken nicht mehr ganz im Hochleistungsmodus läuft.

**PartyPayback** soll dabei helfen, die Ausgaben einer gemeinsamen Sommerparty fair zu verteilen. Die Teilnehmenden werden erfasst, ihre bezahlten Beiträge werden eingetragen, und die Anwendung berechnet:

1. wie hoch die Gesamtkosten waren
2. welchen fairen Anteil jede Person tragen sollte
3. wer zu viel bezahlt hat
4. wer noch etwas zahlen muss
5. welche konkreten Ausgleichszahlungen zwischen den Personen sinnvoll sind

Ziel ist eine einfache, nachvollziehbare und faire Ausgleichsrechnung für alle Beteiligten, damit nach der Party nicht die Diskussion über Geld länger dauert als die Party selbst.

## Scope für Version 1

Die erste Version soll bewusst klein, verständlich und gut testbar bleiben.

Enthalten sein soll:

1. Personen erfassen
2. Ausgaben erfassen
3. Pro Ausgabe eine zahlende Person, eine Beschreibung und einen Betrag speichern
4. Gesamtkosten berechnen
5. Fairen Anteil pro Person berechnen
6. Saldo pro Person berechnen
7. Konkrete Ausgleichszahlungen vorschlagen
8. Ergebnis verständlich anzeigen

## Fachliche Regeln

1. Alle Teilnehmenden tragen in Version 1 den gleichen Anteil an den Gesamtkosten.
2. Es gibt keine unterschiedlichen Beteiligungen pro Ausgabe.
3. Es gibt keine Sonderregeln für einzelne Personen.
4. Beträge werden in Euro erfasst.
5. Beträge werden auf zwei Nachkommastellen gerundet.
6. Ausgleichszahlungen sollen möglichst einfach und nachvollziehbar sein.
7. Personen können auch null Euro bezahlt haben.
8. Eine Ausgabe muss immer einer zahlenden Person zugeordnet sein.
9. Negative Beträge sind nicht erlaubt.
10. Ohne mindestens zwei Personen soll keine sinnvolle Abrechnung erstellt werden.

## Nicht im Scope für Version 1

Nicht enthalten sein sollen:

1. Benutzerkonten
2. Login oder Authentifizierung
3. Datenbank oder serverseitige Persistenz
4. Mehrere Währungen
5. Beleg Upload
6. OCR oder Fotoerkennung
7. Zahlungsstatus
8. Unterschiedliche Kostenanteile pro Person
9. Unterschiedliche Beteiligung einzelner Personen an einzelnen Ausgaben
10. Mehrere Partys oder gespeicherte Historie

## Qualitätsfokus

Der wichtigste Teil des Projekts ist die fachlich korrekte und gut getestete Berechnungslogik.

Die Anwendung soll so aufgebaut sein, dass die Kernlogik unabhängig von der Oberfläche getestet werden kann. Unit Tests sollen insbesondere die Berechnung von Gesamtkosten, fairem Anteil, Salden, Rundung und Ausgleichszahlungen abdecken.

Die Oberfläche darf einfach bleiben. Sie soll nur so viel können, wie nötig ist, um Personen und Ausgaben einzugeben und das Ergebnis nachvollziehbar anzuzeigen.

## Technischer Stack (Version 1)

Der Stack ist für die Workshop-Demo bewusst festgelegt und **nicht offen zu lassen** — diese Vorgabe ersetzt jede sonst nötige Stack-Annahme im GSD-Prozess:

- **Sprache:** TypeScript
- **Build / Dev-Server:** Vite
- **Tests:** Vitest (Unit-Tests für den Berechnungskern)
- **Oberfläche:** Vanilla DOM — **kein** UI-Framework (kein React/Vue/Svelte), kein Routing, keine State-Library
- **Runtime-Dependencies:** auf das absolute Minimum beschränken. Keine externen CDNs zur Laufzeit; alles self-hosten/bündeln. Falls ein Webfont gewünscht ist, via `@fontsource/*` ins Bundle holen (nicht über Google Fonts).
- **Persistenz:** keine — rein clientseitig, In-Memory (wie im Scope vorgegeben).

## Bitte für den GSD Prozess

Erstelle daraus zuerst ein kompaktes PRD für PartyPayback.

Starte noch nicht mit der Implementierung.

Frage nur nach, wenn eine Entscheidung für Version 1 zwingend notwendig ist. Triff ansonsten sinnvolle Annahmen, halte sie sichtbar fest und achte darauf, den Scope klein genug für eine kurze Workshop Demo zu halten.

Nach Freigabe des PRDs sollen daraus die passenden GSD Spec Dateien für Planung, Architektur, Implementierung und Tests abgeleitet werden.

## Workshop-Kontext & Steuerung (Version 1)

Dieses PRD wird in einem **90-minütigen Live-Workshop** parallel von rund 20 Teilnehmenden durch GSD realisiert. Halte den gesamten Prozess bewusst schlank und wähle bei jeder Unklarheit den **einfacheren, schnelleren Weg** — ohne den Core Value (korrekte, getestete Ausgleichsrechnung) zu opfern. Konkret für Version 1:

1. **Zwei Bausteine genügen.** Plane das Projekt als zwei zusammenhängende Lieferblöcke: (A) den framework-unabhängigen **Berechnungskern** inkl. Validierung und Tests; (B) **Datenerfassung + minimale Oberfläche**, die den Kern anbindet und das Ergebnis anzeigt. Lege die Roadmap grob an (wenige Phasen) und bevorzuge **einen Plan pro Phase**, statt in viele Teilpläne zu zerlegen.
2. **Tests fokussieren.** Unit-Tests sind verpflichtend für den **Berechnungskern** (Gesamtkosten, fairer Anteil, Salden, Rundung, Ausgleichszahlungen). Für Datenerfassung und Oberfläche genügt manuelle Sichtprüfung — dort keine umfassende Testabdeckung.
3. **Ausgleichszahlungen einfach halten.** Ein nachvollziehbarer Greedy-Ansatz (größter Gläubiger gegen größten Schuldner) ist ausdrücklich ausreichend. Keine aufwendige Optimierung auf die mathematisch minimale Transaktionszahl nötig.
4. **Oberfläche minimal.** Eine einzige Seite zum Erfassen und Anzeigen. Kein Routing, keine zusätzlichen Ansichten, kein Feature jenseits der oben genannten Scope-Punkte.
5. **Kein Gold-Plating.** Keine Edge-Cases jenseits der Fachregeln, keine spekulativen Erweiterungen, knappe Planungs- und Zusammenfassungs-Dokumente.
