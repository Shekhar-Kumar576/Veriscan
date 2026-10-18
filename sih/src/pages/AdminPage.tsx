import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useScreenings } from "../context/ScreeningContext";
import { downloadCsv, screeningsToCsv } from "../lib/api";
import {
  Users, BarChart3, Settings, Activity, Shield,
  CheckCircle2, AlertTriangle, Trash2, Search, Plus,
  Server, Database, RefreshCw, ChevronRight,
} from "lucide-react";
import { CHECKPOINT_STATS, MOCK_SCREENINGS } from "../data/mockData";
import type { User } from "../types";
import TopBar from "../components/layout/TopBar";

type AdminTab = "users" | "stats" | "system" | "reports";

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("users");
  const [userSearch, setUserSearch] = useState("");
  const { users, addUser, removeUser, setUserActive } = useAuth();
  const { screenings } = useScreenings();
  const [live, setLive] = useState<any[]>([]);
  const refresh = () => { fetch("/api/health").then((r) => r.json()).then(setLive).catch(() => setLive([])); };
  useEffect(() => { if (tab === "system") refresh(); }, [tab]);
  const addOfficer = () => {
    const name = prompt("Officer full name"); if (!name) return;
    const email = prompt("Official email (*.gov.in)"); if (!email || !email.endsWith(".gov.in")) { alert("A valid *.gov.in email is required."); return; }
    const badgeNumber = prompt("Badge number") || "SSB-NEW";
    const checkpoint = prompt("Checkpoint") || "Unassigned";
    addUser({ name, email: email.toLowerCase(), role: "officer", badgeNumber, checkpoint, isActive: true });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.badgeNumber.toLowerCase().includes(userSearch.toLowerCase())
  );

  const systemHealth = [
    { label: "AI Processing Server", status: "online", uptime: "99.8%", latency: "42ms" },
    { label: "OCR Engine", status: "online", uptime: "99.9%", latency: "18ms" },
    { label: "Face Verification Service", status: "online", uptime: "99.7%", latency: "67ms" },
    { label: "Watchlist Database", status: "online", uptime: "100%", latency: "8ms" },
    { label: "Document Storage", status: "online", uptime: "99.9%", latency: "12ms" },
    { label: "Sync Service (Offline Mode)", status: "degraded", uptime: "94.2%", latency: "230ms" },
  ];

  const seedReports: { name: string; generated: string; size: string; checkpoints: number | null; csv?: string }[] = [
    { name: "August 2026 Screening Report", generated: "2026-09-01", size: "4.2 MB", checkpoints: 6 },
    { name: "Q2 2026 Threat Intelligence Summary", generated: "2026-07-01", size: "8.7 MB", checkpoints: 6 },
    { name: "Forgery Pattern Analysis — Jul 2026", generated: "2026-08-05", size: "2.1 MB", checkpoints: 6 },
    { name: "AI Model Performance Report — v4.2.1", generated: "2026-08-30", size: "1.3 MB", checkpoints: null },
  ];

  const [reports, setReports] = useState(seedReports);
  const generateReport = () => {
    const csv = screeningsToCsv(screenings);
    setReports((r) => [{ name: `Screening Report — ${new Date().toLocaleString("en-IN")}`, generated: new Date().toISOString(), size: `${Math.max(1, Math.round(csv.length / 1024))} KB`, checkpoints: new Set(screenings.map((s) => s.checkpoint)).size, csv }, ...r]);
  };
  const tabs = [
    { id: "users" as AdminTab, label: "User Management", icon: <Users size={14} /> },
    { id: "stats" as AdminTab, label: "System Statistics", icon: <BarChart3 size={14} /> },
    { id: "system" as AdminTab, label: "System Health", icon: <Server size={14} /> },
    { id: "reports" as AdminTab, label: "Reports", icon: <Activity size={14} /> },
  ];

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Administration" }, { label: "Admin Panel" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400 mb-2">Command center</div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">System configuration and oversight</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-success bg-success/10 border border-success/30 rounded px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            All systems operational
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Officers", value: users.filter((u) => u.isActive).length.toString(), icon: <Users size={16} />, color: "text-primary dark:text-accent" },
            { label: "Total Screenings (30d)", value: "18,492", icon: <Shield size={16} />, color: "text-success" },
            { label: "Flags Issued (30d)", value: "947", icon: <AlertTriangle size={16} />, color: "text-orange-400" },
            { label: "Active Checkpoints", value: "6", icon: <Database size={16} />, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-bold font-mono text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                tab === t.id
                  ? "border-primary dark:border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {tab === "users" && (
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search officers..."
                  className="pl-9 pr-3 py-2 bg-background border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-56"
                />
              </div>
              <button onClick={addOfficer} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-all">
                <Plus size={13} /> Add Officer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Officer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Badge No.</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Checkpoint</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Login</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u: User) => (
                    <tr key={u.id} className="hover:bg-secondary/50 transition-all">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary dark:text-accent shrink-0">
                            {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{u.badgeNumber}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded border capitalize ${
                          u.role === "admin" ? "bg-purple-500/15 text-purple-400 border-purple-500/30" :
                          u.role === "supervisor" ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                          "bg-secondary text-muted-foreground border-border"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{u.checkpoint}</td>
                      <td className="px-5 py-3">
                        <div className={`flex items-center gap-1.5 text-xs ${u.isActive ? "text-success" : "text-orange-400"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-success" : "bg-orange-400"}`} />
                          {u.isActive ? "Active" : "Pending approval"}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {new Date(u.lastLogin).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button title={u.isActive ? "Deactivate" : "Activate"} onClick={() => setUserActive(u.id, !u.isActive)} className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-all">
                            <Settings size={13} />
                          </button>
                          {u.role !== "admin" && (
                            <button title="Remove" onClick={() => { if (confirm(`Remove ${u.name}?`)) removeUser(u.id); }} className="p-1.5 text-muted-foreground hover:text-destructive rounded transition-all">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats tab */}
        {tab === "stats" && (
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-lg">
              <div className="px-5 py-4 border-b border-border text-sm font-semibold text-foreground">
                Checkpoint Performance (Today)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Checkpoint</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cleared</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flagged</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rejected</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clear Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {CHECKPOINT_STATS.map((cp) => (
                      <tr key={cp.name} className="hover:bg-secondary/50">
                        <td className="px-5 py-3 font-medium text-foreground">{cp.name}</td>
                        <td className="px-5 py-3 text-right font-mono text-muted-foreground">{cp.total}</td>
                        <td className="px-5 py-3 text-right font-mono text-success">{cp.cleared}</td>
                        <td className="px-5 py-3 text-right font-mono text-orange-400">{cp.flagged}</td>
                        <td className="px-5 py-3 text-right font-mono text-destructive">{cp.rejected}</td>
                        <td className="px-5 py-3 text-right font-mono text-foreground">
                          {((cp.cleared / cp.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System health tab */}
        {tab === "system" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={refresh} className="flex items-center gap-2 px-3 py-2 border border-border bg-card text-xs text-muted-foreground hover:text-foreground rounded transition-all">
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
            <div className="grid gap-3">
              {[...live, ...systemHealth].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.status === "online" ? "bg-success animate-pulse" : "bg-orange-400 animate-pulse"}`} />
                    <div>
                      <div className="text-sm font-medium text-foreground">{s.label}</div>
                      <div className="text-xs text-muted-foreground capitalize">{s.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                      <div className="font-mono text-sm font-semibold text-foreground">{s.uptime}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Latency</div>
                      <div className={`font-mono text-sm font-semibold ${+s.latency.replace("ms", "") > 100 ? "text-orange-400" : "text-success"}`}>
                        {s.latency}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports tab */}
        {tab === "reports" && (
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="text-sm font-semibold text-foreground">Generated Reports</div>
              <button onClick={generateReport} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-all">
                <Plus size={13} /> Generate Report
              </button>
            </div>
            <div className="divide-y divide-border">
              {reports.map((r) => (
                <div key={r.name} className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-all">
                  <div>
                    <div className="text-sm font-medium text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Generated {new Date(r.generated).toLocaleDateString("en-IN")} · {r.size}
                      {r.checkpoints && ` · ${r.checkpoints} checkpoints`}
                    </div>
                  </div>
                  <button onClick={() => downloadCsv(r.name, r.csv ?? screeningsToCsv(screenings))} className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-secondary text-xs text-muted-foreground hover:text-foreground rounded transition-all">
                    <ChevronRight size={11} /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
