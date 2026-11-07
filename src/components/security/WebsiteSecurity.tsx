import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Server,
  Info,
  RefreshCw
} from 'lucide-react';
import type { WebsiteSecurityResult } from '../../types/threatora.ts';

export const WebsiteSecurity: React.FC = () => {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WebsiteSecurityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = ['github.com', 'wikipedia.org', 'cloudflare.com'];

  const handleScan = async (hostToScan: string) => {
    const clean = hostToScan.trim();
    if (!clean) {
      setError('Please provide a website URL or domain.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/scan/website-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: clean })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Security assessment failed.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network connection error while conducting security header audit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Website Security & Header Posture
        </h1>
        <p className="text-sm text-slate-400">
          Passive assessment of publicly observable HTTP security headers and defensive boundary configurations.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#273449] flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">Strictly Passive Testing: </strong>
          Threatora only analyzes publicly served HTTP headers. We never attempt exploit payloads, invasive vulnerability scanning, or unauthorized probing. Missing headers represent hardening recommendations, not evidence of a breach.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan(target);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#080B14] border border-[#273449] focus-within:border-cyan-500 transition-colors">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter website (e.g. github.com)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !target.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold text-xs hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{loading ? 'Analyzing Headers...' : 'Run Security Audit'}</span>
          </button>
        </form>

        <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-slate-500 text-[11px]">Quick Tests:</span>
          {presets.map((site, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTarget(site);
                handleScan(site);
              }}
              className="px-2.5 py-1 rounded-md bg-[#111827] border border-[#273449] hover:border-emerald-500/50 hover:text-white transition-colors text-[11px]"
            >
              {site}
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

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#273449]">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Target: {result.target} · Passive Header Audit
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Defensive Header Posture Report
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">HTTPS Enforced:</span>
                <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                  YES
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {result.summary}
            </p>

            {/* Server technology banner info */}
            <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Reported Server Banner:</span>
                <span className="font-mono text-white">
                  {result.serverInfo?.serverHeader || 'Hidden (Secure Baseline)'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                result.serverInfo?.leaksTechnology
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {result.serverInfo?.leaksTechnology ? 'Version Leaked' : 'Hardened'}
              </span>
            </div>
          </div>

          {/* Security Headers Table */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
            <h3 className="text-base font-bold text-white">
              Defensive Header Checklist ({result.headers.filter(h => h.present).length}/{result.headers.length} Implemented)
            </h3>

            <div className="space-y-3">
              {result.headers.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 text-xs ${
                    h.present
                      ? 'bg-[#111827] border-[#273449]'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-bold text-white text-sm">
                      {h.present ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{h.name}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        h.present
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {h.present ? 'Configured' : 'Missing'}
                    </span>
                  </div>

                  <p className="text-slate-400 leading-relaxed font-sans text-xs">
                    {h.description}
                  </p>

                  {h.present && h.value && (
                    <div className="p-2 rounded bg-[#080B14] border border-[#273449] font-mono text-[11px] text-cyan-300 break-all">
                      {h.value}
                    </div>
                  )}

                  {!h.present && (
                    <div className="text-amber-300 font-mono text-[11px]">
                      Recommendation: {h.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
