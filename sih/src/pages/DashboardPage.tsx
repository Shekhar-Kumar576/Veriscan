import React, { useState } from 'react';
import { UploadCloud, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Trash2 } from 'lucide-react';
import { useScanStore } from '../store/useScanStore';
import { Header } from '../components/Header';

export const DashboardPage: React.FC = () => {
  const { currentScan, screeningHistory, clearAllHistory } = useScanStore();
  const [selectedDocType, setSelectedDocType] = useState('aadhaar');

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Screening Stats Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-500 font-medium">Session Screenings</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">{screeningHistory.length}</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-500 font-medium">Clear / Verified</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {screeningHistory.filter((s) => s.verdict === 'Clear').length}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-500 font-medium">Flagged / Forgeries</span>
            <p className="text-2xl font-bold text-rose-400 mt-1">
              {screeningHistory.filter((s) => s.verdict !== 'Clear').length}
            </p>
          </div>
        </div>

        {/* Upload & Active Screen Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-200">Submit Document For Analysis</h2>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="bg-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 border border-slate-700 outline-none"
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="voter_id">Voter ID Card</option>
                <option value="student_id">Student ID Card</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/70 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-slate-950/40 group">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UploadCloud className="h-6 w-6 text-cyan-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-200">Drag and drop document scan or image</p>
              <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WEBP, or PDF up to 10MB</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-md shadow-cyan-500/20">
                Browse Files
              </button>
            </div>
          </div>

          {/* Active Result View / Empty Slate */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h2 className="text-base font-semibold text-slate-200 mb-4">Verification Verdict</h2>
            {currentScan ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Integrity Score</span>
                    <p className="text-2xl font-bold mt-0.5">{currentScan.riskScore}/100</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      currentScan.verdict === 'Clear'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {currentScan.verdict}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tampering Checks</h3>
                  {currentScan.checks.map((check) => (
                    <div key={check.id} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 text-xs flex justify-between items-center">
                      <span className="text-slate-300">{check.name}</span>
                      <span className={check.status === 'passed' ? 'text-emerald-400' : 'text-rose-400'}>
                        {check.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-slate-800/60 rounded-xl bg-slate-950/30">
                <FileText className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-300">Ready for Document Screening</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Upload an identity card above to run Vision Forensics, ELA, and TinyFish authority validation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Screening History Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-200">Recent Screening Activity</h2>
              <p className="text-xs text-slate-400">All previous logs cleared. New evaluations will appear here.</p>
            </div>
            {screeningHistory.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete All</span>
              </button>
            )}
          </div>

          {screeningHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No recent screenings found. All historical candidate databases wiped clean.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Risk Score</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {screeningHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-slate-400">{item.timestamp}</td>
                      <td className="py-3 text-slate-200">{item.documentType}</td>
                      <td className="py-3 font-mono">{item.riskScore}/100</td>
                      <td className="py-3">
                        <span className={item.verdict === 'Clear' ? 'text-emerald-400' : 'text-rose-400'}>
                          {item.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
