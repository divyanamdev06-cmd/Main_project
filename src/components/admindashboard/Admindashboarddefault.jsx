import { useEffect, useMemo, useState } from "react";
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

function DonutChart({ rows }) {
  const palette = [
    "#F6C85F",
    "#60A5FA",
    "#34D399",
    "#F472B6",
    "#A78BFA",
    "#FB923C",
    "#94A3B8",
  ];

  const normalized = (rows || [])
    .map((r, i) => ({
      label: String(r.label || r.key || r._id || "Unknown"),
      value: Number(r.value ?? r.count ?? 0),
      color: palette[i % palette.length],
    }))
    .filter((r) => r.value > 0);

  const total = normalized.reduce((sum, r) => sum + r.value, 0);
  if (!total) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 text-center text-sm text-slate-600">
        No data yet.
      </div>
    );
  }

  let acc = 0;
  const stops = normalized
    .map((s) => {
      const start = acc;
      const end = acc + (s.value / total) * 100;
      acc = end;
      return `${s.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    })
    .join(", ");

  return (
    <div className="grid gap-6 sm:grid-cols-[220px_1fr] sm:items-center">
      <div className="flex items-center justify-center">
        <div
          className="relative h-44 w-44 rounded-full ring-1 ring-slate-200 shadow-sm"
          style={{ background: `conic-gradient(${stops})` }}
          aria-label="Donut chart"
        >
          <div className="absolute inset-5 rounded-full bg-white ring-1 ring-slate-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{total}</div>
            </div>
          </div>
        </div>
      </div>

      <ul className="grid gap-2">
        {normalized.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: s.color }} />
                <span className="truncate font-semibold text-slate-800">{s.label}</span>
              </div>
              <div className="shrink-0 font-semibold text-slate-700 tabular-nums">
                {s.value} <span className="text-slate-400">({pct}%)</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Admindashboarddefault() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [usersRes, jobsRes, analyticsRes] = await Promise.all([
          apiGet("/user/getalluser"),
          apiGet("/job/get"),
          apiGet("/analytics/admin"),
        ]);
        if (cancelled) return;
        const users = extractList(usersRes, ["data", "users"]);
        const jobs = extractList(jobsRes, ["data", "jobs"]);
        const activeUsers = users.filter((u) => u.status === "Active" || u.isActive !== false).length;
        const activeJobs = jobs.filter((j) => j.isActive).length;
        setAnalytics({
          totals: {
            users: users.length,
            activeUsers,
            jobs: jobs.length,
            activeJobs,
          },
          analytics: analyticsRes?.data || null,
        });
      } catch (e) {
        if (!cancelled) {
          setAnalytics(null);
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

  const totals = analytics?.totals || { users: 0, activeUsers: 0, jobs: 0, activeJobs: 0 };
  const a = analytics?.analytics;
  const byRole = useMemo(() => {
    const u = a?.users;
    if (!u) return [];
    return [
      { label: "Job seekers", value: u.jobSeekers || 0 },
      { label: "Recruiters", value: u.recruiters || 0 },
      { label: "Admins", value: u.admins || 0 },
    ];
  }, [a]);

  const byAppStatus = useMemo(() => {
    const m = a?.applications?.byStatus || {};
    return [
      { label: "Pending", value: m.pending || 0 },
      { label: "Reviewed", value: m.reviewed || 0 },
      { label: "Shortlisted", value: m.shortlisted || 0 },
      { label: "Rejected", value: m.rejected || 0 },
    ];
  }, [a]);

  const topJobs = Array.isArray(a?.jobsByApplications) ? a.jobsByApplications.slice(0, 6) : [];

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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="text-base font-bold text-slate-900">Users by role</h2>
          <p className="mt-1 text-xs text-slate-500">Breakdown of accounts across JobNest.</p>
          {loading ? <p className="mt-10 text-center text-sm text-slate-500">Loading…</p> : <DonutChart rows={byRole} />}
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="text-base font-bold text-slate-900">Application pipeline</h2>
          <p className="mt-1 text-xs text-slate-500">Share of applications by status.</p>
          {loading ? (
            <p className="mt-10 text-center text-sm text-slate-500">Loading…</p>
          ) : (
            <DonutChart rows={byAppStatus} />
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Top jobs by applications</h2>
            <p className="mt-1 text-xs text-slate-500">Highest application volume across the platform.</p>
          </div>
          <NavLink to="/admin/analytics" className="text-sm font-semibold text-indigo-700 hover:underline">
            View full analytics →
          </NavLink>
        </div>
        {loading ? (
          <p className="mt-8 text-center text-sm text-slate-500">Loading…</p>
        ) : topJobs.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topJobs.map((j) => (
              <div key={String(j.jobId || j.title)} className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4">
                <p className="truncate text-sm font-bold text-slate-900">{j.title || "—"}</p>
                <p className="truncate text-xs text-slate-500">{j.company || ""}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span className="badge badge-soft">Total: {j.applicationCount ?? 0}</span>
                  <span>Pending {j.pending ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-600">
            No applications yet.
          </div>
        )}
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
