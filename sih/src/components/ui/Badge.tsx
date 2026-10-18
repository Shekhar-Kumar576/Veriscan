import type { RiskLevel, VerificationStatus } from "../../types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

const riskConfig: Record<RiskLevel, { label: string; classes: string }> = {
  clear: { label: "Clear", classes: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  low: { label: "Low Risk", classes: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  medium: { label: "Medium Risk", classes: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" },
  high: { label: "High Risk", classes: "bg-orange-500/15 text-orange-400 border border-orange-500/30" },
  critical: { label: "Critical", classes: "bg-red-500/15 text-red-300 border border-red-500/40 shadow-[0_0_18px_-8px_rgba(248,113,113,0.9)] animate-pulse" },
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const cfg = riskConfig[level];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium backdrop-blur-sm ${sizeClass} ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor(level)}`} />
      {cfg.label}
    </span>
  );
}

function dotColor(level: RiskLevel) {
  const map: Record<RiskLevel, string> = {
    clear: "bg-emerald-400",
    low: "bg-blue-400",
    medium: "bg-yellow-400",
    high: "bg-orange-400",
    critical: "bg-red-400",
  };
  return map[level];
}

interface StatusBadgeProps {
  status: VerificationStatus;
}

const statusConfig: Record<VerificationStatus, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-gray-500/15 text-gray-400 border border-gray-500/30" },
  processing: { label: "Processing", classes: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  verified: { label: "Verified", classes: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  flagged: { label: "Flagged", classes: "bg-orange-500/15 text-orange-400 border border-orange-500/30" },
  rejected: { label: "Rejected", classes: "bg-red-500/15 text-red-400 border border-red-500/30" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

interface ScoreMeterProps {
  score: number;
}

export function ScoreMeter({ score }: ScoreMeterProps) {
  const color =
    score >= 80 ? "bg-emerald-500" :
    score >= 60 ? "bg-blue-500" :
    score >= 40 ? "bg-yellow-500" :
    score >= 20 ? "bg-orange-500" : "bg-red-500";

  const textColor =
    score >= 80 ? "text-emerald-400" :
    score >= 60 ? "text-blue-400" :
    score >= 40 ? "text-yellow-400" :
    score >= 20 ? "text-orange-400" : "text-red-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono font-semibold text-sm ${textColor} w-8 text-right`}>{score}</span>
    </div>
  );
}
