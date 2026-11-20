export const CATEGORIES = [
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'BILLS',
  'HEALTH',
  'ENTERTAINMENT',
  'EDUCATION',
  'GROCERIES',
  'OTHER',
];

export const CATEGORY_COLORS = {
  FOOD: '#f97316',
  TRAVEL: '#0ea5e9',
  SHOPPING: '#a855f7',
  BILLS: '#ef4444',
  HEALTH: '#10b981',
  ENTERTAINMENT: '#ec4899',
  EDUCATION: '#6366f1',
  GROCERIES: '#84cc16',
  OTHER: '#64748b',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function categoryLabel(category) {
  if (!category) return '-';
  return category.charAt(0) + category.slice(1).toLowerCase();
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  const number = Number(value);
  return currencyFormatter.format(Number.isFinite(number) ? number : 0);
}

export function formatPercent(value) {
  const number = Number(value);
  return `${(Number.isFinite(number) ? number : 0).toFixed(1)}%`;
}

export function formatDate(iso) {
  if (!iso) return '-';
  const [year, month, day] = String(iso).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '-';
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso) {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
