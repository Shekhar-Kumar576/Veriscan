export type UserRole = "officer" | "supervisor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber: string;
  checkpoint: string;
  avatar?: string;
  lastLogin: string;
  isActive: boolean;
}

export type DocumentType =
  | "passport"
  | "visa"
  | "national_id"
  | "driving_license"
  | "border_permit"
  | "student_id"
  | "other";

export type RiskLevel = "clear" | "low" | "medium" | "high" | "critical";

export type VerificationStatus =
  | "pending"
  | "processing"
  | "verified"
  | "flagged"
  | "rejected";

export interface OCRField {
  label: string;
  value: string;
  confidence: number;
  flagged?: boolean;
  reason?: string;
}

export interface TamperingCheck {
  checkName: string;
  status: "pass" | "fail" | "warning";
  confidence: number;
  detail: string;
}

export interface FaceVerificationResult {
  similarity: number;
  liveness: boolean;
  livenessScore: number;
  status: "match" | "mismatch" | "inconclusive";
  detail: string;
}

export interface WatchlistHit {
  matched: boolean;
  listName?: string;
  matchType?: string;
  severity?: RiskLevel;
  detail?: string;
}

export interface ScreeningResult {
  id: string;
  submittedAt: string;
  completedAt: string;
  documentType: DocumentType;
  documentNumber: string;
  subjectName: string;
  nationality: string;
  dateOfBirth: string;
  checkpoint: string;
  officerId: string;
  officerName: string;
  riskLevel: RiskLevel;
  status: VerificationStatus;
  overallScore: number;
  ocrFields: OCRField[];
  tamperingChecks: TamperingCheck[];
  faceVerification: FaceVerificationResult;
  watchlistHit: WatchlistHit;
  webEvidence?: { source: string; url: string; finding: string }[];
  engine?: { vision: string; web: string; sourcesChecked: number };
  aiNarrative: string;
  recommendedAction: string;
  reviewedBy?: string;
  reviewNotes?: string;
  reportUrl?: string;
}

export interface Notification {
  id: string;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  screeningId?: string;
}

export interface CheckpointStat {
  name: string;
  total: number;
  cleared: number;
  flagged: number;
  rejected: number;
}

export interface DailyVolume {
  date: string;
  screenings: number;
  flagged: number;
  cleared: number;
}

export interface RiskDistribution {
  level: RiskLevel;
  count: number;
  percentage: number;
}

export interface DocumentTypeBreakdown {
  type: string;
  count: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (role?: UserRole) => void;
  logout: () => void;
  users: User[];
  addUser: (u: Omit<User, "id" | "lastLogin">) => void;
  removeUser: (id: string) => void;
  setUserActive: (id: string, active: boolean) => void;
}
