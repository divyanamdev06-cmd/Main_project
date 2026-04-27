import { NavLink } from "react-router-dom";

const HERO_IMG =
  "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/bannerImg.svg";

/**
 * Shared layout for Login + Signup: responsive, matches landing (yellow + navy).
 */
export default function AuthShell({
  panelTitle,
  panelSubtitle,
  cardTitle,
  cardSubtitle,
  children,
  footer,
}) {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-yellow-50 to-white pb-8 sm:pb-10">
      <div className="container-app flex min-h-[calc(100vh-2rem)] flex-col py-6 sm:py-8 lg:min-h-screen lg:py-10">
        <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 content-center gap-6 sm:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Brand panel */}
          <aside className="order-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-[#243b6b] px-6 py-7 text-white shadow-xl ring-1 ring-white/10 sm:rounded-3xl sm:px-8 sm:py-8 lg:order-1 lg:col-span-5 lg:min-h-[min(520px,70vh)] lg:p-9">
            <div>
              <NavLink
                to="/"
                className="inline-flex rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-[#243b6b]"
              >
                <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Jobnest<span className="text-[#F6C85F]">.com</span>
                </span>
              </NavLink>
              <h1 className="mt-5 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl lg:mt-6 lg:text-3xl">
                {panelTitle}
              </h1>
              {panelSubtitle ? (
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-blue-100/95 sm:mt-3 sm:text-[15px] lg:text-base">
                  {panelSubtitle}
                </p>
              ) : null}

              <ul className="mt-5 space-y-2 text-sm leading-snug text-blue-100/90 sm:mt-6">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F6C85F]" />
                  Curated roles across categories
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F6C85F]" />
                  Dashboards for job seekers and admins
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F6C85F]" />
                  Manage jobs, categories, and applications in one flow
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-center sm:mt-8 lg:mt-10 lg:justify-start">
              <img
                src={HERO_IMG}
                alt=""
                className="h-auto w-full max-w-[220px] opacity-95 sm:max-w-[260px] lg:max-w-[280px]"
              />
            </div>
          </aside>

          {/* Form card */}
          <section className="order-1 flex items-stretch justify-center lg:order-2 lg:col-span-7 lg:justify-end lg:pl-2">
            <div className="relative w-full max-w-md">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-br from-[#F6C85F]/25 via-transparent to-[#243b6b]/10 opacity-70 blur-sm sm:rounded-3xl"
              />
              <div className="card relative border-t-[3px] border-t-[#F6C85F] p-6 shadow-lg ring-1 ring-black/4 sm:p-8">
                <header className="border-b border-gray-100 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700/90">
                    Jobnest
                  </p>
                  <h2 className="mt-1.5 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                    {cardTitle}
                  </h2>
                  {cardSubtitle ? (
                    <p className="section-subtitle mt-1.5 max-w-sm">{cardSubtitle}</p>
                  ) : null}
                </header>

                <div className="pt-6">{children}</div>

                {footer ? (
                  <footer className="mt-8 border-t border-gray-100 pt-5 text-center">{footer}</footer>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
