import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../lib/apiClient.js";
import { useToast } from "./ui/ToastProvider.jsx";
import { useDispatch } from "react-redux";
import { register } from "../store/authSlice.js";
import AuthShell from "./AuthShell.jsx";

function dashboardPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/user";
}

const Signup = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "job_seeker",
    companyName: "",
  });
  const [fieldError, setFieldError] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFieldError((p) => ({ ...p, [e.target.name]: "" }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};
    if (!formData.name) nextErrors.name = "Name is required";
    if (!formData.email) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    if (!formData.mobile) nextErrors.mobile = "Mobile is required";
    if (!formData.role) nextErrors.role = "Role is required";
    if (formData.role === "recruiter" && !formData.companyName?.trim()) {
      nextErrors.companyName = "Company name is required for recruiters";
    }
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setSubmitting(true);
      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: formData.role,
        ...(formData.role === "recruiter" ? { companyName: formData.companyName.trim() } : {}),
      };
      const res = await dispatch(register(body)).unwrap();
      toast({
        type: "success",
        title: "Welcome to JobNest",
        message: res?.message || "Your account is ready.",
      });
      const role = res?.user?.role === "user" ? "job_seeker" : res?.user?.role || "job_seeker";
      navigate(dashboardPathForRole(role), { replace: true });
    } catch (err) {
      toast({
        type: "error",
        title: "Registration failed",
        message: typeof err === "string" ? err : getApiErrorMessage(err),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      panelTitle="Create your Jobnest profile in minutes."
      panelSubtitle="Choose job seeker or recruiter, add your basics, and start using the platform with secure JWT login."
      cardTitle="Create account"
      cardSubtitle="All fields below are required to register."
      footer={
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-semibold text-yellow-700 underline-offset-2 hover:text-yellow-800 hover:underline"
          >
            Sign in
          </NavLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">Full name</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              className="input"
              value={formData.name}
              onChange={handleChange}
            />
            {fieldError.name ? <p className="mt-1 text-sm text-red-600">{fieldError.name}</p> : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldError.email ? <p className="mt-1 text-sm text-red-600">{fieldError.email}</p> : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              className="input"
              value={formData.password}
              onChange={handleChange}
            />
            {fieldError.password ? (
              <p className="mt-1 text-sm text-red-600">{fieldError.password}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">Mobile</label>
            <input
              type="text"
              name="mobile"
              autoComplete="tel"
              placeholder="10-digit number"
              className="input"
              value={formData.mobile}
              onChange={handleChange}
            />
            {fieldError.mobile ? <p className="mt-1 text-sm text-red-600">{fieldError.mobile}</p> : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">I am a</label>
            <select name="role" className="input" value={formData.role} onChange={handleChange}>
              <option value="job_seeker">Job seeker</option>
              <option value="recruiter">Recruiter / employer</option>
            </select>
            {fieldError.role ? <p className="mt-1 text-sm text-red-600">{fieldError.role}</p> : null}
          </div>

          {formData.role === "recruiter" ? (
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">Company name</label>
              <input
                type="text"
                name="companyName"
                autoComplete="organization"
                placeholder="Your company or hiring brand"
                className="input"
                value={formData.companyName}
                onChange={handleChange}
              />
              {fieldError.companyName ? (
                <p className="mt-1 text-sm text-red-600">{fieldError.companyName}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3 text-base">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Signup;
