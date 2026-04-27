import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Undo2,
  XCircle,
} from "lucide-react";
import { apiDelete, apiGet, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";

function statusStyle(status) {
  switch (status) {
    case "pending":
      return {
        chip: "border-amber-200 bg-amber-50 text-amber-950 ring-amber-100/80",
        icon: Clock,
        iconWrap: "bg-amber-100 text-amber-800",
      };
    case "reviewed":
      return {
        chip: "border-sky-200 bg-sky-50 text-sky-950 ring-sky-100/80",
        icon: EyeLine,
        iconWrap: "bg-sky-100 text-sky-800",
      };
    case "shortlisted":
      return {
        chip: "border-emerald-200 bg-emerald-50 text-emerald-950 ring-emerald-100/80",
        icon: CheckCircle2,
        iconWrap: "bg-emerald-100 text-emerald-800",
      };
    case "rejected":
      return {
        chip: "border-red-200 bg-red-50 text-red-900 ring-red-100/80",
        icon: XCircle,
        iconWrap: "bg-red-100 text-red-800",
      };
    default:
      return {
        chip: "border-gray-200 bg-gray-50 text-gray-800 ring-gray-100",
        icon: FileText,
        iconWrap: "bg-gray-100 text-gray-700",
      };
  }
}

/** Lucide doesn't export "EyeLine" — use FileText for reviewed or import Eye */
function EyeLine(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function statusHint(status) {
  switch (status) {
    case "pending":
      return "Waiting on the hiring team — you can still withdraw if you change your mind.";
    case "reviewed":
      return "They opened your application. Watch this space for the next update.";
    case "shortlisted":
      return "Strong match — they may reach out for interviews or next steps.";
    case "rejected":
      return "Not moving forward for this role. Keep exploring other openings.";
    default:
      return "";
  }
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function Applications() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await apiGet("/applications/me");
      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setRows([]);
      toast({ type: "error", title: "Could not load applications", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const shortlisted = rows.filter((r) => r.status === "shortlisted").length;
    const activePipeline = rows.filter((r) => r.status === "pending" || r.status === "reviewed" || r.status === "shortlisted").length;
    return { total, pending, shortlisted, activePipeline };
  }, [rows]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const payload = await apiGet("/applications/me");
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      toast({ type: "success", title: "Updated", message: "Your application list is up to date." });
    } catch (err) {
      toast({ type: "error", title: "Refresh failed", message: getApiErrorMessage(err) });
    } finally {
      setRefreshing(false);
    }
  };

  const withdraw = async (id) => {
    if (!window.confirm("Withdraw this application? You can apply again later if the job is still open.")) return;
    try {
      await apiDelete(`/applications/${id}/withdraw`);
      toast({
        type: "success",
        title: "Withdrawn",
        message: "Removed from the recruiter’s inbox. You can re-apply from the job card if you want.",
      });
      load();
    } catch (err) {
      toast({ type: "error", title: "Withdraw failed", message: getApiErrorMessage(err) });
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-teal-100/90 bg-linear-to-br from-teal-50/90 via-white to-emerald-50/40 p-6 shadow-sm ring-1 ring-teal-900/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-teal-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Application tracker
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">My applications</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Every role you applied to from JobNest lives here. Withdraw only while status is{" "}
              <span className="font-semibold text-slate-800">pending</span> — after that, the recruiter owns the next
              steps.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/user/findjobs"
                className="btn btn-primary inline-flex items-center gap-2 no-underline shadow-md shadow-teal-900/10"
              >
                <Search className="h-4 w-4" aria-hidden />
                Find more jobs
              </Link>
              <button
                type="button"
                onClick={refresh}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
                Refresh
              </button>
            </div>
          </div>

          {!loading && rows.length > 0 ? (
            <div className="grid w-full shrink-0 grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
              <StatPill label="Total" value={stats.total} tone="slate" />
              <StatPill label="In progress" value={stats.activePipeline} tone="teal" />
              <StatPill label="Shortlisted" value={stats.shortlisted} tone="emerald" />
            </div>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-900/5"
            >
              <div className="h-5 w-full max-w-md rounded bg-slate-200" />
              <div className="mt-3 h-4 w-40 rounded bg-slate-100" />
              <div className="mt-6 h-16 rounded-xl bg-slate-50" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
            <FileText className="h-8 w-8 text-slate-400" aria-hidden />
          </div>
          <h2 className="mt-6 text-lg font-bold text-slate-900">No applications yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            When you apply from job cards on the home page or from Find jobs, each submission will show up here with
            live status from recruiters.
          </p>
          <Link
            to="/user/findjobs"
            className="btn btn-primary mt-8 inline-flex items-center gap-2 no-underline"
          >
            Browse openings
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-5">
          {rows.map((app) => {
            const job = app.job;
            const title = job?.title || "Role";
            const company = job?.company || "—";
            const styles = statusStyle(app.status);
            const StatusIcon = styles.icon;
            const hint = statusHint(app.status);

            return (
              <li key={app._id}>
                <article className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:border-teal-200/80 hover:shadow-md">
                  <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 ring-1 ring-teal-200/60">
                          <Briefcase className="h-6 w-6" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">{title}</h2>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                              {company}
                            </span>
                            {job?.location ? (
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                {job.location}
                              </span>
                            ) : null}
                          </p>
                          {job?.category?.name ? (
                            <p className="mt-2 inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
                              <Tag className="h-3 w-3" aria-hidden />
                              {job.category.name}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:text-sm">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" aria-hidden />
                          Applied {formatDate(app.createdAt)}
                        </span>
                        {job?.type ? (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                            {job.type}
                            {job?.mode ? ` · ${job.mode}` : ""}
                          </span>
                        ) : null}
                      </div>

                      {app.message ? (
                        <blockquote className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700">
                          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Your note to the employer
                          </span>
                          {app.message}
                        </blockquote>
                      ) : null}

                      {hint ? <p className="mt-3 text-sm leading-relaxed text-slate-500">{hint}</p> : null}
                    </div>

                    <div className="flex w-full shrink-0 flex-col gap-3 border-t border-slate-100 pt-4 lg:w-52 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                      <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold capitalize shadow-sm ring-1 ${styles.chip}`}
                        >
                          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${styles.iconWrap}`}>
                            <StatusIcon className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          {app.status}
                        </span>
                      </div>

                      {app.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => withdraw(app._id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/90 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                        >
                          <Undo2 className="h-4 w-4" aria-hidden />
                          Withdraw application
                        </button>
                      ) : (
                        <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500 lg:text-left">
                          Status updates are controlled by the recruiter. Check back after interviews or email follow-ups
                          outside JobNest if needed.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatPill({ label, value, tone }) {
  const ring =
    tone === "teal"
      ? "from-teal-500/10 to-teal-600/5 ring-teal-200/70"
      : tone === "emerald"
        ? "from-emerald-500/10 to-emerald-600/5 ring-emerald-200/70"
        : "from-slate-400/10 to-slate-500/5 ring-slate-200/80";
  const labelColor =
    tone === "teal" ? "text-teal-700" : tone === "emerald" ? "text-emerald-800" : "text-slate-600";
  return (
    <div
      className={`rounded-2xl border border-white/80 bg-white/90 p-3 text-center shadow-sm ring-1 ring-slate-900/5 sm:p-4`}
    >
      <div className={`pointer-events-none mx-auto mb-2 h-1 w-10 rounded-full bg-linear-to-r ${ring}`} aria-hidden />
      <p className={`text-[10px] font-bold uppercase tracking-wide ${labelColor}`}>{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
