import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { getApiErrorMessage } from "../lib/apiClient.js";
import { useToast } from "./ui/ToastProvider.jsx";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
import AuthShell from "./AuthShell.jsx";

function dashboardPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/user";
}

const Login = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldError, setFieldError] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFieldError((p) => ({ ...p, [e.target.name]: "" }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setSubmitting(true);
      const res = await dispatch(
        login({ email: formData.email.trim(), password: formData.password })
      ).unwrap();
      toast({
        type: "success",
        title: "Welcome back",
        message: res?.message || "Login successful.",
      });
      const role = res?.user?.role === "user" ? "job_seeker" : res?.user?.role || "job_seeker";
      const rawFrom = location.state?.from;
      const from =
        typeof rawFrom === "string" && rawFrom.startsWith("/") && !rawFrom.startsWith("//")
          ? rawFrom
          : null;
      const fallback = dashboardPathForRole(role);
      navigate(from || fallback, { replace: true });
    } catch (err) {
      toast({
        type: "error",
        title: "Login failed",
        message: typeof err === "string" ? err : getApiErrorMessage(err),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      panelTitle="Sign in and pick up where you left off."
      panelSubtitle="Job seekers manage applications and profiles; recruiters keep listings sharp; admins oversee the platform — all behind one secure login."
      cardTitle="Sign in"
      cardSubtitle="Use the email and password you registered with."
      footer={
        <p className="text-center text-sm text-slate-600">
          New here?{" "}
          <NavLink
            to="/signup"
            className="font-semibold text-teal-700 underline-offset-2 hover:text-teal-800 hover:underline"
          >
            Create an account
          </NavLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Email
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input"
            value={formData.email}
            onChange={handleChange}
          />
          {fieldError.email ? <p className="mt-1.5 text-sm text-red-600">{fieldError.email}</p> : null}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="input pr-11"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldError.password ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldError.password}</p>
          ) : null}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3 text-base">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
