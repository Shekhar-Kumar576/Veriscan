import { useNavigate } from "react-router-dom";
import {
  ScanLine,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Shield,
  Activity,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CHECKPOINT_STATS } from "../data/mockData";
import { useScreenings } from "../context/ScreeningContext";
import { RiskBadge, StatusBadge, ScoreMeter } from "../components/ui/Badge";
import TopBar from "../components/layout/TopBar";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { screenings, notifications } = useScreenings();

  const todayScreenings = screenings.slice(0, 5);
  const unread = notifications.filter((n) => !n.read);
  const critical = screenings.filter((s) => s.riskLevel === "critical" || s.riskLevel === "high");

  const stats = [
    {
      label: "Today's Screenings",
      value: "892",
      delta: "+12.4%",
      positive: true,
      icon: <ScanLine size={18} />,
      sub: "vs. yesterday",
      glow: "stat-cyan",
    },
    {
      label: "Flagged Cases",
      value: "47",
      delta: "5.3% rate",
      positive: false,
      icon: <AlertTriangle size={18} />,
      sub: "require review",
      glow: "stat-magenta",
    },
    {
      label: "Verified Documents",
      value: "845",
      delta: "94.7%",
      positive: true,
      icon: <CheckCircle2 size={18} />,
      sub: "clearance rate",
      glow: "stat-violet",
    },
    {
      label: "Pending Reviews",
      value: screenings.filter((screening) => screening.status === "pending" || screening.status === "flagged").length.toString(),
      delta: "Live queue",
      positive: false,
      icon: <Clock size={18} />,
      sub: "awaiting decision",
      glow: "stat-blue",
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="cyber-hero relative overflow-hidden rounded-3xl border border-cyan-500/20 p-6 sm:p-8">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-beam" aria-hidden="true" />
          <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 mb-2">Operational overview</div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
              {greeting}, {user?.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.checkpoint} · {user?.badgeNumber} ·{" "}
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="status-chip"><span className="status-dot" /> Secure network online</span>
              <span className="status-chip text-violet-300">AI pipeline ready</span>
            </div>
          </div>
          <div className="flex gap-2 self-center">
            <button
              onClick={() => navigate("/screening")}
              className="glow-button inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 text-primary-foreground font-semibold rounded-xl text-sm hover:-translate-y-1 transition-all"
            >
              <ScanLine size={15} />
              New Screening
            </button>
          </div>
          </div>
        </div>

        {/* Alert banner */}
        {critical.length > 0 && (
          <div
            onClick={() => navigate("/notifications")}
            className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/30 rounded cursor-pointer hover:bg-red-500/15 transition-all"
          >
            <Flame size={16} className="text-red-400 shrink-0" />
            <div className="flex-1">
              <span className="text-sm font-semibold text-red-400">{critical.length} critical/high-risk case{critical.length > 1 ? "s" : ""} require attention</span>
              <span className="text-xs text-muted-foreground ml-2">Latest: {critical[0].subjectName}</span>
            </div>
            <ChevronRight size={14} className="text-red-400 shrink-0" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`stat-card ${s.glow} group bg-card/75 backdrop-blur-xl border border-border rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-cyan-400 group-hover:bg-primary/20 transition-colors">{s.icon}</div>
                <span className={`text-xs font-mono font-medium ${s.positive ? "text-success" : "text-warning"}`}>
                  {s.delta}
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-foreground tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              <div className="text-[10px] text-muted-foreground/70 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Recent screenings */}
          <div className="md:col-span-2 bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Activity size={15} className="text-muted-foreground" />
                Recent Screenings
              </div>
              <button
                onClick={() => navigate("/history")}
                className="text-xs text-primary dark:text-accent hover:underline flex items-center gap-1"
              >
                View all <ChevronRight size={11} />
              </button>
            </div>
            <div className="divide-y divide-border">
              {todayScreenings.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/history?id=${s.id}`)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 cursor-pointer transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{s.subjectName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{s.documentNumber}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span className="capitalize">{s.documentType.replace("_", " ")}</span>
                      <span>·</span>
                      <span>{new Date(s.submittedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <RiskBadge level={s.riskLevel} size="sm" />
                    <ChevronRight size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Notifications */}
            <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                <button
                  onClick={() => navigate("/notifications")}
                  className="text-xs text-primary dark:text-accent hover:underline"
                >
                  See all
                </button>
              </div>
              <div className="divide-y divide-border">
                {unread.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => navigate("/notifications")}
                    className="px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        n.type === "alert" ? "bg-red-400" :
                        n.type === "warning" ? "bg-orange-400" :
                        n.type === "success" ? "bg-emerald-400" : "bg-blue-400"
                      }`} />
                      <div>
                        <div className="text-xs font-medium text-foreground leading-tight">{n.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{n.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkpoint overview */}
            <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
                <Shield size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Top Checkpoints</span>
              </div>
              <div className="p-4 space-y-3">
                {CHECKPOINT_STATS.slice(0, 4).map((cp) => (
                  <div key={cp.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground truncate">{cp.name}</span>
                      <span className="text-xs font-mono font-medium text-foreground">{cp.total}</span>
                    </div>
                    <ScoreMeter score={Math.round((cp.cleared / cp.total) * 100)} />
                  </div>
                ))}
                <button
                  onClick={() => navigate("/analytics")}
                  className="w-full text-xs text-primary dark:text-accent hover:underline flex items-center justify-center gap-1 mt-1"
                >
                  Full analytics <ChevronRight size={11} />
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Quick Actions</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {[
                  { label: "New Screening", icon: <ScanLine size={13} />, to: "/screening" },
                  { label: "View History", icon: <Activity size={13} />, to: "/history" },
                  { label: "Analytics", icon: <TrendingUp size={13} />, to: "/analytics" },
                  { label: "Alerts", icon: <AlertTriangle size={13} />, to: "/notifications" },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.to)}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-primary/15 text-sm text-muted-foreground hover:text-foreground rounded transition-all"
                  >
                    {a.icon}
                    <span className="text-xs">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
