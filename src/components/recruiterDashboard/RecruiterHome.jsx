import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { BarChart2, Briefcase, Building2, FileText, Tags } from "lucide-react";
import { apiGet, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";

export default function RecruiterHome() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const payload = await apiGet("/user/dashboard/recruiter-summary");
        setData(payload?.data ?? payload);
      } catch (err) {
        toast({
          type: "error",
          title: "Recruiter dashboard failed",
          message: getApiErrorMessage(err),
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [toast]);

  const k = data?.kpis;
  const series = data?.chart?.applicationsLast14Days || [];
  const byCategory = data?.chart?.applicationsByCategory || [];
  const byLocation = data?.chart?.applicationsByLocation || [];
  const topJobs = data?.chart?.topJobsByApplications || [];

  const max = useMemo(() => {
    const m = Math.max(0, ...series.map((x) => x.count || 0));
    return m || 1;
  }, [series]);

  const total14 = series.reduce((a, b) => a + (b.count || 0), 0);
  const peak = useMemo(() => {
    let best = { date: "", count: 0 };
    for (const p of series) {
      if ((p.count || 0) > (best.count || 0)) best = p;
    }
    return best;
  }, [series]);

  const status = k?.applicationsByStatus || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to JobNest</h1>
        <p className="section-subtitle mt-2 max-w-2xl">
          Post roles, manage listings, and reach candidates — same yellow accent and cards as the rest of the app.
        </p>
      </div>

      {loading ? (
        <div className="card p-6 text-gray-600">Loading recruiter analytics…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard title="Jobs posted" value={k?.jobsTotal ?? 0} hint={`${k?.jobsPublished ?? 0} published`} />
            <KpiCard title="Active jobs" value={k?.jobsActive ?? 0} hint="Currently visible" />
            <KpiCard title="Applications" value={k?.applicationsTotal ?? 0} hint={`${status.pending ?? 0} pending`} />
            <KpiCard title="Shortlisted" value={status.shortlisted ?? 0} hint="Strong candidates" />
            <KpiCard title="Reviewed" value={status.reviewed ?? 0} hint="Processed in pipeline" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DonutCard title="Applications by category" subtitle="Which job types attract candidates">
              <DonutChart rows={byCategory} />
            </DonutCard>
            <DonutCard title="Applications by location" subtitle="Where applicants are coming from">
              <DonutChart rows={byLocation} />
            </DonutCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Applications (last 14 days)</h3>
                  <p className="text-sm text-gray-600">Demand trend across your job posts</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="badge badge-soft">Total: {total14}</span>
                  <span className="badge border-gray-200 bg-white text-gray-700">
                    Peak: {peak?.count ?? 0} on {String(peak?.date || "").slice(8)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {series.length ? (
                  <div className="grid h-48 grid-cols-14 items-end gap-1.5 sm:h-56 sm:gap-2">
                    {series.map((p) => {
                      const h = Math.round(((p.count || 0) / max) * 100);
                      const isPeak = (p.count || 0) === (peak?.count || 0) && (p.count || 0) > 0;
                      return (
                        <div key={p.date} className="flex h-full flex-col items-center gap-2">
                          <div className="flex h-full w-full items-end">
                            <div
                              className={`w-full rounded-xl ring-1 transition ${
                                isPeak
                                  ? "bg-[#F6C85F] ring-amber-300 shadow-sm"
                                  : "bg-amber-100 ring-amber-200/70 hover:bg-[#F6C85F]"
                              }`}
                              style={{ height: `${Math.max(6, h)}%` }}
                              title={`${p.date}: ${p.count}`}
                            />
                          </div>
                          <span className="hidden text-[10px] font-semibold text-gray-400 sm:block">
                            {String(p.date).slice(8)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6 text-center text-gray-600">
                    No applications yet — share your job links to start receiving candidates.
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900">Top jobs</h3>
              <p className="text-sm text-gray-600">Most applied roles</p>
              <div className="mt-5 space-y-3">
                {topJobs.length ? (
                  topJobs.map((j) => (
                    <div key={j.jobId} className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">{j.title || "Untitled job"}</p>
                          <p className="truncate text-xs text-gray-500">
                            {j.company || "Company"} • {j.location || "Location"}
                          </p>
                        </div>
                        <span className="badge badge-soft">{j.applicationCount}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600">
                        <span>Pending: {j.pending ?? 0}</span>
                        <span>Reviewed: {j.reviewed ?? 0}</span>
                        <span>Shortlisted: {j.shortlisted ?? 0}</span>
                        <span>Rejected: {j.rejected ?? 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6 text-center text-gray-600">
                    No data yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <NavLink
          to="/recruiter/analytics"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <BarChart2 size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Analytics</h2>
            <p className="mt-1 text-sm text-gray-600">Applicants per job, pipeline, and trends for your posts.</p>
          </div>
        </NavLink>

        <NavLink
          to="/recruiter/jobs"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <Briefcase size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Job posts</h2>
            <p className="mt-1 text-sm text-gray-600">Create and update openings (JWT required on API).</p>
          </div>
        </NavLink>

        <NavLink
          to="/recruiter/applications"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <FileText size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Applications</h2>
            <p className="mt-1 text-sm text-gray-600">Review candidates who applied to your job posts.</p>
          </div>
        </NavLink>

        <NavLink
          to="/recruiter/categories"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <Tags size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Categories</h2>
            <p className="mt-1 text-sm text-gray-600">Browse active taxonomy — admins maintain the list.</p>
          </div>
        </NavLink>

        <NavLink
          to="/recruiter/profile"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <Building2 size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Company profile</h2>
            <p className="mt-1 text-sm text-gray-600">Keep contact details and company name up to date.</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

function KpiCard({ title, value, hint }) {
  return (
    <div className="card relative overflow-hidden p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-50 blur-2xl"
      />
      <div className="relative">
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">{value}</p>
        <p className="mt-2 text-xs font-semibold text-gray-500">{hint}</p>
        <div className="mt-3 h-1.5 w-16 rounded-full bg-yellow-200" />
      </div>
    </div>
  );
}

function DonutCard({ title, subtitle, children }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <span className="badge badge-soft">Insight</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

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
      label: String(r.label || r._id || "Unknown"),
      value: Number(r.count ?? r.value ?? 0),
      color: palette[i % palette.length],
    }))
    .filter((r) => r.value > 0);

  const total = normalized.reduce((sum, r) => sum + r.value, 0);
  if (!total) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6 text-center text-gray-600">
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
          className="relative h-44 w-44 rounded-full ring-1 ring-gray-200 shadow-sm"
          style={{ background: `conic-gradient(${stops})` }}
          aria-label="Donut chart"
        >
          <div className="absolute inset-5 rounded-full bg-white ring-1 ring-gray-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</div>
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums">{total}</div>
            </div>
          </div>
        </div>
      </div>

      <ul className="grid gap-2">
        {normalized.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <li key={s.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: s.color }} />
                <span className="truncate text-sm font-semibold text-gray-800">{s.label}</span>
              </div>
              <div className="shrink-0 text-sm font-semibold text-gray-700 tabular-nums">
                {s.value} <span className="text-gray-400">({pct}%)</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
