import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Globe, Search, ShieldAlert } from 'lucide-react';

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
  const [url, setUrl] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const target = url.trim();
    if (target) onStartScan(target);
    else onGoToDashboard();
  };

  return (
    <div className="min-h-full bg-[#0b0e11] text-slate-100">
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <ShieldAlert className="h-4 w-4 text-blue-400" />
            <span>Threatora</span>
            <span className="text-slate-600">/</span>
            <span>Link check</span>
          </div>

          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Check a link before you open it.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
            Review a URL for known threats and technical warning signs. Results are evidence to consider, not a guarantee that a site is safe.
          </p>

          <form onSubmit={handleSubmit} className="mt-9">
            <label htmlFor="landing-url" className="mb-2 block text-sm font-medium text-slate-300">
              Website address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#303943] bg-[#11161b] px-3.5 focus-within:border-blue-500">
                <Globe className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  id="landing-url"
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="h-12 w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Search className="h-4 w-4" />
                Check URL
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
            <span>For example</span>
            <button
              type="button"
              onClick={() => setUrl('example.com')}
              className="font-mono text-slate-400 underline decoration-slate-700 underline-offset-4 hover:text-white"
            >
              example.com
            </button>
            <button
              type="button"
              onClick={() => setUrl('login-example.test')}
              className="font-mono text-slate-400 underline decoration-slate-700 underline-offset-4 hover:text-white"
            >
              login-example.test
            </button>
          </div>
        </div>

        <section className="mt-20 border-t border-[#252d35] pt-8" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="text-sm font-medium text-slate-300">
            Available checks
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-white">URL reputation</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Look for known malicious links and domain signals.</p>
            </div>
            <div>
              <p className="text-sm text-white">Message analysis</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Review suspicious email, SMS, or chat messages.</p>
            </div>
            <div>
              <p className="text-sm text-white">Site configuration</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Inspect TLS certificates and security headers.</p>
            </div>
            <div>
              <p className="text-sm text-white">Investigation records</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Revisit previous checks and their findings.</p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-5 border-t border-[#252d35] pt-5 text-sm">
          <button
            onClick={onGoToDashboard}
            className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
          >
            Open dashboard <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onExploreIntel}
            className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
          >
            Threat intelligence <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
