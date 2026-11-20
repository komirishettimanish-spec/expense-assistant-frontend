export default function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${
        fullScreen ? 'min-h-screen' : 'py-16'
      }`}
    >
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
