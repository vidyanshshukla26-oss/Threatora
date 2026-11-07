import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Globe,
  MailWarning,
  KeyRound,
  ShieldCheck,
  Network,
  Boxes,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Bot,
  Filter,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { InvestigationHistoryItem, RiskClassification } from '../../types/threatora.ts';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStartUrlScan: (target: string) => void;
  onStartMessageScan: (message: string) => void;
  history: InvestigationHistoryItem[];
  onOpenGuardianChat: () => void;
  onSelectHistoryItem: (item: InvestigationHistoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onStartUrlScan,
  onStartMessageScan,
  history,
  onOpenGuardianChat,
  onSelectHistoryItem
}) => {
  const [targetType, setTargetType] = useState<'url' | 'message'>('url');
  const [universalInput, setUniversalInput] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const handleUniversalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!universalInput.trim()) return;
    if (targetType === 'url') {
      onStartUrlScan(universalInput.trim());
    } else {
      onStartMessageScan(universalInput.trim());
    }
  };

  // Filter history
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.target.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(historySearch.toLowerCase());
    const matchesRisk = riskFilter === 'all' || item.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Calculate real metrics from store
  const totalCount = history.length;
  const suspiciousCount = history.filter(h => h.risk === 'Suspicious').length;
  const highRiskCount = history.filter(h => h.risk === 'High Risk' || h.risk === 'Confirmed Malicious').length;
  const verifiedCount = 2; // on-chain registered seed reports

  const getRiskBadge = (risk: RiskClassification) => {
    switch (risk) {
      case 'Confirmed Malicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Confirmed Malicious
          </span>
        );
      case 'High Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-950/70 text-orange-300 border border-orange-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            High Risk
          </span>
        );
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Suspicious
          </span>
        );
      case 'No Known Threats':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            No Known Threats
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Inconclusive
          </span>
        );
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Your Digital Security Command Center
        </h1>
        <p className="text-sm text-slate-400">
          Investigate suspicious activity and understand your digital risk exposure.
        </p>
      </div>

      {/* Universal Investigation Input Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0D1220] via-[#111827] to-[#0D1220] border border-[#273449] shadow-xl shadow-black/30 space-y-4">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTargetType('url')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              targetType === 'url'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-[#172033]/50'
            }`}
          >
            Website / URL / Domain
          </button>
          <button
            onClick={() => setTargetType('message')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              targetType === 'message'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-[#172033]/50'
            }`}
          >
            Suspicious Message / Email
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleUniversalSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#273449] focus-within:border-cyan-500 transition-colors">
            {targetType === 'url' ? (
              <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            ) : (
              <MailWarning className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <input
              type="text"
              value={universalInput}
              onChange={(e) => setUniversalInput(e.target.value)}
              placeholder={
                targetType === 'url'
                  ? 'Enter URL or domain (e.g. paypa1-verification.net or github.com)...'
                  : 'Paste suspicious message, SMS text, or email body...'
              }
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-xs hover:opacity-95 shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Investigate Now</span>
          </button>
        </form>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Investigations</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalCount}
          </div>
          <p className="text-[11px] text-slate-500">Stored in local session memory</p>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Suspicious Targets</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {suspiciousCount}
          </div>
          <p className="text-[11px] text-slate-500">Require cautious handling</p>
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">High-Risk / Malicious</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
            {highRiskCount}
          </div>
          <p className="text-[11px] text-slate-500">Phishing or malware feeds</p>
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Verified On-Chain</span>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
            {verifiedCount}
          </div>
          <p className="text-[11px] text-slate-500">Immutable SHA-256 commitments</p>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Investigation Suites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <button
            onClick={() => onNavigate('scanner')}
            className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/50 hover:bg-[#111827] text-left transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                URL Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Investigate suspicious links, brand impersonation, and phishing infrastructure.
              </p>
            </div>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => onNavigate('analyzer')}
            className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/50 hover:bg-[#111827] text-left transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <MailWarning className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Message Analyzer
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Detect potential phishing, social engineering, OTP harvesting, and SMS scams.
              </p>
            </div>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => onNavigate('tls')}
            className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/50 hover:bg-[#111827] text-left transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <KeyRound className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                TLS Inspector
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inspect certificate validity, CA reputation, cipher suites, and Certificate Transparency.
              </p>
            </div>
          </button>

          {/* Card 4 */}
          <button
            onClick={() => onNavigate('security')}
            className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/50 hover:bg-[#111827] text-left transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Website Security
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Review publicly available HTTP headers, HSTS enforcement, and CSP policies.
              </p>
            </div>
          </button>

          {/* Card 5 */}
          <button
            onClick={() => onNavigate('intelligence')}
            className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/50 hover:bg-[#111827] text-left transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Threat Correlation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore connected infrastructure, recurring lookalike patterns, and attack campaigns.
              </p>
            </div>
          </button>

          {/* Card 6 */}
          <button
            onClick={() => onNavigate('blockchain')}
            className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/50 hover:bg-[#111827] text-left transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Blockchain Verification
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Independently verify cryptographic SHA-256 commitments on the EVM testnet registry.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Cyber Guardian AI Assistant Feature Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#111827] to-[#0D1220] border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-400/40 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Threatora Cyber Guardian
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-violet-900/60 text-violet-300 rounded border border-violet-500/30">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Need help understanding a security finding or certificate detail? Ask Threatora AI for calm, evidence-grounded answers.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGuardianChat}
          className="px-4 py-2 rounded-xl bg-[#172033] hover:bg-violet-600/30 border border-[#273449] hover:border-violet-500/50 text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Recent Investigations Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Recent Investigations</h2>
            <p className="text-xs text-slate-500">Audited session activity</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1220] border border-[#273449] text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search target..."
                className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-32 sm:w-44"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-[#0D1220] border border-[#273449] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Risks</option>
              <option value="Confirmed Malicious">Confirmed Malicious</option>
              <option value="High Risk">High Risk</option>
              <option value="Suspicious">Suspicious</option>
              <option value="No Known Threats">No Known Threats</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#273449] bg-[#0D1220]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#273449]">
              <tr>
                <th className="py-3 px-4 font-semibold">Target</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Risk Classification</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#273449]/60 font-mono">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#111827]/50 transition-colors cursor-pointer"
                    onClick={() => onSelectHistoryItem(item)}
                  >
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                      {item.target}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="font-sans px-2 py-0.5 rounded bg-[#172033] text-[11px]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      {getRiskBadge(item.risk)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHistoryItem(item);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                    No investigations match current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
