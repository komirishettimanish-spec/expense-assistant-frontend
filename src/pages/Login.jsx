import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.usernameOrEmail.trim() || !form.password) {
      setError('Enter your username or email and your password.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login({ usernameOrEmail: form.usernameOrEmail.trim(), password: form.password });
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Expense Assistant</h1>
          <p className="mt-1 text-sm text-slate-300">AI-powered expense analysis and budgeting</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6" noValidate>
          <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
          <ErrorMessage message={error} />
          <div>
            <label className="label" htmlFor="usernameOrEmail">Username or email</label>
            <input id="usernameOrEmail" className="input" autoComplete="username" value={form.usernameOrEmail} onChange={update('usernameOrEmail')} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} className="input pr-10" autoComplete="current-password" value={form.password} onChange={update('password')} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-600" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-slate-600">
            New here?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
