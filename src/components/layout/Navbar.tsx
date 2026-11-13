import React from 'react';
import { Moon, Search, ShieldAlert, Sun } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onOpenQuickScan: () => void;
}

const links = [
  { id: 'overview', label: 'Overview' },
  { id: 'scanner', label: 'URL scanner' },
  { id: 'analyzer', label: 'Message analysis' },
  { id: 'tls', label: 'TLS' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isLandingPage,
  setIsLandingPage,
  theme,
  setTheme,
  onOpenQuickScan,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#252d35] bg-[#0b0e11] px-4 sm:px-6">
      <div className="flex min-h-14 items-center justify-between gap-4">
        <button
          onClick={() => setIsLandingPage(true)}
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Threatora home"
        >
          <ShieldAlert className="h-4 w-4 text-blue-400" />
          Threatora
        </button>

        {!isLandingPage && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                aria-current={currentTab === link.id ? 'page' : undefined}
                className={`rounded px-2.5 py-1.5 text-xs transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#1a222b] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {!isLandingPage && (
            <button
              onClick={onOpenQuickScan}
              className="inline-flex h-8 items-center gap-2 rounded border border-[#303943] px-2.5 text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              title="Quick investigation"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick check</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsLandingPage(!isLandingPage);
              if (isLandingPage) onNavigate('overview');
            }}
            className="h-8 rounded px-2.5 text-xs text-slate-400 transition-colors hover:text-white"
          >
            {isLandingPage ? 'Open app' : 'About'}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-[#1a222b] hover:text-white"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
