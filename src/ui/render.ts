/**
 * DOM-Rendering für PartyPayback.
 *
 * Alle drei Render-Funktionen erhalten ihren Ziel-Container und den
 * aktuellen State; sie schreiben ausschließlich via DOM-API (nie innerHTML
 * mit User-Daten, T-02-01).
 *
 * Importiert ausschließlich aus '../core/index' (Barrel-Disziplin).
 */

import {
  validateSettlementInput,
  calculateSettlement,
  type Person,
  type Expense,
} from '../core/index';

import { formatEuro, formatBalance, nameOf } from './format';

// ──────────────────────────────────────────────
// Personen-Liste
// ──────────────────────────────────────────────

/**
 * Rendert die Personen-Liste neu.
 * Jede Zeile enthält den Namen und einen ×-Entfernen-Button (PERS-02).
 */
export function renderPersons(
  container: HTMLUListElement,
  persons: Person[],
  onRemove: (id: string) => void,
): void {
  // Bestehenden Inhalt leeren
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  for (const person of persons) {
    const li = document.createElement('li');
    li.className = 'item-row';

    const label = document.createElement('span');
    label.className = 'item-row__label';
    label.textContent = person.name;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `${person.name} entfernen`);
    removeBtn.addEventListener('click', () => onRemove(person.id));

    li.appendChild(label);
    li.appendChild(removeBtn);
    container.appendChild(li);
  }
}

// ──────────────────────────────────────────────
// Ausgaben-Liste + Payer-Select
// ──────────────────────────────────────────────

/**
 * Befüllt das Payer-Select aus der Personen-Liste und rendert die Ausgaben-Liste.
 * Jede Ausgabe-Zeile: "{Name} — {Beschreibung}: {Betrag}" mit ×-Button (EXP-01/EXP-03).
 */
