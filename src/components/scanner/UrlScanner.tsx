import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Boxes,
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowRight,
  Share2,
  RefreshCw,
  Info
} from 'lucide-react';
import type { URLScanResult, Finding, RiskClassification } from '../../types/threatora.ts';

interface UrlScannerProps {
  initialUrl?: string;
  onSubmitToBlockchain: (scan: URLScanResult) => void;
  onExploreCorrelation: (domain: string) => void;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({
  initialUrl = '',
  onSubmitToBlockchain,
  onExploreCorrelation
}) => {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [result, setResult] = useState<URLScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Example test scenarios (strictly matching prompt criteria)
  const presets = [
    { label: 'Lookalike Typosquatting', url: 'paypa1-security-verification.net', type: 'Suspicious' },
    { label: 'Smishing Lure Domain', url: 'dhl-express-customs-fee-clearance.info', type: 'High Risk' },
    { label: 'Legitimate Site', url: 'github.com', type: 'Benign' },
  ];

  useEffect(() => {
    if (initialUrl && !result && !loading) {
      setUrlInput(initialUrl);
      executeScan(initialUrl);
    }
  }, [initialUrl]);

  const scanStepsLabels = [
    'Validating submitted URL & SSRF safety',
    'Inspecting domain characteristics & brand lookalikes',
    'Checking external threat intelligence (URLhaus)',
    'Examining redirect destination hops',
    'Inspecting TLS certificate authenticity',
    'Synthesizing evidence-backed risk assessment'
  ];

  const executeScan = async (targetToScan: string) => {
    const clean = targetToScan.trim();
    if (!clean) {
      setError('Please provide a URL or domain to investigate.');
      return;
    }

    setError(null);
    setLoading(true);
    setScanStep(0);
    setResult(null);

    // Progress animation interval
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 450);

    try {
      const response = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: clean })
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok) {
        setError(data.error || 'Failed to complete investigation.');
      } else {
        setResult(data);
        // Expand first finding by default if exists
        if (data.findings && data.findings.length > 0) {
          setExpandedFindings({ [data.findings[0].id]: true });
        }
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setError('Network connection error while conducting investigation.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFinding = (id: string) => {
    setExpandedFindings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threatora-report-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: RiskClassification) => {
    switch (risk) {
      case 'Confirmed Malicious':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
      case 'High Risk':
        return 'text-orange-400 border-orange-500/40 bg-orange-950/40';
      case 'Suspicious':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
      case 'No Known Threats':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-900';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Globe className="w-6 h-6 text-cyan-400" />
          Intelligent URL & Phishing Scanner
        </h1>
        <p className="text-sm text-slate-400">
          Deconstruct suspicious websites, examine brand impersonation, and verify digital trust indicators.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] shadow-xl shadow-black/20 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeScan(urlInput);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#080B14] border border-[#273449] focus-within:border-cyan-500 transition-colors">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter a website URL or domain to investigate..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !urlInput.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Investigating...' : 'Analyze Website'}</span>
          </button>
        </form>

        {/* Preset scenario buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-slate-500 text-[11px]">Test Scenarios:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrlInput(p.url);
                executeScan(p.url);
              }}
              className="px-2.5 py-1 rounded-md bg-[#111827] border border-[#273449] hover:border-cyan-500/50 hover:text-white transition-colors text-[11px]"
            >
              {p.label} <span className="text-slate-500 font-mono">({p.url})</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading Animated State */}
      {loading && (
        <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Investigation Pipeline Active</h3>
                <p className="text-xs text-slate-400">Executing deterministic security checks...</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Step {scanStep + 1} of 6
            </span>
          </div>

          {/* Progress sequence bar */}
          <div className="space-y-2">
            <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#273449]">
              <div
                className="bg-gradient-to-r from-violet-600 to-cyan-400 h-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / 6) * 100}%` }}
              />
            </div>
            <p className="text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {scanStepsLabels[scanStep]}
            </p>
          </div>
        </div>
      )}

      {/* Investigation Results Report */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#273449]">
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Report ID: {result.id} · {result.timestamp.replace('T', ' ').substring(0, 19)} UTC
                </div>
                <h2 className="text-xl font-bold text-white mt-1 break-all">
                  {result.target}
                </h2>
              </div>

              {/* Master Risk Classification */}
              <div className={`px-4 py-2 rounded-xl border font-bold text-sm uppercase tracking-wide flex items-center gap-2 shrink-0 ${getRiskColor(result.riskClassification)}`}>
                <ShieldAlert className="w-4 h-4" />
                <span>{result.riskClassification}</span>
              </div>
            </div>

            {/* Evidence-Backed Summary */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#273449] space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Threatora Intelligence Assessment
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {result.summary}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Evidence Coverage:</span>
                <span className="font-mono font-bold text-white">
                  {result.evidenceCoverage.completed}/{result.evidenceCoverage.totalChecks} Checks Completed ({result.evidenceCoverage.coveragePercentage}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#273449] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#273449] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => onSubmitToBlockchain(result)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-violet-600/25 flex items-center gap-1.5 transition-all"
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Register on Web3</span>
                </button>
              </div>
            </div>
          </div>

          {/* Finding Cards Accordion */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Security Findings ({result.findings.length})</span>
              <span className="text-xs font-normal text-slate-400">
                Click any finding to inspect technical details
              </span>
            </h3>

            {result.findings.length > 0 ? (
              result.findings.map((f) => {
                const isExpanded = !!expandedFindings[f.id];
                return (
                  <div
                    key={f.id}
                    className="rounded-xl bg-[#0D1220] border border-[#273449] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFinding(f.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#111827]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            f.severity === 'Critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : f.severity === 'High'
                              ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                              : f.severity === 'Medium'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {f.severity}
                        </span>
                        <h4 className="text-sm font-semibold text-white truncate">
                          {f.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-500 hidden sm:inline-block">
                          {f.evidenceSource}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#273449]/60 space-y-3 text-xs bg-[#080B14]/40">
                        <p className="text-slate-300 leading-relaxed font-sans mt-3">
                          {f.explanation}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-lg bg-[#111827] border border-[#273449] space-y-1">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Technical Details
                            </span>
                            <span className="font-mono text-cyan-300 text-[11px] block break-all">
                              {f.technicalDetails}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-[#111827] border border-[#273449] space-y-1">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Why It Matters
                            </span>
                            <span className="text-slate-300 text-[11px] block">
                              {f.whyItMatters}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs">
                          <span className="font-semibold">Recommended Action: </span>
                          {f.suggestedAction}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#0D1220] border border-[#273449] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Threat Indicators Identified</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The domain resolved correctly, no lookalike character substitutions were observed, and no matches were found in active abuse feeds.
                </p>
              </div>
            )}
          </div>

          {/* Technical Diagnostics Grid (Redirects, Threat Feeds, TLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Redirects */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#273449] space-y-2 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Redirect Inspection
              </span>
              <div className="font-mono text-white">
                Hops: {result.redirects.hopCount}
              </div>
              <p className="text-slate-400 text-[11px]">
                {result.redirects.destinationChangedDomain
                  ? 'Warning: Domain boundary changed during redirect hops.'
                  : 'Direct or same-domain destination.'}
              </p>
            </div>

            {/* External Threat Feeds */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#273449] space-y-2 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Threat Intelligence Feeds
              </span>
              <div className="font-mono text-white">
                {result.threatIntel.filter(t => t.matched).length > 0 ? (
                  <span className="text-rose-400 font-bold">Blacklist Match</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Clear / No Match</span>
                )}
              </div>
              <p className="text-slate-400 text-[11px]">
                Queried URLhaus and verified abuse datasets.
              </p>
            </div>

            {/* TLS Quick Status */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#273449] space-y-2 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                TLS Connection
              </span>
              <div className="font-mono text-white">
                {result.tlsSummary?.hasHttps ? (
                  <span className="text-cyan-400 font-semibold">HTTPS Port 443 Active</span>
                ) : (
                  <span className="text-amber-400 font-semibold">No TLS / Unavailable</span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] truncate">
                Issuer: {result.tlsSummary?.issuer || 'None'}
              </p>
            </div>
          </div>

          {/* Action Recommendations List */}
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Recommended Security Guidance
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.recommendedActions.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
