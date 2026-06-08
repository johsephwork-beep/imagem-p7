import { NavLink } from 'react-router-dom';
import { Brain, LayoutDashboard, BookOpen, BarChart2 } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',           label: 'Dashboard', icon: LayoutDashboard },
  { to: '/topicos',    label: 'Tópicos',   icon: BookOpen },
  { to: '/desempenho', label: 'Desempenho', icon: BarChart2 },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent2 flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-display font-700 text-lg bg-gradient-to-r from-brand-accent to-brand-accent2 bg-clip-text text-transparent">
            IMAGEM P7
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-accent/20 text-brand-accent'
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} className={isActive ? 'text-brand-accent' : ''} />
                  <span className="hidden sm:inline">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
