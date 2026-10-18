import type { ScreeningResult } from "../types";

export function fileToDataUrl(f: File) {
  return new Promise<string>((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result as string); r.onerror = no; r.readAsDataURL(f); });
}
export const splitDataUrl = (d: string) => ({ mime: d.slice(5, d.indexOf(";")), data: d.slice(d.indexOf(",") + 1) });
export async function dataUrlToFile(d: string, name: string) {
  const blob = await (await fetch(d)).blob(); return new File([blob], name, { type: blob.type });
}

/** Calls /api/screen (Gemini + TinyFish) and streams stage progress. */
export async function screenDocument(payload: unknown, onStage: (i: number) => void): Promise<ScreeningResult> {
  const r = await fetch("/api/screen", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
  if (!r.ok || !r.body) throw new Error(r.status === 404 ? "API not found. Run with `vercel dev` locally, or deploy to Vercel." : `Server error ${r.status}`);
  const rd = r.body.getReader(), dec = new TextDecoder(); let buf = "";
  for (;;) {
    const { done, value } = await rd.read(); if (done) break;
    buf += dec.decode(value, { stream: true }); const ls = buf.split("\n"); buf = ls.pop() || "";
    for (const l of ls) {
      if (!l.trim()) continue; const e = JSON.parse(l);
      if (e.t === "stage") onStage(e.i); else if (e.t === "error") throw new Error(e.m); else if (e.t === "result") return e.result;
    }
  }
  throw new Error("Screening ended without a result.");
}

export function downloadCsv(name: string, csv: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = name.replace(/\W+/g, "_") + ".csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
export function screeningsToCsv(rows: ScreeningResult[]) {
  const head = ["id", "submittedAt", "subjectName", "documentType", "documentNumber", "nationality", "checkpoint", "officerName", "riskLevel", "status", "trustScore"];
  return [head.join(","), ...rows.map((s) => [s.id, s.submittedAt, s.subjectName, s.documentType, s.documentNumber, s.nationality, s.checkpoint, s.officerName, s.riskLevel, s.status, s.overallScore].map(q).join(","))].join("\n");
}
const esc = (s: unknown) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
/** Opens a print-ready report; choose "Save as PDF" in the print dialog. */
export function printReport(s: ScreeningResult) {
  const w = window.open("", "_blank"); if (!w) { alert("Allow pop-ups to export the PDF."); return; }
  w.document.write(`<title>${esc(s.id)}</title><body style="font:14px system-ui;max-width:760px;margin:30px auto;color:#111"><h2>VeriScan Report ${esc(s.id)}</h2>
<p><b>${esc(s.subjectName)}</b> · ${esc(s.documentType)} · ${esc(s.documentNumber)} · ${esc(s.nationality)}<br>Risk: <b>${esc(s.riskLevel)}</b> · Trust ${s.overallScore}/100 · ${esc(s.status)}</p>
<p><b>Recommended action:</b> ${esc(s.recommendedAction)}</p><p>${esc(s.aiNarrative)}</p>
<h3>OCR fields</h3><ul>${s.ocrFields.map((f) => `<li>${esc(f.label)}: ${esc(f.value)} (${f.confidence}%)${f.flagged ? " FLAGGED: " + esc(f.reason) : ""}</li>`).join("")}</ul>
<h3>Tampering checks</h3><ul>${s.tamperingChecks.map((c) => `<li>[${c.status}] ${esc(c.checkName)}: ${esc(c.detail)}</li>`).join("")}</ul>
<h3>Face verification</h3><p>${esc(s.faceVerification.status)} · similarity ${s.faceVerification.similarity}% · ${esc(s.faceVerification.detail)}</p>
<h3>Watchlist</h3><p>${s.watchlistHit.matched ? esc(s.watchlistHit.listName) + ": " : ""}${esc(s.watchlistHit.detail)}</p>
${s.webEvidence?.length ? `<h3>Live web evidence (TinyFish)</h3><ul>${s.webEvidence.map((e) => `<li>${esc(e.source)}: ${esc(e.finding)} ${esc(e.url)}</li>`).join("")}</ul>` : ""}</body>`);
  w.document.close(); w.focus(); w.print();
}
