import React from "react";

const HERO_IMG =
  "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/bannerImg.svg";

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-b from-amber-50 via-yellow-50 to-white px-0 pb-12 pt-10 sm:pb-16 sm:pt-12 md:pt-14">
      {/* soft backdrop behind search */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-64 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-[#F6C85F]/20 blur-3xl sm:top-[38%] md:h-72 md:w-4xl"
      />

      <div className="relative z-10 container-app">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl md:leading-[1.1]">
            Find your next role faster.
          </h1>

          <p className="section-subtitle mt-4 max-w-2xl text-pretty sm:mt-5">
            Search across companies, categories, and locations — one place to explore and apply with confidence.
          </p>

          {/* Search — centered hero focal point */}
          <div className="mt-8 w-full max-w-3xl sm:mt-10">
            <div className="rounded-2xl border border-gray-200/90 bg-white/95 p-2 shadow-lg shadow-gray-900/5 ring-1 ring-black/5 backdrop-blur-sm sm:p-2.5 md:rounded-3xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:divide-x sm:divide-gray-200 sm:rounded-2xl sm:bg-gray-50/50 sm:p-1">
                <input
                  type="text"
                  placeholder="Skills / job title"
                  className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-yellow-300 focus:ring-2 focus:ring-[#F6C85F]/50 sm:min-h-[52px] sm:border-0 sm:bg-transparent sm:py-3.5 md:flex-1 md:rounded-l-2xl md:rounded-r-none"
                />
                <input
                  type="text"
                  placeholder="Experience"
                  className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-yellow-300 focus:ring-2 focus:ring-[#F6C85F]/50 sm:min-h-[52px] sm:border-0 sm:bg-transparent sm:py-3.5 md:w-[28%] md:max-w-[200px] md:rounded-none"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-yellow-300 focus:ring-2 focus:ring-[#F6C85F]/50 sm:min-h-[52px] sm:border-0 sm:bg-transparent sm:py-3.5 md:flex-1 md:rounded-none"
                />
                <button
                  type="button"
                  className="btn btn-primary min-h-[48px] w-full shrink-0 rounded-xl px-6 text-sm font-bold sm:min-h-[52px] sm:w-auto sm:rounded-xl md:rounded-l-none md:rounded-r-2xl md:px-8 md:text-base"
                >
                  Search
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-500 sm:text-sm">
              Try keywords like <span className="font-medium text-gray-600">React</span>,{" "}
              <span className="font-medium text-gray-600">Remote</span>, or{" "}
              <span className="font-medium text-gray-600">Bhopal</span>
            </p>
          </div>

          <div className="mt-6 flex justify-center sm:mt-7">
            <span className="badge badge-soft">Salary insight — check benchmarks →</span>
          </div>

          <p className="mt-10 text-xs font-bold uppercase tracking-wider text-gray-400">Trusted by teams at</p>
          <div className="mt-3 flex max-w-xl flex-wrap justify-center gap-2 sm:gap-2.5">
            {["Capgemini", "Genpact", "ICICI", "Kotak", "Tech Mahindra"].map((name) => (
              <span
                key={name}
                className="rounded-full border border-gray-200/90 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm sm:text-sm"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="mt-8 flex w-full justify-center sm:mt-10">
            <img
              src={HERO_IMG}
              alt=""
              className="h-auto w-full max-w-[220px] opacity-95 drop-shadow-md sm:max-w-[280px] md:max-w-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
