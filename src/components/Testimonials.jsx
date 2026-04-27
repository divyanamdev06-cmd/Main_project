import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I lined up three interviews in two weeks. Filters for remote and category actually matched what I was looking for — no endless scrolling through irrelevant posts.",
    name: "Ananya Patel",
    role: "Product designer",
    company: "Previously at a Series B SaaS",
    initials: "AP",
    accent: "border-teal-100 bg-linear-to-br from-teal-50/80 to-white ring-teal-900/5",
    starTone: "text-teal-600",
  },
  {
    quote:
      "We went from spreadsheets to a single inbox for applications. Seeing candidate profiles and resumes in one flow cut our time-to-first-screen by more than half.",
    name: "James Okonkwo",
    role: "Head of talent",
    company: "Regional logistics firm",
    initials: "JO",
    accent: "border-indigo-100 bg-linear-to-br from-indigo-50/80 to-white ring-indigo-900/5",
    starTone: "text-indigo-600",
  },
  {
    quote:
      "Switching careers felt overwhelming until I could track every application in one dashboard. Clear statuses meant I stopped guessing whether a role was still open.",
    name: "Maria Santos",
    role: "Data analyst",
    company: "Career switch, healthcare → tech",
    initials: "MS",
    accent: "border-amber-100 bg-linear-to-br from-amber-50/80 to-white ring-amber-900/5",
    starTone: "text-amber-600",
  },
];

function StarRow({ className }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="border-t border-gray-100 bg-linear-to-b from-gray-50/80 to-white py-14 sm:py-16" aria-labelledby="testimonials-heading">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge border-gray-200 bg-white text-gray-800 shadow-sm">Testimonials</span>
          <h2 id="testimonials-heading" className="section-title mt-4">
            Trusted by people on both sides of the hire
          </h2>
          <p className="section-subtitle mt-2">
            Static stories from typical JobNest journeys — candidates finding clarity, teams hiring with less friction.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure
                className={`flex h-full flex-col rounded-3xl border p-6 shadow-sm ring-1 sm:p-7 ${t.accent}`}
              >
                <Quote className="h-9 w-9 shrink-0 text-gray-300" aria-hidden />
                <StarRow className={`mt-4 ${t.starTone}`} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-gray-200/80 pt-5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 ring-1 ring-gray-200"
                    aria-hidden
                  >
                    {t.initials}
                  </span>
                  <div className="min-w-0 text-left">
                    <cite className="not-italic">
                      <span className="block font-bold text-gray-900">{t.name}</span>
                      <span className="mt-0.5 block text-xs text-gray-600">
                        {t.role}
                        <span className="text-gray-400"> · </span>
                        {t.company}
                      </span>
                    </cite>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
