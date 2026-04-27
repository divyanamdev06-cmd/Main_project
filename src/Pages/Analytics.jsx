import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardList,
  Layers,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import AdminPageHeader from "../components/admin/AdminPageHeader.jsx";
import { apiGet, getApiErrorMessage } from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";

function MetricCard({ title, value, subtitle, icon: Icon, loading }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">{loading ? "…" : value}</p>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </div>
  );
}

function formatShortDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function Analytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet("/analytics/admin");
        if (!cancelled) setData(res?.data || null);
      } catch (e) {
        if (!cancelled) {
          setData(null);
          toast({ type: "error", title: "Analytics unavailable", message: getApiErrorMessage(e) });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const byStatus = data?.applications?.byStatus || {};
  const statusTotal = useMemo(
    () => Object.values(byStatus).reduce((a, b) => a + (Number(b) || 0), 0) || 1,
    [byStatus]
  );

  const funnelBars = useMemo(() => {
    const order = [
      { key: "pending", label: "Pending" },
      { key: "reviewed", label: "Reviewed" },
      { key: "shortlisted", label: "Shortlisted" },
      { key: "rejected", label: "Rejected" },
    ];
    return order.map(({ key, label }) => ({
      key,
      label,
      count: byStatus[key] || 0,
      pct: Math.round(((byStatus[key] || 0) / statusTotal) * 100),
    }));
  }, [byStatus, statusTotal]);

  const jobsTable = Array.isArray(data?.jobsByApplications) ? data.jobsByApplications : [];

  return (
    <div className="w-full max-w-6xl">
      <AdminPageHeader
        title="Analytics"
        description="Live hiring metrics: applicants per job, recruiter activity, listings, and application pipeline across the platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Job seekers"
          value={data?.users?.jobSeekers ?? "—"}
          subtitle="Candidates (includes legacy “user” role)"
          icon={Users}
          loading={loading}
        />
        <MetricCard
          title="Recruiters registered"
          value={data?.users?.recruiters ?? "—"}
          subtitle={`${data?.recruiters?.postedAtLeastOneJob ?? "—"} have posted at least one job`}
          icon={Building2}
          loading={loading}
        />
        <MetricCard
          title="Total applications"
          value={data?.applications?.total ?? "—"}
          subtitle={`${data?.applications?.last7Days ?? "—"} in last 7 days · ${data?.applications?.last30Days ?? "—"} in 30 days`}
          icon={ClipboardList}
          loading={loading}
        />
        <MetricCard
          title="Jobs on platform"
          value={data?.jobs?.total ?? "—"}
          subtitle={`${data?.jobs?.activePublished ?? "—"} active & published · ${data?.jobs?.postedByRecruiters ?? "—"} owned by recruiters`}
          icon={Briefcase}
          loading={loading}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Listings with applicants"
          value={data?.jobs?.withApplications ?? "—"}
          subtitle={`${data?.jobs?.withNoApplications ?? "—"} jobs have zero applications yet`}
          icon={TrendingUp}
          loading={loading}
        />
        <MetricCard
          title="Published jobs"
          value={data?.jobs?.published ?? "—"}
          subtitle={`Draft ${data?.jobs?.draft ?? "—"} · Archived ${data?.jobs?.archived ?? "—"}`}
          icon={Layers}
          loading={loading}
        />
        <MetricCard
          title="Admins"
          value={data?.users?.admins ?? "—"}
          subtitle={`${data?.users?.activeAccounts ?? "—"} accounts marked active`}
          icon={UserCheck}
          loading={loading}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Application pipeline</h2>
              <p className="mt-1 text-xs text-slate-500">Share of applications by recruiter decision stage.</p>
            </div>
            <BarChart3 className="h-5 w-5 shrink-0 text-indigo-500" aria-hidden />
          </div>
          {loading ? (
            <p className="mt-10 text-center text-sm text-slate-500">Loading…</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {funnelBars.map(({ key, label, count, pct }) => (
                <li key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-slate-700">{label}</span>
                    <span className="tabular-nums text-slate-600">
                      {count} <span className="text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-600 to-teal-500 transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="text-base font-bold text-slate-900">Recruiter activity</h2>
          <p className="mt-1 text-xs text-slate-500">
            Registered hiring accounts versus those who have actually created a job post.
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="text-slate-600">Recruiters in directory</dt>
              <dd className="font-bold tabular-nums text-slate-900">{data?.users?.recruiters ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="text-slate-600">Posted at least one job</dt>
              <dd className="font-bold tabular-nums text-emerald-700">{data?.recruiters?.postedAtLeastOneJob ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="text-slate-600">Registered but no jobs yet</dt>
              <dd className="font-bold tabular-nums text-amber-800">{data?.recruiters?.idle ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">Total job posts by recruiters</dt>
              <dd className="font-bold tabular-nums text-slate-900">{data?.jobs?.postedByRecruiters ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Applicants per job</h2>
          <p className="mt-1 text-xs text-slate-500">
            Jobs attracting the most applications (up to 80 rows). Use this to spot hot roles and gaps.
          </p>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="sticky top-0 bg-slate-50/95 text-xs font-bold uppercase tracking-wide text-slate-500 backdrop-blur">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Job</th>
                <th className="whitespace-nowrap px-4 py-3">Recruiter</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Apps</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Pend.</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Short.</th>
                <th className="whitespace-nowrap px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : jobsTable.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No application data yet.
                  </td>
                </tr>
              ) : (
                jobsTable.map((row) => (
                  <tr key={String(row.jobId)} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{row.title || "—"}</div>
                      <div className="text-xs text-slate-500">{row.company || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="max-w-[200px] truncate font-medium">{row.recruiterName || "—"}</div>
                      <div className="max-w-[200px] truncate text-xs text-slate-500">{row.recruiterEmail || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900">{row.applicationCount}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{row.pending}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-700">{row.shortlisted}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {row.isActive ? "Active" : "Inactive"} · {row.publicationStatus || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200/90 bg-linear-to-br from-slate-50 to-indigo-50/40 p-6 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-base font-bold text-slate-900">Latest applications</h2>
        <p className="mt-1 text-xs text-slate-500">Most recent submissions platform-wide.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {loading ? (
            <li className="col-span-2 py-6 text-center text-sm text-slate-500">Loading…</li>
          ) : !(data?.recentApplications?.length > 0) ? (
            <li className="col-span-2 py-6 text-center text-sm text-slate-500">No applications yet.</li>
          ) : (
            data.recentApplications.map((ev) => (
              <li
                key={String(ev.id)}
                className="flex flex-col gap-1 rounded-xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-900">{ev.applicantName}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold capitalize text-slate-700">
                    {ev.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {ev.jobTitle}
                  {ev.company ? ` · ${ev.company}` : ""}
                </p>
                <p className="text-xs text-slate-400">{formatShortDate(ev.createdAt)}</p>
              </li>
            ))
          )}
        </ul>
        {data?.generatedAt ? (
          <p className="mt-4 text-center text-xs text-slate-400">Snapshot: {formatShortDate(data.generatedAt)}</p>
        ) : null}
      </div>
    </div>
  );
}
