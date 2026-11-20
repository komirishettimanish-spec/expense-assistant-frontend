import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold text-slate-800">Page not found</h1>
      <Link to="/dashboard" className="btn-primary">
        Go to dashboard
      </Link>
    </div>
  );
}
