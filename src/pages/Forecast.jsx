import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import useApi from '../hooks/useApi';
import { getForecast, getForecastInsight } from '../api/forecastApi';
import { formatCurrency } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatCard from '../components/dashboard/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import { CalendarDays, IndianRupee, TrendingUp, Clock } from 'lucide-react';

export default function Forecast() {
  const { data, loading, error, reload } = useApi(getForecast, []);
  const [insight, setInsight] = useState({ loading: false, text: '', error: '' });

  async function loadInsight() {
    setInsight({ loading: true, text: '', error: '' });
    try {
      const result = await getForecastInsight();
      setInsight({ loading: false, text: result.insight, error: '' });
    } catch (err) {
      const status = err.response?.status;
      const unavailable = !err.response || status === 502 || status === 503 || status === 504;
      setInsight({
        loading: false,
        text: '',
        error: unavailable ? 'AI insight is temporarily unavailable. Please try again later.' : getErrorMessage(err),
      });
    }
  }

  if (loading && !data) return <LoadingSpinner label="Calculating forecast..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!data) return null;

  const totalDays = data.daysElapsed + data.remainingDays;
  const monthPercent = totalDays ? (data.daysElapsed / totalDays) * 100 : 0;
  const spentPercent = Number(data.projectedMonthEndSpending) > 0
    ? (Number(data.currentSpending) / Number(data.projectedMonthEndSpending)) * 100
    : 0;

  return (
    <div>
      <PageHeader
        title="Average-Based Spending Forecast"
        subtitle="A simple estimate of where this month's spending is heading, based on your average daily spending so far."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={IndianRupee} tone="blue" label="Current spending" value={formatCurrency(data.currentSpending)} hint="This month so far" />
        <StatCard icon={CalendarDays} tone="slate" label="Average daily spending" value={formatCurrency(data.averageDailySpending)} hint={`Over ${data.daysElapsed} days`} />
        <StatCard icon={TrendingUp} tone="amber" label="Projected month-end" value={formatCurrency(data.projectedMonthEndSpending)} hint="Estimated total for the month" />
        <StatCard icon={Clock} tone="green" label="Days remaining" value={data.remainingDays} hint={`Day ${data.daysElapsed} of ${totalDays}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800">Month progress</h3>
          <div className="space-y-5">
            <div>
              <div className="mb-1.5 flex justify-between text-sm text-slate-600">
                <span>Days elapsed</span>
                <span>{data.daysElapsed} / {totalDays}</span>
              </div>
              <ProgressBar percent={monthPercent} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm text-slate-600">
                <span>Spent vs projected</span>
                <span>{formatCurrency(data.currentSpending)} / {formatCurrency(data.projectedMonthEndSpending)}</span>
              </div>
              <ProgressBar percent={spentPercent} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-3 font-semibold text-slate-800">How it is calculated</h3>
          <ol className="space-y-2 text-sm text-slate-600">
            <li>1. Average per day = {formatCurrency(data.currentSpending)} / {data.daysElapsed} days = <strong>{formatCurrency(data.averageDailySpending)}</strong></li>
            <li>2. Projected total = {formatCurrency(data.currentSpending)} x {totalDays} days / {data.daysElapsed} days = <strong>{formatCurrency(data.projectedMonthEndSpending)}</strong></li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            This is a straightforward average-based estimate, not a machine learning prediction. It assumes your spending continues at the same pace.
          </p>
        </div>
      </div>

      <div className="card mt-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="rounded-lg bg-violet-100 p-1.5 text-violet-600"><Sparkles className="h-4 w-4" /></span>
            AI explanation
          </h3>
          <button className="btn-secondary" onClick={loadInsight} disabled={insight.loading}>
            {insight.loading ? 'Generating...' : insight.text ? 'Regenerate' : 'Explain my forecast'}
          </button>
        </div>
        {insight.text && <p className="text-sm leading-relaxed text-slate-700">{insight.text}</p>}
        {insight.error && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{insight.error}</p>}
        {!insight.text && !insight.error && !insight.loading && (
          <p className="text-sm text-slate-500">Ask the AI to explain your forecast in plain language.</p>
        )}
      </div>
    </div>
  );
}
