import {
  calculateTotalCost,
  calculateFairShare,
  calculateBalances,
  calculateTransfers,
  calculateSettlement,
  SettlementValidationError,
} from './settlement';
import type { Person, Expense } from './types';

// ─── Hilfsdaten ────────────────────────────────────────────────────────────

const p1: Person = { id: 'p1', name: 'Alice' };
const p2: Person = { id: 'p2', name: 'Bob' };
const p3: Person = { id: 'p3', name: 'Charlie' };

// ─── calculateTotalCost (CALC-01) ──────────────────────────────────────────

describe('calculateTotalCost', () => {
  it('summiert alle Ausgaben korrekt', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'Pizza', amount: 30 },
      { id: 'e2', payerId: 'p2', description: 'Getränke', amount: 20 },
    ];
    expect(calculateTotalCost(expenses)).toBe(50);
  });

  it('gibt 0 zurück bei leerer Ausgabenliste', () => {
    expect(calculateTotalCost([])).toBe(0);
  });

  it('summiert auch Float-Beträge korrekt', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'A', amount: 10.5 },
      { id: 'e2', payerId: 'p2', description: 'B', amount: 9.5 },
    ];
    expect(calculateTotalCost(expenses)).toBe(20);
  });
});

// ─── calculateFairShare (CALC-02) ──────────────────────────────────────────

describe('calculateFairShare', () => {
  it('teilt Gesamtkosten gleichmäßig auf alle Personen auf', () => {
    expect(calculateFairShare(100, 2)).toBe(50);
  });

  it('rundet den Anteil auf 2 Nachkommastellen (100 / 3 = 33.33)', () => {
    expect(calculateFairShare(100, 3)).toBe(33.33);
  });

  it('rundet korrekt bei Float-Gesamtbetrag', () => {
    // 10 / 3 = 3.333... → 3.33
    expect(calculateFairShare(10, 3)).toBe(3.33);
  });
});

// ─── calculateBalances (CALC-03) ───────────────────────────────────────────

describe('calculateBalances', () => {
  it('berechnet bezahlte Beträge und Salden korrekt', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'Pizza', amount: 100 },
    ];
    const fairShare = 50;
    const balances = calculateBalances([p1, p2], expenses, fairShare);

    const balP1 = balances.find((b) => b.personId === 'p1')!;
    const balP2 = balances.find((b) => b.personId === 'p2')!;

    expect(balP1.paid).toBe(100);
    expect(balP1.fairShare).toBe(50);
    expect(balP1.balance).toBe(50); // bekommt zurück

    expect(balP2.paid).toBe(0);
    expect(balP2.fairShare).toBe(50);
    expect(balP2.balance).toBe(-50); // muss zahlen
  });

  it('Person ohne Ausgaben hat paid === 0', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'Alles', amount: 90 },
    ];
    const balances = calculateBalances([p1, p2, p3], expenses, 30);
    const balP3 = balances.find((b) => b.personId === 'p3')!;
    expect(balP3.paid).toBe(0);
  });

  it('Summe aller Salden ist exakt 0.00', () => {
    // 3 Personen, Gesamt 100 → Anteil 33.33, Rest-Cent wird verteilt
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'Alles', amount: 100 },
    ];
    const fairShare = calculateFairShare(100, 3);
    const balances = calculateBalances([p1, p2, p3], expenses, fairShare);
    const sum = balances.reduce((acc, b) => acc + b.balance, 0);
    expect(Math.round(sum * 100)).toBe(0); // auf Cent-Genauigkeit prüfen
  });
});

// ─── calculateTransfers / Greedy-Ausgleich (CALC-05) ───────────────────────

