import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";

const HERO_IMG =
  "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/bannerImg.svg";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-b from-amber-50 via-yellow-50 to-white px-0 pb-14 pt-10 sm:pb-16 sm:pt-12 md:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] z-0 h-72 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-[#F6C85F]/25 blur-3xl md:top-[32%] md:h-80"
      />

      <div className="relative z-10 container-app">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-12">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              JobNest — one platform for talent & teams
            </p>

            <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl md:leading-[1.08]">
              Hire with clarity. <span className="text-amber-700">Grow</span> with the right role.
            </h1>

            <p className="section-subtitle mx-auto mt-4 max-w-xl text-pretty sm:mt-5 lg:mx-0">
              Discover live openings by category and work style, build a full profile, and connect with recruiters who
              use the same tools as your admin team — without the noise of generic job boards.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <a
                href="#browse-jobs"
                className="btn btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 px-6 text-base font-bold no-underline"
              >
                <Briefcase className="h-5 w-5" aria-hidden />
                Browse live roles
              </a>
              <Link
                to="/signup"
                className="btn btn-outline inline-flex min-h-[48px] items-center justify-center gap-2 px-6 text-base font-semibold no-underline"
              >
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-[48px] items-center justify-center text-sm font-semibold text-gray-700 underline decoration-amber-400/70 underline-offset-4 hover:text-gray-900"
              >
                Already registered? Log in
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm lg:text-left">
              Scroll to filters below, or jump to{" "}
              <Link to="/explore-jobs" className="font-semibold text-amber-800 hover:underline">
                full explore page
              </Link>
              .
            </p>

            <div className="mt-10 border-t border-amber-100/80 pt-8 lg:border-t-0 lg:pt-0">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Built for teams who care about</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                {["Structured profiles", "Role categories", "Recruiter + admin tools", "Fair visibility"].map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-gray-200/90 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center lg:items-end">
            <div className="relative w-full max-w-[320px] rounded-3xl border border-amber-100/90 bg-white/60 p-6 shadow-lg shadow-amber-900/5 ring-1 ring-black/5 backdrop-blur-sm">
              <p className="text-center text-sm font-semibold text-gray-800">Why JobNest?</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 font-bold text-amber-600">1.</span>
                  <span>Live job feed with search, category, and work-mode filters.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 font-bold text-amber-600">2.</span>
                  <span>Rich profiles for candidates and company pages for recruiters.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 font-bold text-amber-600">3.</span>
                  <span>Admins keep categories and quality consistent across the board.</span>
                </li>
              </ul>
            </div>
            <img
              src={HERO_IMG}
              alt="Illustration of people collaborating around career growth"
              className="mt-6 h-auto w-full max-w-[240px] opacity-95 drop-shadow-md sm:max-w-[280px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
