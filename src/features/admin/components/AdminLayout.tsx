import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, MessageSquare, Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAvatarUrl } from '../../../services/authService';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/feedbacks', label: 'Feedback Management', icon: MessageSquare },
];

const AdminLayout: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => {
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-6">
          <div>
            <p className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">DAZZLING</p>
            <p className="text-xs text-slate-500">Admin Console</p>
          </div>
          <button className="rounded-xl p-2 text-slate-400 lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-white text-slate-950 shadow-lg shadow-violet-500/20' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-white/10 p-2 text-slate-300 lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar">
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h1>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                  <img src={getAvatarUrl(user)} alt={user.fullName} className="h-9 w-9 rounded-xl bg-white object-cover" />
                  <div className="leading-tight">
                    <p className="text-sm font-bold">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                </div>
              )}
              <button className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10" onClick={handleLogout}>
                <LogOut size={16} className="mr-2 inline" />
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
