/**
 * PartyPayback — App-Entry.
 *
 * Importiert Schrift und Stylesheet ins Bundle (self-hosted, CSP-konform).
 * Verdrahtet Formulare mit State-Mutationen und registriert Live-Re-Render
 * via Subscribe-Pattern (D-02, kein "Berechnen"-Button).
 */

// Bundle-Imports: Inter-Schrift und Stylesheet (self-hosted, keine externen CDNs — BRANDAD/CSP)
import '@fontsource/inter';
import './styles.css';

import {
  getPersons,
  getExpenses,
  addPerson,
  removePerson,
  addExpense,
  removeExpense,
  subscribe,
} from './ui/state';

import { renderPersons, renderExpenses, renderResult } from './ui/render';

// ──────────────────────────────────────────────
// DOM-Elemente per stabiler ID abrufen
// ──────────────────────────────────────────────

function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Pflicht-Element nicht gefunden: #${id} — prüfe index.html`);
  }
  return el as T;
}

const personForm = getElement<HTMLFormElement>('person-form');
const personNameInput = getElement<HTMLInputElement>('person-name');
const personList = getElement<HTMLUListElement>('person-list');
const personError = getElement<HTMLDivElement>('person-error');

const expenseForm = getElement<HTMLFormElement>('expense-form');
const expensePayerSelect = getElement<HTMLSelectElement>('expense-payer');
const expenseDescriptionInput = getElement<HTMLInputElement>('expense-description');
const expenseAmountInput = getElement<HTMLInputElement>('expense-amount');
const expenseList = getElement<HTMLUListElement>('expense-list');
const expenseError = getElement<HTMLDivElement>('expense-error');

const resultContainer = getElement<HTMLDivElement>('result');

// ──────────────────────────────────────────────
// Render-Funktion (wird nach jeder Mutation aufgerufen)
// ──────────────────────────────────────────────

function render(): void {
  const persons = getPersons();
  const expenses = getExpenses();

  renderPersons(personList, persons, (id) => {
    removePerson(id);
  });

  renderExpenses(expenseList, expensePayerSelect, persons, expenses, (id) => {
    removeExpense(id);
  });

  renderResult(
    resultContainer,
    { personError, expenseError },
    persons,
    expenses,
  );
}

// ──────────────────────────────────────────────
// Personen-Formular
// ──────────────────────────────────────────────

personForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = personNameInput.value.trim();
  if (!name) return;

  addPerson(name);

  // Feld leeren und Fokus zurück (Specifics)
  personNameInput.value = '';
  personNameInput.focus();
});

// ──────────────────────────────────────────────
// Ausgaben-Formular
// ──────────────────────────────────────────────

expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const payerId = expensePayerSelect.value;
  const description = expenseDescriptionInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  // Fachregeln prüft der Kern — hier nur Grundpflicht-Felder
  if (!payerId || !description || isNaN(amount)) return;

  addExpense(payerId, description, amount);

  // Felder leeren und Fokus zurück ins erste Ausgabenfeld (Specifics)
  expenseDescriptionInput.value = '';
  expenseAmountInput.value = '';
  expenseDescriptionInput.focus();
});

// ──────────────────────────────────────────────
// Subscribe: Live-Re-Render nach jeder Mutation (D-02)
// ──────────────────────────────────────────────

subscribe(render);

// ──────────────────────────────────────────────
// Initiales Render (Platzhalter und leeres Payer-Select sofort sichtbar, D-08)
// ──────────────────────────────────────────────

render();
