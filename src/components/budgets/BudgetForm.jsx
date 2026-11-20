import { useState } from 'react';
import ErrorMessage from '../common/ErrorMessage';
import { CATEGORIES, MONTHS, categoryLabel } from '../../utils/format';

export default function BudgetForm({ initial, onSubmit, onCancel, saving = false, serverError = '' }) {
  const [form, setForm] = useState({
    category: initial.category ?? 'FOOD',
    monthlyLimit: initial.monthlyLimit ?? '',
    month: initial.month,
    year: initial.year,
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    const limit = Number(form.monthlyLimit);
    if (form.monthlyLimit === '' || !Number.isFinite(limit)) next.monthlyLimit = 'Enter a valid limit';
    else if (limit <= 0) next.monthlyLimit = 'Limit must be greater than zero';
    const year = Number(form.year);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) next.year = 'Year must be between 2000 and 2100';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      category: form.category,
      monthlyLimit: Number(limit.toFixed(2)),
      month: Number(form.month),
      year,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <ErrorMessage message={serverError} />
      <div>
        <label className="label" htmlFor="budgetCategory">Category</label>
        <select id="budgetCategory" className="input" value={form.category} onChange={update('category')}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {categoryLabel(category)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="monthlyLimit">Monthly limit (₹)</label>
        <input id="monthlyLimit" type="number" step="0.01" min="0" className="input" value={form.monthlyLimit} onChange={update('monthlyLimit')} placeholder="5000" />
        {errors.monthlyLimit && <p className="field-error">{errors.monthlyLimit}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="budgetMonth">Month</label>
          <select id="budgetMonth" className="input" value={form.month} onChange={update('month')}>
            {MONTHS.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="budgetYear">Year</label>
          <input id="budgetYear" type="number" className="input" value={form.year} onChange={update('year')} />
          {errors.year && <p className="field-error">{errors.year}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Budget'}
        </button>
      </div>
    </form>
  );
}
