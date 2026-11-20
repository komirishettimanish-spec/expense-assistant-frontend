import { useMemo, useState } from 'react';
import { PiggyBank, Plus } from 'lucide-react';
import useApi from '../hooks/useApi';
import { createBudget, deleteBudget, getBudgets, getBudgetStatus, updateBudget } from '../api/budgetApi';
import { getErrorMessage } from '../utils/errors';
import { useToast } from '../context/ToastContext';
import { MONTHS } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import PeriodSelect from '../components/common/PeriodSelect';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';

function friendlyBudgetError(err) {
  const message = getErrorMessage(err);
  return message.toLowerCase().includes('already exists')
    ? 'A budget for this category and month already exists.'
    : message;
}

export default function Budgets() {
  const toast = useToast();
  const now = new Date();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });

  const { data, loading, error, reload } = useApi(async () => {
    const [budgets, status] = await Promise.all([getBudgets(), getBudgetStatus(period)]);
    return { budgets, status };
  }, [period.month, period.year]);

  const [formState, setFormState] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const merged = useMemo(() => {
    if (!data) return [];
    return data.budgets
      .filter((b) => b.month === period.month && b.year === period.year)
      .map((b) => {
        const status = data.status.find((s) => s.category === b.category);
        return {
          ...b,
          spent: status?.spent ?? 0,
          remaining: status?.remaining ?? b.monthlyLimit,
          percentageUsed: status?.percentageUsed ?? 0,
          status: status?.status,
        };
      });
  }, [data, period]);

  function openCreate() {
    setFormError('');
    setFormState({ mode: 'create', initial: { month: period.month, year: period.year } });
  }

  function openEdit(budget) {
    setFormError('');
    setFormState({ mode: 'edit', id: budget.id, initial: budget });
  }

  async function handleSubmit(payload) {
    setSaving(true);
    setFormError('');
    try {
      if (formState.mode === 'edit') {
        await updateBudget(formState.id, payload);
        toast.success('Budget updated successfully.');
      } else {
        await createBudget(payload);
        toast.success('Budget created successfully.');
      }
      setFormState(null);
      if (payload.month !== period.month || payload.year !== period.year) {
        setPeriod({ month: payload.month, year: payload.year });
      } else {
        reload();
      }
    } catch (err) {
      setFormError(friendlyBudgetError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleteBusy(true);
    try {
      await deleteBudget(deleting.id);
      toast.success('Budget deleted.');
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Budgets"
        subtitle={`Monthly category limits for ${MONTHS[period.month - 1]} ${period.year}.`}
        actions={
          <>
            <PeriodSelect value={period} onChange={setPeriod} />
            <button className="btn-primary" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add budget
            </button>
          </>
        }
      />

      {loading && !data && <LoadingSpinner label="Loading budgets..." />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {data && merged.length === 0 && (
        <div className="card">
          <EmptyState
            icon={PiggyBank}
            title="No budgets for this month"
            description="Create a budget to set a spending limit for a category."
            action={<button className="btn-primary" onClick={openCreate}>Add budget</button>}
          />
        </div>
      )}

      {merged.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {merged.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} onEdit={openEdit} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(formState)}
        title={formState?.mode === 'edit' ? 'Edit budget' : 'Add budget'}
        onClose={() => !saving && setFormState(null)}
      >
        {formState && (
          <BudgetForm
            key={`${formState.mode}-${formState.id ?? 'new'}`}
            initial={formState.initial}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
            saving={saving}
            serverError={formError}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete budget"
        message={deleting ? `Delete the ${deleting.category.toLowerCase()} budget for ${MONTHS[deleting.month - 1]} ${deleting.year}?` : ''}
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
