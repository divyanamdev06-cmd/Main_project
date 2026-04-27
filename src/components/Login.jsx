import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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

  const handleChange = (e) => {
    setFieldError((p) => ({ ...p, [e.target.name]: "" }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!formData.email) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setSubmitting(true);
      const res = await dispatch(login(formData)).unwrap();
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
      panelSubtitle="Manage applications, explore roles by category, and keep your profile ready — all in one place."
      cardTitle="Sign in"
      cardSubtitle="Use the email and password you registered with."
      footer={
        <p className="text-center text-sm text-gray-600">
          New here?{" "}
          <NavLink
            to="/signup"
            className="font-semibold text-yellow-700 underline-offset-2 hover:text-yellow-800 hover:underline"
          >
            Create an account
          </NavLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input"
            onChange={handleChange}
          />
          {fieldError.email ? <p className="mt-1 text-sm text-red-600">{fieldError.email}</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="input"
            onChange={handleChange}
          />
          {fieldError.password ? (
            <p className="mt-1 text-sm text-red-600">{fieldError.password}</p>
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
