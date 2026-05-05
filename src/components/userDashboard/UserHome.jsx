import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiGet, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";

export function UserHome() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activePoint, setActivePoint] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const payload = await apiGet("/user/dashboard/summary");
        setData(payload?.data ?? payload);
      } catch (err) {
        toast({
          type: "error",
          title: "Dashboard failed to load",
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

  const max = useMemo(() => {
    const m = Math.max(0, ...series.map((x) => x.count || 0));
    return m || 1;
  }, [series]);

  const status = k?.applicationsByStatus || {};
  const hasData = series.some((p) => (p.count || 0) > 0);
  const total14 = series.reduce((a, b) => a + (b.count || 0), 0);
  const peak = useMemo(() => {
    let best = { date: "", count: 0 };
    for (const p of series) {
      if ((p.count || 0) > (best.count || 0)) best = p;
    }
    return best;
  }, [series]);

  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#F6C85F]/30 blur-3xl"
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-gray-500">Welcome back</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Student Dashboard
            </h2>
            <p className="section-subtitle mt-1">
              Track applications, keep your profile ready, and explore new roles.
            </p>
          </div>

          <div className="flex gap-2">
            <NavLink to="/user/findjobs" className="btn btn-primary">
              Find Jobs
            </NavLink>
            <NavLink to="/user/profile" className="btn btn-outline">
              Update Profile
            </NavLink>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 text-gray-600">Loading your KPIs…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Applications"
              value={k?.applicationsTotal ?? 0}
              hint={`${status.pending ?? 0} pending • ${status.reviewed ?? 0} reviewed`}
            />
            <KpiCard
              title="Shortlisted"
              value={status.shortlisted ?? 0}
              hint={status.shortlisted ? "Keep going" : "Apply to more roles"}
            />
            <KpiCard
              title="Jobs open"
              value={k?.jobsOpen ?? 0}
              hint={`${k?.categoriesCount ?? 0} categories`}
            />
            <KpiCard
              title="Profile"
              value={`${k?.profileCompletionPercent ?? 0}%`}
              hint={(k?.profileCompletionPercent ?? 0) >= 80 ? "Strong profile" : "Improve visibility"}
              tone={(k?.profileCompletionPercent ?? 0) >= 80 ? "good" : "warn"}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DonutCard title="Applications by category" subtitle="Where you’re applying most">
              <DonutChart rows={byCategory} />
            </DonutCard>
            <DonutCard title="Applications by location" subtitle="Cities/regions trend">
              <DonutChart rows={byLocation} />
            </DonutCard>
          </div>

          <div className="card p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Applications (last 14 days)</h3>
                <p className="text-sm text-gray-600">Daily activity trend</p>
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
                <div className="relative">
                  {activePoint ? (
                    <div className="absolute -top-11 left-0 right-0 mx-auto w-fit rounded-xl border border-amber-200/70 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm ring-1 ring-black/5">
                      {activePoint.date}:{" "}
                      <span className="font-extrabold text-gray-900">{activePoint.count}</span>
                    </div>
                  ) : null}

                  <div className="grid h-48 grid-cols-14 items-end gap-1.5 sm:h-56 sm:gap-2">
                    {series.map((p) => {
                      const h = Math.round(((p.count || 0) / max) * 100);
                      const isPeak = (p.count || 0) === (peak?.count || 0) && (p.count || 0) > 0;
                      const dim = !hasData ? false : (p.count || 0) === 0;
                      return (
                        <div
                          key={p.date}
                          className="group flex h-full flex-col items-center gap-2"
                          onMouseEnter={() => setActivePoint(p)}
                          onMouseLeave={() => setActivePoint(null)}
                        >
                          <div className="flex h-full w-full items-end">
                            <div
                              className={`w-full rounded-xl ring-1 transition ${
                                isPeak
                                  ? "bg-[#F6C85F] ring-amber-300 shadow-sm"
                                  : dim
                                    ? "bg-gray-100 ring-gray-200/70"
                                    : "bg-amber-100 ring-amber-200/70 group-hover:bg-[#F6C85F]"
                              }`}
                              style={{ height: `${Math.max(6, h)}%` }}
                              aria-label={`${p.date}: ${p.count} applications`}
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
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6 text-center text-gray-600">
                  No activity yet. Apply to your first job to see the graph.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card p-5">
      <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
        {value}
      </p>
      <div className="mt-3 h-1.5 w-16 rounded-full bg-yellow-200" />
    </div>
  );
}

function KpiCard({ title, value, hint, tone = "base" }) {
  const accent =
    tone === "good"
      ? "bg-emerald-200"
      : tone === "warn"
        ? "bg-amber-200"
        : "bg-yellow-200";
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
        <div className={`mt-3 h-1.5 w-16 rounded-full ${accent}`} />
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
        No data yet. Apply to jobs to populate this chart.
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