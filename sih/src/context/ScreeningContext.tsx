import React, { createContext, useContext, useEffect, useState } from "react";
import { MOCK_SCREENINGS } from "../data/mockData";
import type { ScreeningResult, Notification } from "../types";
import { MOCK_NOTIFICATIONS } from "../data/mockData";

interface ScreeningState {
  screenings: ScreeningResult[];
  recordScreening: (screening: ScreeningResult) => ScreeningResult;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const STORAGE_KEY = "veriscan-screening-history";
const ScreeningContext = createContext<ScreeningState | null>(null);

function loadScreenings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ScreeningResult[]) : MOCK_SCREENINGS;
  } catch {
    return MOCK_SCREENINGS;
  }
}

export function ScreeningProvider({ children }: { children: React.ReactNode }) {
  const [screenings, setScreenings] = useState<ScreeningResult[]>(loadScreenings);

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try { const s = localStorage.getItem("veriscan-notifications"); return s ? (JSON.parse(s) as Notification[]) : MOCK_NOTIFICATIONS; } catch { return MOCK_NOTIFICATIONS; }
  });
  useEffect(() => { localStorage.setItem("veriscan-notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(screenings));
  }, [screenings]);

  const recordScreening = (screening: ScreeningResult) => {
    const now = new Date();
    const completed = new Date(now.getTime() + 12_000);
    const recorded = {
      ...screening,
      id: `SCR-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`,
      submittedAt: now.toISOString(),
      completedAt: completed.toISOString(),
    };
    setScreenings((current) => [recorded, ...current]);
    if (recorded.riskLevel !== "clear" && recorded.riskLevel !== "low") {
      setNotifications((n) => [{
        id: `n${now.getTime()}`, type: recorded.riskLevel === "critical" ? "alert" : "warning",
        title: `${recorded.riskLevel === "critical" ? "Critical" : "Risk"} Flag: ${recorded.id}`,
        message: `Screening of ${recorded.subjectName} was rated ${recorded.riskLevel}. ${recorded.recommendedAction}`,
        timestamp: now.toISOString(), read: false, screeningId: recorded.id,
      }, ...n]);
    }
    return recorded;
  };

  return (
    <ScreeningContext.Provider value={{ screenings, recordScreening, notifications, setNotifications }}>
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreenings() {
  const context = useContext(ScreeningContext);
  if (!context) throw new Error("useScreenings must be used within ScreeningProvider");
  return context;
}
