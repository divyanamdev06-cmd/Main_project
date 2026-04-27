import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { apiGet, apiPut, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";
import { setCredentials } from "../../store/authSlice.js";

export default function UserProfile() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    skills: "",
    bio: "",
    companyName: "",
    role: "",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const payload = await apiGet("/user/me");
      const u = payload?.data ?? payload;
      setUser({
        name: u.name || "",
        email: u.email || "",
        mobile: u.mobile || "",
        city: u.address?.city || "",
        state: u.address?.state || "",
        pincode: u.address?.pincode || "",
        skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
        bio: u.bio || "",
        companyName: u.companyName || "",
        role: u.role || "",
      });
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = await apiPut("/user/profile/complete", {
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        bio: user.bio,
        skills: user.skills,
        companyName: user.companyName,
      });
      const updated = payload?.data ?? payload;
      toast({
        type: "success",
        title: "Profile saved",
        message: payload?.message || "Your details were updated.",
      });
      setEdit(false);
      await load();
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
        Loading profile…
      </div>
    );
  }

  const initial = (user.name || "U").charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My profile</h1>

      <div className="card border-t-4 border-[#F6C85F] p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#F6C85F] to-amber-400 text-2xl font-bold text-gray-900 shadow-inner ring-2 ring-white">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name || "—"}</h2>
              <p className="text-gray-500">{user.email}</p>
              {user.role ? (
                <span className="badge badge-soft mt-2 capitalize">{user.role.replace("_", " ")}</span>
              ) : null}
            </div>
          </div>

          <div className="flex gap-2">
            {edit ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEdit(false);
                    load();
                  }}
                  className="btn btn-outline px-5 py-2"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary px-5 py-2">
                  {saving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEdit(true)} className="btn btn-primary px-5 py-2">
                Edit profile
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Full name" name="name" value={user.name} onChange={handleChange} edit={false} />
          <InputField label="Email" name="email" value={user.email} onChange={handleChange} edit={false} />
          <InputField label="Mobile" name="mobile" value={user.mobile} onChange={handleChange} edit={edit} />
          <InputField label="City" name="city" value={user.city} onChange={handleChange} edit={edit} />
          <InputField label="State" name="state" value={user.state} onChange={handleChange} edit={edit} />
          <InputField label="Pincode" name="pincode" value={user.pincode} onChange={handleChange} edit={edit} />

          {user.role === "recruiter" ? (
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Company name</label>
              {edit ? (
                <input
                  name="companyName"
                  value={user.companyName}
                  onChange={handleChange}
                  className="input mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-800">{user.companyName || "—"}</p>
              )}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Skills (comma separated)</label>
            {edit ? (
              <input name="skills" value={user.skills} onChange={handleChange} className="input mt-1" />
            ) : (
              <p className="mt-1 text-gray-800">{user.skills || "—"}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Bio</label>
            {edit ? (
              <textarea name="bio" value={user.bio} onChange={handleChange} className="input mt-1 min-h-[100px]" />
            ) : (
              <p className="mt-1 text-gray-800">{user.bio || "—"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, edit }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      {edit ? (
        <input name={name} value={value} onChange={onChange} className="input mt-1" />
      ) : (
        <p className="mt-1 text-gray-800">{value || "—"}</p>
      )}
    </div>
  );
}
