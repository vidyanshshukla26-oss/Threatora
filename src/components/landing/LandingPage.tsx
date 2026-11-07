import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  MailWarning,
  KeyRound,
  Boxes,
  Network,
  HelpCircle,
  ExternalLink,
  Search,
  Eye,
  ShieldCheck,
  FileCheck,
  Zap,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStartScan: (targetUrl: string) => void;
  onExploreIntel: () => void;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartScan,
  onExploreIntel,
  onGoToDashboard
}) => {
  const [heroInput, setHeroInput] = useState('');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroInput.trim()) {
      onStartScan(heroInput.trim());
    } else {
      onGoToDashboard();
    }
  };

  const sampleUrls = [
    'paypa1-security-verification.net',
    'dhl-express-customs-fee-clearance.info',
    'github.com'
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-cyan-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen Web Threat Detection & Digital Trust Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
              The Internet Is Full of Deception.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Stay One Step Ahead.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Threatora uses artificial intelligence, cybersecurity intelligence, and decentralized verification to help you detect malicious websites, identify online scams, and understand digital threats before they harm you.
            </p>

            {/* Interactive Hero URL Form */}
            <form onSubmit={handleHeroSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-[#0D1220] border border-[#273449] rounded-2xl shadow-xl shadow-black/40 focus-within:border-cyan-500/70 transition-all">
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    placeholder="Paste a suspicious URL, domain, or link..."
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0"
                >
                  <span>Start Free Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Quick Links */}
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-400">
                <span className="text-slate-500">Try testing:</span>
                {sampleUrls.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHeroInput(sample);
                      onStartScan(sample);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#111827] border border-[#273449] hover:border-cyan-500/50 hover:text-white transition-colors font-mono text-[11px]"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </form>

            {/* Secondary Action Link */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onExploreIntel}
                className="text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Threat Intelligence Network</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hero Right Column: Cyber Guardian & Network Graphics */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-[#273449] bg-[#0D1220] shadow-2xl group">
              {/* Image banner */}
              <div className="relative h-96 w-full overflow-hidden bg-[#080B14]">
                <img
                  src="/src/assets/images/cyber_guardian_mascot_1794048991212.jpg"
                  alt="Threatora AI Cyber Guardian Mascot"
                  className="w-full h-full object-cover object-top filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-transparent to-transparent" />
                
                {/* Subtle animated scan overlay */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-cyber-scan pointer-events-none" />

                {/* Floating active card badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#111827]/90 border border-[#273449] backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Threatora Sentinel Unit</h4>
                      <p className="text-[10px] text-slate-400">Deterministic Threat Verification</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Capability Indicators (No fake stats or fake logos) */}
      <section className="border-y border-[#273449] bg-[#0D1220]/70 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center lg:justify-between gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI-Powered Threat Investigation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>TLS Certificate Validation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Phishing Intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Scam Message Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Verifiable Threat Reports</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Clear 3-Stage Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            How Threatora Protects You
          </h2>
          <p className="text-slate-400 text-sm">
            Investigate suspicious links or messages without needing a background in cybersecurity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/40 transition-all space-y-4">
            <div className="text-cyan-400 font-mono text-sm font-bold">01 — Submit</div>
            <h3 className="text-lg font-bold text-white">Paste Suspicious Target</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Input any unfamiliar website URL, shortened link, lookalike domain, email snippet, or urgent SMS message into the investigator.
            </p>
            <div className="p-3 bg-[#111827] rounded-xl border border-[#273449] text-[11px] font-mono text-slate-400">
              Target: https://paypa1-security-verification.net
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/40 transition-all space-y-4">
            <div className="text-cyan-400 font-mono text-sm font-bold">02 — Investigate</div>
            <h3 className="text-lg font-bold text-white">Multidimensional Inspection</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Threatora inspects domain typosquatting, runs live TLS handshake verification, checks external threat feeds (URLhaus), and checks redirect chains.
            </p>
            <div className="p-3 bg-[#111827] rounded-xl border border-[#273449] text-[11px] text-cyan-300 font-mono">
              [DNS OK] · [HOMOGLYPH DETECTED] · [TLS PROBED]
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] hover:border-violet-500/40 transition-all space-y-4">
            <div className="text-cyan-400 font-mono text-sm font-bold">03 — Understand</div>
            <h3 className="text-lg font-bold text-white">Evidence-Backed Decision</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Receive a plain-language explanation of specific risks, technical proof details, actionable advice, and an optional tamper-evident on-chain commitment.
            </p>
            <div className="p-3 bg-[#111827] rounded-xl border border-[#273449] text-[11px] text-rose-400 font-mono">
              Risk: HIGH RISK · Brand: PayPal Spoof
            </div>
          </div>
        </div>
      </section>

      {/* The Triad: AI, Cybersecurity, Web3 */}
      <section className="py-16 px-4 lg:px-8 border-t border-[#273449] bg-[#0D1220]/40">
        <div className="max-w-7xl mx-auto space-y-12 text-left">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              Architecture Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why We Combine AI, Cybersecurity, and Web3
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#273449] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-base font-bold text-white">Artificial Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translates complex cryptographic findings and social engineering deception into calm, objective, plain-language explanations anyone can act upon.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-[#273449] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white">Cybersecurity Engineering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Executes live technical inspection: RFC-compliant URL parsing, Levenshtein brand lookalike scoring, live TLS X.509 handshake analysis, and SSRF-isolated probers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-[#273449] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">Decentralized Web3 Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Records canonical SHA-256 commitments on an EVM smart contract. Threat intelligence cannot be secretly deleted, falsified, or silenced by bad actors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Principles */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0D1220] border border-[#273449] space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Security Guarantee
            </span>
            <h2 className="text-2xl font-bold text-white">Safe by Design & Isolated</h2>
            <p className="text-slate-400 text-xs">
              Threatora is designed so that inspecting a threat never endangers your system or our servers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#273449] space-y-2">
              <h4 className="font-semibold text-slate-200">SSRF Protection</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Prohibits loopback (127.0.0.1), RFC1918 private subnets, and cloud metadata (169.254.169.254) lookups.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#273449] space-y-2">
              <h4 className="font-semibold text-slate-200">Zero Script Execution</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Never renders or executes client-side JavaScript from investigated URLs inside your browser.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#273449] space-y-2">
              <h4 className="font-semibold text-slate-200">Passive Non-Intrusive</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Conducts passive header, DNS, and TLS checks. Never attempts exploit payloads or brute-force tests.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#273449] space-y-2">
              <h4 className="font-semibold text-slate-200">Zero PII On-Chain</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Only canonical SHA-256 integrity commitments are stored on-chain. No private messages or personal data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 lg:px-8 max-w-4xl mx-auto text-left space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about how Threatora evaluates risk.</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0D1220] border border-[#273449] space-y-2">
            <h4 className="text-sm font-semibold text-white">Does a valid HTTPS padlock mean a website is safe?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No. HTTPS only proves that traffic between your browser and the server is encrypted and that the certificate matches the hostname. Phishing criminals routinely issue free, automated TLS certificates for lookalike domains.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0D1220] border border-[#273449] space-y-2">
            <h4 className="text-sm font-semibold text-white">How does the decentralized Web3 registry work?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a verified threat report is filed, Threatora calculates a canonical SHA-256 hash of the investigation evidence and commits it to an EVM smart contract. Anyone can independently verify that the off-chain report has not been altered by re-hashing the data and comparing it to the on-chain commitment.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0D1220] border border-[#273449] space-y-2">
            <h4 className="text-sm font-semibold text-white">What should I do if a link is classified as High Risk?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Do not enter any credentials, passwords, credit card numbers, or one-time passcodes. If you were sent the link in a text message or email, open your mobile banking or service app directly rather than following the link.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#273449] py-12 px-4 lg:px-8 text-center text-xs text-slate-500 bg-[#080B14]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">Threatora</span>
            <span>— Detect Deception. Verify Trust. Stay Protected.</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onGoToDashboard} className="hover:text-slate-300 transition-colors">
              Command Center
            </button>
            <button onClick={onExploreIntel} className="hover:text-slate-300 transition-colors">
              Threat Intelligence
            </button>
            <span>v1.0 Hackathon MVP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
