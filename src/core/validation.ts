/**
 * Fachregeln-Validierung für den PartyPayback-Berechnungskern.
 *
 * validateSettlementInput prüft alle Fachregeln, sammelt alle Verstöße
 * und bricht nicht beim ersten Fehler ab.
 */

import type { Person, Expense, ValidationError, ValidationResult } from './types';

/**
 * Prüft ob Personen und Ausgaben die Fachregeln erfüllen.
 *
 * Fachregeln:
 *   PERS-03: Mindestens 2 Personen für eine sinnvolle Abrechnung.
 *   EXP-04:  Beträge müssen >= 0 sein; negative Beträge sind ungültig.
 *   EXP-02:  Jede Ausgabe muss einer erfassten Person zugeordnet sein.
 *
 * Liefert { ok: true } wenn alle Regeln erfüllt sind,
 * sonst { ok: false; errors: ValidationError[] } mit allen Verstößen.
 */
export function validateSettlementInput(
  persons: Person[],
  expenses: Expense[],
): ValidationResult {
  const errors: ValidationError[] = [];

  // PERS-03: Mindestens 2 Personen erforderlich
  if (persons.length < 2) {
    errors.push({
      code: 'TOO_FEW_PERSONS',
      message: `Für eine Abrechnung werden mindestens 2 Personen benötigt. Aktuell: ${persons.length}.`,
    });
  }

  // Personen-IDs als Set für O(1)-Lookup
  const personIds = new Set(persons.map((p) => p.id));

  for (const expense of expenses) {
    // EXP-04: Negative Beträge sind ungültig; 0 € ist zulässig
    if (expense.amount < 0) {
      errors.push({
        code: 'NEGATIVE_AMOUNT',
        message: `Ausgabe "${expense.description}" hat einen negativen Betrag (${expense.amount} €). Negative Beträge sind nicht zulässig.`,
      });
    }

    // EXP-02: payerId muss zu einer erfassten Person gehören
    if (!personIds.has(expense.payerId)) {
      errors.push({
        code: 'PAYER_NOT_REGISTERED',
        message: `Ausgabe "${expense.description}": Die zahlende Person (ID "${expense.payerId}") ist nicht unter den erfassten Personen registriert.`,
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}
