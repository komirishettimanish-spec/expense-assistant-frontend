import { Link } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import EmptyState from '../common/EmptyState';
import { formatCurrency, formatPercent } from '../../utils/format';

export default function BudgetProgressList({ items, showCreateLink = true }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={PiggyBank}
        title="No budgets for this month"
        description="Set a monthly limit for a category to track your spending."
        action={
          showCreateLink && (
            <Link to="/budgets" className="btn-primary">
              Create a budget
            </Link>
          )
        }
      />
    );
  }

  return (
    <ul className="space-y-5">
      {items.map((budget) => (
        <li key={budget.category}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <CategoryBadge category={budget.category} />
            <StatusBadge status={budget.status} />
          </div>
          <ProgressBar percent={budget.percentageUsed} status={budget.status} />
          <div className="mt-1.5 flex justify-between text-xs text-slate-500">
            <span>
              {formatCurrency(budget.spent)} of {formatCurrency(budget.monthlyLimit)}
            </span>
            <span>{formatPercent(budget.percentageUsed)} used</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
