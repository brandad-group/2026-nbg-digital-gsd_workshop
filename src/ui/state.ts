/**
 * In-Memory-State für PartyPayback.
 *
 * Hält zwei private Arrays (Person[], Expense[]) und bietet reine Getter
 * sowie Mutations-Funktionen. Jede Mutation benachrichtigt alle Listener
 * (Subscribe-Pattern) für Live-Re-Render (D-02).
 *
 * IDs werden via crypto.randomUUID() erzeugt.
 * Keine eigene Fachregeln-Prüfung — das bleibt im Kern (D-04).
 */

import type { Person, Expense } from '../core/index';

// ──────────────────────────────────────────────
// Privater State
// ──────────────────────────────────────────────

let persons: Person[] = [];
let expenses: Expense[] = [];
let listeners: Array<() => void> = [];

// ──────────────────────────────────────────────
// Listener-Muster (Subscribe)
// ──────────────────────────────────────────────

/** Registriert einen Listener, der nach jeder Mutation aufgerufen wird. */
export function subscribe(listener: () => void): void {
  listeners.push(listener);
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

// ──────────────────────────────────────────────
// Getter (geben Kopien zurück)
// ──────────────────────────────────────────────

/** Gibt eine Kopie der aktuellen Personen-Liste zurück. */
export function getPersons(): Person[] {
  return [...persons];
}

/** Gibt eine Kopie der aktuellen Ausgaben-Liste zurück. */
export function getExpenses(): Expense[] {
  return [...expenses];
}

// ──────────────────────────────────────────────
// Mutationen
// ──────────────────────────────────────────────

/** Fügt eine Person mit dem angegebenen Namen hinzu. */
export function addPerson(name: string): void {
  const person: Person = {
    id: crypto.randomUUID(),
    name: name.trim(),
  };
  persons = [...persons, person];
  notify();
}

/** Entfernt die Person mit der angegebenen ID.
 *  Zugehörige Ausgaben werden NICHT automatisch entfernt —
 *  der Kern meldet PAYER_NOT_REGISTERED und die UI zeigt das an (D-03/D-04). */
export function removePerson(id: string): void {
  persons = persons.filter((p) => p.id !== id);
  notify();
}

/** Fügt eine Ausgabe hinzu. amount wird unverändert gespeichert;
 *  die fachliche Prüfung negativer Beträge bleibt im Kern (D-07). */
export function addExpense(payerId: string, description: string, amount: number): void {
  const expense: Expense = {
    id: crypto.randomUUID(),
    payerId,
    description: description.trim(),
    amount,
  };
  expenses = [...expenses, expense];
  notify();
}

/** Entfernt die Ausgabe mit der angegebenen ID. */
export function removeExpense(id: string): void {
  expenses = expenses.filter((e) => e.id !== id);
  notify();
}
