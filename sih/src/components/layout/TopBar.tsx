import { Bell, Sun, Moon, Shield, ChevronRight, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useScreenings } from "../../context/ScreeningContext";

interface TopBarProps {
  breadcrumbs?: { label: string; to?: string }[];
}

export default function TopBar({ breadcrumbs }: TopBarProps) {
  const { isDark, toggle } = useTheme();
  const { isDemoMode, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useScreenings();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border bg-card/65 backdrop-blur-xl sticky top-0 z-30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Shield size={14} className="text-cyan-400" />
        {breadcrumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-muted-foreground" />
            {crumb.to ? (
              <Link to={crumb.to} className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground text-xs font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {isDemoMode && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent border border-accent/40 rounded px-2 py-0.5 mr-2">
            Demo
          </span>
        )}

        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          title="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={() => navigate("/notifications")}
          className="relative w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          title="Notifications"
        >
          <Bell size={15} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          )}
        </button>

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-1.5 h-8 px-2.5 ml-1 rounded text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          title="Sign out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
