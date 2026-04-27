import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  apiDelete,
  apiGet,
  apiPostMultipart,
  apiPut,
  downloadAuthenticatedBlob,
  getApiErrorMessage,
} from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";
import { setCredentials } from "../../store/authSlice.js";
import {
  Building2,
  GraduationCap,
  Loader2,
  FileText,
  Plus,
  Trash2,
  User,
  Download,
  Briefcase,
} from "lucide-react";

const emptyEdu = () => ({
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  description: "",
});

const emptyWork = () => ({
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

function TabButton({ active, onClick, children, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
        active
          ? "bg-teal-600 text-white shadow-md shadow-teal-900/15"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden /> : null}
      {children}
    </button>
  );
}

export default function UserProfile() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const authRole = useSelector((s) => s.auth.user?.role);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [tab, setTab] = useState("account");

  const [role, setRole] = useState("");

  const [account, setAccount] = useState({
    name: "",
    email: "",
    mobile: "",
    headline: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    skills: "",
    bio: "",
    companyName: "",
    companyWebsite: "",
    companyIndustry: "",
    companySize: "",
    companyDescription: "",
  });

  const [education, setEducation] = useState([emptyEdu()]);
  const [workExperience, setWorkExperience] = useState([emptyWork()]);
  const [resumeMeta, setResumeMeta] = useState(null);

  const normalizedRole = useMemo(() => {
    if (!role) return authRole === "user" ? "job_seeker" : authRole || "";
    return role === "user" ? "job_seeker" : role;
  }, [role, authRole]);

  const tabs = useMemo(() => {
    if (normalizedRole === "admin") {
      return [{ id: "account", label: "Account", icon: User }];
    }
    if (normalizedRole === "recruiter") {
      return [
        { id: "account", label: "Account", icon: User },
        { id: "company", label: "Company", icon: Building2 },
      ];
    }
    return [
      { id: "account", label: "Account", icon: User },
      { id: "experience", label: "Experience", icon: Briefcase },
      { id: "education", label: "Education", icon: GraduationCap },
      { id: "resume", label: "Resume", icon: FileText },
    ];
  }, [normalizedRole]);

  useEffect(() => {
    const ids = tabs.map((t) => t.id);
    if (!ids.includes(tab)) setTab(ids[0]);
  }, [tabs, tab]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const payload = await apiGet("/user/me");
      const u = payload?.data ?? payload;
      setRole(u.role || "");

      setAccount({
        name: u.name || "",
        email: u.email || "",
        mobile: u.mobile || "",
        headline: u.headline || "",
        street: u.address?.street || "",
        city: u.address?.city || "",
        state: u.address?.state || "",
        pincode: u.address?.pincode || "",
        country: u.address?.country || "India",
        skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
        bio: u.bio || "",
        companyName: u.companyName || "",
        companyWebsite: u.companyWebsite || "",
        companyIndustry: u.companyIndustry || "",
        companySize: u.companySize || "",
        companyDescription: u.companyDescription || "",
      });

      const edu = Array.isArray(u.education) && u.education.length ? u.education : [emptyEdu()];
      setEducation(
        edu.map((e) => ({
          institution: e.institution || "",
          degree: e.degree || "",
          field: e.field || "",
          startYear: e.startYear != null ? String(e.startYear) : "",
          endYear: e.endYear != null ? String(e.endYear) : "",
          description: e.description || "",
        }))
      );

      const wx = Array.isArray(u.workExperience) && u.workExperience.length ? u.workExperience : [emptyWork()];
      setWorkExperience(
        wx.map((w) => ({
          company: w.company || "",
          title: w.title || "",
          location: w.location || "",
          startDate: w.startDate || "",
          endDate: w.endDate || "",
          current: Boolean(w.current),
          description: w.description || "",
        }))
      );

      setResumeMeta(u.resume || null);
    } catch (err) {
      toast({
        type: "error",
        title: "Could not load profile",
        message: getApiErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const persistAuthUser = (updated) => {
    try {
      const raw = localStorage.getItem("jobnest_auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && updated) {
          dispatch(setCredentials({ token: parsed.token, user: updated }));
        }
      }
    } catch {
      /* ignore */
    }
  };

  const buildProfilePayload = () => {
    const body = {
      name: account.name.trim(),
      mobile: account.mobile.trim(),
      headline: account.headline.trim(),
      street: account.street.trim(),
      city: account.city.trim(),
      state: account.state.trim(),
      pincode: account.pincode.trim(),
      country: account.country.trim() || "India",
      bio: account.bio,
      skills: account.skills,
    };

    if (normalizedRole === "recruiter") {
      body.companyName = account.companyName.trim();
      body.companyWebsite = account.companyWebsite.trim();
      body.companyIndustry = account.companyIndustry.trim();
      body.companySize = account.companySize.trim();
      body.companyDescription = account.companyDescription;
    }

    if (normalizedRole === "job_seeker") {
      const yearOrUndef = (y) => {
        if (y === "" || y == null) return undefined;
        const n = Number(y);
        return Number.isFinite(n) ? n : undefined;
      };
      const eduPayload = education
        .filter((e) => e.institution.trim() || e.degree.trim())
        .map((e) => ({
          ...e,
          startYear: yearOrUndef(e.startYear),
          endYear: yearOrUndef(e.endYear),
        }));
      const workPayload = workExperience.filter((w) => w.company.trim() || w.title.trim());
      body.education = eduPayload;
      body.workExperience = workPayload;
    }

    return body;
  };

  const handleSaveProfile = async () => {
    if (!account.name.trim()) {
      toast({ type: "error", title: "Name required", message: "Please enter your full name." });
      return;
    }
    try {
      setSaving(true);
      const payload = await apiPut("/user/profile/complete", buildProfilePayload());
      const updated = payload?.data ?? payload;
      toast({
        type: "success",
        title: "Profile saved",
        message: payload?.message || "Your details were updated.",
      });
      await load();
      persistAuthUser(updated);
    } catch (err) {
      toast({
        type: "error",
        title: "Save failed",
        message: getApiErrorMessage(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ type: "error", title: "Invalid file", message: "Please upload a PDF resume." });
      return;
    }
    try {
      setUploadingResume(true);
      const fd = new FormData();
      fd.append("resume", file);
      const payload = await apiPostMultipart("/user/profile/resume", fd);
      const updated = payload?.data ?? payload;
      toast({ type: "success", title: "Resume uploaded", message: payload?.message || "Saved." });
      await load();
      persistAuthUser(updated);
    } catch (err) {
      toast({
        type: "error",
        title: "Upload failed",
        message: getApiErrorMessage(err),
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeDownload = async () => {
    try {
      const { blob, filename } = await downloadAuthenticatedBlob("/user/profile/resume", "resume.pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        type: "error",
        title: "Download failed",
        message: getApiErrorMessage(err),
      });
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm("Remove your uploaded resume from JobNest?")) return;
    try {
      const payload = await apiDelete("/user/profile/resume");
      const updated = payload?.data ?? payload;
      toast({ type: "success", title: "Resume removed", message: payload?.message || "Done." });
      await load();
      persistAuthUser(updated);
    } catch (err) {
      toast({
        type: "error",
        title: "Could not remove resume",
        message: getApiErrorMessage(err),
      });
    }
  };

  const acctChange = (e) => {
    setAccount((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-slate-600 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden />
        <span className="ml-3 font-medium">Loading your profile…</span>
      </div>
    );
  }

  const initial = (account.name || "U").charAt(0).toUpperCase();
  const roleLabel =
    normalizedRole === "job_seeker"
      ? "Job seeker"
      : normalizedRole === "recruiter"
        ? "Recruiter"
        : normalizedRole === "admin"
          ? "Administrator"
          : "Member";

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden border-slate-200/80 p-0 shadow-md ring-1 ring-slate-900/5">
        <div className="bg-linear-to-r from-teal-700 via-teal-600 to-teal-800 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-extrabold ring-2 ring-white/30 backdrop-blur">
                {initial}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100/90">Profile</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{account.name || "Your name"}</h1>
                <p className="mt-1 text-sm text-teal-100/95">{account.email}</p>
                {account.headline ? (
                  <p className="mt-2 max-w-xl text-sm text-white/90">{account.headline}</p>
                ) : null}
                <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200 ring-1 ring-white/20">
                  {roleLabel}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn btn-primary self-start px-6 py-3 text-base shadow-lg shadow-teal-950/25 md:self-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} icon={t.icon}>
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {tab === "account" && (
            <div className="grid max-w-3xl gap-5 md:grid-cols-2">
              <Field label="Full name" name="name" value={account.name} onChange={acctChange} />
              <Field
                label="Email"
                name="email"
                value={account.email}
                onChange={() => {}}
                readOnly
                hint="Contact support to change email."
              />
              <Field label="Mobile" name="mobile" value={account.mobile} onChange={acctChange} />
              <Field label="Headline" name="headline" value={account.headline} onChange={acctChange} placeholder="e.g. Full-stack developer · 3 yrs exp" />
              <Field label="Street" name="street" value={account.street} onChange={acctChange} className="md:col-span-2" />
              <Field label="City" name="city" value={account.city} onChange={acctChange} />
              <Field label="State" name="state" value={account.state} onChange={acctChange} />
              <Field label="Pincode" name="pincode" value={account.pincode} onChange={acctChange} />
              <Field label="Country" name="country" value={account.country} onChange={acctChange} />
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</label>
                <input
                  name="skills"
                  value={account.skills}
                  onChange={acctChange}
                  className="input mt-1.5"
                  placeholder="Comma separated, e.g. React, Node.js, MongoDB"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</label>
                <textarea
                  name="bio"
                  value={account.bio}
                  onChange={acctChange}
                  rows={4}
                  className="input mt-1.5 min-h-[120px]"
                  placeholder="Short introduction about you or your hiring focus."
                />
              </div>
            </div>
          )}

          {tab === "company" && normalizedRole === "recruiter" && (
            <div className="grid max-w-3xl gap-5 md:grid-cols-2">
              <Field label="Company name" name="companyName" value={account.companyName} onChange={acctChange} className="md:col-span-2" />
              <Field label="Website" name="companyWebsite" value={account.companyWebsite} onChange={acctChange} placeholder="https://" />
              <Field label="Industry" name="companyIndustry" value={account.companyIndustry} onChange={acctChange} />
              <Field label="Company size" name="companySize" value={account.companySize} onChange={acctChange} className="md:col-span-2" />
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company description</label>
                <textarea
                  name="companyDescription"
                  value={account.companyDescription}
                  onChange={acctChange}
                  rows={5}
                  className="input mt-1.5 min-h-[140px]"
                  placeholder="What candidates should know about your organization."
                />
              </div>
            </div>
          )}

          {tab === "education" && normalizedRole === "job_seeker" && (
            <div className="space-y-4">
              {education.map((row, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm ring-1 ring-slate-900/5"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Education {idx + 1}</span>
                    {education.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setEducation((rows) => rows.filter((_, i) => i !== idx))}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldSmall
                      label="Institution"
                      value={row.institution}
                      onChange={(v) =>
                        setEducation((rows) => rows.map((r, i) => (i === idx ? { ...r, institution: v } : r)))
                      }
                    />
                    <FieldSmall
                      label="Degree"
                      value={row.degree}
                      onChange={(v) => setEducation((rows) => rows.map((r, i) => (i === idx ? { ...r, degree: v } : r)))}
                    />
                    <FieldSmall
                      label="Field of study"
                      value={row.field}
                      onChange={(v) => setEducation((rows) => rows.map((r, i) => (i === idx ? { ...r, field: v } : r)))}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FieldSmall
                        label="Start year"
                        value={row.startYear}
                        onChange={(v) => setEducation((rows) => rows.map((r, i) => (i === idx ? { ...r, startYear: v } : r)))}
                      />
                      <FieldSmall
                        label="End year"
                        value={row.endYear}
                        onChange={(v) => setEducation((rows) => rows.map((r, i) => (i === idx ? { ...r, endYear: v } : r)))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500">Details</label>
                      <textarea
                        value={row.description}
                        onChange={(e) =>
                          setEducation((rows) => rows.map((r, i) => (i === idx ? { ...r, description: e.target.value } : r)))
                        }
                        rows={2}
                        className="input mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEducation((rows) => [...rows, emptyEdu()])}
                className="btn btn-outline w-full border-dashed py-3 sm:w-auto"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add education
              </button>
            </div>
          )}

          {tab === "experience" && normalizedRole === "job_seeker" && (
            <div className="space-y-4">
              {workExperience.map((row, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Role {idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <input
                          type="checkbox"
                          checked={row.current}
                          onChange={(e) =>
                            setWorkExperience((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, current: e.target.checked, endDate: e.target.checked ? "" : r.endDate } : r))
                            )
                          }
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        I currently work here
                      </label>
                      {workExperience.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => setWorkExperience((rows) => rows.filter((_, i) => i !== idx))}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldSmall
                      label="Company"
                      value={row.company}
                      onChange={(v) =>
                        setWorkExperience((rows) => rows.map((r, i) => (i === idx ? { ...r, company: v } : r)))
                      }
                    />
                    <FieldSmall
                      label="Title"
                      value={row.title}
                      onChange={(v) =>
                        setWorkExperience((rows) => rows.map((r, i) => (i === idx ? { ...r, title: v } : r)))
                      }
                    />
                    <FieldSmall
                      label="Location"
                      value={row.location}
                      onChange={(v) =>
                        setWorkExperience((rows) => rows.map((r, i) => (i === idx ? { ...r, location: v } : r)))
                      }
                    />
                    <FieldSmall
                      label="Start (YYYY-MM)"
                      value={row.startDate}
                      onChange={(v) =>
                        setWorkExperience((rows) => rows.map((r, i) => (i === idx ? { ...r, startDate: v } : r)))
                      }
                    />
                    {!row.current ? (
                      <FieldSmall
                        label="End (YYYY-MM)"
                        value={row.endDate}
                        onChange={(v) =>
                          setWorkExperience((rows) => rows.map((r, i) => (i === idx ? { ...r, endDate: v } : r)))
                        }
                        className="sm:col-span-2"
                      />
                    ) : null}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500">Description</label>
                      <textarea
                        value={row.description}
                        onChange={(e) =>
                          setWorkExperience((rows) =>
                            rows.map((r, i) => (i === idx ? { ...r, description: e.target.value } : r))
                          )
                        }
                        rows={3}
                        className="input mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setWorkExperience((rows) => [...rows, emptyWork()])}
                className="btn btn-outline w-full border-dashed py-3 sm:w-auto"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add experience
              </button>
            </div>
          )}

          {tab === "resume" && normalizedRole === "job_seeker" && (
            <div className="max-w-xl space-y-4">
              <p className="text-sm text-slate-600">
                Upload a PDF resume (max 5MB). You can replace it anytime; the previous file is removed automatically.
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                {resumeMeta?.hasFile ? (
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-900">Current file</p>
                    <p className="text-sm text-slate-600">
                      {resumeMeta.originalName || "resume.pdf"}
                      {resumeMeta.uploadedAt ? (
                        <span className="block text-xs text-slate-500">
                          Uploaded {new Date(resumeMeta.uploadedAt).toLocaleString()}
                        </span>
                      ) : null}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={handleResumeDownload} className="btn btn-outline">
                        <Download className="h-4 w-4" aria-hidden />
                        Download
                      </button>
                      <button type="button" onClick={handleResumeDelete} className="btn btn-outline text-red-700 ring-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">No resume uploaded yet.</p>
                )}
                <div className="mt-4">
                  <label className="btn btn-primary cursor-pointer">
                    {uploadingResume ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" aria-hidden />
                        {resumeMeta?.hasFile ? "Replace PDF" : "Upload PDF"}
                      </>
                    )}
                    <input type="file" accept="application/pdf" className="hidden" disabled={uploadingResume} onChange={handleResumeUpload} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, readOnly, hint, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`input mt-1.5 ${readOnly ? "cursor-not-allowed bg-slate-50 text-slate-600" : ""}`}
      />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function FieldSmall({ label, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input mt-1.5" />
    </div>
  );
}
