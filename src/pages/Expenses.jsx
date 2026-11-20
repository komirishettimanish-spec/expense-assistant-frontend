import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Plus, Receipt, Trash2 } from 'lucide-react';
import useApi from '../hooks/useApi';
import { deleteExpense, getExpenses, updateExpense } from '../api/expenseApi';
import { getErrorMessage } from '../utils/errors';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, categoryLabel, formatCurrency, formatDate, formatDateTime } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import CategoryBadge from '../components/common/CategoryBadge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ExpenseForm from '../components/expenses/ExpenseForm';

const EMPTY_FILTERS = { category: '', fromDate: '', toDate: '' };

export default function Expenses() {
  const toast = useToast();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [filterError, setFilterError] = useState('');
  const { data: expenses, loading, error, reload } = useApi(() => getExpenses(applied), [applied]);

  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const setFilter = (field) => (event) => setFilters((current) => ({ ...current, [field]: event.target.value }));

  function applyFilters(event) {
    event.preventDefault();
    if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
      setFilterError('The "from" date must be on or before the "to" date.');
      return;
    }
    setFilterError('');
    setApplied(filters);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setFilterError('');
  }

  async function handleUpdate(payload) {
    setSaving(true);
    setEditError('');
    try {
      await updateExpense(editing.id, payload);
      toast.success('Expense updated successfully.');
      setEditing(null);
      reload();
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleteBusy(true);
    try {
      await deleteExpense(deleting.id);
      toast.success('Expense deleted.');
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  const hasFilters = applied.category || applied.fromDate || applied.toDate;
  const total = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="View, edit and manage all your recorded expenses."
        actions={
          <>
            <Link to="/receipt-scanner" className="btn-secondary">Scan receipt</Link>
            <Link to="/add-expense" className="btn-primary"><Plus className="h-4 w-4" /> Add expense</Link>
          </>
        }
      />

      <form onSubmit={applyFilters} className="card mb-6 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label className="label" htmlFor="filterCategory">Category</label>
          <select id="filterCategory" className="input" value={filters.category} onChange={setFilter('category')}>
            <option value="">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{categoryLabel(category)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="fromDate">From date</label>
          <input id="fromDate" type="date" className="input" value={filters.fromDate} onChange={setFilter('fromDate')} />
        </div>
        <div>
          <label className="label" htmlFor="toDate">To date</label>
          <input id="toDate" type="date" className="input" value={filters.toDate} onChange={setFilter('toDate')} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">Apply</button>
          <button type="button" className="btn-secondary flex-1" onClick={clearFilters}>Clear</button>
        </div>
        {filterError && <p className="field-error sm:col-span-2 lg:col-span-4">{filterError}</p>}
      </form>

      {loading && !expenses && <LoadingSpinner label="Loading expenses..." />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {expenses && (
        <div className="card">
          {expenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={hasFilters ? 'No expenses match these filters' : 'No expenses yet'}
              description={hasFilters ? 'Try changing or clearing the filters.' : 'Scan a receipt or add an expense manually.'}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3 font-medium">Merchant</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 text-right font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{expense.merchantName}</td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(expense.expenseDate)}</td>
                        <td className="px-5 py-3"><CategoryBadge category={expense.category} /></td>
                        <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-slate-800">{formatCurrency(expense.amount)}</td>
                        <td className="max-w-xs truncate px-5 py-3 text-slate-600">{expense.description || '-'}</td>
                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          <button onClick={() => setViewing(expense)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="View"><Eye className="h-4 w-4" /></button>
                          <button onClick={() => { setEditError(''); setEditing(expense); }} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => setDeleting(expense)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
                <span>{expenses.length} expense{expenses.length === 1 ? '' : 's'}</span>
                <span className="font-semibold text-slate-800">Total: {formatCurrency(total)}</span>
              </div>
            </>
          )}
        </div>
      )}

      <Modal open={Boolean(viewing)} title="Expense details" onClose={() => setViewing(null)}>
        {viewing && (
          <dl className="space-y-3 text-sm">
            {[
              ['Merchant', viewing.merchantName],
              ['Date', formatDate(viewing.expenseDate)],
              ['Amount', formatCurrency(viewing.amount)],
              ['Category', <CategoryBadge key="c" category={viewing.category} />],
              ['Description', viewing.description || '-'],
              ['Receipt file', viewing.receiptFileName || '-'],
              ['Recorded on', formatDateTime(viewing.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-medium text-slate-800">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="mb-1 text-slate-500">Items</dt>
              {viewing.items && viewing.items.length > 0 ? (
                <ul className="list-inside list-disc rounded-lg bg-slate-50 p-3 text-slate-700">
                  {viewing.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <dd className="text-slate-700">-</dd>
              )}
            </div>
          </dl>
        )}
      </Modal>

      <Modal open={Boolean(editing)} title="Edit expense" onClose={() => !saving && setEditing(null)} size="max-w-xl">
        {editing && (
          <ExpenseForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Update Expense"
            saving={saving}
            serverError={editError}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete expense"
        message={deleting ? `Delete the ${formatCurrency(deleting.amount)} expense at ${deleting.merchantName}? This cannot be undone.` : ''}
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
