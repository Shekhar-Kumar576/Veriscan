import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  ScanLine,
  Brain,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Download,
  RotateCcw,
  Info,
  Loader2,
  FileText,
  Globe,
  Camera,
} from "lucide-react";
import { MOCK_SCREENINGS } from "../data/mockData";
import type { ScreeningResult, DocumentType } from "../types";
import { RiskBadge, StatusBadge, ScoreMeter } from "../components/ui/Badge";
import TopBar from "../components/layout/TopBar";
import { useScreenings } from "../context/ScreeningContext";
import { useAuth } from "../context/AuthContext";
import { screenDocument, fileToDataUrl, splitDataUrl, dataUrlToFile } from "../lib/api";
import { computeForensics, shrink } from "../lib/forensics";

type WizardStep = "upload" | "processing" | "result";

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa" },
  { value: "national_id", label: "National ID Card" },
  { value: "driving_license", label: "Driving License" },
  { value: "border_permit", label: "Border Permit" },
  { value: "student_id", label: "Student ID Card" },
];

const DEMO_SCENARIOS = [
  { id: "SCR-2026-084731", label: "Critical Forgery + INTERPOL Match", color: "text-red-400" },
  { id: "SCR-2026-084698", label: "Authentic Document — Clear", color: "text-emerald-400" },
  { id: "SCR-2026-084655", label: "Medium Risk — Secondary Screening", color: "text-yellow-400" },
  { id: "SCR-2026-084612", label: "Low Risk — Manual Review Complete", color: "text-blue-400" },
  { id: "SCR-2026-084590", label: "Counterfeit Passport — High Risk", color: "text-orange-400" },
  { id: "SCR-2026-083401", label: "Visa Anomaly — Cleared After Review", color: "text-cyan-400" },
];

const PROCESSING_STAGES = [
  { label: "Extracting OCR fields (vision AI)", icon: <FileText size={14} />, duration: 600 },
  { label: "Validating MRZ checksums", icon: <ScanLine size={14} />, duration: 400 },
  { label: "Running tampering detection (7 checks)", icon: <Brain size={14} />, duration: 900 },
  { label: "Performing face verification", icon: <Fingerprint size={14} />, duration: 700 },
  { label: "TinyFish live web & watchlist cross-check", icon: <Globe size={14} />, duration: 500 },
  { label: "Computing AI risk score", icon: <ShieldCheck size={14} />, duration: 300 },
];

function TinyFishBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-violet-500/15 to-cyan-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
      <Globe size={11} /> Powered by TinyFish
    </span>
  );
}

function LiveCamera({ facing, label, onCapture, onClose }: { facing: "user" | "environment"; label: string; onCapture: (dataUrl: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    let stream: MediaStream | null = null;
    let dead = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 } }, audio: false });
        if (dead) { stream.getTracks().forEach((t) => t.stop()); return; }
        if (ref.current) { ref.current.srcObject = stream; await ref.current.play(); setReady(true); }
      } catch {
        setErr("Camera unavailable. Allow camera permission (HTTPS is required) or switch to Upload Image.");
      }
    })();
    return () => { dead = true; stream?.getTracks().forEach((t) => t.stop()); };
  }, [facing]);
  const snap = () => {
    const v = ref.current; if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    onCapture(c.toDataURL("image/jpeg", 0.92));
  };
  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-background overflow-hidden">
      {err ? (
        <div className="p-5 text-xs text-destructive">{err}</div>
      ) : (
        <div className="relative">
          <video ref={ref} playsInline muted className="w-full max-h-72 object-cover bg-black" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border-2 border-dashed border-cyan-300/70" />
          {!ready && <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground"><Loader2 size={16} className="animate-spin mr-2" />Starting camera...</div>}
        </div>
      )}
      <div className="flex gap-2 p-3">
        <button onClick={snap} disabled={!ready} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-cyan-600 text-primary-foreground font-semibold rounded-xl text-xs disabled:opacity-50">
          <Camera size={14} /> {label}
        </button>
        <button onClick={onClose} className="px-3 py-2.5 border border-border bg-card text-muted-foreground hover:text-foreground rounded-xl text-xs">Cancel</button>
      </div>
    </div>
  );
}

