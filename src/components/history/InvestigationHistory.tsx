import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';
import type { InvestigationHistoryItem, RiskClassification } from '../../types/threatora.ts';

interface InvestigationHistoryProps {
  history: InvestigationHistoryItem[];
  onSelectReport: (item: InvestigationHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const InvestigationHistory: React.FC<InvestigationHistoryProps> = ({
  history,
  onSelectReport,
  onDeleteHistoryItem
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.target.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesRisk = riskFilter === 'all' || item.risk === riskFilter;
    return matchesSearch && matchesType && matchesRisk;
  });

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
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            No Known Threats
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Target,Type,Risk,Date,Summary,FindingsCount'];
    const rows = history.map(h => `"${h.id}","${h.target}","${h.type}","${h.risk}","${h.date}","${h.summary.replace(/"/g, '""')}",${h.findingsCount}`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threatora-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            Investigation History & Audit Trail
          </h1>
          <p className="text-sm text-slate-400">
            Comprehensive audit record of past URL scans, message evaluations, and TLS probes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-[#111827] border border-[#273449] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1220] border border-[#273449] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#080B14] border border-[#273449] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search target or summary..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#080B14] border border-[#273449] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Types</option>
            <option value="url">URL Scans</option>
            <option value="message">Messages</option>
            <option value="tls">TLS Probes</option>
            <option value="website">Website Audits</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#080B14] border border-[#273449] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="Confirmed Malicious">Confirmed Malicious</option>
            <option value="High Risk">High Risk</option>
            <option value="Suspicious">Suspicious</option>
            <option value="No Known Threats">No Known Threats</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-[#273449] bg-[#0D1220] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#273449]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Target / Subject</th>
                <th className="py-3.5 px-4 font-semibold">Type</th>
                <th className="py-3.5 px-4 font-semibold">Risk Classification</th>
                <th className="py-3.5 px-4 font-semibold">Findings</th>
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#273449]/60 font-mono">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#111827]/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-white max-w-sm truncate">
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
                    <td className="py-3.5 px-4 text-slate-300 tabular-nums">
                      {item.findingsCount} findings
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] tabular-nums">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onSelectReport(item)}
                          className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                          title="Open Report"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No investigations match your search filters.
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
