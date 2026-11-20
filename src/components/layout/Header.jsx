import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/format';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/receipt-scanner': 'Receipt Scanner',
  '/add-expense': 'Add Expense',
  '/expenses': 'Expenses',
  '/budgets': 'Budgets',
  '/forecast': 'Forecast',
  '/monthly-report': 'Monthly Report',
  '/profile': 'Profile',
};

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold text-slate-800">{TITLES[pathname] || 'Expense Assistant'}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">@{user?.username}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {initials(user?.name)}
        </div>
      </div>
    </header>
  );
}
