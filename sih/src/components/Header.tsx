import React from 'react';
import { Shield, RefreshCw, LogOut } from 'lucide-react';
import { useScanStore } from '../store/useScanStore';

export const Header: React.FC = () => {
  const { clearAllHistory, screeningHistory } = useScanStore();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090D17]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
          <Shield className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-200 tracking-tight block">
            AI-Powered Identity &amp; Document Screening
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Active Screening Session</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {screeningHistory.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 border border-slate-800 transition-colors cursor-pointer"
            title="Wipe current screening logs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clear Scan History</span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
