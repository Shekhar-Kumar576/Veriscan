import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.endsWith(".gov.in")) {
      setError("Please enter your official government email (*.gov.in).");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="auth-shell min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground mb-3">Reset Link Sent</h2>
          <p className="text-sm text-muted-foreground mb-6">
            If <strong>{email}</strong> is registered, a password reset link has been sent. Check your inbox.
          </p>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 transition-all inline-block"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <ShieldCheck size={18} className="text-primary-foreground" />
          </div>
          <div className="font-bold font-display text-foreground">VeriScan AI</div>
        </div>
        <h1 className="text-2xl font-bold font-display text-foreground mb-1">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-7">
          Enter your official email to receive a reset link.{" "}
          <Link to="/login" className="text-primary dark:text-accent hover:underline">Back to login</Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your.name@ssb.gov.in"
              className="w-full px-3 py-2.5 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 transition-all"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
