import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, AlertCircle, Loader2, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

const DEMO_ROLES: { role: UserRole; label: string; desc: string; email: string }[] = [
  { role: "officer", label: "Border Officer", desc: "Screen documents at checkpoint", email: "officer@ssb.gov.in" },
  { role: "supervisor", label: "Supervisor", desc: "Review flagged cases & approve", email: "supervisor@ssb.gov.in" },
  { role: "admin", label: "Administrator", desc: "System management & reports", email: "admin@ssb.gov.in" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("officer@ssb.gov.in");
  const [password, setPassword] = useState("Demo@1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setLoading(true);
    const ok = await login(email.trim(), password.trim());
    setLoading(false);
    if (ok) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Use Demo@1234 with any demo account.");
    }
  };

  const handleDemo = (role: UserRole) => {
    loginAsDemo(role);
    navigate("/dashboard");
  };

  return (
    <div className="auth-shell min-h-screen bg-background flex overflow-hidden relative">
      {/* Left panel */}
      <div className="auth-visual hidden lg:flex w-1/2 flex-col justify-between p-10 relative overflow-hidden">
        <div className="auth-grid" aria-hidden="true" />
        <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
        <div className="auth-orbit auth-orbit-two" aria-hidden="true" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-primary-foreground/20 flex items-center justify-center">
            <ShieldCheck size={18} className="text-primary-foreground" />
          </div>
          <div>
            <div className="text-primary-foreground font-bold font-display">VeriScan AI</div>
            <div className="text-primary-foreground/60 text-[10px] uppercase tracking-widest">Ministry of Home Affairs · SSB</div>
          </div>
        </div>
        <div>
          <div className="text-5xl font-bold font-display text-primary-foreground leading-tight mb-5 tracking-tight">
            Securing India's borders with<br />
            <span className="gradient-text">intelligent verification</span>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
            AI-Based Fake Identity & Document Screening System for Sashastra Seema Bal border checkpoints.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "47+", label: "SSB Checkpoints" },
              { value: "99.2%", label: "Detection Accuracy" },
              { value: "&lt;15s", label: "Screening Time" },
              { value: "24/7", label: "AI Monitoring" },
            ].map((s) => (
              <div key={s.label} className="auth-stat bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-xl font-bold font-mono text-primary-foreground" dangerouslySetInnerHTML={{ __html: s.value }} />
                <div className="text-xs text-primary-foreground/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-primary-foreground/40">
          Government of India · Smart India Hackathon 2026 · PS 26188
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.12),transparent_35%)] pointer-events-none" />
        <div className="auth-card relative w-full max-w-md border border-border bg-card/65 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <ShieldCheck size={18} className="text-primary-foreground" />
            </div>
            <div className="font-bold font-display text-foreground">VeriScan AI</div>
          </div>

          <h1 className="text-2xl font-bold font-display text-foreground mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-7">
            Access your SSB screening dashboard.{" "}
            <Link to="/" className="text-primary dark:text-accent hover:underline">Back to home</Link>
          </p>

          {/* Demo quick-login */}
          <div className="mb-5 p-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/25 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent mb-2.5">
              <Users size={12} />
              Quick Demo Login
            </div>
            <div className="flex gap-2">
              {DEMO_ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleDemo(r.role)}
                  className="flex-1 text-center py-2 text-[10px] font-medium rounded-xl border border-violet-400/25 text-violet-300 hover:bg-violet-500/15 hover:border-violet-400/50 transition-all capitalize"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">or sign in with credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@ssb.gov.in"
                className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="glow-button w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 text-primary-foreground font-semibold rounded-xl text-sm disabled:opacity-60 transition-all"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            New officer?{" "}
            <Link to="/register" className="text-primary dark:text-accent hover:underline">
              Request account access
            </Link>
          </p>

          <div className="mt-6 text-center text-[10px] text-muted-foreground">
            Authorized personnel only · Unauthorized access is a criminal offence under IT Act 2000
          </div>
        </div>
      </div>
    </div>
  );
}
