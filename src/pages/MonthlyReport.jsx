import { useState } from 'react';
import { BarChart3, Hash, IndianRupee, Trophy } from 'lucide-react';
import useApi from '../hooks/useApi';
import { getMonthlyReport } from '../api/reportApi';
import { MONTHS, categoryLabel, formatCurrency } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import PeriodSelect from '../components/common/PeriodSelect';
import StatCard from '../components/dashboard/StatCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import BudgetProgressList from '../components/dashboard/BudgetProgressList';
import CategoryBadge from '../components/common/CategoryBadge';

export default function MonthlyReport() {
  const now = new Date();
  const initial = { month: now.getMonth() + 1, year: now.getFullYear() };
  const [selected, setSelected] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const { data, loading, error, reload } = useApi(() => getMonthlyReport(applied), [applied.month, applied.year]);

  const total = Number(data?.totalSpending) || 0;

  return (
    <div>
      <PageHeader
        title="Monthly Report"
        subtitle="Pick a month and year to see a spending summary."
        actions={
          <>
            <PeriodSelect value={selected} onChange={setSelected} />
            <button className="btn-primary" onClick={() => setApplied(selected)} disabled={loading}>
              Generate report
            </button>
          </>
        }
      />

      {loading && <LoadingSpinner label="Generating report..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}

      {!loading && data && data.expenseCount === 0 && (
        <div className="card">
          <EmptyState
            icon={BarChart3}
            title={`No expenses in ${MONTHS[data.month - 1]} ${data.year}`}
            description="Choose a different month, or add expenses for this period."
          />
        </div>
      )}

      {!loading && data && data.expenseCount > 0 && (
        <>
          <p className="mb-4 text-sm font-medium text-slate-600">
            Report for {MONTHS[data.month - 1]} {data.year}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={IndianRupee} tone="blue" label="Total spending" value={formatCurrency(data.totalSpending)} />
            <StatCard icon={Hash} tone="slate" label="Expenses" value={data.expenseCount} />
            <StatCard
              icon={Trophy}
              tone="amber"
              label="Highest spending category"
              value={categoryLabel(data.highestSpendingCategory)}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <h3 className="mb-4 font-semibold text-slate-800">Category breakdown</h3>
              <CategoryChart items={data.categoryBreakdown} variant="bar" />
            </div>
            <div className="card p-5">
              <h3 className="mb-4 font-semibold text-slate-800">Breakdown table</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 font-medium">Category</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                    <th className="py-2 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.categoryBreakdown.map((row) => (
                    <tr key={row.category}>
                      <td className="py-2.5"><CategoryBadge category={row.category} /></td>
                      <td className="py-2.5 text-right font-semibold text-slate-800">{formatCurrency(row.amount)}</td>
                      <td className="py-2.5 text-right text-slate-600">
                        {total > 0 ? `${((Number(row.amount) / total) * 100).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-6 p-5">
            <h3 className="mb-4 font-semibold text-slate-800">Budget status</h3>
            <BudgetProgressList items={data.budgetStatus} />
          </div>
        </>
      )}
    </div>
  );
}
