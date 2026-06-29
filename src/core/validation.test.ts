import { validateSettlementInput } from './validation';
import type { Person, Expense } from './types';

describe('validateSettlementInput', () => {
  const personA: Person = { id: 'p1', name: 'Alice' };
  const personB: Person = { id: 'p2', name: 'Bob' };

  const validExpense: Expense = {
    id: 'e1',
    payerId: 'p1',
    description: 'Pizza',
    amount: 30,
  };

  it('gibt ok:true zurück bei 2 Personen und gültiger Ausgabe', () => {
    const result = validateSettlementInput([personA, personB], [validExpense]);
    expect(result.ok).toBe(true);
  });

  it('gibt ok:true zurück bei 2 Personen ohne Ausgaben', () => {
    const result = validateSettlementInput([personA, personB], []);
    expect(result.ok).toBe(true);
  });

  it('gibt ok:false mit TOO_FEW_PERSONS bei 0 Personen', () => {
    const result = validateSettlementInput([], []);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === 'TOO_FEW_PERSONS')).toBe(true);
    }
  });

  it('gibt ok:false mit TOO_FEW_PERSONS bei 1 Person', () => {
    const result = validateSettlementInput([personA], [validExpense]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === 'TOO_FEW_PERSONS')).toBe(true);
    }
  });

  it('gibt ok:false mit NEGATIVE_AMOUNT bei negativem Betrag', () => {
    const negativeExpense: Expense = {
      id: 'e2',
      payerId: 'p1',
      description: 'Negativ',
      amount: -5,
    };
    const result = validateSettlementInput([personA, personB], [negativeExpense]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === 'NEGATIVE_AMOUNT')).toBe(true);
    }
  });

  it('gibt ok:true bei amount === 0 (0 € ist zulässig, EXP-04)', () => {
    const zeroExpense: Expense = {
      id: 'e3',
      payerId: 'p1',
      description: 'Gratis',
      amount: 0,
    };
    const result = validateSettlementInput([personA, personB], [zeroExpense]);
    expect(result.ok).toBe(true);
  });

  it('gibt ok:false mit PAYER_NOT_REGISTERED wenn payerId nicht erfasst', () => {
    const unknownPayerExpense: Expense = {
      id: 'e4',
      payerId: 'unbekannt',
      description: 'Unbekannte Zahlerin',
      amount: 20,
    };
    const result = validateSettlementInput([personA, personB], [unknownPayerExpense]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === 'PAYER_NOT_REGISTERED')).toBe(true);
    }
  });

  it('sammelt mehrere Fehler gleichzeitig (bricht nicht beim ersten Fehler ab)', () => {
    const multiViolationExpense: Expense = {
      id: 'e5',
      payerId: 'unbekannt',
      description: 'Mehrere Verstöße',
      amount: -10,
    };
    // 0 Personen + negativer Betrag + unbekannte payerId
    const result = validateSettlementInput([], [multiViolationExpense]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const codes = result.errors.map((e) => e.code);
      expect(codes).toContain('TOO_FEW_PERSONS');
      expect(codes).toContain('NEGATIVE_AMOUNT');
      expect(codes).toContain('PAYER_NOT_REGISTERED');
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    }
  });
});
