import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem('veriscan_history');
    localStorage.removeItem('truthlens_history');
    localStorage.setItem('auth_token', 'session_active');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen w-full bg-[#080B12] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Left Branding Column */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 bg-gradient-to-br from-[#0E1726] via-[#090D17] to-[#06080F]">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <ShieldCheck className="h-6 w-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">VeriScan AI</span>
              <span className="block text-[11px] font-medium text-cyan-400/90 tracking-wide uppercase">Inspection Suite</span>
            </div>
          </div>

          <div className="mt-20 max-w-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              AI-Powered Identity &amp; Document Screening
            </h1>
            <p className="mt-6 text-slate-400 text-sm md:text-base leading-relaxed">
              Automated document validation and anti-forgery detection. Analyzes physical wear, digital manipulation, recapture artifacts, and real-time issuer records.
            </p>
          </div>
        </div>

        <div className="my-10 md:my-0">
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Detection Pipeline</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">Multi-Signal Vision &amp; ELA</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Authority Verification</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">Live Web Cross-Reference</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6 font-mono">VeriScan Core v2.4 &bull; Production Engine</p>
        </div>
      </div>

      {/* Right Login Box */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-[#080B12]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Console Access</h2>
            <p className="text-sm text-slate-400 mt-1">Enter your credentials to begin identity screening.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Officer Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="analyst@agency.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Authenticate &amp; Launch</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
