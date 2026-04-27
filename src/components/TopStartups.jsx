import { Link } from "react-router-dom";

const sectors = [
  {
    name: "Agri & rural tech",
    blurb: "Operations and field roles with hybrid teams.",
    accent: "from-emerald-50 to-teal-50 border-emerald-100",
  },
  {
    name: "Fintech & payments",
    blurb: "Engineering, risk, and growth in regulated markets.",
    accent: "from-sky-50 to-blue-50 border-sky-100",
  },
  {
    name: "Health & research",
    blurb: "Clinical, data, and product under one roof.",
    accent: "from-violet-50 to-purple-50 border-violet-100",
  },
  {
    name: "Mobility & logistics",
    blurb: "On-the-ground and platform roles at scale.",
    accent: "from-amber-50 to-orange-50 border-amber-100",
  },
];

export default function TopStartups() {
  return (
    <section className="border-t border-gray-100 bg-white py-14 sm:py-16">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge border-gray-200 bg-gray-100 text-gray-800">Sectors we map well</span>
          <h2 className="section-title mt-4">From seed-stage to scale-ups</h2>
          <p className="section-subtitle mt-2">
            Categories and filters stay consistent whether you hire five people a year or five hundred. Start from the
            live board below, then refine by mode and experience.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((item) => (
            <li key={item.name}>
              <article
                className={`flex h-full flex-col rounded-2xl border bg-linear-to-br p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md ${item.accent}`}
              >
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{item.blurb}</p>
                <a
                  href="#browse-jobs"
                  className="mt-5 inline-flex text-sm font-semibold text-gray-900 underline decoration-amber-500/70 underline-offset-4 hover:text-amber-900"
                >
                  Browse related roles
                </a>
              </article>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-gray-500">
          Illustrative sectors — your taxonomy is configured by admins on your JobNest instance.{" "}
          <Link to="/blogs" className="font-medium text-gray-700 hover:underline">
            Read hiring tips on the blog →
          </Link>
        </p>
      </div>
    </section>
  );
}
