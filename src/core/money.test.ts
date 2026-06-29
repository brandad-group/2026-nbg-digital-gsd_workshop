import { roundEuro, toCents, fromCents } from './money';

describe('roundEuro', () => {
  it('rundet ganze Zahlen unverändert', () => {
    expect(roundEuro(10)).toBe(10);
  });

  it('rundet kaufmännisch auf den nächsten Cent (0.005 → 0.01)', () => {
    expect(roundEuro(10.005)).toBe(10.01);
  });

  it('rundet kaufmännisch ab wenn < 0.005 (0.004 → 0.00)', () => {
    expect(roundEuro(10.004)).toBe(10.0);
  });

  it('beseitigt Float-Drift (0.1 + 0.2 → 0.30)', () => {
    expect(roundEuro(0.1 + 0.2)).toBe(0.3);
  });

  it('rundet negative Werte korrekt (reine Arithmetik, keine Fachregel)', () => {
    expect(roundEuro(-10.005)).toBe(-10.0);
    expect(roundEuro(-10.004)).toBe(-10.0);
  });
});

describe('toCents', () => {
  it('wandelt Euro-Betrag in ganzzahlige Cents um', () => {
    expect(toCents(19.99)).toBe(1999);
  });

  it('wandelt 0 korrekt um', () => {
    expect(toCents(0)).toBe(0);
  });

  it('wandelt ganze Eurowerte korrekt um', () => {
    expect(toCents(100)).toBe(10000);
  });
});

describe('fromCents', () => {
  it('wandelt Cents in Euro-Betrag um', () => {
    expect(fromCents(1999)).toBe(19.99);
  });

  it('wandelt 0 korrekt um', () => {
    expect(fromCents(0)).toBe(0);
  });

  it('wandelt ganze Eurowerte korrekt um', () => {
    expect(fromCents(10000)).toBe(100);
  });
});
