import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Download, ExternalLink, FileText, User } from "lucide-react";
import { apiGet, apiPatch, downloadAuthenticatedBlob, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";
import Modal from "../ui/Modal.jsx";

const STATUS_OPTIONS = [
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function formatShortDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

function addressLine(addr) {
  if (!addr || typeof addr !== "object") return null;
  const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export default function RecruiterApplications() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [profileModal, setProfileModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [resumeBusy, setResumeBusy] = useState(false);
  const [cardResumeId, setCardResumeId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await apiGet("/applications/inbox");
      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setRows([]);
      toast({ type: "error", title: "Could not load inbox", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await apiPatch(`/applications/${applicationId}/status`, { status });
      toast({ type: "success", title: "Updated", message: "Application status saved." });
      await load();
    } catch (err) {
      toast({ type: "error", title: "Update failed", message: getApiErrorMessage(err) });
    } finally {
      setUpdatingId(null);
    }
  };

  const closeProfileModal = () => {
    setProfileModal(null);
    setProfile(null);
    setProfileLoading(false);
  };

  const openProfileModal = async (app) => {
    setProfileModal({ appId: app._id, name: app.applicant?.name || "Candidate" });
    setProfileLoading(true);
    setProfile(null);
    try {
      const payload = await apiGet(`/applications/${app._id}/applicant-profile`);
      setProfile(payload?.data || null);
    } catch (err) {
      toast({ type: "error", title: "Profile unavailable", message: getApiErrorMessage(err) });
      closeProfileModal();
      return;
    } finally {
      setProfileLoading(false);
    }
  };

  const resumeUrlForApp = (applicationId) => `/applications/${applicationId}/applicant-resume`;

  const handleResumeDownload = async (applicationId) => {
    setResumeBusy(true);
    try {
      const { blob, filename } = await downloadAuthenticatedBlob(resumeUrlForApp(applicationId), "resume.pdf");
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 2000);
      toast({ type: "success", title: "Download started", message: filename });
    } catch (err) {
      toast({ type: "error", title: "Could not download resume", message: getApiErrorMessage(err) });
    } finally {
      setResumeBusy(false);
    }
  };

  const handleResumeView = async (applicationId) => {
    setResumeBusy(true);
    try {
      const { blob } = await downloadAuthenticatedBlob(resumeUrlForApp(applicationId), "resume.pdf");
      const href = URL.createObjectURL(blob);
      window.open(href, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(href), 120000);
    } catch (err) {
      toast({ type: "error", title: "Could not open resume", message: getApiErrorMessage(err) });
    } finally {
      setResumeBusy(false);
    }
  };

  const handleCardResumeAction = async (applicationId, mode) => {
    setCardResumeId(applicationId);
    try {
      if (mode === "view") await handleResumeView(applicationId);
      else await handleResumeDownload(applicationId);
    } finally {
      setCardResumeId(null);
    }
  };

  const modalResumeDisabled = profileLoading || !profile?.resume?.hasFile || resumeBusy;
  const modalAppId = profileModal?.appId;

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Applications inbox</h1>
        <p className="section-subtitle mt-1 max-w-2xl">
          Candidates who applied to your job posts appear here. Mark applications as reviewed, shortlisted, or
          rejected. Open a profile to see full details and view or download the resume when available.
        </p>
        <Link
          to="/recruiter/jobs"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"
        >
          <Briefcase className="h-4 w-4" aria-hidden />
          Back to job posts
        </Link>
      </div>

      <Modal
        open={!!profileModal}
        onClose={closeProfileModal}
        title={profileModal ? `Applicant — ${profileModal.name}` : ""}
        size="xl"
        footer={
          <div className="flex w-full flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => modalAppId && handleResumeView(modalAppId)}
              disabled={modalResumeDisabled || !modalAppId}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View resume
            </button>
            <button
              type="button"
              onClick={() => modalAppId && handleResumeDownload(modalAppId)}
              disabled={modalResumeDisabled || !modalAppId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download resume
            </button>
            <button
              type="button"
              onClick={closeProfileModal}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        }
      >
        {profileLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading profile…</div>
        ) : profile ? (
          <div className="space-y-6 text-sm text-gray-800">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Contact</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <p>
                  <span className="text-gray-500">Name</span>
                  <br />
                  <span className="font-semibold">{profile.name || "—"}</span>
                </p>
                <p>
                  <span className="text-gray-500">Email</span>
                  <br />
                  <span className="break-all font-medium">{profile.email || "—"}</span>
                </p>
                {profile.mobile ? (
                  <p>
                    <span className="text-gray-500">Mobile</span>
                    <br />
                    <span className="font-medium">{profile.mobile}</span>
                  </p>
                ) : null}
                {profile.headline ? (
                  <p className="sm:col-span-2">
                    <span className="text-gray-500">Headline</span>
                    <br />
                    <span className="font-medium text-gray-900">{profile.headline}</span>
                  </p>
                ) : null}
              </div>
            </section>

            {profile.bio ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Bio</h3>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">{profile.bio}</p>
              </section>
            ) : null}

            {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Skills</h3>
                <p className="mt-2 text-gray-700">{profile.skills.join(", ")}</p>
              </section>
            ) : null}

            {Array.isArray(profile.interests) && profile.interests.length > 0 ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Interests</h3>
                <p className="mt-2 text-gray-700">{profile.interests.join(", ")}</p>
              </section>
            ) : null}

            {profile.dob || profile.gender ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Other</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-gray-700">
                  {profile.dob ? <span>DOB: {formatShortDate(profile.dob)}</span> : null}
                  {profile.gender ? <span className="capitalize">Gender: {profile.gender}</span> : null}
                </div>
              </section>
            ) : null}

            {addressLine(profile.address) ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Address</h3>
                <p className="mt-2 text-gray-700">{addressLine(profile.address)}</p>
              </section>
            ) : null}

            {Array.isArray(profile.education) && profile.education.length > 0 ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Education</h3>
                <ul className="mt-2 space-y-3">
                  {profile.education.map((e) => (
                    <li key={e._id || `${e.institution}-${e.degree}`} className="rounded-lg border border-gray-100 bg-gray-50/80 p-3">
                      <p className="font-semibold text-gray-900">
                        {[e.degree, e.field].filter(Boolean).join(" · ") || "Education"}
                      </p>
                      {e.institution ? <p className="text-gray-600">{e.institution}</p> : null}
                      {(e.startYear || e.endYear) && (
                        <p className="text-xs text-gray-500">
                          {e.startYear || "—"} — {e.endYear || "—"}
                        </p>
                      )}
                      {e.description ? <p className="mt-1 text-gray-700">{e.description}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {Array.isArray(profile.workExperience) && profile.workExperience.length > 0 ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Experience</h3>
                <ul className="mt-2 space-y-3">
                  {profile.workExperience.map((w) => (
                    <li key={w._id || `${w.company}-${w.title}`} className="rounded-lg border border-gray-100 bg-gray-50/80 p-3">
                      <p className="font-semibold text-gray-900">{w.title || "Role"}</p>
                      {w.company ? <p className="text-gray-600">{w.company}</p> : null}
                      {(w.startDate || w.endDate || w.current) && (
                        <p className="text-xs text-gray-500">
                          {w.startDate || "—"} — {w.current ? "Present" : w.endDate || "—"}
                          {w.location ? ` · ${w.location}` : ""}
                        </p>
                      )}
                      {w.description ? <p className="mt-1 text-gray-700">{w.description}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Resume</h3>
              {profile.resume?.hasFile ? (
                <p className="mt-2 text-gray-700">
                  <FileText className="mr-1 inline h-4 w-4 text-indigo-600" aria-hidden />
                  {profile.resume.originalName || "Uploaded file"}
                  {profile.resume.uploadedAt ? (
                    <span className="ml-2 text-xs text-gray-500">({formatShortDate(profile.resume.uploadedAt)})</span>
                  ) : null}
                </p>
              ) : (
                <p className="mt-2 text-gray-500">No resume uploaded for this candidate.</p>
              )}
            </section>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">No profile data.</p>
        )}
      </Modal>

      {loading ? (
        <div className="card p-10 text-center text-sm text-gray-500">Loading applications…</div>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-sm text-gray-600">
          No applications yet. Publish an active job and share it with candidates.
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((app) => {
            const job = app.job;
            const person = app.applicant;
            const busy = updatingId === app._id;
            const cardBusy = cardResumeId === app._id;
            return (
              <li key={app._id} className="card p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Role</p>
                    <h2 className="text-lg font-bold text-gray-900">{job?.title || "—"}</h2>
                    <p className="text-sm text-gray-600">{job?.company}</p>
                    {job?.category?.name ? (
                      <p className="mt-1 text-xs font-medium text-indigo-700">{job.category.name}</p>
                    ) : null}
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-indigo-700 ring-1 ring-gray-200">
                        <User className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="font-semibold text-gray-900">{person?.name || "Candidate"}</p>
                        <p className="truncate text-gray-600">{person?.email}</p>
                        {person?.headline ? <p className="mt-1 text-gray-700">{person.headline}</p> : null}
                        {Array.isArray(person?.skills) && person.skills.length > 0 ? (
                          <p className="mt-2 text-xs text-gray-500">
                            Skills: {person.skills.slice(0, 8).join(", ")}
                            {person.skills.length > 8 ? "…" : ""}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openProfileModal(app)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                          >
                            View full profile
                          </button>
                          <button
                            type="button"
                            disabled={cardBusy}
                            onClick={() => handleCardResumeAction(app._id, "view")}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            View resume
                          </button>
                          <button
                            type="button"
                            disabled={cardBusy}
                            onClick={() => handleCardResumeAction(app._id, "download")}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden />
                            Download resume
                          </button>
                        </div>
                      </div>
                    </div>
                    {app.message ? (
                      <blockquote className="mt-3 border-l-4 border-amber-300 pl-3 text-sm italic text-gray-700">
                        {app.message}
                      </blockquote>
                    ) : null}
                    <p className="mt-3 text-xs text-gray-400">Received {formatDate(app.createdAt)}</p>
                  </div>
                  <div className="flex w-full flex-col gap-2 border-t border-gray-100 pt-4 lg:w-56 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Status</p>
                    <span className="mb-1 inline-flex w-fit rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-bold capitalize text-gray-800">
                      {app.status}
                    </span>
                    <label className="text-xs font-medium text-gray-600">
                      Update
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm font-medium disabled:opacity-50"
                        disabled={busy}
                        value={app.status === "pending" ? "" : app.status}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v) setStatus(app._id, v);
                        }}
                      >
                        {app.status === "pending" ? <option value="">Set first decision…</option> : null}
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {busy ? <p className="text-xs text-gray-400">Saving…</p> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
