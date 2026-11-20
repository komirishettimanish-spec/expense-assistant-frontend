import { Pencil, Trash2 } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { formatCurrency, formatPercent } from '../../utils/format';

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const spent = budget.spent ?? 0;
  const remaining = budget.remaining ?? budget.monthlyLimit;
  const over = Number(remaining) < 0;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <CategoryBadge category={budget.category} />
          <p className="text-xl font-bold text-slate-900">{formatCurrency(budget.monthlyLimit)}</p>
          <p className="text-xs text-slate-500">Monthly limit</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={budget.status} />
          <div className="flex gap-1">
            <button onClick={() => onEdit(budget)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Edit budget">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(budget)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete budget">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ProgressBar percent={budget.percentageUsed} status={budget.status} />
      <p className="mt-1.5 text-right text-xs text-slate-500">{formatPercent(budget.percentageUsed)} used</p>

      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Spent</dt>
          <dd className="font-semibold text-slate-800">{formatCurrency(spent)}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">{over ? 'Over budget by' : 'Remaining'}</dt>
          <dd className={`font-semibold ${over ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(Math.abs(Number(remaining)))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
