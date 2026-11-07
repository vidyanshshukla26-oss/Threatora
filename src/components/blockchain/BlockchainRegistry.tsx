import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Hash,
  Cpu,
  RefreshCw,
  PlusCircle,
  FileCheck2,
  X
} from 'lucide-react';
import type { BlockchainThreatReport } from '../../types/threatora.ts';

interface BlockchainRegistryProps {
  initialReportToSubmit?: any;
}

export const BlockchainRegistry: React.FC<BlockchainRegistryProps> = ({
  initialReportToSubmit
}) => {
  const [reports, setReports] = useState<BlockchainThreatReport[]>([]);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Independent verification modal / query state
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  // New report form state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formTarget, setFormTarget] = useState(initialReportToSubmit?.target || '');
  const [formCategory, setFormCategory] = useState(initialReportToSubmit?.riskClassification || 'Phishing / Brand Spoof');
  const [formSummary, setFormSummary] = useState(initialReportToSubmit?.summary || '');
  const [formIndicators, setFormIndicators] = useState(
    initialReportToSubmit?.findings?.map((f: any) => f.title).join(', ') || 'typosquatting, deceptive domain, fake TLS'
  );

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blockchain/reports');
      const data = await res.json();
      setReports(data.reports || []);
      setContractAddress(data.contractAddress || '');
      setNetwork(data.network || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (queryToVerify?: string) => {
    const q = (queryToVerify || verifyQuery).trim();
    if (!q) return;

    setVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch('/api/blockchain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: q, txHash: q })
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch {
      setVerificationResult({
        outcome: 'Unavailable',
        message: 'Could not connect to EVM smart contract node.',
        verified: false
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTarget.trim()) return;

    setSubmitting(true);
    try {
      const indicatorsArr = formIndicators.split(',').map((s: string) => s.trim()).filter(Boolean);
      const res = await fetch('/api/blockchain/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: formTarget.trim(),
          threatCategory: formCategory,
          summary: formSummary.trim(),
          indicators: indicatorsArr
        })
      });

      if (res.ok) {
        setIsSubmitModalOpen(false);
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-purple-400" />
            Decentralized Threat Intelligence Registry
          </h1>
          <p className="text-sm text-slate-400">
            Immutable, tamper-evident security commitments registered on an EVM smart contract.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 shadow-lg shadow-violet-600/25 flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Threat On-Chain</span>
        </button>
      </div>

      {/* Contract & Network Meta Bar */}
      <div className="p-4 rounded-xl bg-[#0D1220] border border-[#273449] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-500">Contract:</span>
          <span className="text-cyan-300 break-all">{contractAddress || '0x8fB6c123C417A2F09191295D31F830eC56b4E901'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Network:</span>
          <span className="text-emerald-400 font-semibold">{network || 'Ethereum Sepolia Testnet'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Independent Verification Search Box */}
      <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            Independent Report Verifier
          </h2>
          <p className="text-xs text-slate-400">
            Enter a Report ID or Transaction Hash. Threatora will independently recompute the SHA-256 canonical hash of the off-chain data and compare it against the on-chain commitment.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#273449] focus-within:border-cyan-500 transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={verifyQuery}
              onChange={(e) => setVerifyQuery(e.target.value)}
              placeholder="Enter Report ID (e.g. TR-2026-8841) or Tx Hash (0x3a4b...)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={verifying || !verifyQuery.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
          >
            {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{verifying ? 'Recalculating...' : 'Verify Cryptographic Integrity'}</span>
          </button>
        </form>

        {/* Verification Outcome Card */}
        {verificationResult && (
          <div className="p-4 rounded-xl bg-[#111827] border border-[#273449] space-y-3 pt-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#273449]">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Verification Result
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                  verificationResult.outcome === 'Verified'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : verificationResult.outcome === 'Verification Failed'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}
              >
                {verificationResult.outcome === 'Verified' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {verificationResult.outcome}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {verificationResult.explanation || verificationResult.message}
            </p>

            {verificationResult.storedCommitment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono pt-2">
                <div className="p-2.5 rounded bg-[#080B14] border border-[#273449] space-y-1">
                  <span className="text-slate-500 block">On-Chain Registered Commitment:</span>
                  <span className="text-cyan-300 break-all">{verificationResult.storedCommitment}</span>
                </div>
                <div className="p-2.5 rounded bg-[#080B14] border border-[#273449] space-y-1">
                  <span className="text-slate-500 block">Independently Recalculated Hash:</span>
                  <span className="text-emerald-300 break-all">{verificationResult.recalculatedHash}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registered On-Chain Reports List */}
      <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            On-Chain Threat Report Ledger ({reports.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            EVM Contract: ThreatReportRegistry.sol
          </span>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.reportId}
              className="p-4 rounded-xl bg-[#111827] border border-[#273449] hover:border-violet-500/40 transition-all space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {report.reportId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-300 text-[10px] font-medium border border-violet-500/30">
                    {report.threatCategory}
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  Block #{report.blockNumber} · {report.timestamp.replace('T', ' ').substring(0, 16)} UTC
                </span>
              </div>

              <div className="font-mono text-white text-xs break-all">
                Target: {report.target}
              </div>

              <p className="text-slate-300 font-sans leading-relaxed text-xs">
                {report.summary}
              </p>

              {/* Hash commitment & Tx hash */}
              <div className="p-3 rounded-lg bg-[#080B14] border border-[#273449] space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 truncate">SHA-256 Commitment:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 truncate max-w-xs">{report.hashCommitment}</span>
                    <button
                      onClick={() => handleCopy(report.hashCommitment)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Hash"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 truncate">Tx Hash:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 truncate max-w-xs">{report.txHash}</span>
                    <button
                      onClick={() => handleCopy(report.txHash)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Tx"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {report.indicators.map((ind, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#172033] text-[10px] text-slate-400">
                      {ind}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setVerifyQuery(report.reportId);
                    handleVerify(report.reportId);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Hash</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D1220] border border-[#273449] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-purple-400" />
                Submit Verifiable Threat Report
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewReport} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Target Domain or URL
                </label>
                <input
                  type="text"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  placeholder="https://example-phish.net"
                  required
                  className="w-full bg-[#080B14] border border-[#273449] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Threat Category
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Brand Impersonation, Credential Phishing"
                  required
                  className="w-full bg-[#080B14] border border-[#273449] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Report Summary (Public & Verifiable)
                </label>
                <textarea
                  rows={3}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Describe observed deceptive behaviors. Do NOT include passwords or private data."
                  required
                  className="w-full bg-[#080B14] border border-[#273449] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Threat Indicators (Comma separated)
                </label>
                <input
                  type="text"
                  value={formIndicators}
                  onChange={(e) => setFormIndicators(e.target.value)}
                  placeholder="homoglyph, fake TLS, urgency timer"
                  required
                  className="w-full bg-[#080B14] border border-[#273449] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-violet-950/30 border border-violet-500/20 text-[11px] text-violet-300">
                Threatora will compute a canonical SHA-256 hash commitment of this payload and broadcast it to the smart contract registry.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#111827] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Sign & Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
