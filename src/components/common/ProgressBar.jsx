const COLORS = {
  SAFE: 'bg-emerald-500',
  WARNING: 'bg-amber-500',
  EXCEEDED: 'bg-red-500',
};

export default function ProgressBar({ percent = 0, status }) {
  const width = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all ${COLORS[status] || 'bg-blue-500'}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
