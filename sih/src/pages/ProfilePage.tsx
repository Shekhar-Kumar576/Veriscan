import { useState } from "react";
import { User, Lock, Bell, Shield, Save, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/layout/TopBar";

type Tab = "profile" | "security" | "notifications" | "preferences";

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [sessions, setSessions] = useState([
{ device: "Chrome on Windows 11", location: "Raxaul, Bihar", time: "Now (current session)", current: true },
                  { device: "Mobile Browser (Android)", location: "Raxaul, Bihar", time: "2 hours ago", current: false }
  ]);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    checkpoint: user?.checkpoint ?? "",
    phone: "+91-98765-43210",
    bio: "Border Security Officer with 8 years of experience at Nepal border checkpoints.",
  });

  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    highRiskFlags: true,
    dailyBriefing: true,
    systemUpdates: false,
    modelUpdates: true,
    reportReady: true,
  });

  const [preferences, setPreferences] = useState({
    defaultDocType: "passport",
    autoScan: true,
    confirmBeforeSubmit: false,
    language: "en",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={14} /> },
    { id: "security", label: "Security", icon: <Lock size={14} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
    { id: "preferences", label: "Preferences", icon: <Shield size={14} /> },
  ];

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Profile & Settings" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="relative overflow-hidden flex items-center gap-4 bg-gradient-to-br from-card via-card to-violet-500/10 border border-violet-500/20 rounded-2xl p-6">
          <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/25 to-violet-500/25 border border-cyan-400/25 flex items-center justify-center text-xl font-bold text-cyan-300 shadow-lg shadow-cyan-500/10">
            {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 mb-1">Officer profile</div>
            <div className="text-xl font-bold font-display text-foreground">{user?.name}</div>
            <div className="text-sm text-muted-foreground capitalize">{user?.role} · {user?.badgeNumber}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{user?.checkpoint}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border gap-1 overflow-x-auto">
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

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Checkpoint Assignment</label>
                <input
                  value={form.checkpoint}
                  readOnly
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Contact admin to change checkpoint.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Bio / Note</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              {saved && <div className="flex items-center gap-1.5 text-xs text-success"><CheckCircle2 size={13} /> Saved</div>}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Security tab */}
        {tab === "security" && (
          <div className="bg-card border border-border rounded-lg p-5 space-y-5">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
              <div className="space-y-3 max-w-sm">
                {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 pr-10 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90 transition-all mt-2"
                >
                  Update Password
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3">Active Sessions</h3>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div key={s.device} className="flex items-center justify-between p-3 bg-secondary border border-border rounded text-sm">
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {s.device}
                        {s.current && <span className="text-[10px] bg-success/15 text-success border border-success/30 rounded px-1.5 py-0.5">Current</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.location} · {s.time}</div>
                    </div>
                    {!s.current && (
                      <button onClick={() => setSessions((x) => x.filter((y) => y.device !== s.device))} className="text-xs text-destructive hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {tab === "notifications" && (
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Notification Preferences</h3>
            <div className="space-y-3">
              {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
                const labels: Record<string, string> = {
                  criticalAlerts: "Critical risk alerts (DETAIN cases)",
                  highRiskFlags: "High risk flags",
                  dailyBriefing: "Daily threat intelligence briefing",
                  systemUpdates: "System maintenance notices",
                  modelUpdates: "AI model updates",
                  reportReady: "Monthly reports ready",
                };
                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{labels[key]}</span>
                    <button
                      onClick={() => setNotifications((n) => ({ ...n, [key]: !val }))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${val ? "bg-primary dark:bg-accent" : "bg-muted"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-all ${val ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90 transition-all">
                <Save size={13} /> Save
              </button>
            </div>
          </div>
        )}

        {/* Preferences tab */}
        {tab === "preferences" && (
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Screening Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Default Document Type</label>
                <select
                  value={preferences.defaultDocType}
                  onChange={(e) => setPreferences((p) => ({ ...p, defaultDocType: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="passport">Passport</option>
                  <option value="visa">Visa</option>
                  <option value="national_id">National ID</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <div className="text-sm text-foreground">Auto-start scan on document placement</div>
                  <div className="text-xs text-muted-foreground">Triggers scanning automatically when a document is detected</div>
                </div>
                <button
                  onClick={() => setPreferences((p) => ({ ...p, autoScan: !p.autoScan }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${preferences.autoScan ? "bg-primary dark:bg-accent" : "bg-muted"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-all ${preferences.autoScan ? "translate-x-4.5" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-foreground">Confirm before submitting screening</div>
                  <div className="text-xs text-muted-foreground">Show a review screen before final submission</div>
                </div>
                <button
                  onClick={() => setPreferences((p) => ({ ...p, confirmBeforeSubmit: !p.confirmBeforeSubmit }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${preferences.confirmBeforeSubmit ? "bg-primary dark:bg-accent" : "bg-muted"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-all ${preferences.confirmBeforeSubmit ? "translate-x-4.5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90 transition-all">
                <Save size={13} /> Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
