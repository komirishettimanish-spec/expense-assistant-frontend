import { useState } from 'react';
import { FileText } from 'lucide-react';
import ErrorMessage from '../common/ErrorMessage';
import { CATEGORIES, categoryLabel, todayISO } from '../../utils/format';

function toFormState(initial = {}) {
  return {
    merchantName: initial.merchantName ?? '',
    expenseDate: initial.expenseDate ?? todayISO(),
    amount: initial.amount ?? '',
    category: initial.category ?? 'FOOD',
    description: initial.description ?? '',
    itemsText: (initial.items || []).join('\n'),
  };
}

export default function ExpenseForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save Expense',
  saving = false,
  serverError = '',
}) {
  const [form, setForm] = useState(() => toFormState(initial));
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  function validate() {
    const next = {};
    if (!form.merchantName.trim()) next.merchantName = 'Merchant name is required';
    else if (form.merchantName.trim().length > 150) next.merchantName = 'Merchant name must be 150 characters or fewer';
    if (!form.expenseDate) next.expenseDate = 'Date is required';
    const amount = Number(form.amount);
    if (form.amount === '' || !Number.isFinite(amount)) next.amount = 'Enter a valid amount';
    else if (amount <= 0) next.amount = 'Amount must be greater than zero';
    else if (amount >= 1000000000) next.amount = 'Amount is too large';
    if (form.description.length > 500) next.description = 'Description must be 500 characters or fewer';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      merchantName: form.merchantName.trim(),
      expenseDate: form.expenseDate,
      amount: Number(Number(form.amount).toFixed(2)),
      category: form.category,
      description: form.description.trim() || null,
      items: form.itemsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      receiptFileName: initial?.receiptFileName || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <ErrorMessage message={serverError} />

      {initial?.receiptFileName && (
        <p className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <FileText className="h-4 w-4" /> Attached receipt: {initial.receiptFileName}
        </p>
      )}

      <div>
        <label className="label" htmlFor="merchantName">Merchant</label>
        <input id="merchantName" className="input" value={form.merchantName} onChange={update('merchantName')} placeholder="e.g. DMART" />
        {errors.merchantName && <p className="field-error">{errors.merchantName}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="expenseDate">Date</label>
          <input id="expenseDate" type="date" className="input" value={form.expenseDate} onChange={update('expenseDate')} />
          {errors.expenseDate && <p className="field-error">{errors.expenseDate}</p>}
        </div>
        <div>
          <label className="label" htmlFor="amount">Amount (₹)</label>
          <input id="amount" type="number" step="0.01" min="0" className="input" value={form.amount} onChange={update('amount')} placeholder="0.00" />
          {errors.amount && <p className="field-error">{errors.amount}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="category">Category</label>
        <select id="category" className="input" value={form.category} onChange={update('category')}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {categoryLabel(category)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="description">Description (optional)</label>
        <textarea id="description" rows={2} className="input" value={form.description} onChange={update('description')} />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div>
        <label className="label" htmlFor="items">Items (optional, one per line)</label>
        <textarea id="items" rows={4} className="input font-mono" value={form.itemsText} onChange={update('itemsText')} placeholder={'Rice - 650\nMilk - 80'} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
