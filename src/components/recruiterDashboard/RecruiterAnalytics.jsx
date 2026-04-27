import { useEffect, useMemo, useState } from "react";
import { BarChart3, Briefcase, ClipboardList, Layers, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";

function MetricCard({ title, value, subtitle, icon: Icon, loading }) {
  return (
    <div className="card p-5 transition hover:border-amber-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-gray-900">{loading ? "…" : value}</p>
          {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </div>
  );
}

export default function RecruiterAnalytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet("/analytics/recruiter");
        if (!cancelled) setData(res?.data || null);
      } catch (e) {
        if (!cancelled) {
          setData(null);
          toast({ type: "error", title: "Could not load analytics", message: getApiErrorMessage(e) });
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

  const funnel = useMemo(() => {
    const keys = ["pending", "reviewed", "shortlisted", "rejected"];
    return keys.map((key) => ({
      key,
      label: key,
      count: byStatus[key] || 0,
      pct: Math.round(((byStatus[key] || 0) / statusTotal) * 100),
    }));
  }, [byStatus, statusTotal]);

  const perJob = Array.isArray(data?.perJob) ? data.perJob : [];

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Hiring analytics</h1>
        <p className="section-subtitle mt-1 max-w-2xl">
          Track how many candidates applied to each of your roles, pipeline status, and recent volume — scoped only
          to your company&apos;s job posts.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link to="/recruiter/applications" className="font-semibold text-amber-800 hover:underline">
            Open applications inbox →
          </Link>
          <Link to="/recruiter/jobs" className="font-semibold text-amber-800 hover:underline">
            Manage job posts →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Your job posts"
          value={data?.jobs?.total ?? "—"}
          subtitle={`${data?.jobs?.activePublished ?? "—"} live (published + active)`}
          icon={Briefcase}
          loading={loading}
        />
        <MetricCard
          title="Applications received"
          value={data?.applications?.total ?? "—"}
          subtitle={`${data?.applications?.last7Days ?? "—"} last 7 days · ${data?.applications?.last30Days ?? "—"} last 30 days`}
          icon={ClipboardList}
          loading={loading}
        />
        <MetricCard
          title="Published vs draft"
          value={data?.jobs?.published ?? "—"}
          subtitle={`Draft ${data?.jobs?.draft ?? "—"} · Archived ${data?.jobs?.archived ?? "—"}`}
          icon={Layers}
          loading={loading}
        />
        <MetricCard
          title="Pipeline (pending)"
          value={byStatus.pending ?? "—"}
          subtitle="Awaiting your first decision"
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-gray-900">Your application mix</h2>
              <p className="mt-1 text-xs text-gray-500">How candidates are distributed across statuses.</p>
            </div>
            <BarChart3 className="h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          </div>
          {loading ? (
            <p className="mt-10 text-center text-sm text-gray-500">Loading…</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {funnel.map(({ key, label, count, pct }) => (
                <li key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-gray-700">{label}</span>
                    <span className="tabular-nums text-gray-600">
                      {count} <span className="text-gray-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-500 to-amber-700"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-900">What to do next</h2>
          <p className="mt-1 text-xs text-gray-500">Practical cues from your current numbers.</p>
          <ul className="mt-5 space-y-3 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {(byStatus.pending || 0) > 0
                ? `You have ${byStatus.pending} application(s) still pending — review them in the inbox to improve candidate experience.`
                : "No pending applications right now. Great time to refresh job descriptions or post a new role."}
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {(data?.jobs?.draft || 0) > 0
                ? `${data.jobs.draft} draft job(s) are not visible to candidates — publish when ready.`
                : "No drafts sitting idle."}
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {(data?.applications?.total || 0) === 0 && (data?.jobs?.activePublished || 0) > 0
                ? "Live jobs but no applications yet — consider widening location, salary band, or skills on the post."
                : (data?.applications?.total || 0) > 0
                  ? "Keep statuses up to date so candidates know where they stand."
                  : "Post a published job to start collecting applications here."}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Applications by your job</h2>
          <p className="mt-1 text-xs text-gray-500">Every role you own, sorted by application volume.</p>
        </div>
        <div className="max-h-[400px] overflow-auto">
          <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
            <thead className="sticky top-0 bg-gray-50/95 text-xs font-bold uppercase tracking-wide text-gray-500 backdrop-blur">
              <tr>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Pending</th>
                <th className="px-4 py-3 text-right">Shortlisted</th>
                <th className="px-4 py-3">Listing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : perJob.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No job posts yet. Create one under Job posts.
                  </td>
                </tr>
              ) : (
                perJob.map((row) => (
                  <tr key={String(row.jobId)} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{row.title}</div>
                      <div className="text-xs text-gray-500">{row.company}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-gray-900">{row.applicationCount}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-600">{row.pending}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-700">{row.shortlisted}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {row.isActive ? "Active" : "Inactive"} · {row.publicationStatus || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data?.generatedAt ? (
        <p className="mt-6 text-center text-xs text-gray-400">
          Last updated: {new Date(data.generatedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}
