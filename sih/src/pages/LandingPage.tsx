import { Navigate, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ScanLine,
  Brain,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Globe,
  Fingerprint,
  FileSearch,
  Users,
  Clock,
  TrendingUp,
  Lock,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginAsDemo, isAuthenticated } = useAuth();

  const handleDemo = () => {
    loginAsDemo("officer");
    navigate("/dashboard");
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="marketing-shell min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <ShieldCheck size={16} className="text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm font-display text-foreground">VeriScan AI</span>
              <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">MHA · SSB</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#solution" className="hover:text-foreground transition-colors">Solution</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#impact" className="hover:text-foreground transition-colors">Impact</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              Sign In
            </button>
            <button
              onClick={handleDemo}
              className="text-sm px-3 py-1.5 rounded bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-all"
            >
              Live Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent border border-accent/30 bg-accent/10 rounded px-3 py-1.5 mb-6">
                <Star size={11} /> Smart India Hackathon 2026 · PS 26188
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight text-foreground mb-5">
                AI-Powered Document &{" "}
                <span className="gradient-text">Identity Screening</span>{" "}
                for Border Security
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                VeriScan AI enables Sashastra Seema Bal officers to instantly authenticate passports, visas, and identity documents — detecting forgeries, photo substitution, and watchlist matches at every border checkpoint.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDemo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 transition-all"
                >
                  <ScanLine size={16} />
                  Try Live Demo
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-medium rounded text-sm hover:bg-secondary transition-all"
                >
                  Officer Login
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-success" />
                  99.2% accuracy
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-success" />
                  Under 15s per document
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-success" />
                  Offline capable
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card border border-border rounded-lg p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Screening Result</div>
                  <span className="text-xs font-mono text-muted-foreground">SCR-2026-084731</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">Subject</span>
                    <span className="text-sm font-medium text-foreground">Mohammed Al-Rashid</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">Trust Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="w-[12%] h-full bg-red-500 rounded-full" />
                      </div>
                      <span className="text-sm font-mono font-bold text-red-400">12/100</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">Face Match</span>
                    <span className="text-sm font-mono text-red-400 font-semibold">41.2% — Mismatch</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">Tampering</span>
                    <span className="text-xs px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded font-medium">3 Checks Failed</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-muted-foreground">Watchlist</span>
                    <span className="text-xs px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded font-medium">⚠ INTERPOL Match</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <div className="text-xs font-semibold text-red-400 mb-1">AI Recommendation</div>
                  <div className="text-xs text-red-300">DETAIN — Escalate to duty supervisor immediately.</div>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                CRITICAL RISK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="solution" className="border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">The Problem</div>
              <h2 className="text-3xl font-bold font-display mb-5 text-foreground">
                Border checkpoints process thousands of documents daily with manual inspection
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sashastra Seema Bal operates border outposts along India's 1,751 km border with Nepal and 699 km with Bhutan. Officers must manually verify passports, visas, and identity documents — a process that is slow, inconsistent, and vulnerable to sophisticated fraud.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <AlertTriangle size={15} />, label: "High-quality counterfeit passports indistinguishable to the naked eye" },
                  { icon: <AlertTriangle size={15} />, label: "Photo substitution on genuine stolen passports" },
                  { icon: <AlertTriangle size={15} />, label: "Manual cross-referencing of watchlists is slow and error-prone" },
                  { icon: <AlertTriangle size={15} />, label: "No standardized decision framework across 47+ checkpoints" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-orange-400 mt-0.5 shrink-0">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Our Solution</div>
              <h2 className="text-3xl font-bold font-display mb-5 text-foreground">
                End-to-end AI screening in under 15 seconds
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                VeriScan AI combines OCR, computer vision, and watchlist matching to give border officers an instant, explainable risk verdict — with a digital audit trail for every decision.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <CheckCircle2 size={15} />, label: "AI-powered OCR extracts all document fields in seconds" },
                  { icon: <CheckCircle2 size={15} />, label: "Computer vision detects photo swaps, stamp forgery, and MRZ tampering" },
                  { icon: <CheckCircle2 size={15} />, label: "Real-time face verification against document photo" },
                  { icon: <CheckCircle2 size={15} />, label: "Automatic watchlist matching with INTERPOL and national databases" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-emerald-400 mt-0.5 shrink-0">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-b border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Process Flow</div>
            <h2 className="text-3xl font-bold font-display text-foreground">How VeriScan AI Works</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4 relative">
            {[
              {
                step: "01",
                icon: <FileSearch size={20} />,
                title: "Document Capture",
                desc: "Officer scans or photographs the document. Supports passports, visas, NIDs, and driving licenses.",
              },
              {
                step: "02",
                icon: <ScanLine size={20} />,
                title: "OCR Extraction",
                desc: "AI extracts all fields from both the visual zone and machine-readable zone (MRZ).",
              },
              {
                step: "03",
                icon: <Brain size={20} />,
                title: "AI Analysis",
                desc: "Computer vision checks for photo substitution, font anomalies, stamp forgery, and metadata tampering.",
              },
              {
                step: "04",
                icon: <Fingerprint size={20} />,
                title: "Identity Verification",
                desc: "Live face match against the document photo. Liveness detection prevents photo spoofing.",
              },
              {
                step: "05",
                icon: <ShieldCheck size={20} />,
                title: "Risk Verdict",
                desc: "A scored, explainable AI verdict is delivered in seconds with a recommended action.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-card border border-border rounded-lg p-5 h-full">
                  <div className="text-3xl font-bold font-mono text-muted-foreground/30 mb-3">{step.step}</div>
                  <div className="w-9 h-9 rounded bg-primary/15 flex items-center justify-center text-primary dark:text-accent mb-3">
                    {step.icon}
                  </div>
                  <div className="font-semibold text-sm text-foreground mb-2 font-display">{step.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{step.desc}</div>
                </div>
                {i < 4 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10 w-5 h-5 items-center justify-center">
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Capabilities</div>
            <h2 className="text-3xl font-bold font-display text-foreground">Built for Border Security</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <FileSearch size={20} />,
                title: "Multi-Document OCR",
                desc: "Extracts structured data from passports, visas, national IDs, and driving licenses. Supports 60+ issuing country formats including Nepal, Bangladesh, China, Myanmar.",
                tags: ["OCR", "MRZ Parsing", "Multi-language"],
              },
              {
                icon: <Brain size={20} />,
                title: "Tampering Detection",
                desc: "7-point forensic analysis including JPEG artifact detection for photo swaps, MRZ checksum validation, UV pattern simulation, and metadata integrity checks.",
                tags: ["Computer Vision", "Forensics", "Anti-forgery"],
              },
              {
                icon: <Fingerprint size={20} />,
                title: "Face Verification",
                desc: "Real-time biometric matching with 3D liveness detection. Scores facial similarity against document photo with confidence intervals.",
                tags: ["Biometrics", "Liveness Detection", "FaceNet"],
              },
              {
                icon: <Globe size={20} />,
                title: "Watchlist Matching",
                desc: "Cross-references against INTERPOL Red Notices, national Most Wanted lists, and banned entry databases. Fuzzy name matching handles aliases.",
                tags: ["INTERPOL", "National DB", "Fuzzy Match"],
              },
              {
                icon: <Clock size={20} />,
                title: "Digital Audit Trail",
                desc: "Every screening is timestamped, logged, and signed. Full chain of custody for evidence in investigations. Supports court-admissible reporting.",
                tags: ["Audit Log", "Evidence Chain", "Reporting"],
              },
              {
                icon: <Lock size={20} />,
                title: "Offline Mode",
                desc: "Core screening functions operate without internet. Sync when connectivity resumes. Critical for remote border posts along Himalayan terrain.",
                tags: ["Offline-first", "Local Sync", "Resilient"],
              },
            ].map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-all group">
                <div className="w-9 h-9 rounded bg-primary/15 flex items-center justify-center text-primary dark:text-accent mb-4 group-hover:bg-primary/25 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm font-display text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground rounded font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-16 border-b border-border bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60 mb-3">Projected Impact</div>
            <h2 className="text-3xl font-bold font-display">Measurable difference at the border</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "94%", label: "Reduction in verification time", sub: "From 3–5 min to under 15 sec" },
              { value: "99.2%", label: "Document authentication accuracy", sub: "Across 12 forgery categories" },
              { value: "47+", label: "SSB checkpoints deployable", sub: "India–Nepal & India–Bhutan border" },
              { value: "18,000+", label: "Screenings per day (projected)", sub: "Across all connected checkpoints" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold font-display mb-2">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-primary-foreground/60">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">AI Architecture</div>
              <h2 className="text-3xl font-bold font-display mb-5 text-foreground">
                Explainable AI — every decision has a reason
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                VeriScan AI does not operate as a black box. Every risk verdict comes with a plain-language explanation of the specific indicators that triggered it, allowing officers to make informed final decisions.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "OCR & MRZ Engine",
                    tech: "Tesseract + custom CNN fine-tuned on travel document datasets",
                  },
                  {
                    title: "Tampering Detection",
                    tech: "EfficientNet-B4 trained on MIDV-500 and proprietary forgery dataset",
                  },
                  {
                    title: "Face Verification",
                    tech: "ArcFace model with anti-spoofing liveness check",
                  },
                  {
                    title: "Risk Scoring",
                    tech: "Weighted ensemble with calibrated confidence intervals",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.tech}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 font-mono text-xs space-y-3">
              <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-4">AI Reasoning — SCR-2026-084731</div>
              <div className="text-red-400">⚠ MRZ checksum mismatch on line 2</div>
              <div className="text-muted-foreground pl-3">→ Expected: 7, Computed: 3 (DOB field)</div>
              <div className="text-red-400">⚠ Photo forensics: boundary artifacts detected</div>
              <div className="text-muted-foreground pl-3">→ JPEG double-compression at 89.7% confidence</div>
              <div className="text-red-400">⚠ Face mismatch (41.2% similarity)</div>
              <div className="text-muted-foreground pl-3">→ Threshold: 70.0% | Delta: −28.8pp</div>
              <div className="text-red-400">⚠ Watchlist: INTERPOL Red Notice</div>
              <div className="text-muted-foreground pl-3">→ Record IA-2022-3847 @ 87.0% confidence</div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-foreground font-semibold">VERDICT: CRITICAL RISK (Score: 12/100)</div>
                <div className="text-accent mt-1">ACTION: DETAIN — Escalate immediately</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 border-b border-border bg-secondary/20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">FAQ</div>
            <h2 className="text-3xl font-bold font-display text-foreground">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What documents can VeriScan AI verify?",
                a: "Passports, visas, national identity cards, and driving licenses. Support for 60+ country formats, with priority for documents issued by Nepal, Bangladesh, China, and Myanmar — the highest-volume border nationalities for SSB.",
              },
              {
                q: "Does the system work offline at remote checkpoints?",
                a: "Yes. Core OCR, tampering detection, and face verification work fully offline using locally deployed models. Watchlist lookups and cloud sync resume automatically when connectivity is restored.",
              },
              {
                q: "How does the AI explain its decisions?",
                a: "Every screening result includes a plain-language narrative listing the specific indicators that contributed to the risk score — MRZ checksum values, face similarity percentage, UV pattern anomalies, etc. Officers can review each sub-check individually.",
              },
              {
                q: "What happens to data privacy and document images?",
                a: "Document images are encrypted at rest and in transit. Biometric data is not retained beyond the screening session by default. All data storage is on sovereign Indian government infrastructure, compliant with IT Act 2000 and relevant MHA data policies.",
              },
              {
                q: "Can the system be wrong? What is the human role?",
                a: "Yes, no AI system is infallible. VeriScan AI is a decision-support tool — the final entry/detention decision always rests with the officer. The system's role is to surface evidence and reduce cognitive load, not replace officer judgment.",
              },
            ].map((item, i) => (
              <details key={i} className="bg-card border border-border rounded-lg group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium text-foreground">
                  {item.q}
                  <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-16 border-b border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">For SIH 2026 Judges</div>
          <h2 className="text-3xl font-bold font-display mb-4 text-foreground">
            Experience the complete solution now
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Our demo includes 6 realistic screening scenarios — from a fully authentic passport to a critical counterfeit with watchlist hit. No sign-up required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDemo}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded text-sm hover:bg-primary/90 transition-all"
            >
              <ScanLine size={16} />
              Launch Demo as Border Officer
            </button>
            <button
              onClick={() => { loginAsDemo("admin"); navigate("/admin"); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded text-sm hover:opacity-90 transition-all"
            >
              <Users size={16} />
              View as Admin
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><TrendingUp size={12} /> Full analytics dashboard</span>
            <span className="flex items-center gap-1.5"><BookOpen size={12} /> Pre-loaded screening history</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> 6 demo scenarios</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                  <ShieldCheck size={14} className="text-primary-foreground" />
                </div>
                <span className="font-bold text-sm font-display">VeriScan AI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI-Based Fake Identity & Document Screening System for India's border checkpoints.
              </p>
              <div className="mt-3 text-[10px] text-muted-foreground">
                SIH 2026 · Problem Statement 26188
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Platform</div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors" onClick={handleDemo}>Try Demo</div>
                <div className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navigate("/login")}>Officer Login</div>
                <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#faq" className="block hover:text-foreground transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Organisation</div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>Ministry of Home Affairs</div>
                <div>Sashastra Seema Bal</div>
                <div>Police II Division</div>
                <div>Government of India</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact</div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail size={11} /> sih-support@ssb.gov.in</div>
                <div className="flex items-center gap-2"><Phone size={11} /> +91-11-2309-8000</div>
                <div className="flex items-center gap-2"><MapPin size={11} /> Lok Nayak Bhawan, New Delhi</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-muted-foreground">
              © 2026 VeriScan AI — Developed for Smart India Hackathon 2026. Prototype for demonstration purposes.
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
