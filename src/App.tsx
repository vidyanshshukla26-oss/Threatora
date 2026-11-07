import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';
import { UrlScanner } from './components/scanner/UrlScanner.tsx';
import { MessageAnalyzer } from './components/analyzer/MessageAnalyzer.tsx';
import { TlsInspector } from './components/tls/TlsInspector.tsx';
import { WebsiteSecurity } from './components/security/WebsiteSecurity.tsx';
import { ThreatCorrelation } from './components/intelligence/ThreatCorrelation.tsx';
import { BlockchainRegistry } from './components/blockchain/BlockchainRegistry.tsx';
import { InvestigationHistory } from './components/history/InvestigationHistory.tsx';
import { SettingsPage } from './components/settings/Settings.tsx';
import { CyberGuardianChat } from './components/ai/CyberGuardianChat.tsx';
import type { InvestigationHistoryItem, URLScanResult } from './types/threatora.ts';
import { Search, X, Globe, MailWarning, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isGuardianOpen, setIsGuardianOpen] = useState<boolean>(false);

  // Global Quick Scan Modal
  const [isQuickScanOpen, setIsQuickScanOpen] = useState<boolean>(false);
  const [quickScanInput, setQuickScanInput] = useState<string>('');
  const [quickScanType, setQuickScanType] = useState<'url' | 'message'>('url');

  // Shared investigation target when navigating
  const [activeUrlTarget, setActiveUrlTarget] = useState<string>('');
  const [activeMessageTarget, setActiveMessageTarget] = useState<string>('');
  const [reportToRegister, setReportToRegister] = useState<any | null>(null);

  // Persistent / in-memory history state
  const [history, setHistory] = useState<InvestigationHistoryItem[]>([]);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Check URL query parameters (e.g. ?autostart=1 or ?tab=scanner)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab')) {
      setCurrentTab(params.get('tab')!);
      setIsLandingPage(false);
    }
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load history from backend
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.warn('Could not load history:', err);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartUrlScan = (targetUrl: string) => {
    setActiveUrlTarget(targetUrl);
    setIsLandingPage(false);
    setCurrentTab('scanner');
  };

  const handleStartMessageScan = (message: string) => {
    setActiveMessageTarget(message);
    setIsLandingPage(false);
    setCurrentTab('analyzer');
  };

  const handleSubmitToBlockchain = (scanResult: URLScanResult) => {
    setReportToRegister(scanResult);
    setCurrentTab('blockchain');
  };

  const handleSelectHistoryItem = (item: InvestigationHistoryItem) => {
    if (item.type === 'URL') {
      handleStartUrlScan(item.target);
    } else if (item.type === 'Message') {
      handleStartMessageScan(item.target);
    } else if (item.type === 'TLS') {
      setActiveUrlTarget(item.target);
      setCurrentTab('tls');
    } else {
      setActiveUrlTarget(item.target);
      setCurrentTab('security');
    }
  };

  const handleQuickScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScanInput.trim()) return;
    setIsQuickScanOpen(false);
    if (quickScanType === 'url') {
      handleStartUrlScan(quickScanInput.trim());
    } else {
      handleStartMessageScan(quickScanInput.trim());
    }
    setQuickScanInput('');
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setIsLandingPage(false);
          setCurrentTab(tab);
        }}
        isLandingPage={isLandingPage}
        setIsLandingPage={setIsLandingPage}
        theme={theme}
        setTheme={setTheme}
        onOpenQuickScan={() => setIsQuickScanOpen(true)}
      />

      {/* Main Workspace Frame */}
      {isLandingPage ? (
        <main className="flex-1">
          <LandingPage
            onStartScan={handleStartUrlScan}
            onExploreIntel={() => {
              setIsLandingPage(false);
              setCurrentTab('intelligence');
            }}
            onGoToDashboard={() => {
              setIsLandingPage(false);
              setCurrentTab('overview');
            }}
          />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onOpenGuardianChat={() => setIsGuardianOpen(true)}
          />

          {/* Module Viewport */}
          <main className="flex-1 overflow-y-auto">
            {currentTab === 'overview' && (
              <Dashboard
                onNavigate={(tab) => setCurrentTab(tab)}
                onStartUrlScan={handleStartUrlScan}
                onStartMessageScan={handleStartMessageScan}
                history={history}
                onOpenGuardianChat={() => setIsGuardianOpen(true)}
                onSelectHistoryItem={handleSelectHistoryItem}
              />
            )}

            {currentTab === 'scanner' && (
              <UrlScanner
                initialUrl={activeUrlTarget}
                onSubmitToBlockchain={handleSubmitToBlockchain}
                onExploreCorrelation={(domain) => {
                  setCurrentTab('intelligence');
                }}
              />
            )}

            {currentTab === 'analyzer' && (
              <MessageAnalyzer
                initialMessage={activeMessageTarget}
                onInvestigateUrl={(url) => handleStartUrlScan(url)}
              />
            )}

            {currentTab === 'tls' && <TlsInspector />}

            {currentTab === 'security' && <WebsiteSecurity />}

            {currentTab === 'intelligence' && (
              <ThreatCorrelation onInvestigateTarget={handleStartUrlScan} />
            )}

            {currentTab === 'blockchain' && (
              <BlockchainRegistry initialReportToSubmit={reportToRegister} />
            )}

            {currentTab === 'history' && (
              <InvestigationHistory
                history={history}
                onSelectReport={handleSelectHistoryItem}
                onDeleteHistoryItem={handleDeleteHistory}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage
                demoMode={demoMode}
                setDemoMode={setDemoMode}
                onLaunchTestScenario={(type, target) => {
                  if (type === 'url') {
                    handleStartUrlScan(target);
                  } else {
                    handleStartMessageScan(target);
                  }
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Cyber Guardian AI Assistant Drawer */}
      <CyberGuardianChat
        isOpen={isGuardianOpen}
        onClose={() => setIsGuardianOpen(false)}
        activeContext={{ currentTab, activeUrlTarget }}
      />

      {/* Global Quick Scan Modal */}
      {isQuickScanOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D1220] border border-[#273449] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#273449]">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Universal Investigation Shortcut</h3>
              </div>
              <button
                onClick={() => setIsQuickScanOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuickScanType('url')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  quickScanType === 'url' ? 'bg-violet-600 text-white' : 'bg-[#172033] text-slate-400'
                }`}
              >
                URL / Domain
              </button>
              <button
                onClick={() => setQuickScanType('message')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  quickScanType === 'message' ? 'bg-violet-600 text-white' : 'bg-[#172033] text-slate-400'
                }`}
              >
                Message / SMS
              </button>
            </div>

            <form onSubmit={handleQuickScanSubmit} className="space-y-3">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#080B14] border border-[#273449] focus-within:border-cyan-500">
                {quickScanType === 'url' ? (
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <MailWarning className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <input
                  type="text"
                  value={quickScanInput}
                  onChange={(e) => setQuickScanInput(e.target.value)}
                  placeholder={
                    quickScanType === 'url'
                      ? 'Enter URL or domain (e.g. paypa1-verification.net)...'
                      : 'Paste suspicious message...'
                  }
                  autoFocus
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickScanOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#111827] text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
