import React from 'react';
import {
  ShieldAlert,
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onOpenQuickScan: () => void;
}

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
    <header className="sticky top-0 z-40 w-full border-b border-[#273449] bg-[#080B14]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-8 max-w-7xl mx-auto">
        {/* Zone 1: Single element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsLandingPage(true)}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1"
            aria-label="Threatora Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                Threat<span className="text-cyan-400">ora</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links or Workspace indicator */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setIsLandingPage(false);
              onNavigate('overview');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              !isLandingPage && currentTab === 'overview' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Command Center
          </button>
          <button
            onClick={() => {
              setIsLandingPage(false);
              onNavigate('scanner');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              !isLandingPage && currentTab === 'scanner' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            URL Scanner
          </button>
          <button
            onClick={() => {
              setIsLandingPage(false);
              onNavigate('analyzer');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              !isLandingPage && currentTab === 'analyzer' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Message Analyzer
          </button>
          <button
            onClick={() => {
              setIsLandingPage(false);
              onNavigate('tls');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              !isLandingPage && currentTab === 'tls' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            TLS Inspector
          </button>
          <button
            onClick={() => {
              setIsLandingPage(false);
              onNavigate('blockchain');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              !isLandingPage && currentTab === 'blockchain' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Web3 Registry
          </button>
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Universal Scan trigger */}
          <button
            onClick={onOpenQuickScan}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#273449] bg-[#111827]/80 text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="Global Quick Scan"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="whitespace-nowrap">Investigate Target</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#172033] rounded border border-[#273449]">
              /
            </kbd>
          </button>

          {/* Landing vs App toggle */}
          {isLandingPage ? (
            <button
              onClick={() => {
                setIsLandingPage(false);
                onNavigate('overview');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/25 transition-all whitespace-nowrap shrink-0"
            >
              Launch Dashboard
            </button>
          ) : (
            <button
              onClick={() => setIsLandingPage(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#111827] border border-[#273449] rounded-lg hover:text-white hover:border-slate-600 transition-colors whitespace-nowrap shrink-0"
            >
              Public Overview
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#111827] rounded-lg transition-colors border border-transparent hover:border-[#273449]"
            aria-label="Toggle theme mode"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-200" />}
          </button>

          {/* User / Sentinel status */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#273449]">
            <div className="w-7 h-7 rounded-full bg-violet-950 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300">
              TR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
