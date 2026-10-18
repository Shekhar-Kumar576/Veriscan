import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search, Filter, Download, ChevronRight, X, CheckCircle2,
  AlertTriangle, XCircle, Eye, SortAsc, SortDesc,
} from "lucide-react";
import type { ScreeningResult, RiskLevel } from "../types";
import { downloadCsv, screeningsToCsv, printReport } from "../lib/api";
import { useScreenings } from "../context/ScreeningContext";
import { RiskBadge, StatusBadge, ScoreMeter } from "../components/ui/Badge";
import TopBar from "../components/layout/TopBar";

export default function HistoryPage() {
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");
  const navigate = useNavigate();
  const { screenings } = useScreenings();

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [sortField, setSortField] = useState<"submittedAt" | "overallScore">("submittedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<ScreeningResult | null>(
    focusId ? (screenings.find((s) => s.id === focusId) ?? null) : null
  );

  const filtered = useMemo(() => {
    let arr = [...screenings];
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (s) =>
          s.subjectName.toLowerCase().includes(q) ||
          s.documentNumber.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== "all") arr = arr.filter((s) => s.riskLevel === riskFilter);
    arr.sort((a, b) => {
      const va = sortField === "submittedAt" ? a.submittedAt : a.overallScore;
      const vb = sortField === "submittedAt" ? b.submittedAt : b.overallScore;
      return sortDir === "asc" ? (va < vb ? -1 : 1) : va > vb ? -1 : 1;
    });
    return arr;
  }, [screenings, search, riskFilter, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const riskLevels: RiskLevel[] = ["clear", "low", "medium", "high", "critical"];

  return (
    <div>
      <TopBar breadcrumbs={[{ label: "Operations" }, { label: "Screening History" }]} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 mb-2">Case intelligence</div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">Screening History</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} records</p>
          </div>
          <button onClick={() => downloadCsv("screening-history", screeningsToCsv(filtered))} className="flex items-center gap-2 px-3 py-2 border border-border bg-card text-sm text-muted-foreground hover:text-foreground rounded transition-all">
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ID, document..."
              className="pl-9 pr-3 py-2 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-56"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Filter size={13} className="text-muted-foreground" />
            <button
              onClick={() => setRiskFilter("all")}
              className={`px-2.5 py-1 rounded text-xs border transition-all ${
                riskFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {riskLevels.map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded text-xs border transition-all capitalize ${
                  riskFilter === r ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {search && (
            <button onClick={() => setSearch("")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Case ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk</th>
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("overallScore")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Score
                      {sortField === "overallScore" ? (sortDir === "asc" ? <SortAsc size={11} /> : <SortDesc size={11} />) : null}
                    </span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("submittedAt")}
                  >
                    <span className="flex items-center gap-1">
                      Time
                      {sortField === "submittedAt" ? (sortDir === "asc" ? <SortAsc size={11} /> : <SortDesc size={11} />) : null}
                    </span>
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">
                      No records match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelected(s)}
                      className={`hover:bg-secondary/50 cursor-pointer transition-all ${selected?.id === s.id ? "bg-primary/10" : ""}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{s.subjectName}</div>
                        <div className="text-xs text-muted-foreground">{s.nationality} · {s.dateOfBirth}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground capitalize">{s.documentType.replace("_", " ")}</div>
                        <div className="text-xs font-mono text-muted-foreground">{s.documentNumber}</div>
                      </td>
                      <td className="px-4 py-3"><RiskBadge level={s.riskLevel} size="sm" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 w-28">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.overallScore >= 80 ? "bg-success" : s.overallScore >= 40 ? "bg-warning" : "bg-destructive"}`}
                              style={{ width: `${s.overallScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-foreground w-6 text-right">{s.overallScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(s.submittedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <Eye size={14} className="text-muted-foreground hover:text-foreground" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">{selected.id}</span>
                <RiskBadge level={selected.riskLevel} />
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X size={15} />
              </button>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{selected.subjectName}</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ["Document", `${selected.documentType.replace("_", " ")} · ${selected.documentNumber}`],
                      ["Nationality", selected.nationality],
                      ["Date of Birth", selected.dateOfBirth],
                      ["Checkpoint", selected.checkpoint],
                      ["Officer", selected.officerName],
                      ["Processed At", new Date(selected.completedAt).toLocaleString("en-IN")],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <span className="text-muted-foreground w-28 shrink-0">{k}</span>
                        <span className="text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">AI Analysis Summary</div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{selected.aiNarrative}</p>
                  <div className="p-3 bg-secondary border border-border rounded text-sm">
                    <span className="text-muted-foreground text-xs">Recommended Action · </span>
                    <span className="font-semibold text-foreground">{selected.recommendedAction}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/screening`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-all"
                    >
                      <ChevronRight size={11} /> New Screening
                    </button>
                    <button onClick={() => printReport(selected!)} className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-muted-foreground hover:text-foreground rounded text-xs transition-all">
                      <Download size={11} /> Export PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Tampering summary */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Tampering Checks</div>
                <div className="flex flex-wrap gap-2">
                  {selected.tamperingChecks.map((c) => (
                    <div
                      key={c.checkName}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${
                        c.status === "pass" ? "bg-success/10 border-success/30 text-success" :
                        c.status === "warning" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                        "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}
                    >
                      {c.status === "pass" ? <CheckCircle2 size={11} /> :
                       c.status === "warning" ? <AlertTriangle size={11} /> :
                       <XCircle size={11} />}
                      {c.checkName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
