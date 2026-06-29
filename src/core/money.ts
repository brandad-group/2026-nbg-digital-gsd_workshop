/**
 * Geld-Arithmetik für den PartyPayback-Berechnungskern.
 *
 * Enthält ausschließlich mathematische Helfer — keine Fachregeln.
 * Alle Fachregeln (z. B. "keine negativen Beträge") liegen in validation.ts.
 */

/**
 * Rundet einen Euro-Betrag kaufmännisch auf 2 Nachkommastellen.
 *
 * Verwendet Number.EPSILON zur Epsilon-Korrektur gegen Float-Drift,
 * damit z. B. 0.1 + 0.2 = 0.30 und nicht 0.30000000000000004 liefert.
 */
export function roundEuro(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Wandelt einen Euro-Betrag in ganzzahlige Cents um.
 * Intern für Cent-genaue Ganzzahlarithmetik in der Greedy-Schleife.
 */
export function toCents(value: number): number {
  return Math.round(value * 100);
}

/**
 * Wandelt Cents zurück in einen Euro-Betrag (auf 2 Nachkommastellen).
 */
export function fromCents(cents: number): number {
  return roundEuro(cents / 100);
}
