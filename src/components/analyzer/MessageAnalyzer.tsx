import React, { useState } from 'react';
import {
  MailWarning,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Coins,
  Link,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import type { MessageAnalysisResult, RiskClassification } from '../../types/threatora.ts';

interface MessageAnalyzerProps {
  initialMessage?: string;
  onInvestigateUrl: (url: string) => void;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({
  initialMessage = '',
  onInvestigateUrl
}) => {
  const [messageText, setMessageText] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      title: 'Banking OTP Phish',
      text: 'CHASE ALERT: Unauthorized $890 transfer detected on your account. If you did not make this request, reply immediately with your 6-digit OTP code or click http://chase-security-verify-auth.com to cancel within 30 minutes.'
    },
    {
      title: 'Customs Smishing',
      text: 'DHL Express: Your package #US882910 has an unpaid customs duty fee of $2.85. Your package will be returned to sender in 24 hours if unpaid. Clear fee at: https://dhl-express-customs-fee-clearance.info/pay'
    },
    {
      title: 'Crypto Reward Scam',
      text: 'Congratulations! Your wallet was selected in the Web3 Foundation Giveaway. You won 1.5 ETH ($4,500). Connect wallet or deposit 0.05 ETH gas fee to bc1q9x... within 12 hours to claim.'
    },
    {
      title: 'Benign Work Email',
      text: 'Hi Team, the Q3 design review is scheduled for tomorrow at 10:00 AM in Conference Room B. Please review the updated slide deck on our internal drive before the meeting.'
    }
  ];

  const handleAnalyze = async (textToScan: string) => {
    const clean = textToScan.trim();
    if (!clean) {
      setError('Please paste a message or email body to analyze.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/scan/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to analyze message.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network connection error while analyzing communication.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: RiskClassification) => {
    switch (risk) {
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
          <MailWarning className="w-6 h-6 text-amber-400" />
          AI Scam & Social Engineering Analyzer
        </h1>
        <p className="text-sm text-slate-400">
          Paste suspicious SMS, emails, WhatsApp messages, or job offers to identify manipulation and fraud patterns.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] shadow-xl space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Suspicious Communication Content
          </label>
          <textarea
            rows={5}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Paste your suspicious message or email here. Threatora AI will investigate its potential risks..."
            className="w-full bg-[#080B14] border border-[#273449] rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
            disabled={loading}
          />
        </div>

        {/* Action Button & Preset Chips */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 mr-1">Load Lure Preset:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMessageText(p.text);
                  handleAnalyze(p.text);
                }}
                className="px-2.5 py-1 rounded-md bg-[#111827] border border-[#273449] hover:border-amber-500/50 hover:text-white transition-colors text-[11px] text-slate-300"
              >
                {p.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAnalyze(messageText)}
            disabled={loading || !messageText.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white font-semibold text-xs hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Analyzing Tactics...' : 'Analyze Message'}</span>
          </button>
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
          {/* Header Assessment Card */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#273449]">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Analysis ID: {result.id} · {result.timestamp.replace('T', ' ').substring(0, 19)} UTC
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  Social Engineering Risk Assessment
                </h2>
              </div>

              <div className={`px-4 py-2 rounded-xl border font-bold text-sm uppercase tracking-wide flex items-center gap-2 shrink-0 ${getRiskColor(result.riskClassification)}`}>
                <ShieldAlert className="w-4 h-4" />
                <span>{result.riskClassification}</span>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="p-5 rounded-xl bg-[#111827] border border-violet-500/30 space-y-2">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Threatora AI Behavioral Breakdown</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {result.aiExplanation}
              </p>
            </div>

            {/* Detected Tactics Grid */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Detected Social Engineering Patterns
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  result.tacticsDetected.urgency
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : 'bg-[#111827] border-[#273449] text-slate-500'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Time Urgency Lure</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  result.tacticsDetected.otpPasswordHarvesting
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold'
                    : 'bg-[#111827] border-[#273449] text-slate-500'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>OTP / Code Theft</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  result.tacticsDetected.financialRequest
                    ? 'bg-orange-950/40 border-orange-500/40 text-orange-300'
                    : 'bg-[#111827] border-[#273449] text-slate-500'
                }`}>
                  <Coins className="w-3.5 h-3.5 shrink-0" />
                  <span>Payment Demand</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  result.tacticsDetected.fakeKyc
                    ? 'bg-orange-950/40 border-orange-500/40 text-orange-300'
                    : 'bg-[#111827] border-[#273449] text-slate-500'
                }`}>
                  <MailWarning className="w-3.5 h-3.5 shrink-0" />
                  <span>Identity / KYC Bait</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Entities List */}
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-3">
            <h3 className="text-sm font-bold text-white">
              Extracted Indicators ({result.extractedEntities.length})
            </h3>

            {result.extractedEntities.length > 0 ? (
              <div className="space-y-2">
                {result.extractedEntities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {ent.type === 'url' && <Link className="w-4 h-4 text-cyan-400 shrink-0" />}
                      {ent.type === 'phone' && <Phone className="w-4 h-4 text-slate-400 shrink-0" />}
                      {ent.type === 'email' && <Mail className="w-4 h-4 text-slate-400 shrink-0" />}
                      {ent.type === 'crypto' && <Coins className="w-4 h-4 text-amber-400 shrink-0" />}
                      <span className="font-mono text-slate-200 truncate">{ent.value}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-400 text-[11px]">{ent.note}</span>
                      {ent.type === 'url' && (
                        <button
                          onClick={() => onInvestigateUrl(ent.value)}
                          className="px-2.5 py-1 rounded bg-violet-600/30 border border-violet-500/40 hover:bg-violet-600/50 text-cyan-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>Scan URL</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No URLs, email addresses, phone numbers, or cryptocurrency wallets were embedded in this message.
              </p>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Protective Action Steps
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
