import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  BarChart3,
  History,
  Bell,
  UserCircle,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useScreenings } from "../../context/ScreeningContext";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-primary/35 via-cyan-500/15 to-violet-500/10 text-primary-foreground border border-cyan-400/30 shadow-lg shadow-cyan-500/5"
            : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:translate-x-1"
        }`
      }
    >
      <span className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && badge > 0 ? (
        <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const { notifications } = useScreenings();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter(
    (n) => !n.read && n.type === "alert"
  ).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-card/80 backdrop-blur-xl border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-primary flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/15">
            <ShieldCheck className="w-4.5 h-4.5 text-primary-foreground" size={18} />
          </div>
          <div>
            <div className="text-base font-bold text-foreground leading-tight font-display tracking-tight">
              VeriScan AI
            </div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-[0.18em]">
              Secure Intelligence
            </div>
          </div>
        </div>
      </div>

      {isDemoMode && (
        <div className="mx-3 mt-3 px-2.5 py-2 bg-accent/10 border border-accent/30 rounded text-xs text-accent flex items-center gap-1.5">
          <AlertTriangle size={12} />
          Demo Mode Active
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-1.5 mt-1">
          Operations
        </div>
        <NavItem to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
        <NavItem to="/screening" icon={<ScanLine size={16} />} label="New Screening" />
        <NavItem to="/history" icon={<History size={16} />} label="Screening History" />

        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-1.5 mt-3">
          Intelligence
        </div>
        <NavItem to="/analytics" icon={<BarChart3 size={16} />} label="Analytics" />
        <NavItem
          to="/notifications"
          icon={<Bell size={16} />}
          label="Notifications"
          badge={unreadCount}
        />

        {(user?.role === "admin" || user?.role === "supervisor") && (
          <>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-1.5 mt-3">
              Administration
            </div>
            <NavItem to="/admin" icon={<Settings size={16} />} label="Admin Panel" />
          </>
        )}
      </nav>

      {/* User profile */}
      <div className="border-t border-border px-3 py-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-2 rounded transition-all mb-1 ${
              isActive ? "bg-secondary" : "hover:bg-secondary"
            }`
          }
        >
          <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{user?.name.split(" ")[0]} {user?.name.split(" ").slice(-1)}</div>
            <div className="text-[10px] text-muted-foreground truncate capitalize">{user?.role} · {user?.badgeNumber}</div>
          </div>
          <ChevronRight size={12} className="text-muted-foreground shrink-0" />
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
