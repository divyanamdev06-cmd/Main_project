import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Briefcase, MapPin, Search } from "lucide-react";
import { apiGet, getApiErrorMessage } from "../../lib/apiClient.js";
import { selectEffectiveRole } from "../../store/authSlice.js";
import JobApplyActions from "../jobs/JobApplyActions.jsx";

const LIMIT = 12;

function buildParams({ q, page }) {
  const p = new URLSearchParams();
  if (q?.trim()) p.set("q", q.trim());
  p.set("page", String(page));
  p.set("limit", String(LIMIT));
  return p.toString();
}

export default function FindJobs() {
  const token = useSelector((s) => s.auth.token);
  const role = useSelector(selectEffectiveRole);

  const [qInput, setQInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(() => new Set());

  useEffect(() => {
    if (!token || role !== "job_seeker") {
      setAppliedJobIds(new Set());
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const payload = await apiGet("/applications/me");
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const next = new Set(
          list.map((a) => String(a.job?._id || a.job || "")).filter(Boolean)
        );
        if (!cancelled) setAppliedJobIds(next);
      } catch {
        if (!cancelled) setAppliedJobIds(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, role]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(qInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [qInput]);

  const qs = useMemo(() => buildParams({ q: debouncedQ, page }), [debouncedQ, page]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await apiGet(`/job/browse?${qs}`);
      const d = payload?.data;
      setJobs(Array.isArray(d?.jobs) ? d.jobs : []);
      setTotal(typeof d?.total === "number" ? d.total : 0);
      setPageCount(typeof d?.pageCount === "number" ? d.pageCount : 0);
    } catch (err) {
      setJobs([]);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="card mb-6 p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Find jobs</h1>
        <p className="section-subtitle mt-1">
          Search live openings. When you are signed in as a job seeker, you can apply directly from each card.
        </p>
        <div className="relative mt-4 max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search roles…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {error ? <div className="card mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
        <span>
          {loading ? "Loading…" : (
            <>
              {total} role{total === 1 ? "" : "s"} found
            </>
          )}
        </span>
        {pageCount > 1 ? (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-semibold hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pageCount || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-semibold hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!loading &&
          jobs.map((job) => (
            <div key={job._id} className="card flex flex-col p-5 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                    <Briefcase className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                    <p className="truncate text-sm font-medium text-gray-600">{job.company}</p>
                  </div>
                </div>
                <span className="badge badge-soft shrink-0">{job.type}</span>
              </div>

              <p className="mt-2 text-xs font-semibold text-teal-800">{job.category?.name}</p>

              <div className="mt-2 space-y-1 text-sm text-gray-500">
                {job.location ? (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {job.location}
                  </p>
                ) : null}
                {job.salary ? <p className="font-medium text-gray-700">{job.salary}</p> : null}
              </div>

              {job.summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm text-gray-600">{job.summary}</p> : null}

              <JobApplyActions
                job={job}
                appliedJobIds={appliedJobIds}
                onApplied={(id) =>
                  setAppliedJobIds((prev) => {
                    const n = new Set(prev);
                    n.add(id);
                    return n;
                  })
                }
              />
            </div>
          ))}
      </div>

      {!loading && jobs.length === 0 && !error ? (
        <div className="card p-8 text-center text-sm text-gray-500">No openings match your search.</div>
      ) : null}
    </div>
  );
}
