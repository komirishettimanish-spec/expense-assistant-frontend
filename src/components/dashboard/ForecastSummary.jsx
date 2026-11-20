import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';
import ProgressBar from '../common/ProgressBar';

export default function ForecastSummary({ forecast }) {
  if (!forecast) return null;
  const totalDays = forecast.daysElapsed + forecast.remainingDays;
  const monthPercent = totalDays ? (forecast.daysElapsed / totalDays) * 100 : 0;

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">Projected month-end spending</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(forecast.projectedMonthEndSpending)}</p>
      <div className="mt-4">
        <ProgressBar percent={monthPercent} />
        <p className="mt-1.5 text-xs text-slate-500">
          Day {forecast.daysElapsed} of {totalDays} ({forecast.remainingDays} days remaining)
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Spent so far</dt>
          <dd className="font-semibold text-slate-800">{formatCurrency(forecast.currentSpending)}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Daily average</dt>
          <dd className="font-semibold text-slate-800">{formatCurrency(forecast.averageDailySpending)}</dd>
        </div>
      </dl>
      <Link to="/forecast" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
        View full forecast
      </Link>
    </div>
  );
}
