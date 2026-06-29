/**
 * Anzeige-Helfer für PartyPayback.
 *
 * Enthält keine Fachlogik — nur Formatierungsfunktionen für die Anzeige.
 */

import type { Person } from '../core/index';

// ──────────────────────────────────────────────
// Euro-Formatierung
// ──────────────────────────────────────────────

/** Formatiert einen Betrag mit genau 2 Nachkommastellen und Euro-Zeichen.
 *  Beispiel: 12.5 → "12,50 €" */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ──────────────────────────────────────────────
// Saldo-Text (D-10)
// ──────────────────────────────────────────────

/** Gibt einen lesbaren Saldo-Text zurück:
 *  positiv → "bekommt X € zurück"
 *  negativ → "muss X € zahlen"
 *  exakt 0 → "ist ausgeglichen" */
export function formatBalance(balance: number): string {
  if (balance > 0) {
    return `bekommt ${formatEuro(balance)} zurück`;
  }
  if (balance < 0) {
    return `muss ${formatEuro(Math.abs(balance))} zahlen`;
  }
  return 'ist ausgeglichen';
}

// ──────────────────────────────────────────────
// ID → Name-Mapping
// ──────────────────────────────────────────────

/** Mappt eine personId auf Person.name.
 *  Fallback: die ID selbst, falls nicht gefunden. */
export function nameOf(personId: string, persons: Person[]): string {
  const person = persons.find((p) => p.id === personId);
  return person ? person.name : personId;
}
