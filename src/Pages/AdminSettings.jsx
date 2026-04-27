import { useCallback, useEffect, useState } from "react";
import { Bell, Lock, Save, Shield, SlidersHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import AdminPageHeader from "../components/admin/AdminPageHeader.jsx";
import { apiGet, apiPut, getApiErrorMessage } from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { setCredentials } from "../store/authSlice.js";

const tabs = [
  { id: "profile", label: "Profile", icon: SlidersHorizontal },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "system", label: "System", icon: Shield },
];

export default function AdminSettings() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    bio: "",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const payload = await apiGet("/user/me");
      const u = payload?.data ?? payload;
      setForm((f) => ({
        ...f,
        name: u.name || "",
        email: u.email || "",
        mobile: u.mobile || "",
        bio: u.bio || "",
      }));
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const payload = await apiPut("/user/profile/complete", {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        bio: form.bio,
      });
      const updated = payload?.data ?? payload;
      toast({ type: "success", title: "Saved", message: payload?.message || "Profile updated." });
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
      await load();
    } catch (err) {
      toast({ type: "error", title: "Save failed", message: getApiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <AdminPageHeader
        title="Settings"
        description="Manage your administrator profile. Other sections are placeholders for future security and system controls."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="flex flex-col gap-1 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm ring-1 ring-slate-900/5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  tab === id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-9">
          {tab === "profile" && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">Profile</h2>
              <p className="mt-1 text-sm text-slate-600">Name and contact sync with your JobNest account.</p>

              {loading ? (
                <p className="mt-8 text-sm text-slate-500">Loading…</p>
              ) : (
                <div className="mt-6 space-y-5 max-w-xl">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</label>
                    <input type="email" value={form.email} readOnly className="input mt-1.5 cursor-not-allowed bg-slate-50 text-slate-600" />
                    <p className="mt-1 text-xs text-slate-500">Email changes require a future admin workflow.</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Mobile</label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="input mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={4}
                      className="input mt-1.5 min-h-[120px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5"
                  >
                    <Save className="h-4 w-4" aria-hidden />
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "security" && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
              <Lock className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
              <p className="mt-4 font-semibold text-slate-800">Security center</p>
              <p className="mt-2 text-sm text-slate-600">Password policies, 2FA, and session controls will appear here.</p>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
              <Bell className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
              <p className="mt-4 font-semibold text-slate-800">Notifications</p>
              <p className="mt-2 text-sm text-slate-600">Email and in-app alerts for admin events — coming soon.</p>
            </div>
          )}

          {tab === "system" && (
            <div className="rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/50 p-8 text-center">
              <Shield className="mx-auto h-10 w-10 text-amber-600" aria-hidden />
              <p className="mt-4 font-semibold text-slate-800">System</p>
              <p className="mt-2 text-sm text-slate-600">Maintenance mode and feature flags — connect to backend when ready.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
