import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const STYLES = {
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: AlertTriangle },
  info: { box: 'border-blue-200 bg-blue-50 text-blue-800', icon: Info },
};

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const style = STYLES[toast.type] || STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-3 text-sm shadow-lg ${style.box}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1">{toast.message}</p>
            <button onClick={() => onDismiss(toast.id)} className="opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
