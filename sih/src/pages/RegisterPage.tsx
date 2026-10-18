import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    badgeNumber: "",
    email: "",
    checkpoint: "",
    role: "officer",
    supervisorCode: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.badgeNumber.trim()) errs.badgeNumber = "Badge/Service number is required.";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid official email required.";
    if (!form.email.endsWith(".gov.in")) errs.email = "Must be a government email (*.gov.in).";
    if (!form.checkpoint) errs.checkpoint = "Checkpoint assignment is required.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    addUser({ name: form.name.trim(), email: form.email.trim().toLowerCase(), role: "officer", badgeNumber: form.badgeNumber.trim(), checkpoint: form.checkpoint, isActive: false });
    setSubmitted(true);
  };

  const set = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  if (submitted) {
    return (
      <div className="auth-shell min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground mb-3">Access Request Submitted</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your account request has been submitted for verification by your supervisor. You will receive an activation email at <strong>{form.email}</strong> within 24–48 hours.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <ShieldCheck size={18} className="text-primary-foreground" />
          </div>
          <div className="font-bold font-display text-foreground">VeriScan AI</div>
        </div>

        <h1 className="text-2xl font-bold font-display text-foreground mb-1">Request Account Access</h1>
        <p className="text-sm text-muted-foreground mb-6">
          New SSB officers must request access through their supervising officer.{" "}
          <Link to="/login" className="text-primary dark:text-accent hover:underline">Back to login</Link>
        </p>

        <div className="mb-5 p-3 bg-primary/10 border border-primary/30 rounded text-xs text-muted-foreground flex items-start gap-2">
          <AlertCircle size={13} className="mt-0.5 text-primary shrink-0" />
          Accounts require supervisor approval and are restricted to authorized SSB personnel. Use your official government email address.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Full Name (as on service record)</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Rajesh Kumar Singh"
                className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Badge / Service No.</label>
              <input
                value={form.badgeNumber}
                onChange={(e) => set("badgeNumber", e.target.value)}
                placeholder="SSB-XXXX"
                className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.badgeNumber && <p className="text-xs text-destructive mt-1">{errors.badgeNumber}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="officer">Border Officer</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Official Email (*.gov.in)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="your.name@ssb.gov.in"
                className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Assigned Checkpoint</label>
              <select
                value={form.checkpoint}
                onChange={(e) => set("checkpoint", e.target.value)}
                className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select checkpoint...</option>
                <option>Raxaul (Bihar)</option>
                <option>Jogbani (Bihar)</option>
                <option>Sonauli (UP)</option>
                <option>Nautanwa (UP)</option>
                <option>Sunauli (UP)</option>
                <option>Rupaidiha (UP)</option>
                <option>Kakarbhitta (West Bengal)</option>
                <option>Panitanki (West Bengal)</option>
                <option>Jaigaon (West Bengal)</option>
                <option>HQ, New Delhi</option>
              </select>
              {errors.checkpoint && <p className="text-xs text-destructive mt-1">{errors.checkpoint}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 transition-all"
          >
            Submit Access Request
          </button>
        </form>
      </div>
    </div>
  );
}
