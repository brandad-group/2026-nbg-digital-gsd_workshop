/**
 * Datentypen für den PartyPayback-Berechnungskern.
 * Enthält ausschließlich Typdeklarationen — keine Laufzeitlogik.
 */

/** Eine Person, die an der Abrechnung teilnimmt. */
export interface Person {
  id: string;
  name: string;
}

/**
 * Eine Ausgabe, die von einer Person bezahlt wurde.
 * amount ist der Betrag in Euro (>= 0).
 */
export interface Expense {
  id: string;
  payerId: string;
  description: string;
  amount: number;
}

/**
 * Saldo einer Person.
 * balance = paid - fairShare:
 *   positiv → Person bekommt Geld zurück
 *   negativ → Person muss Geld zahlen
 */
export interface PersonBalance {
  personId: string;
  paid: number;
  fairShare: number;
  balance: number;
}

/**
 * Eine konkrete Ausgleichszahlung.
 * fromId zahlt amount an toId.
 */
export interface Transfer {
  fromId: string;
  toId: string;
  amount: number;
}

/** Das Gesamtergebnis der Abrechnung. */
export interface SettlementResult {
  totalCost: number;
  fairShare: number;
  balances: PersonBalance[];
  transfers: Transfer[];
}

/** Fehlercodes für Fachregelverstöße. */
export type ValidationErrorCode =
  | 'TOO_FEW_PERSONS'
  | 'NEGATIVE_AMOUNT'
  | 'PAYER_NOT_REGISTERED';

/** Ein einzelner Validierungsfehler mit Code und nachvollziehbarer Nachricht. */
export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
}

/** Ergebnis der Fachregelpüfung. */
export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: ValidationError[] };
