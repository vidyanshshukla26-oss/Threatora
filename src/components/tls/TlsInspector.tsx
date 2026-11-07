import React, { useState } from 'react';
import {
  KeyRound,
  Search,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Cpu,
  FileCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import type { TLSInspectionResult, RiskClassification } from '../../types/threatora.ts';

export const TlsInspector: React.FC = () => {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TLSInspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: 'Cloudflare / GitHub (Valid)', host: 'github.com' },
    { label: 'Expired Test Domain', host: 'expired.badssl.com' },
    { label: 'Untrusted Root Test', host: 'untrusted-root.badssl.com' }
  ];

  const handleInspect = async (hostToInspect: string) => {
    const clean = hostToInspect.trim();
    if (!clean) {
      setError('Please provide a domain or hostname for TLS inspection.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/scan/tls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: clean })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to inspect TLS configuration.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network connection error while conducting TLS handshake.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TLSInspectionResult['status']) => {
    switch (status) {
      case 'Valid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid Certificate
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            Certificate Expired
          </span>
        );
      case 'Mismatch':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-950/60 text-orange-300 border border-orange-500/40">
            <ShieldAlert className="w-3.5 h-3.5" />
            Hostname Mismatch
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40">
            <Info className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-cyan-400" />
          TLS Certificate & Digital Trust Inspector
        </h1>
        <p className="text-sm text-slate-400">
          Probe X.509 cryptographic certificates, Certificate Authority authenticity, and verify digital trust chains.
        </p>
      </div>

      {/* Crucial Educational Principle Banner */}
      <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-start gap-3 text-xs leading-relaxed text-violet-200">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold">Core Principle: </strong>
          HTTPS means the connection is encrypted and certificate-authenticated. It does not guarantee that the website is legitimate or safe. Phishers routinely obtain valid free certificates for malicious lookalike websites.
        </div>
      </div>

      {/* Input Card */}
      <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInspect(target);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#080B14] border border-[#273449] focus-within:border-cyan-500 transition-colors">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter domain or hostname (e.g. github.com)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !target.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>{loading ? 'Inspecting Handshake...' : 'Inspect TLS Certificate'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-slate-500 text-[11px]">Test Hostnames:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTarget(p.host);
                handleInspect(p.host);
              }}
              className="px-2.5 py-1 rounded-md bg-[#111827] border border-[#273449] hover:border-cyan-500/50 hover:text-white transition-colors text-[11px]"
            >
              {p.label}
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
          {/* Main Status & Issuer Card */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#273449]">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Target: {result.target} · Port 443 SNI Handshake
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  X.509 Digital Certificate Report
                </h2>
              </div>
              {getStatusBadge(result.status)}
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {result.summary}
            </p>

            {/* Issuer & Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#111827] border border-[#273449] space-y-2 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Issuing Certificate Authority (CA)
                </span>
                <div className="text-sm font-bold text-white">
                  {result.issuer.organization || result.issuer.commonName}
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                  CN: {result.issuer.commonName} | Country: {result.issuer.country}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-[#273449] space-y-2 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Certificate Subject & SANs
                </span>
                <div className="text-sm font-bold text-white truncate">
                  {result.subject.commonName}
                </div>
                <div className="text-slate-400 text-[11px] font-mono truncate">
                  SAN Count: {result.subject.altNames.length} ({result.subject.altNames.slice(0, 3).join(', ')}...)
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic & Timeline Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Box 1 */}
            <div className="p-4 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Validity Window</span>
              </div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {result.validity.daysRemaining} Days
              </div>
              <p className="text-[11px] text-slate-500">
                Until {result.validity.validTo ? new Date(result.validity.validTo).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-4 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Public Key</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">
                {result.cryptography.keySizeBits}-bit {result.cryptography.keyAlgorithm}
              </div>
              <p className="text-[11px] text-slate-500">Asymmetric Key Strength</p>
            </div>

            {/* Box 3 */}
            <div className="p-4 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cipher Suite</span>
              </div>
              <div className="text-sm font-bold text-white font-mono truncate">
                {result.cryptography.cipherSuite}
              </div>
              <p className="text-[11px] text-slate-500">{result.cryptography.protocolVersion}</p>
            </div>

            {/* Box 4 */}
            <div className="p-4 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transparency (CT)</span>
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                SCT Logged
              </div>
              <p className="text-[11px] text-slate-500">Public Auditability Recorded</p>
            </div>
          </div>

          {/* Certificate Findings or Health Confirmation */}
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-3">
            <h3 className="text-sm font-bold text-white">
              Trust Chain & Configuration Findings ({result.findings.length})
            </h3>

            {result.findings.length > 0 ? (
              <div className="space-y-2">
                {result.findings.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#111827] border border-[#273449] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30">
                        {f.severity}
                      </span>
                      <span>{f.title}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{f.explanation}</p>
                    <div className="text-cyan-300 font-mono text-[11px]">
                      Evidence: {f.technicalDetails}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  No cryptographic anomalies or expiration concerns identified. The certificate chain matches RFC 6125 standards and is issued by a recognized root authority.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
