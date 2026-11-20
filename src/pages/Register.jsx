import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (form.username.trim().length < 3 || form.username.trim().length > 50) next.username = 'Username must be 3-50 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  const field = (id, label, type = 'text', autoComplete) => (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type={type} className="input" autoComplete={autoComplete} value={form[id]} onChange={update(id)} />
      {errors[id] && <p className="field-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6" noValidate>
          <ErrorMessage message={serverError} />
          {field('name', 'Full name', 'text', 'name')}
          {field('username', 'Username', 'text', 'username')}
          {field('email', 'Email', 'email', 'email')}
          {field('password', 'Password', 'password', 'new-password')}
          {field('confirmPassword', 'Confirm password', 'password', 'new-password')}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
