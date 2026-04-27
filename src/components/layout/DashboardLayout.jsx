import { useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";

function navRowActiveClass(variant, isActive) {
  if (!isActive) return "text-slate-300 hover:bg-white/5 hover:text-white";
  if (variant === "recruiter") {
    return "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/35 shadow-lg shadow-black/20";
  }
  if (variant === "admin") {
    return "bg-indigo-500/25 text-indigo-50 ring-1 ring-indigo-400/40 shadow-lg shadow-black/20";
  }
  return "bg-teal-500/20 text-white ring-1 ring-teal-400/40 shadow-lg shadow-black/20";
}

function navIconActiveClass(variant, isActive) {
  if (!isActive) return "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200";
  if (variant === "recruiter") return "bg-amber-500/25 text-amber-200";
  if (variant === "admin") return "bg-indigo-400/35 text-indigo-100";
  return "bg-teal-500/30 text-teal-100";
}

function navChevronClass(variant) {
  if (variant === "recruiter") return "text-amber-300/80";
  if (variant === "admin") return "text-indigo-300/80";
  return "text-teal-300/80";
}

function profilePath(variant) {
  if (variant === "recruiter") return "/recruiter/profile";
  if (variant === "admin") return "/admin/profile";
  return "/user/profile";
}

function avatarGradientClass(variant) {
  if (variant === "recruiter") {
    return "bg-linear-to-br from-amber-400 to-amber-600 text-slate-900 ring-amber-200/50";
  }
  if (variant === "admin") {
    return "bg-linear-to-br from-indigo-400 to-violet-800 text-white ring-indigo-200/40";
  }
  return "bg-linear-to-br from-teal-500 to-teal-700";
}

/**
 * Shared shell for seeker, recruiter, and admin dashboards.
 * @param {"seeker" | "recruiter" | "admin"} props.variant
 * @param {{ to: string; end?: boolean; label: string; icon: import("lucide-react").LucideIcon }[]} props.navItems
 * @param {boolean} [props.showHeaderSearch] — optional admin-style search field in header
 */
export default function DashboardLayout({ variant, navItems, showHeaderSearch = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeSidebar();
    navigate("/", { replace: true });
  };

  const initial = useMemo(
    () => (user?.name || user?.companyName || "U").charAt(0).toUpperCase(),
    [user?.name, user?.companyName]
  );

  const headline =
    variant === "recruiter"
      ? user?.companyName || user?.name || "Your company"
      : variant === "admin"
        ? user?.name || "Administrator"
        : user?.name || "Welcome";

  const subline =
    variant === "recruiter"
      ? user?.headline || "Recruiter workspace"
      : variant === "admin"
        ? "JobNest control center"
        : user?.headline || "Build your career on JobNest";

  const pageTitle = useMemo(() => {
    const p = location.pathname.replace(/\/+$/, "") || location.pathname;

    const exactEnd = navItems.find((n) => {
      if (!n.end) return false;
      const t = (n.to || "").replace(/\/+$/, "") || "/";
      return p === t;
    });
    if (exactEnd) return exactEnd.label;

    const nonEnd = [...navItems].filter((n) => !n.end).sort((a, b) => b.to.length - a.to.length);
    for (const n of nonEnd) {
      const t = n.to.replace(/\/+$/, "");
      if (p === t || (t && p.startsWith(`${t}/`))) return n.label;
    }
    return "Overview";
  }, [location.pathname, navItems]);

  const badge =
    variant === "recruiter" ? "Recruiter" : variant === "admin" ? "Administrator" : "Job seeker";

  const mainMargin = sidebarCollapsed ? "md:ml-20" : "md:ml-72";
  const headerSidebarOffset = sidebarCollapsed ? "md:left-20" : "md:left-72";

  return (
    <div className="relative flex h-dvh min-h-0 overflow-hidden bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex max-h-screen w-[min(18rem,88vw)] flex-col border-r border-slate-800/80 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-slate-900/40 transition-[transform,width] duration-300 ease-out ${
          sidebarCollapsed ? "md:w-20" : "md:w-72"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Brand row */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4">
            <NavLink
              to="/"
              onClick={closeSidebar}
              className="group flex min-w-0 items-center gap-2.5 rounded-xl py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/40">
                <Sparkles className="h-5 w-5 text-amber-300" aria-hidden />
              </span>
              {!sidebarCollapsed ? (
                <span className="min-w-0 text-left">
                  <span className="block truncate text-lg font-extrabold tracking-tight text-white">JobNest</span>
                  <span
                    className={`block truncate text-[11px] font-semibold uppercase tracking-wider ${
                      variant === "admin" ? "text-indigo-200/95" : "text-teal-200/90"
                    }`}
                  >
                    {badge}
                  </span>
                </span>
              ) : null}
            </NavLink>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:flex"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <PanelLeftClose className={`h-5 w-5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
              </button>
              <button
                type="button"
                onClick={closeSidebar}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User card */}
          {!sidebarCollapsed ? (
            <div className="border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-inner ring-2 ring-white/20 ${avatarGradientClass(variant)}`}
                >
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{headline}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-400">{subline}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center border-b border-white/10 py-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${avatarGradientClass(variant)}`}
              >
                {initial}
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            {navItems.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to + (end ? "-end" : "")}
                to={to}
                end={end}
                onClick={closeSidebar}
                title={sidebarCollapsed ? label : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all md:py-2.5 ${navRowActiveClass(
                    variant,
                    isActive
                  )} ${sidebarCollapsed ? "justify-center px-2" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${navIconActiveClass(
                        variant,
                        isActive
                      )}`}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                    </span>
                    {!sidebarCollapsed ? <span className="truncate">{label}</span> : null}
                    {!sidebarCollapsed && (
                      <ChevronRight
                        className={`ml-auto h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 ${navChevronClass(variant)}`}
                        aria-hidden
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={handleLogout}
              title={sidebarCollapsed ? "Log out" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-100 md:py-2.5 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                <LogOut className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              </span>
              {!sidebarCollapsed ? <span>Log out</span> : null}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ${mainMargin}`}>
        <header
          className={`fixed top-0 right-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 bg-white/90 px-3 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/80 sm:h-16 sm:px-5 left-0 ${headerSidebarOffset}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-900 md:hidden"
              aria-expanded={sidebarOpen}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden h-9 w-px bg-slate-200 sm:block md:hidden" aria-hidden />

            <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
              <div className="min-w-0 shrink-0 lg:max-w-[min(100%,20rem)]">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <Home
                    className={`h-3.5 w-3.5 shrink-0 ${variant === "admin" ? "text-indigo-600" : "text-teal-600"}`}
                    aria-hidden
                  />
                  <span>Workspace</span>
                  <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" aria-hidden />
                  <span
                    className={
                      variant === "recruiter"
                        ? "text-amber-700"
                        : variant === "admin"
                          ? "text-indigo-700"
                          : "text-teal-700"
                    }
                  >
                    {badge}
                  </span>
                </div>
                <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{pageTitle}</h1>
              </div>

              {showHeaderSearch ? (
                <div className="hidden min-w-0 flex-1 md:block">
                  <label className="sr-only" htmlFor="dashboard-admin-search">
                    Search users and jobs
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/90 px-3 py-2 shadow-inner ring-1 ring-slate-900/5">
                    <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <input
                      id="dashboard-admin-search"
                      type="search"
                      placeholder="Search users, jobs…"
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      readOnly
                      title="Search coming soon"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-900"
              aria-label="Notifications (coming soon)"
            >
              <Bell className="h-5 w-5" strokeWidth={2} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white" />
            </button>

            <NavLink
              to={profilePath(variant)}
              onClick={closeSidebar}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-teal-200 hover:shadow-md sm:pr-4"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-inner ${avatarGradientClass(variant)}`}
              >
                {initial}
              </span>
              <span className="hidden min-w-0 flex-col text-left sm:flex">
                <span className="truncate text-xs font-bold text-slate-900">{user?.name || "Account"}</span>
                <span className="truncate text-[11px] font-medium text-slate-500">View profile</span>
              </span>
            </NavLink>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-14 sm:pt-16">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
