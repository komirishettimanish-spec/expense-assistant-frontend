import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 ${className}`}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-1 font-medium underline">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
