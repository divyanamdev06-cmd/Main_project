// import React from "react";
// import {
//   Facebook,
//   Instagram,
//   Linkedin,
//   Youtube,
// } from "lucide-react";

// const Footer = () => {
//     return (
//         <>
//             {/* ================== EXPLORE JOBS SECTION ================== */}
//             <div className="bg-[#f5f5f5] py-10">
//                 <div className="max-w-7xl mx-auto px-6">

//                     <h2 className="text-lg font-semibold text-gray-800 mb-6">
//                         Explore Jobs by Skills, Location, Companies & More
//                     </h2>

//                     {/* Tabs */}
//                     <div className="flex flex-wrap gap-3 mb-6">
//                         {[
//                             "Jobs by Skills",
//                             "Jobs by Designation",
//                             "Jobs by City",
//                             "Jobs By Company",
//                             "Jobs by Industry",
//                             "Popular Jobs",
//                         ].map((tab, i) => (
//                             <button
//                                 key={i}
//                                 className={`px-4 py-1.5 rounded-full text-sm border ${i === 0
//                                         ? "bg-yellow-100 border-yellow-400 text-yellow-700"
//                                         : "bg-white border-gray-300 text-gray-600"
//                                     }`}
//                             >
//                                 {tab}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Job Links Grid */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
//                         <ul className="space-y-2">
//                             <li>• Accounting Jobs</li>
//                             <li>• Data Analysis Jobs</li>
//                             <li>• Digital Marketing Jobs</li>
//                             <li>• React Native Jobs</li>
//                         </ul>

//                         <ul className="space-y-2">
//                             <li>• Banking Jobs</li>
//                             <li>• Typing Jobs</li>
//                             <li>• Java Jobs</li>
//                             <li>• Enterprise Sales Jobs</li>
//                         </ul>

//                         <ul className="space-y-2">
//                             <li>• Civil Engineering Jobs</li>
//                             <li>• Data Analytics Jobs</li>
//                             <li>• Data Science Jobs</li>
//                             <li>• .NET Jobs</li>
//                         </ul>

//                         <ul className="space-y-2">
//                             <li>• C++ Jobs</li>
//                             <li>• Content Marketing Jobs</li>
//                             <li>• Python Jobs</li>
//                             <li className="text-yellow-600 cursor-pointer">• View All</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             {/* ================== MAIN FOOTER ================== */}
//             <footer className="bg-[#243b6b] text-white pt-12">
//                 <div className="max-w-7xl mx-auto px-6">

//                     {/* Top Links */}
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-blue-400/20">

//                         <div>
//                             <h3 className="font-semibold mb-4">Trending Blogs</h3>
//                             <h3 className="font-semibold">Trending Jobs</h3>
//                         </div>

//                         <div>
//                             <h3 className="font-semibold mb-4">Important Links</h3>
//                             <ul className="space-y-2 text-sm text-gray-300">
//                                 <li>Employer Home</li>
//                                 <li>About Us</li>
//                                 <li>Contact Us</li>
//                                 <li>Fraud Alert</li>
//                             </ul>
//                         </div>

//                         <div>
//                             <h3 className="font-semibold mb-4">Job Seekers</h3>
//                             <ul className="space-y-2 text-sm text-gray-300">
//                                 <li>Register/Login</li>
//                                 <li>Job Search</li>
//                                 <li>Create Free Job Alert</li>
//                                 <li>Job Assistance Services</li>
//                                 <li>Courses</li>
//                             </ul>
//                         </div>

//                         <div>
//                             <h3 className="font-semibold mb-4">Resources</h3>
//                             <ul className="space-y-2 text-sm text-gray-300">
//                                 <li>Business News</li>
//                                 <li>English News</li>
//                                 <li>Disclaimer</li>
//                                 <li>FAQ's</li>
//                             </ul>
//                         </div>

//                         <div>
//                             <h3 className="font-semibold mb-4">Employers</h3>
//                             <ul className="space-y-2 text-sm text-gray-300">
//                                 <li>Register/Log-In</li>
//                                 <li>Recruiter India</li>
//                                 <li>Post a Job</li>
//                             </ul>
//                         </div>
//                     </div>

//                     {/* App + Partners */}
//                     <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-10">

//                         {/* App Box */}
//                         <div className="bg-[#2f4a7f] rounded-xl px-6 py-5 flex justify-between items-center w-full md:w-[50%]">
//                             <div>
//                                 <h4 className="font-semibold text-lg">Download Jobnest App</h4>
//                                 <p className="text-sm text-gray-300">
//                                     Get the latest job updates instantly on the jobnest App
//                                 </p>
//                             </div>
//                             <button className="bg-[#3d5a96] px-5 py-2 rounded-lg text-sm hover:bg-[#4a6ab0]">
//                                 Get App ↗
//                             </button>
//                         </div>

