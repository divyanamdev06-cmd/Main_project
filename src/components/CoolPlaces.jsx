import React from "react";

const companies = [
  "https://www.shine.com/_next/image?url=https%3A%2F%2Fstaticrect.shine.com%2Fr%2Fm%2Fimages%2Femployerbranding%2F264470edd81541d190bc774a279534aa.png&w=256&q=75",
  "https://logo.clearbit.com/techmahindra.com",
  "https://logo.clearbit.com/soprasteria.com",
  "https://logo.clearbit.com/kotak.com",
  "https://logo.clearbit.com/ltimindtree.com",
  "https://logo.clearbit.com/nttdata.com",
];

const CoolPlaces = () => {
  return (
    <section className="border-t border-gray-100 bg-linear-to-b from-[#f6eddc] to-[#e8dab8] py-12 sm:py-16">
      <div className="container-app">
        <div className="flex justify-center">
          <span className="rounded-full border border-amber-200/80 bg-[#e9dfc9] px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm">
            Cool places to work
          </span>
        </div>

        <div className="mt-8 overflow-x-hidden">
          <div className="marquee flex gap-4 sm:gap-6">
            {[...companies, ...companies].map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex min-w-[150px] shrink-0 items-center justify-center rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md sm:min-w-[170px]"
              >
                <img
                  src={logo}
                  alt=""
                  className="h-8 max-h-10 object-contain grayscale transition hover:grayscale-0 sm:h-10"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <img
            src="https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/img_coolPlaceToWork.svg"
            alt=""
            className="h-auto w-full max-w-[300px] sm:max-w-[340px]"
          />
        </div>
      </div>
    </section>
  );
};

export default CoolPlaces;
