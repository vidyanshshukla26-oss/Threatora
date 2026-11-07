import React from 'react';
import {
  LayoutDashboard,
  Globe,
  MailWarning,
  KeyRound,
  ShieldCheck,
  Network,
  Boxes,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenGuardianChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenGuardianChat
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, category: 'Core' },
    { id: 'scanner', label: 'URL Scanner', icon: Globe, category: 'Detection' },
    { id: 'analyzer', label: 'Message Analyzer', icon: MailWarning, category: 'Detection' },
    { id: 'tls', label: 'TLS Inspector', icon: KeyRound, category: 'Verification' },
    { id: 'security', label: 'Website Security', icon: ShieldCheck, category: 'Verification' },
    { id: 'intelligence', label: 'Threat Intelligence', icon: Network, category: 'Intelligence' },
    { id: 'blockchain', label: 'Blockchain Registry', icon: Boxes, category: 'Web3' },
    { id: 'history', label: 'Investigation History', icon: History, category: 'Records' },
    { id: 'settings', label: 'Settings & Demos', icon: Settings, category: 'System' },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-[#273449] bg-[#0D1220] transition-all duration-300 z-30 ${
        isCollapsed ? 'w-18' : 'w-64'
      } shrink-0 hidden md:flex`}
      aria-label="Sidebar Navigation"
    >
      {/* Collapse Toggle button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#172033] border border-[#273449] text-slate-400 hover:text-white flex items-center justify-center shadow-md hover:scale-110 transition-all z-20"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Main navigation list */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Investigation Suites
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-cyan-400 border border-violet-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]/70'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <span className="truncate text-left whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cyber Guardian Mascot Assistant Callout */}
      <div className="p-3 border-t border-[#273449]">
        <button
          onClick={onOpenGuardianChat}
          className={`w-full rounded-xl p-3 border border-violet-500/20 bg-gradient-to-b from-[#111827] to-[#172033] hover:border-violet-500/40 text-left transition-all group ${
            isCollapsed ? 'p-2 flex justify-center' : ''
          }`}
          title="Ask Threatora AI Cyber Guardian"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg bg-violet-900/60 border border-violet-400/40 flex items-center justify-center overflow-hidden">
                <Bot className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  Threatora AI
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </span>
                <span className="text-[11px] text-slate-400 truncate">Ask Cyber Guardian</span>
              </div>
            )}
          </div>
        </button>
      </div>
    </aside>
  );
};
