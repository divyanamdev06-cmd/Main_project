import { Link } from "react-router-dom";
import { Building2, UserCircle, ArrowRight, ClipboardList } from "lucide-react";

/**
 * Two clear paths: job seekers vs hiring teams — aligned with real JobNest features.
 */
export default function Cards() {
  return (
    <section className="border-t border-gray-100 bg-white py-14 sm:py-16">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Pick your path</h2>
          <p className="section-subtitle mt-2">
            Whether you are interviewing next week or building a pipeline for next quarter, JobNest keeps workflows in
            one place.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-3xl border border-teal-100 bg-linear-to-br from-teal-50/90 to-white p-7 shadow-sm ring-1 ring-teal-900/5 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
              <UserCircle className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-gray-900">I&apos;m looking for a job</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              Search live roles with filters that match how you actually look for work — category, remote or hybrid,
              seniority, and skills. Save a profile with experience and education so recruiters see the full picture.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
                <span>Dashboard for saved progress and applications (expandable as you ship features).</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#browse-jobs" className="btn btn-primary no-underline">
                Search openings
              </a>
              <Link to="/signup" className="btn btn-outline no-underline">
                Sign up free
              </Link>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50/90 to-white p-7 shadow-sm ring-1 ring-indigo-900/5 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
              <Building2 className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-gray-900">I&apos;m hiring</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              Post jobs under admin-managed categories, control draft vs published listings, and keep your company
              profile aligned with how candidates discover you — all from the recruiter workspace.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                <span>Admins curate taxonomy; you focus on compelling job posts and status.</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="btn btn-primary no-underline">
                Get started
              </Link>
              <Link to="/login" className="btn btn-outline inline-flex items-center gap-1 no-underline">
                Recruiter login
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
