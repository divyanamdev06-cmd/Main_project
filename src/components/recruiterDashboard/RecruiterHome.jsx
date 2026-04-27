import { NavLink } from "react-router-dom";
import { Briefcase, Building2 } from "lucide-react";

export default function RecruiterHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to JobNest</h1>
        <p className="section-subtitle mt-2 max-w-2xl">
          Post roles, manage listings, and reach candidates — same yellow accent and cards as the rest of the app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NavLink
          to="/recruiter/jobs"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <Briefcase size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Job posts</h2>
            <p className="mt-1 text-sm text-gray-600">Create and update openings (JWT required on API).</p>
          </div>
        </NavLink>

        <NavLink
          to="/recruiter/profile"
          className="card group flex items-start gap-4 p-5 transition hover:border-yellow-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <Building2 size={22} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900">Company profile</h2>
            <p className="mt-1 text-sm text-gray-600">Keep contact details and company name up to date.</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
