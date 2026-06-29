/**
 * Öffentliche API des PartyPayback-Berechnungskerns.
 *
 * Dieses Barrel ist die einzige Datei, die Phase 2 (UI) importiert.
 * Enthält ausschließlich Re-Export-Statements — keine Berechnungs- oder DOM-Logik.
 */

// Datentypen
export type {
  Person,
  Expense,
  PersonBalance,
  Transfer,
  SettlementResult,
  ValidationError,
  ValidationErrorCode,
  ValidationResult,
} from './types';

// Geld-Arithmetik
export { roundEuro, toCents, fromCents } from './money';

// Validierung
export { validateSettlementInput } from './validation';

// Settlement-Berechnung
export {
  calculateSettlement,
  calculateTotalCost,
  calculateFairShare,
  calculateBalances,
  calculateTransfers,
  SettlementValidationError,
} from './settlement';
