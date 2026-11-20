import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import useApi from '../hooks/useApi';
import { getMe } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile, loading, error, reload } = useApi(getMe, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account details." />

      {loading && !profile && <LoadingSpinner label="Loading profile..." />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {profile && (
        <div className="card max-w-xl p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {initials(profile.name)}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-500">@{profile.username}</p>
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            {[
              ['Name', profile.name],
              ['Username', profile.username],
              ['Email', profile.email],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <button className="btn-danger mt-6" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
