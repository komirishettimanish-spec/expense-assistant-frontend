import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileBarChart,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Plus,
  Receipt,
  ScanLine,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/receipt-scanner', label: 'Receipt Scanner', icon: ScanLine },
  { to: '/add-expense', label: 'Add Expense', icon: Plus },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/forecast', label: 'Forecast', icon: TrendingUp },
  { to: '/monthly-report', label: 'Monthly Report', icon: FileBarChart },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col bg-slate-900 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="rounded-lg bg-emerald-500 p-2 text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Expense Assistant</p>
            <p className="text-xs text-slate-400">AI budget tracker</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-slate-800 px-3 py-4">
          <NavLink to="/profile" className={linkClass} onClick={onClose}>
            <User className="h-4 w-4" />
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
