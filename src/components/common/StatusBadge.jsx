const STYLES = {
  SAFE: 'bg-emerald-100 text-emerald-700',
  WARNING: 'bg-amber-100 text-amber-700',
  EXCEEDED: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {status || '-'}
    </span>
  );
}
