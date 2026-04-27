import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

const HERO_IMG =
  "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/bannerImg.svg";

/**
 * Shared layout for Login + Signup — JobNest slate + teal + warm highlights.
 */
export default function AuthShell({
  panelTitle,
  panelSubtitle,
  cardTitle,
  cardSubtitle,
  children,
  footer,
  /** Widen the form column (e.g. `max-w-2xl` for multi-step signup). */
  formMaxWidthClass = "max-w-md",
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-teal-50/40 to-amber-50/30 pb-10">
      <div className="container-app flex min-h-[calc(100vh-2rem)] flex-col py-6 sm:py-10 lg:min-h-screen lg:py-12">
        <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 content-center gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Brand panel */}
          <aside className="order-2 flex flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-teal-950 px-7 py-8 text-white shadow-2xl ring-1 ring-white/10 sm:px-9 sm:py-10 lg:order-1 lg:col-span-5 lg:min-h-[min(540px,72vh)]">
            <div>
              <NavLink
                to="/"
                className="inline-flex items-center gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/30">
                  <Sparkles className="h-5 w-5 text-amber-300" aria-hidden />
                </span>
                <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  JobNest<span className="text-amber-300">.</span>
                </span>
              </NavLink>
              <h1 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {panelTitle}
              </h1>
              {panelSubtitle ? (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                  {panelSubtitle}
                </p>
              ) : null}

              <ul className="mt-6 space-y-3 text-sm leading-snug text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  Secure JWT sessions with role-based dashboards
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  Rich profiles: skills, experience, education, resume
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  Built for seekers, recruiters, and platform admins
                </li>
              </ul>
            </div>

            <div className="mt-8 flex justify-center lg:mt-10 lg:justify-start">
              <img
                src={HERO_IMG}
                alt=""
                className="h-auto w-full max-w-[200px] opacity-90 sm:max-w-[240px] lg:max-w-[260px]"
              />
            </div>
          </aside>

          {/* Form card */}
          <section className="order-1 flex items-stretch justify-center lg:order-2 lg:col-span-7 lg:justify-end lg:pl-2">
            <div className={`relative w-full ${formMaxWidthClass}`}>
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl bg-linear-to-br from-teal-400/30 via-amber-300/20 to-slate-400/15 opacity-80 blur-md"
              />
              <div className="card relative rounded-3xl border border-white/80 bg-white/95 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur sm:p-8 lg:p-9">
                <header className="border-b border-slate-100 pb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700/90">JobNest</p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{cardTitle}</h2>
                  {cardSubtitle ? (
                    <p className="section-subtitle mt-2 max-w-sm text-slate-600">{cardSubtitle}</p>
                  ) : null}
                </header>

                <div className="pt-6">{children}</div>

                {footer ? (
                  <footer className="mt-8 border-t border-slate-100 pt-5 text-center">{footer}</footer>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
