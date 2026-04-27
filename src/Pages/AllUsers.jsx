import { useCallback, useEffect, useMemo, useState } from "react";
import { Briefcase, Search, Shield, UserCircle, Users } from "lucide-react";
import AdminPageHeader from "../components/admin/AdminPageHeader.jsx";
import Modal from "../components/ui/Modal.jsx";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPut,
  extractList,
  getApiErrorMessage,
} from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";

function readAuthUserId() {
  try {
    const raw = localStorage.getItem("jobnest_auth");
    if (!raw) return null;
    const j = JSON.parse(raw);
    const u = j?.user;
    if (!u) return null;
    return u._id ?? u.id ?? null;
  } catch {
    return null;
  }
}

function roleLabel(role) {
  const r = role === "user" ? "job_seeker" : role;
  if (r === "recruiter") return "Recruiter";
  if (r === "admin") return "Admin";
  return "Job seeker";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatAddress(addr) {
  if (!addr || typeof addr !== "object") return "—";
  const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-2 space-y-1.5 text-sm text-slate-800">{children}</div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <span className="shrink-0 text-slate-500 sm:w-36">{label}</span>
      <span className="min-w-0 wrap-break-word font-medium text-slate-900">{value ?? "—"}</span>
    </div>
  );
}

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [authUserId, setAuthUserId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [panelTab, setPanelTab] = useState("details");
  const [selectedId, setSelectedId] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "job_seeker",
    status: "Active",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setAuthUserId(readAuthUserId());
  }, []);

  const fetchUsers = useCallback(async () => {
    setListLoading(true);
    try {
      const payload = await apiGet("/user/getalluser");
      setUsers(extractList(payload, ["data", "users"]));
    } catch (err) {
      setUsers([]);
      toast({
        type: "error",
        title: "Failed to load users",
        message: getApiErrorMessage(err),
      });
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const r = u.role === "user" ? "job_seeker" : u.role;
      if (roleFilter !== "all" && r !== roleFilter) return false;
      if (!q) return true;
      const hay = [
        u.name,
        u.email,
        u.mobile,
        u.companyName,
        u.headline,
        Array.isArray(u.skills) ? u.skills.join(" ") : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [users, roleFilter, search]);

  const openForUser = useCallback(
    async (row) => {
      const id = row?._id;
      if (!id) return;
      setSelectedId(String(id));
      setDetailUser(row);
      setPanelTab("details");
      setEditForm({
        name: row.name || "",
        email: row.email || "",
        mobile: row.mobile || "",
        role: row.role === "user" ? "job_seeker" : row.role || "job_seeker",
        status: row.status === "Inactive" ? "Inactive" : "Active",
        password: "",
      });
      setModalOpen(true);
      setDetailLoading(true);
      try {
        const payload = await apiGet(`/user/admin/detail/${id}`);
        const fresh = payload?.data;
        if (fresh && typeof fresh === "object") {
          setDetailUser(fresh);
          setEditForm((prev) => ({
            ...prev,
            name: fresh.name || "",
            email: fresh.email || "",
            mobile: fresh.mobile || "",
            role: fresh.role === "user" ? "job_seeker" : fresh.role || "job_seeker",
            status: fresh.status === "Inactive" ? "Inactive" : "Active",
            password: "",
          }));
        }
      } catch (err) {
        toast({
          type: "error",
          title: "Could not refresh user",
          message: getApiErrorMessage(err),
        });
      } finally {
        setDetailLoading(false);
      }
    },
    [toast]
  );

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
    setDetailUser(null);
    setPanelTab("details");
    setDetailLoading(false);
  };

  const isSelf = detailUser && authUserId && String(detailUser._id) === String(authUserId);

  const mergeUserInList = (updated) => {
    if (!updated?._id) return;
    setUsers((prev) => prev.map((u) => (String(u._id) === String(updated._id) ? { ...u, ...updated } : u)));
  };

  const handleSaveEdit = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const body = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        mobile: editForm.mobile.trim(),
        role: editForm.role,
        status: editForm.status,
      };
      if (editForm.password.trim()) {
        body.password = editForm.password.trim();
      }
      const payload = await apiPut(`/user/update/${selectedId}`, body);
      const updated = payload?.data;
      if (updated) {
        setDetailUser(updated);
        mergeUserInList(updated);
      }
      toast({ type: "success", title: "Saved", message: "User was updated." });
      setPanelTab("details");
      setEditForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      toast({
        type: "error",
        title: "Update failed",
        message: getApiErrorMessage(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (nextActive) => {
    if (!selectedId || isSelf) return;
    setStatusBusy(true);
    try {
      const payload = await apiPatch(`/user/status/${selectedId}`, {
        status: nextActive ? "active" : "inactive",
      });
      const updated = payload?.data;
      if (updated) {
        setDetailUser(updated);
        mergeUserInList(updated);
        setEditForm((f) => ({
          ...f,
          status: updated.status === "Inactive" ? "Inactive" : "Active",
        }));
      }
      toast({
        type: "success",
        title: "Status updated",
        message: `Account is now ${nextActive ? "active" : "inactive"}.`,
      });
    } catch (err) {
      toast({
        type: "error",
        title: "Status failed",
        message: getApiErrorMessage(err),
      });
    } finally {
      setStatusBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || isSelf) return;
    if (!window.confirm("Delete this user permanently? This cannot be undone.")) return;
    setDeleteBusy(true);
    try {
      await apiDelete(`/user/delete/${selectedId}`);
      setUsers((prev) => prev.filter((u) => String(u._id) !== String(selectedId)));
      toast({ type: "success", title: "Deleted", message: "User was removed." });
      closeModal();
    } catch (err) {
      toast({
        type: "error",
        title: "Delete failed",
        message: getApiErrorMessage(err),
      });
    } finally {
      setDeleteBusy(false);
    }
  };

  const filterPills = [
    { id: "all", label: "All", Icon: Users },
    { id: "job_seeker", label: "Job seekers", Icon: UserCircle },
    { id: "recruiter", label: "Recruiters", Icon: Briefcase },
    { id: "admin", label: "Admins", Icon: Shield },
  ];

  return (
    <div className="w-full max-w-6xl">
      <AdminPageHeader
        title="All users"
        description="Job seekers, recruiters, and admins — inspect profiles, edit accounts, and control access."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchUsers()}
              disabled={listLoading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Refresh
            </button>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-center shadow-sm sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">Showing</p>
              <p className="text-2xl font-extrabold tabular-nums text-slate-900">
                {filteredUsers.length}
                <span className="text-sm font-semibold text-slate-500"> / {users.length}</span>
              </p>
            </div>
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterPills.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRoleFilter(id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === id
                  ? "border-indigo-300 bg-indigo-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company, skills…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-indigo-500/20 focus:border-indigo-300 focus:ring-2"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-linear-to-r from-indigo-50/90 via-white to-violet-50/50 px-4 py-3 sm:px-5">
          <Users className="h-4 w-4 text-indigo-600" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-wide text-slate-600">User directory</span>
        </div>
        <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[720px] w-full border-collapse text-left text-sm sm:min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                {["Name", "Email", "Contact", "Role", "Company", "Status", ""].map((h) => (
                  <th
                    key={h || "act"}
                    className="whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600 sm:px-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {listLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    Loading users…
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const rid = user._id || user.email;
                  const r = user.role === "user" ? "job_seeker" : user.role;
                  return (
                    <tr key={rid} className="transition hover:bg-indigo-50/40">
                      <td className="whitespace-nowrap px-3 py-3.5 font-semibold text-slate-900 sm:px-4">
                        {user.name}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3.5 text-slate-600 sm:max-w-none sm:whitespace-nowrap sm:px-4">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-slate-600 sm:px-4">
                        {user.mobile || "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-slate-700 sm:px-4">{roleLabel(user.role)}</td>
                      <td className="max-w-[160px] truncate px-3 py-3.5 text-slate-600 sm:max-w-[220px] sm:px-4">
                        {r === "recruiter" && user.companyName ? user.companyName : "—"}
                      </td>
                      <td className="px-3 py-3.5 sm:px-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            user.status === "Active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {user.status || "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 sm:px-4">
                        <button
                          type="button"
                          onClick={() => openForUser(user)}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                        >
                          View & manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!listLoading && filteredUsers.length === 0 && (
          <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">No users match</p>
            <p className="mt-1 text-xs text-slate-500">Try another role filter or search term.</p>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        size="xl"
        title={detailUser?.name ? `${detailUser.name}` : "User"}
        footer={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPanelTab("details")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  panelTab === "details" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setPanelTab("edit")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  panelTab === "edit" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                Edit account
              </button>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {!isSelf ? (
                <>
                  <button
                    type="button"
                    disabled={statusBusy || !detailUser}
                    onClick={() => handleQuickStatus(!(detailUser?.status === "Active"))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {detailUser?.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    disabled={deleteBusy}
                    onClick={handleDelete}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete user
                  </button>
                </>
              ) : (
                <span className="text-xs text-slate-500">You cannot delete or deactivate your own account here.</span>
              )}
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        {detailLoading && (
          <p className="mb-3 text-xs font-medium text-indigo-600">Refreshing latest profile from server…</p>
        )}

        {panelTab === "details" && detailUser && (
          <div className="space-y-4">
            <Section title="Account">
              <Row label="Email" value={detailUser.email} />
              <Row label="Mobile" value={detailUser.mobile} />
              <Row label="Role" value={roleLabel(detailUser.role)} />
              <Row label="Status" value={detailUser.status} />
              <Row
                label="Email verified"
                value={detailUser.isEmailVerified ? "Yes" : "No"}
              />
              <Row label="Member since" value={formatDate(detailUser.createdAt)} />
            </Section>

            <Section title="Profile">
              <Row label="Headline" value={detailUser.headline} />
              <Row label="Bio" value={detailUser.bio} />
              <Row
                label="Skills"
                value={Array.isArray(detailUser.skills) ? detailUser.skills.join(", ") : "—"}
              />
              <Row
                label="Interests"
                value={Array.isArray(detailUser.interests) ? detailUser.interests.join(", ") : "—"}
              />
              <Row label="Gender" value={detailUser.gender} />
              <Row label="Date of birth" value={formatDate(detailUser.dob)} />
            </Section>

            <Section title="Address">
              <Row label="Location" value={formatAddress(detailUser.address)} />
            </Section>

            {(detailUser.role === "recruiter" || detailUser.companyName) && (
              <Section title="Company (recruiter)">
                <Row label="Name" value={detailUser.companyName} />
                <Row label="Website" value={detailUser.companyWebsite} />
                <Row label="Industry" value={detailUser.companyIndustry} />
                <Row label="Size" value={detailUser.companySize} />
                <Row label="Description" value={detailUser.companyDescription} />
              </Section>
            )}

            <Section title="Education">
              {Array.isArray(detailUser.education) && detailUser.education.length > 0 ? (
                <ul className="list-inside list-disc space-y-2 text-slate-800">
                  {detailUser.education.map((e) => (
                    <li key={e._id || `${e.institution}-${e.degree}`}>
                      <span className="font-medium">{e.degree || "—"}</span>
                      {e.institution ? ` · ${e.institution}` : ""}
                      {e.field ? ` (${e.field})` : ""}
                      {(e.startYear || e.endYear) && (
                        <span className="text-slate-500">
                          {" "}
                          · {e.startYear ?? "?"}–{e.endYear ?? "?"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No entries</p>
              )}
            </Section>

            <Section title="Work experience">
              {Array.isArray(detailUser.workExperience) && detailUser.workExperience.length > 0 ? (
                <ul className="space-y-3">
                  {detailUser.workExperience.map((w) => (
                    <li
                      key={w._id || `${w.company}-${w.title}`}
                      className="rounded-lg border border-slate-100 bg-white/80 p-3"
                    >
                      <div className="font-semibold text-slate-900">{w.title || "—"}</div>
                      <div className="text-slate-600">
                        {w.company}
                        {w.location ? ` · ${w.location}` : ""}
                      </div>
                      <div className="text-xs text-slate-500">
                        {w.startDate || "?"} — {w.current ? "Present" : w.endDate || "?"}
                      </div>
                      {w.description ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{w.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No entries</p>
              )}
            </Section>

            <Section title="Resume">
              {detailUser.resume?.hasFile ? (
                <>
                  <Row label="File" value="On file (path hidden)" />
                  <Row label="Original name" value={detailUser.resume.originalName} />
                  <Row label="Uploaded" value={formatDate(detailUser.resume.uploadedAt)} />
                </>
              ) : (
                <p className="text-slate-500">No resume uploaded</p>
              )}
            </Section>
          </div>
        )}

        {panelTab === "edit" && detailUser && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Changes apply immediately. Leave password blank to keep the current one.
            </p>
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mobile
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={editForm.mobile}
                onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Role
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="job_seeker">Job seeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
                <option value="user">User (legacy)</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Account status
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={editForm.status}
                disabled={isSelf}
                onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            {isSelf ? (
              <p className="text-xs text-amber-700">You cannot set your own account to inactive here.</p>
            ) : null}
            <label className="block text-sm font-medium text-slate-700">
              New password (optional)
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={editForm.password}
                onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPanelTab("details")}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveEdit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
