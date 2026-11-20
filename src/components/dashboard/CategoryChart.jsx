import { Bar, Doughnut } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';
import '../../utils/chartSetup';
import EmptyState from '../common/EmptyState';
import { CATEGORY_COLORS, categoryLabel, formatCurrency } from '../../utils/format';

export default function CategoryChart({ items, variant = 'doughnut' }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="No spending data yet"
        description="Add or scan an expense and the category chart will appear here."
      />
    );
  }

  const isBar = variant === 'bar';
  const data = {
    labels: items.map((item) => categoryLabel(item.category)),
    datasets: [
      {
        data: items.map((item) => Number(item.amount)),
        backgroundColor: items.map((item) => CATEGORY_COLORS[item.category] || '#64748b'),
        borderWidth: isBar ? 0 : 2,
        borderRadius: isBar ? 6 : 0,
      },
    ],
  };

  const tooltip = {
    callbacks: {
      label: (context) => ` ${formatCurrency(isBar ? context.parsed.y : context.parsed)}`,
    },
  };

  const options = isBar
    ? {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip },
        scales: { y: { beginAtZero: true, ticks: { callback: (value) => `\u20B9${value}` } } },
      }
    : {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: { legend: { position: 'bottom' }, tooltip },
      };

  return (
    <div className="h-64 sm:h-72">{isBar ? <Bar data={data} options={options} /> : <Doughnut data={data} options={options} />}</div>
  );
}
