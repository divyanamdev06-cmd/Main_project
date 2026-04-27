import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Briefcase, ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { apiGet, getApiErrorMessage } from "../lib/apiClient.js";
import { selectEffectiveRole } from "../store/authSlice.js";
import JobApplyActions from "./jobs/JobApplyActions.jsx";

const PAGE_SIZE = 9;

function buildBrowseParams({ q, categoryId, mode, type, experienceLevel, skills, page }) {
  const p = new URLSearchParams();
  if (q?.trim()) p.set("q", q.trim());
  if (categoryId) p.set("categoryId", categoryId);
  if (mode) p.set("mode", mode);
  if (type) p.set("type", type);
  if (experienceLevel) p.set("experienceLevel", experienceLevel);
  if (skills?.trim()) p.set("skills", skills.trim());
  p.set("page", String(page));
  p.set("limit", String(PAGE_SIZE));
  return p.toString();
}

export default function ExploreJobs() {
  const token = useSelector((s) => s.auth.token);
  const role = useSelector(selectEffectiveRole);

  const [qInput, setQInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mode, setMode] = useState("");
  const [type, setType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
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

  const queryString = useMemo(
    () =>
      buildBrowseParams({
        q: debouncedQ,
        categoryId,
        mode,
        type,
        experienceLevel,
        skills: skillsFilter,
        page,
      }),
    [debouncedQ, categoryId, mode, type, experienceLevel, skillsFilter, page]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await apiGet(`/job/browse?${queryString}`);
      const d = payload?.data;
      setJobs(Array.isArray(d?.jobs) ? d.jobs : []);
      setCategories(Array.isArray(d?.categories) ? d.categories : []);
      setTotal(typeof d?.total === "number" ? d.total : 0);
      setPageCount(typeof d?.pageCount === "number" ? d.pageCount : 0);
    } catch (err) {
      setJobs([]);
      setCategories([]);
      setTotal(0);
      setPageCount(0);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section
      id="browse-jobs"
      className="scroll-mt-24 border-t border-gray-100 bg-gray-50/80 py-12 sm:scroll-mt-28 sm:py-16"
    >
      <div className="container-app">
        <div className="text-center">
          <span className="badge badge-soft">Explore jobs</span>
          <h2 className="section-title mx-auto mt-4 max-w-2xl">Find roles that match you</h2>
          <p className="section-subtitle mx-auto mt-2 max-w-2xl">
            This is the same live board candidates see after sign-in: search, categories, work mode, seniority, and
            skill tags — powered by your JobNest API.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search title, company, location, skills, description…"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-black/5 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/60"
              aria-label="Search jobs"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-5xl flex-col gap-4 rounded-2xl border border-gray-200/90 bg-white/95 p-4 shadow-md shadow-gray-900/5 ring-1 ring-black/5 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Categories
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryId("");
                setPage(1);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                !categoryId
                  ? "border-amber-400 bg-[#F6C85F] text-gray-900 shadow-sm ring-1 ring-amber-300/50"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-200 hover:bg-amber-50/80"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => {
                  setCategoryId(String(c._id));
                  setPage(1);
                }}
                className={`max-w-[220px] truncate rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  categoryId === String(c._id)
                    ? "border-amber-400 bg-[#F6C85F] text-gray-900 shadow-sm ring-1 ring-amber-300/50"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-200 hover:bg-amber-50/80"
                }`}
                title={c.description || c.name}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
              Work mode
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900"
              >
                <option value="">Any</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
              Job type
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900"
              >
                <option value="">Any</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
              Experience
              <select
                value={experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900"
              >
                <option value="">Any</option>
                <option value="intern">Intern</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
                <option value="any">Unspecified</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
              Skills (comma = AND)
              <input
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                onBlur={() => setPage(1)}
                placeholder="e.g. React, Node"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900"
              />
            </label>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <p>
            {loading ? (
              <span>Loading…</span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{total}</span> open role{total === 1 ? "" : "s"} match
                your filters
              </>
            )}
          </p>
          {pageCount > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="tabular-nums text-xs font-semibold text-gray-500">
                Page {page} / {pageCount || 1}
              </span>
              <button
                type="button"
                disabled={page >= pageCount || loading}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <ul className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            jobs.map((job) => (
              <li key={job._id}>
                <article className="card flex h-full flex-col p-5 text-left transition hover:border-amber-200/80 hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-900 ring-1 ring-amber-100">
                        <Briefcase className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 font-bold text-gray-900">{job.title}</h3>
                        <p className="truncate text-sm font-medium text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <span className="badge badge-soft shrink-0">{job.type}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    {job.category?.name || "General"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {job.mode}
                    {job.experienceLevel ? ` · ${job.experienceLevel}` : ""}
                  </p>
                  {job.location ? (
                    <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                      <span className="line-clamp-1">{job.location}</span>
                    </p>
                  ) : null}
                  {job.salary ? <p className="mt-1 text-sm font-semibold text-gray-800">{job.salary}</p> : null}
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {job.summary || job.description || "Open role — create an account as a job seeker to apply in one click."}
                  </p>
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
                </article>
              </li>
            ))}
        </ul>

        {!loading && !error && jobs.length === 0 ? (
          <p className="mx-auto mt-10 max-w-lg text-center text-sm text-gray-500">
            No jobs match right now. Try clearing filters or run{" "}
            <code className="rounded bg-gray-100 px-1">npm run seed:jobs</code> in the API project for demo data.
          </p>
        ) : null}
      </div>
    </section>
  );
}
