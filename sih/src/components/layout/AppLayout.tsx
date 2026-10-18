import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { BarChart3, History, LayoutDashboard, ScanLine, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell flex h-screen overflow-hidden bg-background">
      <div className="cyber-orb cyber-orb-one" aria-hidden="true" />
      <div className="cyber-orb cyber-orb-two" aria-hidden="true" />
      <div className="cyber-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <Sidebar />
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
        <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 grid grid-cols-5 rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl">
          {[
            { to: "/dashboard", label: "Home", icon: LayoutDashboard },
            { to: "/screening", label: "Scan", icon: ScanLine },
            { to: "/history", label: "History", icon: History },
            { to: "/analytics", label: "Insights", icon: BarChart3 },
            { to: "/profile", label: "Profile", icon: UserCircle },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition-all ${
                  isActive ? "bg-primary/15 text-cyan-400" : "text-muted-foreground"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
