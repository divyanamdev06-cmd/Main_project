import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Briefcase, Loader2 } from "lucide-react";
import { selectEffectiveRole } from "../../store/authSlice.js";
import { apiPost, getApiErrorMessage } from "../../lib/apiClient.js";
import { useToast } from "../ui/ToastProvider.jsx";

/**
 * Footer actions for a public job card — respects auth role and application state.
 */
export default function JobApplyActions({ job, appliedJobIds, onApplied, variant = "card" }) {
  const token = useSelector((s) => s.auth.token);
  const role = useSelector(selectEffectiveRole);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const jobId = job?._id;
  const applied = jobId && appliedJobIds?.has(String(jobId));

  const handleApply = async () => {
    if (!jobId || submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/applications", { jobId });
      toast({ type: "success", title: "Application sent", message: "The hiring team can review it in their inbox." });
      onApplied?.(String(jobId));
    } catch (err) {
      toast({ type: "error", title: "Could not apply", message: getApiErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const isSeeker = Boolean(token) && role === "job_seeker";
  const isRecruiter = Boolean(token) && role === "recruiter";
  const isAdmin = Boolean(token) && role === "admin";

  const btnBase =
    variant === "compact"
      ? "inline-flex min-h-[40px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
      : "btn min-h-[44px] flex-1 text-center text-sm";

  if (!token) {
    return (
      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <Link to="/signup" className={`${btnBase} btn-primary no-underline`}>
          Create account to apply
        </Link>
        <Link to="/login" className={`${btnBase} btn-outline no-underline`}>
          Log in
        </Link>
      </div>
    );
  }

  if (isSeeker) {
    if (applied) {
      return (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <span className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
            Applied
          </span>
          <Link to="/user/applications" className={`${btnBase} btn-outline no-underline`}>
            My applications
          </Link>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={submitting}
          onClick={handleApply}
          className={`${btnBase} btn-primary inline-flex items-center justify-center gap-2`}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Apply now
        </button>
        <Link to="/user/profile" className={`${btnBase} btn-outline no-underline`}>
          Update profile
        </Link>
      </div>
    );
  }

  if (isRecruiter) {
    return (
      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <Link
          to="/recruiter/jobs"
          className={`${btnBase} btn-outline inline-flex flex-1 items-center justify-center gap-2 no-underline`}
        >
          <Briefcase className="h-4 w-4" aria-hidden />
          Manage your job posts
        </Link>
        <Link to="/recruiter/applications" className={`${btnBase} btn-primary no-underline`}>
          Applications inbox
        </Link>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="border-t border-gray-100 pt-4">
        <Link to="/admin/jobs" className={`${btnBase} btn-outline w-full no-underline sm:w-auto`}>
          Open job admin
        </Link>
        <p className="mt-2 text-center text-xs text-gray-500 sm:text-left">
          Admins manage listings and users. Job seekers apply from the home page or their dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
      <Link to="/login" className="font-semibold text-amber-800 hover:underline">
        Log in as a job seeker
      </Link>{" "}
      to apply to roles.
    </div>
  );
}
