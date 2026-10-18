import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, AlertTriangle, Info, CheckCircle2, AlertCircle, Trash2, ChevronRight } from "lucide-react";
import { useScreenings } from "../context/ScreeningContext";
import type { Notification } from "../types";
import TopBar from "../components/layout/TopBar";

const typeConfig = {
  alert: { icon: <AlertTriangle size={16} />, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  warning: { icon: <AlertCircle size={16} />, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  success: { icon: <CheckCircle2 size={16} />, color: "text-success", bg: "bg-success/10 border-success/30" },
  info: { icon: <Info size={16} />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, setNotifications } = useScreenings();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markRead = (id: string) =>
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  const dismiss = (id: string) => setNotifications((ns) => ns.filter((n) => n.id !== id));

  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Intelligence" }, { label: "Notifications" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400 mb-2">Security signal center</div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex border border-border rounded overflow-hidden text-xs">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 capitalize transition-all ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-xs text-muted-foreground hover:text-foreground rounded transition-all"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={32} className="mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No notifications to show</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((n) => {
              const cfg = typeConfig[n.type];
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                    !n.read ? "bg-card border-border" : "bg-secondary/50 border-border opacity-70"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${cfg.color}`}>{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                          {n.title}
                          {!n.read && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary dark:bg-accent shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                        <div className="text-[10px] text-muted-foreground/60 mt-1.5">
                          {new Date(n.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="p-1 text-muted-foreground hover:text-success rounded transition-all"
                            title="Mark as read"
                          >
                            <Check size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(n.id)}
                          className="p-1 text-muted-foreground hover:text-destructive rounded transition-all"
                          title="Dismiss"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {n.screeningId && (
                      <button
                        onClick={() => navigate(`/history?id=${n.screeningId}`)}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-primary dark:text-accent hover:underline"
                      >
                        View screening {n.screeningId} <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