describe('calculateTransfers', () => {
  it('Beispiel A: P1 zahlte 100, P2 zahlte 0 → ein Transfer P2→P1 über 50.00', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'Alles', amount: 100 },
    ];
    const fairShare = calculateFairShare(100, 2);
    const balances = calculateBalances([p1, p2], expenses, fairShare);
    const transfers = calculateTransfers(balances);

    expect(transfers).toHaveLength(1);
    expect(transfers[0].fromId).toBe('p2');
    expect(transfers[0].toId).toBe('p1');
    expect(transfers[0].amount).toBe(50.0);
  });

  it('Beispiel B: 3 Personen P1=90, P2=30, P3=0 → Transfers P3→P1 und P2→P1', () => {
    // Gesamt 120, Anteil 40 → Salden +50 / -10 / -40
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'A', amount: 90 },
      { id: 'e2', payerId: 'p2', description: 'B', amount: 30 },
    ];
    const fairShare = calculateFairShare(120, 3);
    const balances = calculateBalances([p1, p2, p3], expenses, fairShare);
    const transfers = calculateTransfers(balances);

    // Greedy: größter Schuldner (P3, -40) zuerst gegen größten Gläubiger (P1, +50)
    // → Transfer P3→P1 über 40, dann P2→P1 über 10
    expect(transfers.length).toBe(2);

    const t1 = transfers.find((t) => t.fromId === 'p3');
    const t2 = transfers.find((t) => t.fromId === 'p2');

    expect(t1).toBeDefined();
    expect(t1?.toId).toBe('p1');
    expect(t1?.amount).toBe(40);

    expect(t2).toBeDefined();
    expect(t2?.toId).toBe('p1');
    expect(t2?.amount).toBe(10);
  });

  it('erzeugt keine Transfers mit amount === 0', () => {
    // Alle zahlen gleich viel → keine Ausgleiche nötig
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'A', amount: 50 },
      { id: 'e2', payerId: 'p2', description: 'B', amount: 50 },
    ];
    const fairShare = calculateFairShare(100, 2);
    const balances = calculateBalances([p1, p2], expenses, fairShare);
    const transfers = calculateTransfers(balances);
    expect(transfers.every((t) => t.amount > 0)).toBe(true);
  });

  it('Reconciliation: Summe der Transfers gleicht positive Salden vollständig aus', () => {
    // Beispiel B
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'A', amount: 90 },
      { id: 'e2', payerId: 'p2', description: 'B', amount: 30 },
    ];
    const fairShare = calculateFairShare(120, 3);
    const balances = calculateBalances([p1, p2, p3], expenses, fairShare);
    const transfers = calculateTransfers(balances);

    // Summe der positiven Salden (= was zurück zu bekommen ist)
    const positiveBalanceSum = balances
      .filter((b) => b.balance > 0)
      .reduce((acc, b) => acc + b.balance, 0);

    const transferSum = transfers.reduce((acc, t) => acc + t.amount, 0);
    expect(Math.round(transferSum * 100)).toBe(Math.round(positiveBalanceSum * 100));
  });

  it('Reconciliation: nach Anwendung aller Transfers ist jeder Saldo 0', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'A', amount: 90 },
      { id: 'e2', payerId: 'p2', description: 'B', amount: 30 },
    ];
    const fairShare = calculateFairShare(120, 3);
    const balances = calculateBalances([p1, p2, p3], expenses, fairShare);
    const transfers = calculateTransfers(balances);

    // Salden als veränderliche Map simulieren
    const balanceMap = new Map(balances.map((b) => [b.personId, b.balance]));
    for (const t of transfers) {
      balanceMap.set(t.fromId, (balanceMap.get(t.fromId) ?? 0) + t.amount);
      balanceMap.set(t.toId, (balanceMap.get(t.toId) ?? 0) - t.amount);
    }
    for (const [, bal] of balanceMap) {
      expect(Math.round(bal * 100)).toBe(0);
    }
  });
});

// ─── calculateSettlement (Integration) ─────────────────────────────────────

describe('calculateSettlement', () => {
  it('liefert korrektes SettlementResult für gültige Eingabe', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'Pizza', amount: 100 },
    ];
    const result = calculateSettlement([p1, p2], expenses);

    expect(result.totalCost).toBe(100);
    expect(result.fairShare).toBe(50);
    expect(result.balances).toHaveLength(2);
    expect(result.transfers).toHaveLength(1);
  });

  it('alle Geldwerte haben höchstens 2 Nachkommastellen', () => {
    const expenses: Expense[] = [
      { id: 'e1', payerId: 'p1', description: 'A', amount: 100 },
    ];
    const result = calculateSettlement([p1, p2, p3], expenses);

    const twoDecimals = (n: number) => Math.round(n * 100) / 100 === n;

    expect(twoDecimals(result.totalCost)).toBe(true);
    expect(twoDecimals(result.fairShare)).toBe(true);
    result.balances.forEach((b) => {
      expect(twoDecimals(b.paid)).toBe(true);
      expect(twoDecimals(b.fairShare)).toBe(true);
      expect(twoDecimals(b.balance)).toBe(true);
    });
    result.transfers.forEach((t) => {
      expect(twoDecimals(t.amount)).toBe(true);
    });
  });

  it('wirft SettlementValidationError bei weniger als 2 Personen', () => {
    expect(() => calculateSettlement([p1], [])).toThrow(SettlementValidationError);
  });

  it('wirft SettlementValidationError bei negativem Betrag', () => {
    const badExpense: Expense = {
      id: 'e1',
      payerId: 'p1',
      description: 'Negativ',
      amount: -5,
    };
    expect(() => calculateSettlement([p1, p2], [badExpense])).toThrow(
      SettlementValidationError,
    );
  });

  it('wirft SettlementValidationError bei unbekannter payerId', () => {
    const badExpense: Expense = {
      id: 'e1',
      payerId: 'unbekannt',
      description: 'Unbekannt',
      amount: 10,
    };
    expect(() => calculateSettlement([p1, p2], [badExpense])).toThrow(
      SettlementValidationError,
    );
  });

  it('liefert bei ungültiger Eingabe kein Teilergebnis (wirft immer)', () => {
    let result: unknown = undefined;
    try {
      result = calculateSettlement([p1], []);
    } catch {
      // erwartet
    }
    expect(result).toBeUndefined();
  });

  it('SettlementValidationError trägt die Validierungsfehler', () => {
    try {
      calculateSettlement([p1], []);
    } catch (e) {
      expect(e).toBeInstanceOf(SettlementValidationError);
      if (e instanceof SettlementValidationError) {
        expect(e.errors.length).toBeGreaterThan(0);
        expect(e.errors[0].code).toBe('TOO_FEW_PERSONS');
      }
    }
  });
});
