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
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scanner', label: 'URL Scanner', icon: Globe },
    { id: 'analyzer', label: 'Message Analyzer', icon: MailWarning },
    { id: 'tls', label: 'TLS Inspector', icon: KeyRound },
    { id: 'security', label: 'Website Security', icon: ShieldCheck },
    { id: 'intelligence', label: 'Threat Intelligence', icon: Network },
    { id: 'blockchain', label: 'Blockchain Registry', icon: Boxes },
    { id: 'history', label: 'Investigation History', icon: History },
    { id: 'settings', label: 'Settings & Demos', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-[#252d35] bg-[#0d1115] transition-all duration-200 z-30 ${
        isCollapsed ? 'w-18' : 'w-64'
      } shrink-0 hidden md:flex`}
      aria-label="Sidebar Navigation"
    >
      {/* Collapse Toggle button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#151b21] border border-[#303943] text-slate-400 hover:text-white flex items-center justify-center transition-colors z-20"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Main navigation list */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-medium text-slate-500">
            Workspace
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-[#1a222b] text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151b21]'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              {!isCollapsed && (
                <span className="truncate text-left whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cyber Guardian Mascot Assistant Callout */}
      <div className="p-3 border-t border-[#252d35]">
        <button
          onClick={onOpenGuardianChat}
          className={`w-full rounded-md p-2.5 border border-[#303943] hover:border-slate-500 text-left transition-colors group ${
            isCollapsed ? 'p-2 flex justify-center' : ''
          }`}
          title="Ask Threatora assistant"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#1a222b] text-slate-400">
              <Bot className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-slate-200">Assistant</span>
                <span className="text-[11px] text-slate-500 truncate">Ask about a finding</span>
              </div>
            )}
          </div>
        </button>
      </div>
    </aside>
  );
};
