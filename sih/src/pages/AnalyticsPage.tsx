import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  DAILY_VOLUME, RISK_DISTRIBUTION, DOCUMENT_BREAKDOWN, CHECKPOINT_STATS,
} from "../data/mockData";
import TopBar from "../components/layout/TopBar";
import { TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";

const RISK_COLORS: Record<string, string> = {
  clear: "#10b981",
  low: "#3b82f6",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const CHART_COLORS = ["#22d3ee", "#8b5cf6", "#10b981", "#d946ef", "#f97316"];

export default function AnalyticsPage() {
  const total = DAILY_VOLUME.reduce((a, d) => a + d.screenings, 0);
  const totalFlagged = DAILY_VOLUME.reduce((a, d) => a + d.flagged, 0);
  const avgTime = "11.3s";

  const summaryStats = [
    { label: "Total Screenings (7 days)", value: total.toLocaleString("en-IN"), icon: <TrendingUp size={16} />, color: "text-primary dark:text-accent" },
    { label: "Total Flagged", value: totalFlagged.toString(), icon: <ShieldAlert size={16} />, color: "text-orange-400" },
    { label: "Flag Rate", value: ((totalFlagged / total) * 100).toFixed(1) + "%", icon: <TrendingDown size={16} />, color: "text-yellow-400" },
    { label: "Avg. Processing Time", value: avgTime, icon: <TrendingUp size={16} />, color: "text-success" },
  ];

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Intelligence" }, { label: "Analytics" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 mb-2">Threat intelligence</div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">Analytics & Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All SSB checkpoints · Last 7 days (26 Aug – 1 Sep 2026)
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-bold font-mono text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Screening volume + flag rate */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-card border border-border rounded-lg p-5">
            <div className="mb-4">
              <div className="text-sm font-semibold text-foreground">Daily Screening Volume</div>
              <div className="text-xs text-muted-foreground">Total screenings vs. flagged cases (7-day window)</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DAILY_VOLUME} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  itemStyle={{ color: "var(--muted-foreground)" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="cleared" name="Cleared" fill="#10b981" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="flagged" name="Flagged" fill="#f97316" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="mb-4">
              <div className="text-sm font-semibold text-foreground">Risk Distribution</div>
              <div className="text-xs text-muted-foreground">By risk level (30-day)</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {RISK_DISTRIBUTION.map((entry) => (
                    <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(value: number, name: string) => [value.toLocaleString("en-IN"), name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {RISK_DISTRIBUTION.map((r) => (
                <div key={r.level} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: RISK_COLORS[r.level] }} />
                    <span className="text-xs text-muted-foreground capitalize">{r.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground">{r.count.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-muted-foreground">{r.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line chart: flag trend */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-card border border-border rounded-lg p-5">
            <div className="mb-4">
              <div className="text-sm font-semibold text-foreground">Flag Rate Trend</div>
              <div className="text-xs text-muted-foreground">Percentage of screenings flagged per day</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={DAILY_VOLUME.map((d) => ({
                  ...d,
                  rate: +((d.flagged / d.screenings) * 100).toFixed(1),
                }))}
                margin={{ top: 0, right: 0, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(v: number) => [`${v}%`, "Flag Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Flag Rate"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#f97316" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="mb-4">
              <div className="text-sm font-semibold text-foreground">Document Types</div>
              <div className="text-xs text-muted-foreground">By document category (30-day)</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DOCUMENT_BREAKDOWN} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                />
                <Bar dataKey="count" name="Screenings" radius={[0, 3, 3, 0]}>
                  {DOCUMENT_BREAKDOWN.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Checkpoint breakdown */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-sm font-semibold text-foreground">Checkpoint Performance (Today)</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Checkpoint</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cleared</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flagged</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rejected</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clear Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CHECKPOINT_STATS.map((cp) => {
                  const clearRate = ((cp.cleared / cp.total) * 100).toFixed(1);
                  return (
                    <tr key={cp.name} className="hover:bg-secondary/50 transition-all">
                      <td className="px-5 py-3 text-foreground font-medium">{cp.name}</td>
                      <td className="px-5 py-3 text-right font-mono text-muted-foreground">{cp.total}</td>
                      <td className="px-5 py-3 text-right font-mono text-success">{cp.cleared}</td>
                      <td className="px-5 py-3 text-right font-mono text-orange-400">{cp.flagged}</td>
                      <td className="px-5 py-3 text-right font-mono text-destructive">{cp.rejected}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-mono text-xs font-semibold ${
                          +clearRate >= 95 ? "text-success" :
                          +clearRate >= 90 ? "text-blue-400" :
                          "text-yellow-400"
                        }`}>{clearRate}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI accuracy section */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm font-semibold text-foreground mb-4">AI Model Performance Indicators</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "OCR Extraction Accuracy", value: "98.7%", model: "v2.4.1" },
              { label: "Tampering Detection Precision", value: "99.2%", model: "v4.2.1" },
              { label: "Face Match Accuracy", value: "97.8%", model: "v3.1.0" },
              { label: "Watchlist False Positive Rate", value: "0.3%", model: "v1.9.2" },
            ].map((m) => (
              <div key={m.label} className="bg-secondary border border-border rounded p-3">
                <div className="text-2xl font-bold font-mono text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                <div className="text-[10px] font-mono text-muted-foreground/60 mt-1">Model {m.model}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