export function renderExpenses(
  listContainer: HTMLUListElement,
  payerSelect: HTMLSelectElement,
  persons: Person[],
  expenses: Expense[],
  onRemove: (id: string) => void,
): void {
  // ── Payer-Select befüllen ──────────────────
  const currentValue = payerSelect.value;
  while (payerSelect.firstChild) {
    payerSelect.removeChild(payerSelect.firstChild);
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Zahlende Person wählen …';
  payerSelect.appendChild(placeholder);

  for (const person of persons) {
    const option = document.createElement('option');
    option.value = person.id;
    option.textContent = person.name;
    payerSelect.appendChild(option);
  }

  // Selektion erhalten wenn möglich
  if (currentValue && persons.some((p) => p.id === currentValue)) {
    payerSelect.value = currentValue;
  }

  // ── Ausgaben-Liste ────────────────────────
  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.firstChild);
  }

  for (const expense of expenses) {
    const li = document.createElement('li');
    li.className = 'item-row';

    const label = document.createElement('span');
    label.className = 'item-row__label';
    // Sicher via textContent — kein XSS-Vektor (T-02-01)
    const payerName = nameOf(expense.payerId, persons);
    label.textContent = `${payerName} — ${expense.description}: ${formatEuro(expense.amount)}`;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Ausgabe "${expense.description}" entfernen`);
    removeBtn.addEventListener('click', () => onRemove(expense.id));

    li.appendChild(label);
    li.appendChild(removeBtn);
    listContainer.appendChild(li);
  }
}

// ──────────────────────────────────────────────
// Ergebnis-Bereich
// ──────────────────────────────────────────────

/**
 * Rendert den Ergebnis-Bereich.
 *
 * Ruft validateSettlementInput auf:
 *   ok:false → Fehlertexte aus error.message (D-03), Platzhalter im Ergebnisbereich
 *   ok:true  → calculateSettlement → Gesamtkosten, fairer Anteil, Salden, Transfers (UI-02)
 *
 * Fehler-Kategorisierung:
 *   TOO_FEW_PERSONS → Ergebnisbereich-Platzhalter
 *   NEGATIVE_AMOUNT / PAYER_NOT_REGISTERED → Ausgaben-Fehlercontainer
 */
export function renderResult(
  resultContainer: HTMLDivElement,
  errorContainers: { personError: HTMLDivElement; expenseError: HTMLDivElement },
  persons: Person[],
  expenses: Expense[],
): void {
  // Fehlercontainer leeren
  errorContainers.personError.textContent = '';
  errorContainers.expenseError.textContent = '';

  // DOM des Ergebnisbereichs leeren
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  const validation = validateSettlementInput(persons, expenses);

  if (!validation.ok) {
    // Fehler kategorisieren und anzeigen (D-03)
    const expenseErrors: string[] = [];
    const generalErrors: string[] = [];

    for (const err of validation.errors) {
      if (err.code === 'TOO_FEW_PERSONS') {
        generalErrors.push(err.message);
      } else {
        // NEGATIVE_AMOUNT, PAYER_NOT_REGISTERED → Ausgaben-Container
        expenseErrors.push(err.message);
      }
    }

    if (expenseErrors.length > 0) {
      errorContainers.expenseError.textContent = expenseErrors.join(' ');
    }

    // Platzhalter im Ergebnisbereich
    const placeholder = document.createElement('p');
    placeholder.className = 'result-placeholder';

    if (generalErrors.length > 0) {
      // TOO_FEW_PERSONS: Wortlaut direkt aus dem Kern
      placeholder.textContent = generalErrors[0];
    } else if (expenseErrors.length > 0) {
      // Ausgabenfehler: freundlicher Hinweis im Ergebnisbereich
      placeholder.textContent = 'Bitte die Eingabefehler bei den Ausgaben korrigieren.';
    } else {
      placeholder.textContent = 'Mindestens 2 Personen erfassen, um die Abrechnung zu sehen.';
    }

    resultContainer.appendChild(placeholder);
    return;
  }

  // ── Ergebnis rendern (ok: true) ─────────────────────────────────
  const result = calculateSettlement(persons, expenses);

  const grid = document.createElement('div');
  grid.className = 'result-grid';

  // Zusammenfassung: Gesamtkosten + fairer Anteil
  const summary = document.createElement('div');
  summary.className = 'result-summary';

  const totalStat = createStat('Gesamtkosten', formatEuro(result.totalCost));
  const shareStat = createStat('Fairer Anteil pro Person', formatEuro(result.fairShare));
  summary.appendChild(totalStat);
  summary.appendChild(shareStat);
  grid.appendChild(summary);

  // Salden pro Person
  const balanceTitle = document.createElement('p');
  balanceTitle.className = 'result-section-title';
  balanceTitle.textContent = 'Salden';
  grid.appendChild(balanceTitle);

  const balanceList = document.createElement('ul');
  balanceList.className = 'result-list';

  for (const bal of result.balances) {
    const li = document.createElement('li');

    let balanceClass = 'result-row balance--neutral';
    if (bal.balance > 0) balanceClass = 'result-row balance--positive';
    else if (bal.balance < 0) balanceClass = 'result-row balance--negative';

    li.className = balanceClass;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = nameOf(bal.personId, persons);

    const balanceSpan = document.createElement('span');
    balanceSpan.textContent = formatBalance(bal.balance);

    li.appendChild(nameSpan);
    li.appendChild(balanceSpan);
    balanceList.appendChild(li);
  }

  grid.appendChild(balanceList);

  // Ausgleichszahlungen
  if (result.transfers.length > 0) {
    const transferTitle = document.createElement('p');
    transferTitle.className = 'result-section-title';
    transferTitle.textContent = 'Ausgleichszahlungen';
    grid.appendChild(transferTitle);

    const transferList = document.createElement('ul');
    transferList.className = 'result-list';

    for (const transfer of result.transfers) {
      const li = document.createElement('li');
      li.className = 'transfer-row';
      const from = nameOf(transfer.fromId, persons);
      const to = nameOf(transfer.toId, persons);
      li.textContent = `${from} zahlt ${formatEuro(transfer.amount)} an ${to}`;
      transferList.appendChild(li);
    }

    grid.appendChild(transferList);
  } else {
    const noTransfers = document.createElement('p');
    noTransfers.className = 'result-placeholder';
    noTransfers.textContent = 'Keine Ausgleichszahlungen nötig — alle sind ausgeglichen.';
    grid.appendChild(noTransfers);
  }

  resultContainer.appendChild(grid);
}

// ──────────────────────────────────────────────
// Hilfsfunktion
// ──────────────────────────────────────────────

function createStat(label: string, value: string): HTMLDivElement {
  const stat = document.createElement('div');
  stat.className = 'result-stat';

  const labelEl = document.createElement('p');
  labelEl.className = 'result-stat__label';
  labelEl.textContent = label;

  const valueEl = document.createElement('p');
  valueEl.className = 'result-stat__value';
  valueEl.textContent = value;

  stat.appendChild(labelEl);
  stat.appendChild(valueEl);
  return stat;
}
