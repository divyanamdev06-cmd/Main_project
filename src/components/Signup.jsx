import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  Briefcase,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getApiErrorMessage } from "../lib/apiClient.js";
import { useToast } from "./ui/ToastProvider.jsx";
import { useDispatch } from "react-redux";
import { register } from "../store/authSlice.js";
import AuthShell from "./AuthShell.jsx";

const MIN_PASSWORD = 8;
const FORM_ID = "jobnest-signup-form";

function dashboardPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/user";
}

function passwordStrengthScore(password) {
  if (!password) return { score: 0, label: "", width: "0%" };
  let score = 0;
  if (password.length >= MIN_PASSWORD) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const capped = Math.min(score, 4);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const width = `${(capped / 4) * 100}%`;
  return { score: capped, label: labels[capped] || "", width };
}

const Signup = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: "job_seeker",
    companyName: "",
    companyWebsite: "",
    companyIndustry: "",
    companySize: "",
    companyDescription: "",
  });
  const [fieldError, setFieldError] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const maxStep = useMemo(() => (formData.role === "recruiter" ? 4 : 3), [formData.role]);

  useEffect(() => {
    if (step > maxStep) setStep(maxStep);
  }, [maxStep, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleChange = (e) => {
    setFieldError((p) => ({ ...p, [e.target.name]: "" }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFieldError((p) => ({ ...p, role: "" }));
    setFormData((prev) => ({ ...prev, role }));
  };

  function validateStep(currentStep) {
    const err = {};
    if (currentStep === 1) {
      if (!formData.role) err.role = "Choose how you’ll use JobNest";
    }
    if (currentStep === 2) {
      if (!formData.name.trim()) err.name = "Name is required";
      if (!formData.email.trim()) err.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        err.email = "Enter a valid email address";
      }
      if (!formData.mobile.trim()) err.mobile = "Mobile number is required";
    }
    if (currentStep === 3) {
      if (!formData.password) err.password = "Password is required";
      else if (formData.password.length < MIN_PASSWORD) {
        err.password = `Use at least ${MIN_PASSWORD} characters`;
      }
      if (formData.password !== formData.confirmPassword) {
        err.confirmPassword = "Passwords do not match";
      }
    }
    if (currentStep === 4 && formData.role === "recruiter") {
      if (!formData.companyName?.trim()) err.companyName = "Company name is required";
    }
    setFieldError(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (step < maxStep) {
      if (!validateStep(step)) return;
      setStep((s) => Math.min(s + 1, maxStep));
      return;
    }

    const finalErrors = {};
    if (!formData.name.trim()) finalErrors.name = "Name is required";
    if (!formData.email.trim()) finalErrors.email = "Email is required";
    if (!formData.password || formData.password.length < MIN_PASSWORD) {
      finalErrors.password = `At least ${MIN_PASSWORD} characters`;
    }
    if (formData.password !== formData.confirmPassword) {
      finalErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.mobile.trim()) finalErrors.mobile = "Mobile is required";
    if (formData.role === "recruiter" && !formData.companyName?.trim()) {
      finalErrors.companyName = "Company name is required";
    }
    setFieldError(finalErrors);
    if (Object.keys(finalErrors).length) return;

    try {
      setSubmitting(true);
      const body = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobile: formData.mobile.trim(),
        role: formData.role,
        ...(formData.role === "recruiter"
          ? {
              companyName: formData.companyName.trim(),
              companyWebsite: formData.companyWebsite.trim(),
              companyIndustry: formData.companyIndustry.trim(),
              companySize: formData.companySize.trim(),
              companyDescription: formData.companyDescription.trim(),
            }
          : {}),
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

  function goBack() {
    setFieldError({});
    setStep((s) => Math.max(1, s - 1));
  }

  const strength = passwordStrengthScore(formData.password);
  const stepTitles = useMemo(() => {
    if (formData.role === "recruiter") {
      return ["", "Account type", "Your details", "Password", "Company"];
    }
    return ["", "Account type", "Your details", "Password & finish"];
  }, [formData.role]);

  const primaryLabel =
    step < maxStep ? "Continue" : submitting ? "Creating account…" : "Create account";

  const stepDescription = () => {
    if (step === 1) return "Choose the experience that matches you. You can’t pick admin here — admins are invited separately.";
    if (step === 2) return "We’ll use this to verify your account and personalize your dashboard.";
    if (step === 3) return "Pick a strong password. You’ll stay signed in securely with a JWT session.";
    if (step === 4) return "Help candidates understand who you are. You can edit everything later in your profile.";
    return "";
  };

  const navButtons = (layoutClass) => (
    <div className={layoutClass}>
      <button
        type="button"
        onClick={goBack}
        disabled={step <= 1 || submitting}
        className="btn btn-outline min-h-[48px] w-full gap-2 px-4 py-3 sm:w-auto sm:min-w-[120px] sm:px-6 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
        Back
      </button>
      <button
        type="submit"
        form={FORM_ID}
        disabled={submitting}
        className="btn btn-primary min-h-[48px] w-full gap-2 px-4 py-3 text-base font-bold shadow-md shadow-teal-900/15 sm:w-auto sm:min-w-[200px] sm:px-8"
      >
        {primaryLabel}
      </button>
    </div>
  );

  return (
    <AuthShell
      formMaxWidthClass="max-w-2xl"
      panelTitle="Join JobNest in a few guided steps."
      panelSubtitle="A cleaner signup flow on every screen size: pick your path, confirm your details, then start in the right workspace."
      cardTitle="Create your account"
      cardSubtitle="Step-by-step — same teal & amber look you already like."
      footer={
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-semibold text-teal-700 underline-offset-2 hover:text-teal-800 hover:underline"
          >
            Sign in
          </NavLink>
        </p>
      }
    >
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <span>
            Step {step} of {maxStep}
          </span>
          <span className="truncate text-teal-800">{stepTitles[step]}</span>
        </div>
        <div
          className="mt-2 flex gap-1.5"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={maxStep}
          aria-label={`Signup progress: step ${step} of ${maxStep}`}
        >
          {Array.from({ length: maxStep }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i + 1 <= step ? "bg-teal-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-slate-600">{stepDescription()}</p>

      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6 pb-28 lg:pb-0">
        {step === 1 && (
          <section aria-labelledby="signup-step1-title" className="space-y-4">
            <h3 id="signup-step1-title" className="sr-only">
              Account type
            </h3>
            <p className="text-sm font-semibold text-slate-800">I am joining JobNest as</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("job_seeker")}
                aria-pressed={formData.role === "job_seeker"}
                className={`group relative flex min-h-[120px] flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  formData.role === "job_seeker"
                    ? "border-teal-600 bg-linear-to-br from-teal-50 to-white shadow-md shadow-teal-900/10 ring-1 ring-teal-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                      formData.role === "job_seeker"
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-800"
                    }`}
                  >
                    <Briefcase className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <span className="block text-lg font-bold text-slate-900">Job seeker</span>
                    <span className="mt-1 block text-sm leading-snug text-slate-600">
                      Discover roles, apply with your profile, and upload a resume.
                    </span>
                  </div>
                </div>
                <span
                  className={`mt-4 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    formData.role === "job_seeker" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {formData.role === "job_seeker" ? "Selected" : "Tap to select"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                aria-pressed={formData.role === "recruiter"}
                className={`group relative flex min-h-[120px] flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                  formData.role === "recruiter"
                    ? "border-amber-500 bg-linear-to-br from-amber-50 to-white shadow-md shadow-amber-900/10 ring-1 ring-amber-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                      formData.role === "recruiter"
                        ? "bg-amber-500 text-slate-900"
                        : "bg-slate-100 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-900"
                    }`}
                  >
                    <Building2 className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <span className="block text-lg font-bold text-slate-900">Recruiter</span>
                    <span className="mt-1 block text-sm leading-snug text-slate-600">
                      Post openings, represent your brand, and manage applicants.
                    </span>
                  </div>
                </div>
                <span
                  className={`mt-4 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    formData.role === "recruiter" ? "bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {formData.role === "recruiter" ? "Selected" : "Tap to select"}
                </span>
              </button>
            </div>
            {fieldError.role ? <p className="text-sm font-medium text-red-600">{fieldError.role}</p> : null}
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="signup-step2-title" className="space-y-5">
            <h3 id="signup-step2-title" className="text-base font-bold text-slate-900">
              Your details
            </h3>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <UserRound className="h-4 w-4 text-teal-600" aria-hidden />
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="e.g. Priya Sharma"
                  className="input min-h-[48px] text-base"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldError.name)}
                />
                {fieldError.name ? <p className="mt-1.5 text-sm text-red-600">{fieldError.name}</p> : null}
              </div>

              <div className="lg:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Mail className="h-4 w-4 text-teal-600" aria-hidden />
                  Work or personal email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input min-h-[48px] text-base"
                  value={formData.email}
                  onChange={handleChange}
                  inputMode="email"
                  aria-invalid={Boolean(fieldError.email)}
                />
                {fieldError.email ? <p className="mt-1.5 text-sm text-red-600">{fieldError.email}</p> : null}
              </div>

              <div className="lg:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Phone className="h-4 w-4 text-teal-600" aria-hidden />
                  Mobile number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  autoComplete="tel"
                  placeholder="Include country code if needed"
                  className="input min-h-[48px] text-base"
                  value={formData.mobile}
                  onChange={handleChange}
                  inputMode="tel"
                  aria-invalid={Boolean(fieldError.mobile)}
                />
                {fieldError.mobile ? <p className="mt-1.5 text-sm text-red-600">{fieldError.mobile}</p> : null}
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="signup-step3-title" className="space-y-5">
            <h3 id="signup-step3-title" className="text-base font-bold text-slate-900">
              Password
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Lock className="h-4 w-4 text-teal-600" aria-hidden />
                  Create password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder={`At least ${MIN_PASSWORD} characters`}
                    className="input min-h-[48px] pr-12 text-base"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldError.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldError.password ? (
                  <p className="mt-1.5 text-sm text-red-600">{fieldError.password}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Mix letters, numbers, and symbols for a stronger password.
                  </p>
                )}
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                      Strength
                    </span>
                    {strength.label ? (
                      <span
                        className={
                          strength.score >= 3
                            ? "text-teal-700"
                            : strength.score >= 2
                              ? "text-amber-700"
                              : "text-red-600"
                        }
                      >
                        {strength.label}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        strength.score >= 3
                          ? "bg-teal-600"
                          : strength.score >= 2
                            ? "bg-amber-500"
                            : strength.score >= 1
                              ? "bg-amber-400"
                              : "bg-slate-300"
                      }`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Confirm password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="input min-h-[48px] text-base"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldError.confirmPassword)}
                />
                {fieldError.confirmPassword ? (
                  <p className="mt-1.5 text-sm text-red-600">{fieldError.confirmPassword}</p>
                ) : null}
              </div>
            </div>
          </section>
        )}

        {step === 4 && formData.role === "recruiter" && (
          <section aria-labelledby="signup-step4-title" className="space-y-5">
            <h3 id="signup-step4-title" className="text-base font-bold text-slate-900">
              Company profile
            </h3>
            <div className="rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50/90 via-white to-white p-5 shadow-sm ring-1 ring-amber-100/60 sm:p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wide text-amber-900/90">
                Visible to candidates after you post jobs
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    Company name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    autoComplete="organization"
                    placeholder="Legal or hiring brand name"
                    className="input min-h-[48px]"
                    value={formData.companyName}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldError.companyName)}
                  />
                  {fieldError.companyName ? (
                    <p className="mt-1.5 text-sm text-red-600">{fieldError.companyName}</p>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Website</label>
                    <input
                      type="text"
                      name="companyWebsite"
                      placeholder="https://company.com"
                      className="input min-h-[48px]"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Industry</label>
                    <input
                      type="text"
                      name="companyIndustry"
                      placeholder="e.g. SaaS, Healthcare"
                      className="input min-h-[48px]"
                      value={formData.companyIndustry}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Company size</label>
                    <input
                      type="text"
                      name="companySize"
                      placeholder="e.g. 51–200 employees"
                      className="input min-h-[48px]"
                      value={formData.companySize}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">About the company</label>
                    <textarea
                      name="companyDescription"
                      rows={4}
                      placeholder="Mission, culture, and what you typically hire for."
                      className="input min-h-[120px] resize-y"
                      value={formData.companyDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Desktop / tablet actions inside scroll */}
        <div className="hidden border-t border-slate-100 pt-6 lg:block">
          {navButtons("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between")}
        </div>
      </form>

      {/* Mobile & small-tablet sticky action bar — thumb-friendly, safe-area aware */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 lg:hidden">
        <div className="pointer-events-auto border-t border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md supports-backdrop-filter:bg-white/85 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
            {navButtons("flex flex-col gap-2 sm:flex-row sm:justify-stretch")}
          </div>
        </div>
      </div>
    </AuthShell>
  );
};

export default Signup;
