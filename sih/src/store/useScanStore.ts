import { create } from 'zustand';

export interface TamperingCheck {
  id: string;
  name: string;
  category: 'vision' | 'forensics' | 'web' | 'metadata';
  status: 'passed' | 'warning' | 'failed' | 'running';
  confidence: number;
  details: string;
  defectReason?: string;
}

export interface ScreeningRecord {
  id: string;
  timestamp: string;
  documentType: string;
  riskScore: number;
  verdict: 'Clear' | 'High Risk' | 'Critical Risk';
  checks: TamperingCheck[];
  extractedData?: {
    name?: string;
    dob?: string;
    idNumber?: string;
    issuer?: string;
    expiryDate?: string;
  };
  filePreview?: string;
}

interface ScanStoreState {
  screeningHistory: ScreeningRecord[];
  currentScan: ScreeningRecord | null;
  isScanning: boolean;
  scanProgress: number;
  activeStatusFilter: 'all' | 'clear' | 'warning' | 'critical';
  setScanning: (scanning: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentScan: (scan: ScreeningRecord | null) => void;
  addScreeningRecord: (record: ScreeningRecord) => void;
  clearAllHistory: () => void;
}

export const useScanStore = create<ScanStoreState>((set) => ({
  // Clean start: zero demo profiles or mock screening history
  screeningHistory: [],
  currentScan: null,
  isScanning: false,
  scanProgress: 0,
  activeStatusFilter: 'all',

  setScanning: (isScanning) => set({ isScanning }),
  setProgress: (scanProgress) => set({ scanProgress }),
  setCurrentScan: (currentScan) => set({ currentScan }),
  
  addScreeningRecord: (record) =>
    set((state) => ({
      screeningHistory: [record, ...state.screeningHistory],
      currentScan: record,
    })),

  clearAllHistory: () => {
    localStorage.removeItem('veriscan_history');
    localStorage.removeItem('truthlens_history');
    localStorage.removeItem('screening_records');
    set({ screeningHistory: [], currentScan: null, scanProgress: 0, isScanning: false });
  },
}));
