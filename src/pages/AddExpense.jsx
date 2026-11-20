import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExpense } from '../api/expenseApi';
import { getErrorMessage } from '../utils/errors';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/common/PageHeader';
import ExpenseForm from '../components/expenses/ExpenseForm';

export default function AddExpense() {
  const navigate = useNavigate();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleSubmit(payload) {
    setSaving(true);
    setServerError('');
    try {
      await createExpense(payload);
      toast.success('Expense saved successfully.');
      navigate('/expenses');
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Expense" subtitle="Record an expense manually." />
      <div className="card max-w-2xl p-6">
        <ExpenseForm onSubmit={handleSubmit} onCancel={() => navigate('/expenses')} saving={saving} serverError={serverError} />
      </div>
    </div>
  );
}
