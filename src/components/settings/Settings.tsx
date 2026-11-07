import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Sparkles,
  Lock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ExternalLink
} from 'lucide-react';

interface SettingsProps {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  onLaunchTestScenario: (type: 'url' | 'message', target: string) => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({
  demoMode,
  setDemoMode,
  onLaunchTestScenario
}) => {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-400" />
          Settings & Predefined Test Scenarios
        </h1>
        <p className="text-sm text-slate-400">
          Configure inspection boundaries, review SSRF defense filters, and run 48-hour MVP demo benchmarks.
        </p>
      </div>

      {/* Demo Mode Toggle Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Demonstration & Offline Mode</h3>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-500/30">
              HACKATHON MODE
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            When enabled, Threatora prioritizes local deterministic dataset fixtures for external threat feeds if internet connectivity or rate limits are reached.
          </p>
        </div>

        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            demoMode
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/25'
              : 'bg-[#172033] border border-[#273449] text-slate-400 hover:text-white'
          }`}
        >
          {demoMode ? 'Demo Mode Active' : 'Enable Demo Mode'}
        </button>
      </div>

      {/* Predefined Test Benchmarks (Mandatory prompt requirements) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-cyan-400" />
          Predefined Test Benchmarks
        </h2>
        <p className="text-xs text-slate-400">
          Demonstrate Threatora's dual-engine detection on both suspicious threats and benign controls.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Suspicious Scenarios */}
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Suspicious Test Scenarios</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Lookalike Typosquatting Domain</h4>
                  <p className="text-slate-400 text-[11px] font-mono">paypa1-security-verification.net</p>
                </div>
                <button
                  onClick={() => onLaunchTestScenario('url', 'paypa1-security-verification.net')}
                  className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/30 text-[11px] font-semibold hover:bg-rose-900/50 transition-colors"
                >
                  Test Scan
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Urgent Financial OTP Smishing</h4>
                  <p className="text-slate-400 text-[11px] truncate max-w-xs">CHASE ALERT: Unauthorized $890 transfer...</p>
                </div>
                <button
                  onClick={() => onLaunchTestScenario('message', 'CHASE ALERT: Unauthorized $890 transfer detected on your account. Reply immediately with your OTP code to cancel within 30 minutes.')}
                  className="px-2.5 py-1 rounded bg-orange-950 text-orange-300 border border-orange-500/30 text-[11px] font-semibold hover:bg-orange-900/50 transition-colors"
                >
                  Test Scan
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Known Phishing Feed Match</h4>
                  <p className="text-slate-400 text-[11px] font-mono">dhl-express-customs-fee-clearance.info</p>
                </div>
                <button
                  onClick={() => onLaunchTestScenario('url', 'dhl-express-customs-fee-clearance.info')}
                  className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/30 text-[11px] font-semibold hover:bg-rose-900/50 transition-colors"
                >
                  Test Scan
                </button>
              </div>
            </div>
          </div>

          {/* Benign Scenarios */}
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Benign Control Scenarios</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Known Legitimate Domain</h4>
                  <p className="text-slate-400 text-[11px] font-mono">github.com</p>
                </div>
                <button
                  onClick={() => onLaunchTestScenario('url', 'github.com')}
                  className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-900/50 transition-colors"
                >
                  Test Scan
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Normal Business Communication</h4>
                  <p className="text-slate-400 text-[11px] truncate max-w-xs">Hi Team, Q3 design review tomorrow at 10 AM...</p>
                </div>
                <button
                  onClick={() => onLaunchTestScenario('message', 'Hi Team, the Q3 design review is scheduled for tomorrow at 10:00 AM. Please review the updated slide deck on our internal drive.')}
                  className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-900/50 transition-colors"
                >
                  Test Scan
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Valid High-Assurance TLS Host</h4>
                  <p className="text-slate-400 text-[11px] font-mono">cloudflare.com</p>
                </div>
                <button
                  onClick={() => onLaunchTestScenario('url', 'cloudflare.com')}
                  className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-900/50 transition-colors"
                >
                  Test Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture & Isolation Details */}
      <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          Active SSRF Protection & Isolation Parameters
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex justify-between font-mono">
            <span className="text-slate-400">Blocked IP Ranges:</span>
            <span className="text-cyan-300">127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, ::1</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex justify-between font-mono">
            <span className="text-slate-400">Redirect Limits:</span>
            <span className="text-cyan-300">Max 3 hops with re-evaluated DNS SSRF validation per hop</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex justify-between font-mono">
            <span className="text-slate-400">Web3 Contract:</span>
            <span className="text-cyan-300">0x8fB6c123C417A2F09191295D31F830eC56b4E901 (Sepolia Testnet)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