//                         {/* Partner Logos */}
//                         <div>
//                              <p className="text-gray-200 mb-5 text-center">our partners site</p>
//                             <div className="flex gap-4 items-center">
//                                 <img src="https://www.shine.com/nova/assets/partner-sites/live-hindustan.svg" className="bg-white p-2 rounded-md" />
//                                 <img src="https://www.shine.com/nova/assets/partner-sites/live-mint.svg" className="bg-white p-2 rounded-md" />
//                                 <img src="https://www.shine.com/nova/assets/partner-sites/ott-play.svg" className="bg-white p-2 rounded-md" />
//                                 <img src="https://www.shine.com/nova/assets/partner-sites/fab-play.svg" className="bg-white p-2 rounded-md" />
//                                 <img src="https://www.shine.com/nova/assets/partner-sites/hindustan-times.svg" className="bg-white p-2 rounded-md" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bottom Bar */}
//                     <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-blue-400/20 text-sm text-gray-300">

//                         <div>© 2026 Jobnest.com | All Right Reserved</div>

//                         <div className="flex gap-4 my-3 md:my-0">
//                             <span>T&C</span>
//                             <span>|</span>
//                             <span>Privacy Policy</span>
//                             <span>|</span>
//                             <span>Cookie Policy</span>
//                             <span>|</span>
//                             <span>Report Job Posting</span>
//                         </div>

//                         {/* <div className="flex gap-4">
//               <Facebook size={18} />
//               <Instagram size={18} />
//               <Linkedin size={18} />
//               <Youtube size={18} />
//             </div> */}
//                     </div>

//                 </div>
//             </footer>
//         </>
//     );
// };

// export default Footer;
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
      {/* ================== EXPLORE JOBS SECTION ================== */}
      <div className="bg-[#f5f5f5] py-10">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Explore Jobs by Skills, Location, Companies & More
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">
            {[
              "Jobs by Skills",
              "Jobs by Designation",
              "Jobs by City",
              "Jobs By Company",
              "Jobs by Industry",
              "Popular Jobs",
            ].map((tab, i) => (
              <button
                key={i}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  i === 0
                    ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                    : "bg-white border-gray-300 text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
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
              <li className="text-yellow-600 cursor-pointer">• View All</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================== MAIN FOOTER ================== */}
      <footer className="bg-[#243b6b] text-white pt-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Top Links */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-blue-400/20">

            <div>
              <h3 className="font-semibold mb-4">Trending Blogs</h3>
              <h3 className="font-semibold">Trending Jobs</h3>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Important Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Employer Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Fraud Alert</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Job Seekers</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Register/Login</li>
                <li>Job Search</li>
                <li>Create Free Job Alert</li>
                <li>Job Assistance Services</li>
                <li>Courses</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Business News</li>
                <li>English News</li>
                <li>Disclaimer</li>
                <li>FAQ's</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Employers</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Register/Log-In</li>
                <li>Recruiter India</li>
                <li>Post a Job</li>
              </ul>
            </div>
          </div>

          {/* App + Partners */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-10">

            {/* App Box */}
            <div className="bg-[#2f4a7f] rounded-xl px-6 py-5 flex justify-between items-center w-full md:w-[50%]">
              <div>
                <h4 className="font-semibold text-lg">Download Jobnest App</h4>
                <p className="text-sm text-gray-300">
                  Get the latest job updates instantly on the jobnest App
                </p>
              </div>
              <button className="bg-[#3d5a96] px-5 py-2 rounded-lg text-sm hover:bg-[#4a6ab0]">
                Get App ↗
              </button>
            </div>

            {/* 🔥 PARTNER MARQUEE */}
            <div className="w-full md:w-[50%]">
              <p className="text-gray-200 mb-5 text-center">
                Our Partner Sites
              </p>

              <div className="relative overflow-hidden">

                {/* LEFT FADE */}
                <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#243b6b] to-transparent z-10" />

                {/* RIGHT FADE */}
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#243b6b] to-transparent z-10" />

                {/* MARQUEE */}
                <div className="marquee flex gap-6 items-center">
                  {[...partners, ...partners].map((logo, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg min-w-[120px] flex justify-center items-center opacity-80 hover:opacity-100 transition"
                    >
                      <img
                        src={logo}
                        alt="partner"
                        className="h-6 sm:h-8 object-contain"
                      />
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-blue-400/20 text-sm text-gray-300">
            <div>© 2026 Jobnest.com | All Right Reserved</div>

            <div className="flex gap-4 my-3 md:my-0">
              <span>T&C</span>
              <span>|</span>
              <span>Privacy Policy</span>
              <span>|</span>
              <span>Cookie Policy</span>
              <span>|</span>
              <span>Report Job Posting</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;