export default function ScreeningPage() {
  const navigate = useNavigate();
  const { recordScreening } = useScreenings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<WizardStep>("upload");
  const [docType, setDocType] = useState<DocumentType>("passport");
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0].id);
  const [processingStage, setProcessingStage] = useState(0);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [activeTab, setActiveTab] = useState<"ocr" | "tampering" | "face" | "ai">("ocr");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const { user } = useAuth();
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [camFor, setCamFor] = useState<"doc" | "selfie" | null>(null);
  const [docSource, setDocSource] = useState<"camera" | "upload">("upload");
  const [selfie, setSelfie] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const onDocCapture = async (dataUrl: string) => {
    setSelectedFile(await dataUrlToFile(dataUrl, "camera-capture.jpg"));
    setDocSource("camera");
    setFileError("");
    setCamFor(null);
  };

  useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const selectFile = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File exceeds the 10 MB limit.");
      return;
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setFileError("Choose a JPG, PNG, or PDF document.");
      return;
    }
    setFileError("");
    setDocSource("upload");
    setSelectedFile(file);
  };

  const runProcessing = async () => {
    setErrMsg("");
    setStep("processing");
    setProcessingStage(0);
    if (!selectedFile) {
      // No document supplied: run the selected pre-loaded demo scenario.
      for (let i = 0; i < PROCESSING_STAGES.length; i++) {
        await new Promise((r) => setTimeout(r, PROCESSING_STAGES[i].duration));
        setProcessingStage(i + 1);
      }
      const found = MOCK_SCREENINGS.find((s) => s.id === selectedScenario) ?? MOCK_SCREENINGS[0];
      setResult(recordScreening(found));
      setStep("result");
      setActiveTab("ocr");
      return;
    }
    try {
      const isImage = selectedFile.type.startsWith("image/");
      const raw = await fileToDataUrl(selectedFile);
      if (!isImage && selectedFile.size > 3 * 1024 * 1024) throw new Error("PDF is larger than 3 MB. Upload an image or a smaller PDF.");
      const dataUrl = isImage ? await shrink(raw) : raw;
      const forensics = isImage ? await computeForensics(selectedFile, raw) : null;
      const partial = await screenDocument(
        {
          docType,
          doc: splitDataUrl(dataUrl),
          selfie: selfie ? splitDataUrl(await shrink(selfie, 900)) : undefined,
          forensics,
          source: docSource,
          portalUrl: portalUrl.trim() || undefined,
        },
        (i) => setProcessingStage(i)
      );
      setProcessingStage(PROCESSING_STAGES.length);
      setResult(recordScreening({ ...partial, officerId: user?.id ?? "", officerName: user?.name ?? "", checkpoint: user?.checkpoint ?? "" }));
      setStep("result");
      setActiveTab("ocr");
    } catch (e: any) {
      setErrMsg(e?.message || "Screening failed.");
      setStep("upload");
    }
  };

  const reset = () => {
    setStep("upload");
    setResult(null);
    setProcessingStage(0);
  };

  const riskBg: Record<string, string> = {
    clear: "bg-emerald-500/10 border-emerald-500/30",
    low: "bg-blue-500/10 border-blue-500/30",
    medium: "bg-yellow-500/10 border-yellow-500/30",
    high: "bg-orange-500/10 border-orange-500/30",
    critical: "bg-red-500/10 border-red-500/30",
  };

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Operations" }, { label: "New Screening" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 mb-2">AI screening workspace</div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">Verify identity document</h1>
          <p className="text-sm text-muted-foreground mt-1">Capture or upload a document for live AI and TinyFish web verification, or run a pre-loaded demo scenario.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {(["upload", "processing", "result"] as WizardStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                step === s ? "bg-primary text-primary-foreground border-primary" :
                (["upload", "processing", "result"].indexOf(step) > i)
                  ? "bg-success/15 text-success border-success/30"
                  : "bg-secondary text-muted-foreground border-border"
              }`}>
                {(["upload", "processing", "result"].indexOf(step) > i) && <CheckCircle2 size={11} />}
                <span className="capitalize">{s}</span>
              </div>
              {i < 2 && <ChevronRight size={12} className="text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Upload */}
        {step === "upload" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="font-bold font-display text-foreground mb-4">Document Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as DocumentType)}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {DOC_TYPES.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Capture Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        onClick={() => { setMode("camera"); setCamFor("doc"); }}
                        className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition-all ${mode === "camera" ? "bg-primary/15 border-primary/40" : "bg-secondary border-border hover:border-primary/40"}`}
                      >
                        <Camera size={14} className={mode === "camera" ? "text-primary dark:text-accent" : "text-muted-foreground"} />
                        <span className={`text-xs ${mode === "camera" ? "font-medium text-foreground" : "text-muted-foreground"}`}>Camera Scan</span>
                      </div>
                      <div
                        onClick={() => { setMode("upload"); setCamFor(null); }}
                        className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition-all ${mode === "upload" ? "bg-primary/15 border-primary/40" : "bg-secondary border-border hover:border-primary/40"}`}
                      >
                        <Upload size={14} className={mode === "upload" ? "text-primary dark:text-accent" : "text-muted-foreground"} />
                        <span className={`text-xs ${mode === "upload" ? "font-medium text-foreground" : "text-muted-foreground"}`}>Upload Image</span>
                      </div>
                    </div>
                  </div>
                  {camFor === "doc" ? (
                    <LiveCamera facing="environment" label="Capture document" onCapture={onDocCapture} onClose={() => setCamFor(null)} />
                  ) : (<>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) => selectFile(event.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => (mode === "camera" ? setCamFor("doc") : fileInputRef.current?.click())}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      selectFile(event.dataTransfer.files[0]);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
                    }}
                    className="upload-zone group rounded-2xl p-6 text-center transition-all cursor-pointer"
                  >
                    {previewUrl ? (
                      <div className="document-preview relative mx-auto mb-4 max-w-60 overflow-hidden rounded-xl border border-cyan-400/30 bg-background">
                        <img src={previewUrl} alt="Selected document preview" className="h-32 w-full object-cover opacity-80" />
                        <div className="absolute inset-x-0 h-px bg-cyan-300 shadow-[0_0_14px_3px_rgba(34,211,238,0.8)] scan-line" />
                      </div>
                    ) : (
                    <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 border border-cyan-400/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <Upload size={22} className="text-cyan-400" />
                    </div>
                    )}
                    <p className="text-sm text-foreground font-medium">
                      {selectedFile ? selectedFile.name : mode === "camera" ? "Tap to open the live camera" : "Choose a document image or PDF"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG, PDF · Max 10MB</p>
                    <p className="text-xs text-accent mt-3 font-medium">{selectedFile ? "Live analysis: vision AI + TinyFish web verification" : "No document yet: the selected demo scenario will run"}</p>
                  </div>
                  </>)}
                  {fileError && <p className="text-xs text-destructive mt-2">{fileError}</p>}
                  {errMsg && <p className="text-xs text-destructive mt-2">{errMsg}</p>}
                  {selectedFile && mode === "camera" && camFor !== "doc" && (
                    <button onClick={() => setCamFor("doc")} className="mt-3 text-xs text-primary dark:text-accent hover:underline">Retake document photo</button>
                  )}
                </div>
              </div>
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="font-bold font-display text-foreground mb-1">Live Selfie</h2>
                <p className="text-xs text-muted-foreground mb-4">Optional. Adds face match and liveness as a detection signal.</p>
                {camFor === "selfie" ? (
                  <LiveCamera facing="user" label="Capture selfie" onCapture={(d) => { setSelfie(d); setCamFor(null); }} onClose={() => setCamFor(null)} />
                ) : selfie ? (
                  <div className="flex items-center gap-3">
                    <img src={selfie} alt="Captured selfie" className="h-20 w-20 rounded-xl object-cover border border-border" />
                    <div className="flex gap-3 text-xs">
                      <button onClick={() => setCamFor("selfie")} className="text-primary dark:text-accent hover:underline">Retake</button>
                      <button onClick={() => setSelfie("")} className="text-muted-foreground hover:text-destructive">Remove</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCamFor("selfie")} className="w-full flex items-center justify-center gap-2 py-2.5 border border-border bg-secondary hover:border-primary/40 rounded-xl text-xs text-foreground transition-all">
                    <Camera size={14} /> Capture live selfie
                  </button>
                )}
              </div>
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-1"><h2 className="font-bold font-display text-foreground">Portal Check</h2><TinyFishBadge /></div>
                <p className="text-xs text-muted-foreground mb-3">Optional. A public verification page for the TinyFish agent to open and check the record.</p>
                <input value={portalUrl} onChange={(e) => setPortalUrl(e.target.value)} placeholder="https://verify.example.gov/..." className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={15} className="text-accent" />
                  <h2 className="font-bold font-display text-foreground">Demo Scenarios</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Select a pre-loaded screening scenario to demonstrate the full AI workflow. Each represents a real-world border encounter.
                </p>
                <div className="space-y-2">
                  {DEMO_SCENARIOS.map((sc) => (
                    <div
                      key={sc.id}
                      onClick={() => setSelectedScenario(sc.id)}
                      className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                        selectedScenario === sc.id
                          ? "bg-primary/15 border-primary/40"
                          : "bg-secondary border-border hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        selectedScenario === sc.id ? "bg-primary dark:bg-accent" : "bg-border"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium ${sc.color}`}>{sc.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{sc.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={runProcessing}
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-cyan-600 text-primary-foreground font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all"
                >
                  <ScanLine size={15} />
                  Start AI Screening
                </button>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <div className="flex items-start gap-2 text-xs">
                  <Info size={13} className="text-accent mt-0.5 shrink-0" />
                  <div className="text-muted-foreground leading-relaxed">
                    The officer captures the document with the checkpoint camera. Vision AI reads and checks it, then TinyFish verifies it against live public web sources and watchlists.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Processing */}
        {step === "processing" && (
          <div className="max-w-xl mx-auto bg-card/80 backdrop-blur border border-border rounded-2xl p-8 text-center overflow-hidden relative">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-line" />
            <div className="scanner-core w-24 h-24 rounded-full bg-primary/15 border border-cyan-500/40 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/10 relative">
              <div className="scanner-orbit absolute inset-1 rounded-full border border-dashed border-violet-400/50" />
              <ShieldCheck size={34} className="text-cyan-400 shield-pulse" />
            </div>
            <h2 className="font-bold font-display text-foreground text-lg mb-1">Analyzing Document</h2>
            <p className="text-xs text-muted-foreground mb-3">AI pipeline running — please wait</p>
            <div className="mb-6"><TinyFishBadge /></div>
            <div className="space-y-3 text-left">
              {PROCESSING_STAGES.map((stage, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all ${
                  i < processingStage ? "text-success" :
                  i === processingStage ? "text-foreground" :
                  "text-muted-foreground/40"
                }`}>
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    {i < processingStage ? (
                      <CheckCircle2 size={16} className="text-success" />
                    ) : i === processingStage ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-current" />
                    )}
                  </div>
                  <span className="flex items-center gap-1.5">
                    {stage.icon}
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(processingStage / PROCESSING_STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 3 — Result */}
        {step === "result" && result && (
          <div className="space-y-5">
            {/* Verdict banner */}
            <div className={`border rounded-2xl p-5 sm:p-6 ${riskBg[result.riskLevel]}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    result.riskLevel === "clear" ? "bg-emerald-500/20" :
                    result.riskLevel === "critical" || result.riskLevel === "high" ? "bg-red-500/20" :
                    "bg-yellow-500/20"
                  }`}>
                    {result.riskLevel === "clear" ? (
                      <CheckCircle2 size={24} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={24} className={result.riskLevel === "critical" ? "text-red-400" : "text-yellow-400"} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">{result.id}</span>
                      <RiskBadge level={result.riskLevel} />
                      <StatusBadge status={result.status} />
                    </div>
                    <h2 className="text-xl font-bold font-display text-foreground">{result.subjectName}</h2>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {result.documentType.replace("_", " ")} · {result.documentNumber} · {result.nationality} ·{" "}
                      {new Date(result.submittedAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Trust Score</div>
                    <div className={`text-3xl font-bold font-mono ${
                      result.overallScore >= 80 ? "text-success" :
                      result.overallScore >= 60 ? "text-blue-400" :
                      result.overallScore >= 40 ? "text-yellow-400" :
                      result.overallScore >= 20 ? "text-orange-400" : "text-red-400"
                    }`}>{result.overallScore}<span className="text-lg">/100</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-muted-foreground hover:text-foreground rounded text-xs transition-all"
                    >
                      <RotateCcw size={12} /> New Scan
                    </button>
                    <button
                      onClick={() => navigate(`/history?id=${result.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium transition-all hover:bg-primary/90"
                    >
                      <Download size={12} /> Full Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommended action */}
              <div className="mt-4 pt-4 border-t border-current/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">AI Recommended Action</div>
                <div className="text-sm font-semibold text-foreground">{result.recommendedAction}</div>
              </div>
            </div>

            {/* Watchlist alert */}
            {result.watchlistHit.matched && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-red-400">Watchlist Match Detected</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium">{result.watchlistHit.listName}</span> · {result.watchlistHit.matchType}
                  </div>
                  <div className="text-xs text-red-300 mt-1">{result.watchlistHit.detail}</div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
              <div className="flex border-b border-border overflow-x-auto">
                {(["ocr", "tampering", "face", "ai"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? "border-primary dark:border-accent text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "ocr" ? "OCR Fields" :
                     tab === "tampering" ? "Tampering Checks" :
                     tab === "face" ? "Face Verification" :
                     "AI Analysis"}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {/* OCR */}
                {activeTab === "ocr" && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {result.ocrFields.length} fields extracted · {result.ocrFields.filter(f => f.flagged).length} flagged
                    </div>
                    <div className="space-y-2">
                      {result.ocrFields.map((field, i) => (
                        <div key={i} className={`flex items-start justify-between gap-4 p-3 rounded border ${
                          field.flagged ? "bg-orange-500/10 border-orange-500/30" : "bg-secondary border-border"
                        }`}>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-muted-foreground">{field.label}</div>
                            <div className="font-mono text-sm font-medium text-foreground mt-0.5">{field.value}</div>
                            {field.flagged && field.reason && (
                              <div className="text-xs text-orange-400 mt-1 flex items-start gap-1">
                                <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                                {field.reason}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[10px] text-muted-foreground mb-1">Confidence</div>
                            <div className="font-mono text-xs font-semibold text-foreground">{field.confidence}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tampering */}
                {activeTab === "tampering" && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {result.tamperingChecks.filter(c => c.status === "pass").length} passed ·{" "}
                      {result.tamperingChecks.filter(c => c.status === "warning").length} warnings ·{" "}
                      {result.tamperingChecks.filter(c => c.status === "fail").length} failed
                    </div>
                    <div className="space-y-2">
                      {result.tamperingChecks.map((check, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded border ${
                          check.status === "fail" ? "bg-red-500/10 border-red-500/30" :
                          check.status === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                          "bg-secondary border-border"
                        }`}>
                          <div className="mt-0.5 shrink-0">
                            {check.status === "pass" ? <CheckCircle2 size={15} className="text-success" /> :
                             check.status === "warning" ? <AlertTriangle size={15} className="text-yellow-400" /> :
                             <XCircle size={15} className="text-destructive" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-foreground">{check.checkName}</span>
                              <span className="font-mono text-xs text-muted-foreground shrink-0">{check.confidence}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{check.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Face */}
                {activeTab === "face" && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Face Match Result</div>
                      <div className={`p-4 rounded-lg border ${
                        result.faceVerification.status === "match"
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : result.faceVerification.status === "mismatch"
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-yellow-500/10 border-yellow-500/30"
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          {result.faceVerification.status === "match" ? (
                            <CheckCircle2 size={18} className="text-success" />
                          ) : (
                            <XCircle size={18} className="text-destructive" />
                          )}
                          <span className="font-semibold text-foreground capitalize">{result.faceVerification.status}</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Similarity Score</div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${result.faceVerification.similarity >= 70 ? "bg-emerald-500" : "bg-red-500"}`}
                                  style={{ width: `${result.faceVerification.similarity}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-sm text-foreground w-14 text-right">
                                {result.faceVerification.similarity}%
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1">Threshold: 70.0%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Liveness Score</div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${result.faceVerification.livenessScore}%` }}
                                />
                              </div>
                              <span className="font-mono text-sm text-foreground w-14 text-right">
                                {result.faceVerification.livenessScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Analysis Detail</div>
                      <div className="bg-secondary border border-border rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                        {result.faceVerification.detail}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={12} className={result.faceVerification.liveness ? "text-success" : "text-destructive"} />
                        Liveness: {result.faceVerification.liveness ? "Confirmed — Real person detected" : "Failed — Possible spoofing"}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI */}
                {activeTab === "ai" && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI Narrative</div>
                      <div className="bg-secondary border border-border rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                        {result.aiNarrative}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Score Breakdown</div>
                      <div className="space-y-2">
                        {[
                          { label: "OCR Extraction Quality", score: result.ocrFields.reduce((a, f) => a + f.confidence, 0) / result.ocrFields.length | 0 },
                          { label: "Document Integrity", score: result.tamperingChecks.filter(c => c.status === "pass").length * 14 },
                          { label: "Face Match Score", score: result.faceVerification.similarity | 0 },
                          { label: "Watchlist Clear", score: result.watchlistHit.matched ? 0 : 100 },
                        ].map((item) => (
                          <div key={item.label} className="grid grid-cols-[1fr_3fr_auto] items-center gap-3">
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.score >= 70 ? "bg-success" : item.score >= 40 ? "bg-warning" : "bg-destructive"}`}
                                style={{ width: `${Math.min(item.score, 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-muted-foreground w-8 text-right">{Math.min(item.score, 100)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {result.webEvidence && result.webEvidence.length > 0 && (
                      <div className="p-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Web Evidence</div>
                          <TinyFishBadge />
                        </div>
                        <div className="space-y-2">
                          {result.webEvidence.map((e, i) => (
                            <div key={i} className="text-xs">
                              <div className="font-medium text-foreground">{e.source}</div>
                              <div className="text-muted-foreground">{e.finding}</div>
                              {e.url && <a href={e.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline break-all">{e.url}</a>}
                            </div>
                          ))}
                        </div>
                        {result.engine && <div className="mt-3 text-[10px] text-muted-foreground">{result.engine.sourcesChecked} public pages read with TinyFish Search + Fetch</div>}
                      </div>
                    )}
                    <div className="p-4 bg-card border border-border rounded-lg">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recommended Action</div>
                      <div className="text-sm font-semibold text-foreground">{result.recommendedAction}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
