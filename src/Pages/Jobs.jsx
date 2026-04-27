import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Briefcase,
  Filter,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ToggleLeft,
  Trash2,
  User,
} from "lucide-react";
import AdminPageHeader from "../components/admin/AdminPageHeader.jsx";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  extractList,
  getApiErrorMessage,
} from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import Modal from "../components/ui/Modal.jsx";

const emptyForm = () => ({
  title: "",
  company: "",
  location: "",
  salary: "",
  type: "Full-time",
  mode: "On-site",
  category: "",
  description: "",
  summary: "",
  publicationStatus: "published",
  experienceLevel: "any",
  department: "",
  openings: "1",
  requirementsText: "",
  benefitsText: "",
  skillsText: "",
  applicationDeadline: "",
  externalApplyUrl: "",
});

function jobToForm(job) {
  const base = emptyForm();
  if (!job) return base;
  const catId = job.category?._id ?? job.category ?? "";
  return {
    ...base,
    title: job.title ?? "",
    company: job.company ?? "",
    location: job.location ?? "",
    salary: job.salary ?? "",
    type: job.type ?? "Full-time",
    mode: job.mode ?? "On-site",
    category: catId ? String(catId) : "",
    description: job.description ?? "",
    summary: job.summary ?? "",
    publicationStatus: job.publicationStatus ?? "published",
    experienceLevel: job.experienceLevel ?? "any",
    department: job.department ?? "",
    openings: String(job.openings ?? 1),
    requirementsText: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
    benefitsText: Array.isArray(job.benefits) ? job.benefits.join("\n") : "",
    skillsText: Array.isArray(job.skills) ? job.skills.join("\n") : "",
    applicationDeadline: job.applicationDeadline
      ? String(job.applicationDeadline).slice(0, 10)
      : "",
    externalApplyUrl: job.externalApplyUrl ?? "",
  };
}

function formToPayload(form) {
  return {
    title: form.title.trim(),
    company: form.company.trim(),
    location: form.location.trim(),
    salary: form.salary.trim(),
    type: form.type,
    mode: form.mode,
    category: form.category,
    description: form.description,
    summary: form.summary.trim(),
    publicationStatus: form.publicationStatus,
    experienceLevel: form.experienceLevel,
    department: form.department.trim(),
    openings: Number(form.openings) || 1,
    requirements: form.requirementsText,
    benefits: form.benefitsText,
    skills: form.skillsText,
    applicationDeadline: form.applicationDeadline || null,
    externalApplyUrl: form.externalApplyUrl.trim(),
  };
}

