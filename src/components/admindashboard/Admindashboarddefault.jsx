import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  LayoutDashboard,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminPageHeader from "../admin/AdminPageHeader.jsx";
import { apiGet, extractList, getApiErrorMessage } from "../../lib/apiClient.js";

function StatCard({ label, value, hint, icon: Icon, tone = "indigo" }) {
  const ring =
    tone === "violet"
      ? "from-violet-500/15 to-violet-600/5 ring-violet-200/60"
      : tone === "teal"
        ? "from-teal-500/15 to-teal-600/5 ring-teal-200/60"
        : "from-indigo-500/15 to-indigo-600/5 ring-indigo-200/60";
  const iconBg =
    tone === "violet" ? "bg-violet-100 text-violet-700" : tone === "teal" ? "bg-teal-100 text-teal-700" : "bg-indigo-100 text-indigo-700";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md`}
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-linear-to-br ${ring} ring-1`} aria-hidden />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums tracking-tight text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
        ) : null}
      </div>
    </div>
  );
}

const quickLinks = [
  { to: "/admin/alluser", label: "All users", desc: "Directory & roles", icon: Users },
  { to: "/admin/jobs", label: "Jobs", desc: "Listings & status", icon: Briefcase },
  { to: "/admin/category", label: "Categories", desc: "Taxonomy", icon: Tags },
  { to: "/admin/analytics", label: "Analytics", desc: "Overview metrics", icon: TrendingUp },
];

export default function Admindashboarddefault() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    users: 0,
    activeUsers: 0,
    jobs: 0,
    activeJobs: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [usersRes, jobsRes] = await Promise.all([
          apiGet("/user/getalluser"),
          apiGet("/job/get"),
        ]);
        if (cancelled) return;
        const users = extractList(usersRes, ["data", "users"]);
        const jobs = extractList(jobsRes, ["data", "jobs"]);
        const activeUsers = users.filter((u) => u.status === "Active" || u.isActive !== false).length;
        const activeJobs = jobs.filter((j) => j.isActive).length;
        setTotals({
          users: users.length,
          activeUsers,
          jobs: jobs.length,
          activeJobs,
        });
      } catch (e) {
        if (!cancelled) {
          setTotals({ users: 0, activeUsers: 0, jobs: 0, activeJobs: 0 });
          console.warn(getApiErrorMessage(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-6xl">
      <AdminPageHeader
        title="Overview"
        description="Live counts from your API. Use the sidebar to manage users, jobs, categories, and platform settings."
        actions={
          <NavLink
            to="/admin/analytics"
            className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-900/10"
          >
            Open analytics
            <ArrowRight className="h-4 w-4" aria-hidden />
          </NavLink>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={loading ? "…" : totals.users}
          hint="Registered accounts"
          icon={Users}
          tone="indigo"
        />
        <StatCard
          label="Active users"
          value={loading ? "…" : totals.activeUsers}
          hint="Status Active"
          icon={Users}
          tone="teal"
        />
        <StatCard
          label="Total jobs"
          value={loading ? "…" : totals.jobs}
          hint="All listings"
          icon={Briefcase}
          tone="violet"
        />
        <StatCard
          label="Active jobs"
          value={loading ? "…" : totals.activeJobs}
          hint="Visible listings"
          icon={Briefcase}
          tone="indigo"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <h2 className="text-lg font-bold text-slate-900">Quick access</h2>
            <p className="mt-1 text-sm text-slate-600">Jump to the most common admin tasks.</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {quickLinks.map(({ to, label, desc, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/60 transition group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-500">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 font-bold text-slate-900">
                        {label}
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">{desc}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-slate-200/90 bg-linear-to-b from-slate-900 to-slate-950 p-6 text-white shadow-lg ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-indigo-200">
              <LayoutDashboard className="h-5 w-5" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-wider">Health</span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-white">Platform snapshot</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Applications and interview modules can plug into this panel once those APIs are available.
            </p>
            <ul className="mt-auto space-y-3 border-t border-white/10 pt-5 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                JWT auth & role-based areas are live for seekers, recruiters, and admins.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                User and job counts refresh whenever you open this dashboard.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                Use Categories before posting jobs so listings stay organized.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
