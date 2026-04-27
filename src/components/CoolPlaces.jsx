import { Link } from "react-router-dom";

/**
 * Social proof strip — logos are illustrative; copy stays honest about JobNest.
 */
const logos = [
  { name: "Enterprise IT", src: "https://logo.clearbit.com/techmahindra.com" },
  { name: "Banking", src: "https://logo.clearbit.com/kotak.com" },
  { name: "Consulting", src: "https://logo.clearbit.com/soprasteria.com" },
  { name: "Technology services", src: "https://logo.clearbit.com/ltimindtree.com" },
  { name: "Digital services", src: "https://logo.clearbit.com/nttdata.com" },
];

export default function CoolPlaces() {
  const row = [...logos, ...logos];

  return (
    <section className="border-t border-gray-100 bg-linear-to-b from-slate-50 to-amber-50/40 py-14 sm:py-16">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge badge-soft">Hiring happens everywhere</span>
          <h2 className="section-title mt-4">Teams like these hire in structured categories</h2>
          <p className="section-subtitle mt-2">
            JobNest maps roles to clear categories and work modes so candidates find you faster. Logos shown are
            examples of the kinds of organisations that run structured hiring — your next post belongs in the same
            flow.
          </p>
          <Link
            to="/signup"
            className="mt-5 inline-block text-sm font-semibold text-amber-800 underline decoration-amber-400/80 underline-offset-4 hover:text-amber-950"
          >
            Post under your company name →
          </Link>
        </div>

        <div className="mt-10 overflow-x-hidden">
          <div className="marquee flex gap-4 sm:gap-6">
            {row.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex min-w-[150px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/90 bg-white/95 px-5 py-4 shadow-sm ring-1 ring-black/5 sm:min-w-[170px]"
              >
                <img
                  src={item.src}
                  alt=""
                  className="h-8 max-h-10 object-contain grayscale transition hover:grayscale-0 sm:h-10"
                  loading="lazy"
                />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <img
            src="https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/img_coolPlaceToWork.svg"
            alt=""
            className="h-auto w-full max-w-[280px] opacity-90 sm:max-w-[320px]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
