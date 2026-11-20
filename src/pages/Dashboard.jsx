import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Hash, IndianRupee, TrendingUp } from 'lucide-react';
import useApi from '../hooks/useApi';
import { getDashboard } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatCard from '../components/dashboard/StatCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import BudgetProgressList from '../components/dashboard/BudgetProgressList';
import ForecastSummary from '../components/dashboard/ForecastSummary';
import SuggestionsCard from '../components/dashboard/SuggestionsCard';
import RecentExpenses from '../components/dashboard/RecentExpenses';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi(getDashboard, []);
  const [range, setRange] = useState('month');

  if (loading && !data) return <LoadingSpinner label="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!data) return null;

  const chartItems = range === 'month' ? data.categorySummary : data.allTimeCategorySummary;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || ''}`}
        subtitle="Here is an overview of your spending."
        actions={
          <Link to="/receipt-scanner" className="btn-primary">
            Scan receipt
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={IndianRupee} tone="blue" label="Total expenses" value={formatCurrency(data.totalExpenses)} hint="All time" />
        <StatCard icon={CalendarDays} tone="green" label="This month" value={formatCurrency(data.currentMonthExpenses)} hint="Current month spending" />
        <StatCard icon={Hash} tone="slate" label="Expenses recorded" value={data.expenseCount} hint="All time" />
        <StatCard
          icon={TrendingUp}
          tone="amber"
          label="Projected month-end"
          value={formatCurrency(data.forecast?.projectedMonthEndSpending)}
          hint="Average-based estimate"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Spending by category</h3>
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
              {[
                ['month', 'This month'],
                ['all', 'All time'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setRange(value)}
                  className={`rounded-md px-3 py-1.5 ${range === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <CategoryChart items={chartItems} />
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800">Spending forecast</h3>
          <ForecastSummary forecast={data.forecast} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Budget status (this month)</h3>
            <Link to="/budgets" className="text-sm font-medium text-blue-600 hover:underline">
              Manage
            </Link>
          </div>
          <BudgetProgressList items={data.budgetStatus} />
        </div>
        <SuggestionsCard />
      </div>

      <div className="card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Recent expenses</h3>
          <Link to="/expenses" className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <RecentExpenses expenses={data.recentExpenses} />
      </div>
    </div>
  );
}
