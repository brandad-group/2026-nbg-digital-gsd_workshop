# Phase 2: Erfassung & Oberfläche - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-29
**Phase:** 2-Erfassung & Oberfläche
**Mode:** `--auto` (autonom — empfohlene Option je Gray Area gewählt, keine interaktiven Prompts)
**Areas discussed:** Seitenlayout, Ergebnis-Trigger, Validierungsfeedback, Erfassen/Entfernen-UX, Leerzustand, Visueller Stil

---

## Seitenlayout & Struktur

| Option | Description | Selected |
|--------|-------------|----------|
| Einspaltig, vertikal gestapelt (Personen → Ausgaben → Ergebnis) | Eine durchscrollbare Seite, simpel & responsiv | ✓ |
| Zweispaltig (Erfassung links, Ergebnis rechts) | Mehr Layout-Aufwand, weniger mobil | |
| Tabs / Wizard | Wäre Routing-nah, gegen "eine Seite" | |

**Auto-Wahl:** Einspaltig, vertikal gestapelt (empfohlen)
**Notes:** Deckt UI-01 (eine Seite, kein Routing) am direktesten ab.

---

## Ergebnis-Trigger (Neuberechnung)

| Option | Description | Selected |
|--------|-------------|----------|
| Live/reaktiv nach jeder Mutation | Re-Render bei add/remove, kein Extra-Klick | ✓ |
| Expliziter "Berechnen"-Button | Mehr Interaktion, mehr State-Sync nötig | |

**Auto-Wahl:** Live/reaktiv (empfohlen)
**Notes:** Vanilla-Re-Render bei jeder Zustandsänderung; flüssiges Feedback.

---

## Validierungsfeedback

| Option | Description | Selected |
|--------|-------------|----------|
| Inline-Hinweise + Ergebnis-Platzhalter, Texte aus ValidationError.message | Single-Source-of-Truth im Kern | ✓ |
| Globaler Fehler-Banner oben | Weniger kontextnah | |
| Alert-Dialoge | Unterbrechend, schlechte UX | |

**Auto-Wahl:** Inline-Hinweise + Platzhalter (empfohlen)
**Notes:** UI nutzt `validateSettlementInput`; `calculateSettlement` nur bei `ok: true` anzeigen.

---

## Erfassen- & Entfernen-UX

| Option | Description | Selected |
|--------|-------------|----------|
| Formular + Listenzeilen mit Inline-×, Zahler per `<select>` | Minimal, direkt, vanilla-freundlich | ✓ |
| Editierbare Tabelle | Mehr Aufwand für Inline-Edit | |
| Modale Dialoge | Overhead für eine Demo | |

**Auto-Wahl:** Formular + Listenzeilen (empfohlen)
**Notes:** Zahler-`<select>` aus erfassten Personen; Betrag als number-Input min=0 step=0.01.

---

## Leer-/Initialzustand

| Option | Description | Selected |
|--------|-------------|----------|
| Freundlicher Platzhalter mit Handlungshinweis | Führt den Nutzer (z. B. "mind. 2 Personen") | ✓ |
| Leere Fläche | Wirkt kaputt | |
| Beispieldaten vorbefüllen | Vermischt Demo-Daten mit echten | |

**Auto-Wahl:** Platzhalter mit Hinweis (empfohlen)

---

## Visueller Stil

| Option | Description | Selected |
|--------|-------------|----------|
| Handgeschriebenes CSS + Inter (@fontsource), minimal-clean Card-Layout | Self-hosted, CSP-konform, kein Framework | ✓ |
| Ungestyltes Browser-Default | Widerspricht design-bewusster Vorgabe | |
| Vorab eigenes UI-SPEC via /gsd-ui-phase | Optional, hier nicht verpflichtend gewählt | |

**Auto-Wahl:** Handgeschriebenes CSS + Inter (empfohlen)
**Notes:** Keine externen CDNs/Google Fonts (BRANDAD/CSP-Constraint). Salden positiv/negativ visuell absetzen.

---

## Claude's Discretion

- Modulaufteilung (`index.html`, `src/main.ts`, ggf. `src/ui/*`) — einzige harte Vorgabe: nur aus `src/core/index.ts` importieren.
- ID-Generierung via `crypto.randomUUID()` empfohlen.
- Farbschema, Spacing-Skala, Mikro-Interaktionen — design-bewusst, kein Gold-Plating.

## Deferred Ideas

Keine — Diskussion blieb im Phasen-Scope. Persistenz, Mehrwährung, Zahlungsstatus, gewichtete Anteile sind in PROJECT.md/REQUIREMENTS.md bereits als Out of Scope geführt.
