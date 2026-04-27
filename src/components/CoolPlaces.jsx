// import React from "react";

// const companies = [
//   "Kotak",
//   "LTIMindtree",
//   "NTT DATA",
//   "Capgemini",
//   "Reliance Nippon",
//   "Jio",
//   "Hewlett Packard",
// ];

// const CoolPlaces = () => {
//   return (
//     <div className="w-full bg-[#f6eddc] py-16 overflow-hidden">
//       {/* Heading */}
//       <div className="flex justify-center items-center mb-10">
//         <div className="bg-[#e9dfc9] px-6 py-2 rounded-full text-sm font-semibold tracking-wide text-gray-700 shadow-sm">
//           COOL PLACES TO WORK
//         </div>
//       </div>

//       {/* Marquee */}
//       <div className="relative w-full overflow-hidden">
//         <div className="flex gap-6 animate-marquee whitespace-nowrap">
//           {companies.concat(companies).map((company, index) => (
//             <div
//               key={index}
//               className="bg-white px-8 py-4 rounded-xl shadow-sm flex items-center justify-center min-w-[180px]"
//             >
//               <span className="text-gray-600 font-medium">
//                 {company}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom Illustration */}
//       <div className="flex justify-center mt-16">
//         <img
//           src="https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/img_coolPlaceToWork.svg"
//           alt="working illustration"
//           className="w-[300px] opacity-90"
//         />
//       </div>
//     </div>
//   );
// };

// export default CoolPlaces;
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
    <div className="w-full bg-gradient-to-b from-[#f6eddc] to-[#e8dab8] py-16">

      {/* Container (IMPORTANT for left-right spacing) */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#e9dfc9] px-6 py-2 rounded-full text-sm font-semibold text-gray-700 shadow">
            COOL PLACES TO WORK
          </div>
        </div>

        {/* Marquee Wrapper */}
        <div className="marquee flex gap-6 items-center">

          {[...companies, ...companies].map((logo, index) => (
            <div
              key={index}
              className="bg-white px-6 py-4 rounded-2xl shadow-sm flex items-center justify-center min-w-[160px] sm:min-w-[180px] hover:shadow-md transition"
            >
              <img
                src={logo}
                alt="company"
                className="h-8 sm:h-10 object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}

        </div>

        {/* Illustration */}
        <div className="flex justify-center mt-16">
          <img
            src="https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/img_coolPlaceToWork.svg"
            alt=""
            className="w-[360px] md:w-[350px]"
          />
        </div>

      </div>
    </div>
  );
};

export default CoolPlaces;