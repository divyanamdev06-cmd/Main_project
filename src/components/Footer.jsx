import React from "react";

const Footer = () => {
  const partners = [
    "https://www.shine.com/nova/assets/partner-sites/live-hindustan.svg",
    "https://www.shine.com/nova/assets/partner-sites/live-mint.svg",
    "https://www.shine.com/nova/assets/partner-sites/ott-play.svg",
    "https://www.shine.com/nova/assets/partner-sites/fab-play.svg",
    "https://www.shine.com/nova/assets/partner-sites/hindustan-times.svg",
  ];

  return (
    <>
      <div className="border-t border-gray-200 bg-[#f5f5f5] py-10 sm:py-12">
        <div className="container-app">
          <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Explore jobs by skills, location, companies &amp; more
          </h2>

          <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            {[
              "Jobs by Skills",
              "Jobs by Designation",
              "Jobs by City",
              "Jobs by Company",
              "Jobs by Industry",
              "Popular Jobs",
            ].map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition sm:px-4 ${
                  i === 0
                    ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-gray-600 md:grid-cols-4 md:gap-8">
            <ul className="space-y-2">
              <li>• Accounting Jobs</li>
              <li>• Data Analysis Jobs</li>
              <li>• Digital Marketing Jobs</li>
              <li>• React Native Jobs</li>
            </ul>
            <ul className="space-y-2">
              <li>• Banking Jobs</li>
              <li>• Typing Jobs</li>
              <li>• Java Jobs</li>
              <li>• Enterprise Sales Jobs</li>
            </ul>
            <ul className="space-y-2">
              <li>• Civil Engineering Jobs</li>
              <li>• Data Analytics Jobs</li>
              <li>• Data Science Jobs</li>
              <li>• .NET Jobs</li>
            </ul>
            <ul className="space-y-2">
              <li>• C++ Jobs</li>
              <li>• Content Marketing Jobs</li>
              <li>• Python Jobs</li>
              <li className="cursor-pointer font-medium text-yellow-700 hover:underline">• View all</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="bg-[#243b6b] pt-10 text-white sm:pt-12">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-5 md:gap-8">
            <div>
              <h3 className="font-semibold">Trending</h3>
              <p className="mt-3 text-sm text-blue-100/90">Blogs &amp; featured roles</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Important links</h3>
              <ul className="space-y-2 text-sm text-blue-100/90">
                <li>Employer Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Fraud Alert</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Job seekers</h3>
              <ul className="space-y-2 text-sm text-blue-100/90">
                <li>Register / Login</li>
                <li>Job Search</li>
                <li>Create Job Alert</li>
                <li>Assistance</li>
                <li>Courses</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-blue-100/90">
                <li>Business News</li>
                <li>English News</li>
                <li>Disclaimer</li>
                <li>FAQ&apos;s</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Employers</h3>
              <ul className="space-y-2 text-sm text-blue-100/90">
                <li>Register / Log-in</li>
                <li>Recruiter India</li>
                <li>Post a Job</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6 py-10 md:flex-row md:items-stretch md:justify-between">
            <div className="flex w-full flex-col justify-between gap-4 rounded-xl bg-[#2f4a7f] p-6 md:max-w-[48%] md:flex-row md:items-center">
              <div>
                <h4 className="text-lg font-semibold">Download Jobnest App</h4>
                <p className="mt-1 text-sm text-blue-100/90">Get the latest job updates on the go.</p>
              </div>
              <button
                type="button"
                className="shrink-0 self-start rounded-lg bg-[#3d5a96] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4a6ab0] md:self-center"
              >
                Get App ↗
              </button>
            </div>

            <div className="w-full md:max-w-[48%]">
              <p className="mb-4 text-center text-sm text-blue-100/90 md:text-left">Our partner sites</p>
              <div className="relative overflow-hidden rounded-lg">
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-linear-to-r from-[#243b6b] to-transparent sm:w-16" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-linear-to-l from-[#243b6b] to-transparent sm:w-16" />
                <div className="marquee flex gap-4 sm:gap-6">
                  {[...partners, ...partners].map((logo, index) => (
                    <div
                      key={`${index}-${logo}`}
                      className="flex min-w-[100px] shrink-0 items-center justify-center rounded-lg bg-white p-3 opacity-90 transition hover:opacity-100 sm:min-w-[120px]"
                    >
                      <img src={logo} alt="" className="h-6 object-contain sm:h-8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-blue-100/90 md:flex-row">
            <div>© 2026 Jobnest.com | All rights reserved</div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              <span className="cursor-pointer hover:text-white">T&amp;C</span>
              <span className="text-white/30">|</span>
              <span className="cursor-pointer hover:text-white">Privacy Policy</span>
              <span className="text-white/30">|</span>
              <span className="cursor-pointer hover:text-white">Cookie Policy</span>
              <span className="text-white/30">|</span>
              <span className="cursor-pointer hover:text-white">Report Job Posting</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