export default function Jobs() {
  const { toast } = useToast();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    publication: "",
    categoryId: "",
    mode: "",
    type: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (filters.status) params.set("status", filters.status);
    if (filters.publication) params.set("publicationStatus", filters.publication);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.type) params.set("type", filters.type);
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [debouncedSearch, filters]);

  const fetchJobs = useCallback(async () => {
    setListLoading(true);
    try {
      const payload = await apiGet(`/job/get${queryString}`);
      setJobs(extractList(payload, ["data", "jobs"]));
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      setJobs([]);
      toast({ type: "error", title: "Could not load jobs", message: msg });
    } finally {
      setListLoading(false);
    }
  }, [queryString, toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const payload = await apiGet(`/category/get`);
      setCategories(extractList(payload, ["data", "categories"]));
    } catch (err) {
      setCategories([]);
      toast({
        type: "error",
        title: "Could not load categories",
        message: getApiErrorMessage(err),
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditJob(null);
    setForm(emptyForm());
    setError("");
    setOpen(true);
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setForm(jobToForm(job));
    setError("");
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!form.title.trim() || !form.company.trim()) {
        setError("Title and company are required.");
        return;
      }
      if (!form.category) {
        setError("Please select a category.");
        return;
      }

      const body = formToPayload(form);

      if (editJob) {
        const payload = await apiPut(`/job/updateJob/${editJob._id}`, body);
        toast({
          type: "success",
          title: "Job updated",
          message: payload?.message || "Saved.",
        });
      } else {
        const payload = await apiPost(`/job/create`, body);
        toast({
          type: "success",
          title: "Job created",
          message: payload?.message || "Created.",
        });
      }

      setOpen(false);
      setEditJob(null);
      setForm(emptyForm());
      setError("");
      fetchJobs();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Save failed", message: msg });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job permanently?")) return;
    try {
      const payload = await apiDelete(`/job/${id}`);
      toast({
        type: "success",
        title: "Job deleted",
        message: payload?.message || "Removed.",
      });
      fetchJobs();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Delete failed", message: msg });
    }
  };

  const handleToggle = async (id) => {
    try {
      const payload = await apiPatch(`/job/toggle/${id}`);
      toast({
        type: "success",
        title: "Listing visibility",
        message: payload?.message || "Updated.",
      });
      fetchJobs();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Toggle failed", message: msg });
    }
  };

  const publicationBadge = (p) => {
    const v = p || "published";
    if (v === "draft") return "border-amber-200 bg-amber-50 text-amber-900";
    if (v === "archived") return "border-slate-300 bg-slate-100 text-slate-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  };

  return (
    <div className="w-full max-w-6xl">
      <AdminPageHeader
        title={isAdmin ? "Jobs" : "Your job posts"}
        description={
          isAdmin
            ? "Full catalog: drafts, published roles, and inactive listings. Recruiters only see their own posts in their dashboard."
            : "Create and maintain your listings. Job seekers only see posts that are active, published, and under an active category."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchJobs();
                fetchCategories();
              }}
              disabled={listLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${listLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-900/10"
            >
              <Plus className="h-4 w-4" />
              New job
            </button>
          </div>
        }
      />

      {!isAdmin ? (
        <p className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-950">
          Listings must be <strong>published</strong> and <strong>active</strong> to appear on the public job feed. Use{" "}
          <em>Draft</em> while you are still writing the post.
        </p>
      ) : null}

      <div className="mb-5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Filter className="h-3.5 w-3.5" aria-hidden />
          Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search title, company, location…"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none ring-indigo-500/15 focus:border-indigo-300 focus:ring-2"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Visibility (all)</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
          <select
            value={filters.publication}
            onChange={(e) => handleFilterChange("publication", e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Publication (all)</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange("categoryId", e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.mode}
            onChange={(e) => handleFilterChange("mode", e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Work mode (all)</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
            <option value="Flexible">Flexible</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Job type (all)</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      ) : null}

      {listLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          Loading jobs…
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 py-16 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
          <p className="mt-4 font-semibold text-slate-800">No jobs match</p>
          <p className="mt-1 text-sm text-slate-600">
            Adjust filters or create a new listing. Ensure categories exist (admin).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={job._id}
              className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                    <Briefcase className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-slate-900">{job.title}</h2>
                    <p className="truncate text-sm font-medium text-slate-600">{job.company}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${publicationBadge(
                      job.publicationStatus
                    )}`}
                  >
                    {job.publicationStatus || "published"}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      job.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {isAdmin && job.createdBy ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="h-3 w-3 shrink-0" aria-hidden />
                  <span className="truncate">
                    Posted by{" "}
                    <span className="font-semibold text-slate-700">
                      {job.createdBy.companyName || job.createdBy.name || job.createdBy.email || "User"}
                    </span>
                  </span>
                </p>
              ) : null}

              <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                {job.location ? (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                    {job.location}
                  </p>
                ) : null}
                {job.salary ? <p className="font-medium text-slate-700">{job.salary}</p> : null}
                <p className="text-xs text-slate-500">
                  {job.type} · {job.mode}
                </p>
                <p className="text-xs text-slate-500">
                  Category:{" "}
                  <span className="font-semibold text-slate-700">{job.category?.name || "—"}</span>
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleEdit(job)}
                  className="btn btn-outline min-w-20 flex-1 gap-1 py-2 text-sm"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(job._id)}
                  className="inline-flex min-w-20 flex-1 items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/80 py-2 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100"
                >
                  <ToggleLeft className="h-3.5 w-3.5" aria-hidden />
                  Toggle active
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(job._id)}
                  className="inline-flex min-w-20 flex-1 items-center justify-center gap-1 rounded-xl border border-red-200 bg-white py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditJob(null);
        }}
        size="lg"
        title={editJob ? "Edit job" : "New job"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEditJob(null);
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} className="btn btn-primary">
              Save
            </button>
          </>
        }
      >
        {error ? <p className="mb-3 text-sm font-medium text-red-700">{error}</p> : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Title
            <input name="title" value={form.title} onChange={handleChange} className="input mt-1" />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Company
            <input name="company" value={form.company} onChange={handleChange} className="input mt-1" />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Location
            <input name="location" value={form.location} onChange={handleChange} className="input mt-1" />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Salary / comp
            <input name="salary" value={form.salary} onChange={handleChange} className="input mt-1" />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Department
            <input name="department" value={form.department} onChange={handleChange} className="input mt-1" />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Openings
            <input
              name="openings"
              type="number"
              min={1}
              value={form.openings}
              onChange={handleChange}
              className="input mt-1"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Type
            <select name="type" value={form.type} onChange={handleChange} className="input mt-1">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Work mode
            <select name="mode" value={form.mode} onChange={handleChange} className="input mt-1">
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Flexible</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Category
            <select name="category" value={form.category} onChange={handleChange} className="input mt-1 w-full">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                  {cat.isActive === false ? " (inactive)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Publication
            <select
              name="publicationStatus"
              value={form.publicationStatus}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Experience
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="any">Any</option>
              <option value="intern">Intern</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Apply-by date
            <input name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} className="input mt-1" />
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            External apply URL (optional)
            <input
              name="externalApplyUrl"
              value={form.externalApplyUrl}
              onChange={handleChange}
              className="input mt-1"
              placeholder="https://…"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Short summary (card / SEO)
            <textarea name="summary" value={form.summary} onChange={handleChange} className="input mt-1 min-h-[72px]" maxLength={500} />
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Full description
            <textarea name="description" value={form.description} onChange={handleChange} className="input mt-1 min-h-[120px]" />
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Requirements (one per line)
            <textarea
              name="requirementsText"
              value={form.requirementsText}
              onChange={handleChange}
              className="input mt-1 min-h-[88px]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Benefits (one per line)
            <textarea name="benefitsText" value={form.benefitsText} onChange={handleChange} className="input mt-1 min-h-[72px]" />
          </label>
          <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
            Skills / tags (one per line)
            <textarea name="skillsText" value={form.skillsText} onChange={handleChange} className="input mt-1 min-h-[72px]" />
          </label>
        </div>
      </Modal>
    </div>
  );
}
