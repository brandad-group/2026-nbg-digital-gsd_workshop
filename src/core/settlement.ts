/**
 * Settlement-Berechnung für den PartyPayback-Berechnungskern.
 *
 * Berechnet Gesamtkosten, fairen Anteil, Salden und Greedy-Ausgleichszahlungen.
 * Setzt vorher Fachregeln über validateSettlementInput durch.
 */

import type {
  Person,
  Expense,
  PersonBalance,
  Transfer,
  SettlementResult,
  ValidationError,
} from './types';
import { roundEuro, toCents, fromCents } from './money';
import { validateSettlementInput } from './validation';

// ─── Fehlerklasse ─────────────────────────────────────────────────────────

/**
 * Wird geworfen, wenn calculateSettlement ungültige Eingaben erhält.
 * Trägt alle Validierungsfehler der fehlgeschlagenen Prüfung.
 */
export class SettlementValidationError extends Error {
  readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    const codes = errors.map((e) => e.code).join(', ');
    super(`Ungültige Eingabe: ${codes}`);
    this.name = 'SettlementValidationError';
    this.errors = errors;
  }
}

// ─── Hilfsfunktionen (exportiert für gezielte Unit-Tests) ─────────────────

/**
 * Berechnet die Gesamtkosten als Summe aller Ausgaben (CALC-01).
 */
export function calculateTotalCost(expenses: Expense[]): number {
  return roundEuro(expenses.reduce((sum, e) => sum + e.amount, 0));
}

/**
 * Berechnet den fairen Anteil pro Person (CALC-02).
 * Ergebnis wird auf 2 Nachkommastellen gerundet.
 */
export function calculateFairShare(total: number, personCount: number): number {
  return roundEuro(total / personCount);
}

/**
 * Berechnet den Saldo pro Person (CALC-03).
 *
 * balance = roundEuro(paid - fairShare):
 *   positiv → Person bekommt Geld zurück
 *   negativ → Person muss Geld zahlen
 *
 * Rundungsausgleich: Da fairShare gerundet wird, kann die Saldensumme um einen
 * oder wenige Cent von 0 abweichen. Der Rest-Cent wird auf den größten Saldo
 * aufgeteilt (d. h. dem Gläubiger mit dem höchsten Saldo zugeschlagen), damit
 * die Summe aller Salden exakt 0 bleibt.
 * (Wahl: einfachste korrekte Verteilung; keine Fachregel-Implikation.)
 */
export function calculateBalances(
  persons: Person[],
  expenses: Expense[],
  fairShare: number,
): PersonBalance[] {
  // Summe der Zahlungen je Person
  const paid = new Map<string, number>(persons.map((p) => [p.id, 0]));
  for (const expense of expenses) {
    paid.set(expense.payerId, (paid.get(expense.payerId) ?? 0) + expense.amount);
  }

  const balances: PersonBalance[] = persons.map((p) => {
    const paidAmount = roundEuro(paid.get(p.id) ?? 0);
    const balance = roundEuro(paidAmount - fairShare);
    return { personId: p.id, paid: paidAmount, fairShare, balance };
  });

  // Cent-Ausgleich: Saldensumme muss exakt 0 sein
  const sumCents = balances.reduce((acc, b) => acc + toCents(b.balance), 0);
  if (sumCents !== 0) {
    // Rest-Cent dem Gläubiger mit dem größten positiven Saldo zuschlagen
    // (falls kein Gläubiger existiert, dem Schuldner mit dem betragsmäßig größten Saldo)
    const candidate = balances.reduce((best, b) =>
      b.balance > best.balance ? b : best,
    );
    candidate.balance = fromCents(toCents(candidate.balance) - sumCents);
  }

  return balances;
}

/**
 * Berechnet Greedy-Ausgleichszahlungen (CALC-05).
 *
 * Algorithmus: Cent-genaue Ganzzahlarithmetik verhindert Float-Drift.
 *   1. Trenne Gläubiger (balance > 0) und Schuldner (balance < 0).
 *   2. Sortiere beide Listen absteigend nach Betrag.
 *   3. Ordne wiederholt den größten Schuldner gegen den größten Gläubiger zu.
 *      Transferiere min(|Schuld|, Guthaben), reduziere beide Seiten.
 *      Entferne ausgeglichene Einträge.
 *   4. Erzeugt keine Null-Transfers.
 *
 * Keine Minimal-Transaktions-Optimierung (bewusst out of scope — CLAUDE.md).
 */
export function calculateTransfers(balances: PersonBalance[]): Transfer[] {
  // In Cents arbeiten, um Float-Drift in der Schleife zu vermeiden
  const creditors = balances
    .filter((b) => toCents(b.balance) > 0)
    .map((b) => ({ personId: b.personId, cents: toCents(b.balance) }))
    .sort((a, b) => b.cents - a.cents);

  const debtors = balances
    .filter((b) => toCents(b.balance) < 0)
    .map((b) => ({ personId: b.personId, cents: -toCents(b.balance) })) // positiver Betrag
    .sort((a, b) => b.cents - a.cents);

  const transfers: Transfer[] = [];

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];

    const transferCents = Math.min(creditor.cents, debtor.cents);

    if (transferCents > 0) {
      transfers.push({
        fromId: debtor.personId,
        toId: creditor.personId,
        amount: fromCents(transferCents),
      });
    }

    creditor.cents -= transferCents;
    debtor.cents -= transferCents;

    if (creditor.cents === 0) ci++;
    if (debtor.cents === 0) di++;
  }

  return transfers;
}

// ─── Hauptfunktion ────────────────────────────────────────────────────────

/**
 * Berechnet die vollständige Abrechnung (CALC-01..CALC-05).
 *
 * Wirft SettlementValidationError wenn Fachregeln verletzt sind —
 * in diesem Fall wird niemals ein Teilergebnis zurückgegeben.
 */
export function calculateSettlement(
  persons: Person[],
  expenses: Expense[],
): SettlementResult {
  // Fachregeln zuerst prüfen — bei Verstoß kein Ergebnis
  const validation = validateSettlementInput(persons, expenses);
  if (!validation.ok) {
    throw new SettlementValidationError(validation.errors);
  }

  const totalCost = calculateTotalCost(expenses);
  const fairShare = calculateFairShare(totalCost, persons.length);
  const balances = calculateBalances(persons, expenses, fairShare);
  const transfers = calculateTransfers(balances);

  return { totalCost, fairShare, balances, transfers };
}
