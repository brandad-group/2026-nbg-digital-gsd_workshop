## Workshop-Modus (Live-Demo, ~90 min)

Dieses Projekt wird in einer kurzen Live-Demo durch GSD gebaut. Für jede GSD-Phase gilt:

- Wähle bei Unklarheiten den einfacheren, schnelleren Weg — ohne den Core Value
  (korrekte, getestete Ausgleichsrechnung) zu opfern.
- Bevorzuge **einen Plan pro Phase**; zerlege nicht in viele Teilpläne/Waves.
- Unit-Tests nur für den Berechnungskern. Datenerfassung/UI: manuelle Sichtprüfung.
- Halte Planungs- und Zusammenfassungs-Dokumente knapp. Kein Gold-Plating,
  keine Edge-Cases jenseits der PRD-Fachregeln.
- Modellprofil bleibt `balanced` (nie `budget`).

### Toolchain ist bereits festgelegt — nicht neu aufsetzen

Eine `package.json` + `package-lock.json` mit dem vollständigen Toolchain
(TypeScript, Vite, Vitest) liegt bereits vor. Die Teilnehmer haben die
Abhängigkeiten per `npm ci` aus dem Lockfile installiert (als Pre-Work). Daher:

- **Kein `npm install` / `npm create` ausführen** — der Toolchain ist gesetzt.
  Falls `node_modules` fehlt, ist `npm ci` der richtige Befehl (nicht `npm install`).
- **Dependency-Versionen in `package.json` nicht ändern** — der Stack ist im PRD
  bewusst festgelegt; eine Änderung erzwänge einen erneuten Netzwerk-Install.
- Neue Quellcode-Dateien (`index.html`, `src/**`, `tsconfig.json`,
  `vite.config.ts`) dürfen frei angelegt werden.

<!-- Ab hier verwaltet GSD eigene Blöcke (<!-- GSD:* -->). Der Abschnitt oben
     steht außerhalb dieser Marker und überlebt die Regeneration. -->

<!-- GSD:project-start source:PROJECT.md -->
## Project

**PartyPayback**

PartyPayback ist eine kleine, rein clientseitige Web-Anwendung, die die Ausgaben einer gemeinsamen Sommerparty fair auf alle Teilnehmenden verteilt. Man erfasst Personen und ihre bezahlten Beiträge; die App berechnet Gesamtkosten, fairen Anteil pro Person, Salden und konkrete Ausgleichszahlungen. Zielgruppe sind private Gruppen, die nach einer Feier unkompliziert klären wollen, wer wem wie viel zurückzahlt.

**Core Value:** Eine fachlich korrekte, nachvollziehbare und gut getestete Ausgleichsrechnung — wenn alles andere wegfällt, müssen Salden und Ausgleichszahlungen stimmen.

### Constraints

- **Tech stack**: TypeScript + Vite (Build/Dev), Vitest (Unit-Tests) — im PRD fixiert, nicht offen.
- **UI**: Vanilla DOM, **kein** UI-Framework (kein React/Vue/Svelte), kein Routing, keine State-Library — bewusst minimal, eine einzige Seite.
- **Dependencies**: Runtime-Deps auf absolutes Minimum. Keine externen CDNs zur Laufzeit; alles self-hosten/bündeln. Webfont nur via `@fontsource/*` (bereits `@fontsource/inter`).
- **Persistenz**: keine — rein clientseitig, In-Memory.
- **Fachregeln**: Beträge in Euro, auf 2 Nachkommastellen gerundet; gleichmäßiger Anteil für alle; keine negativen Beträge; jede Ausgabe braucht eine zahlende Person; mind. 2 Personen für eine sinnvolle Abrechnung; Personen dürfen 0 € gezahlt haben.
- **Timeline**: Workshop-Demo, ~90 Minuten — Scope und Doku knapp halten, kein Gold-Plating.
- **Testfokus**: Unit-Tests verpflichtend für den Berechnungskern (Gesamtkosten, fairer Anteil, Salden, Rundung, Ausgleichszahlungen); für Erfassung/Oberfläche genügt manuelle Sichtprüfung.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
