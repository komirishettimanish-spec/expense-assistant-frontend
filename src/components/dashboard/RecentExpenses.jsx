import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import EmptyState from '../common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/format';

export default function RecentExpenses({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses yet"
        description="Scan a receipt or add an expense manually to get started."
        action={
          <Link to="/receipt-scanner" className="btn-primary">
            Scan a receipt
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-4 font-medium">Merchant</th>
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="py-3 pr-4 font-medium text-slate-800">{expense.merchantName}</td>
              <td className="whitespace-nowrap py-3 pr-4 text-slate-600">{formatDate(expense.expenseDate)}</td>
              <td className="py-3 pr-4">
                <CategoryBadge category={expense.category} />
              </td>
              <td className="whitespace-nowrap py-3 text-right font-semibold text-slate-800">
                {formatCurrency(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
