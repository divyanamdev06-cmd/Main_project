import React from "react";

const startups = [
  {
    name: "DeHaat",
    category: "Agri-Tech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/dehaat_circle_d.svg",
  },
  {
    name: "BharatPe",
    category: "Fintech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/bharatpe_circle_d.svg",
  },
  {
    name: "Jivi.AI",
    category: "Health-Tech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/jivai_circle_d.svg",
  },
  {
    name: "Gojek",
    category: "Health-Tech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/gojek_circle_d.svg",
  },
];

const TopStartups = () => {
  return (
    <div className="w-full bg-white py-16">
      {/* Heading */}
      <div className="flex justify-center items-center mb-12">
        <div className="bg-[#e9e9e9] px-6 py-2 rounded-full text-sm font-semibold text-gray-700 tracking-wide">
          TOP STARTUPS HIRING
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {startups.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition"
          >
            {/* Logo */}
            <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center mb-4">
              <img
                src={item.logo}
                alt={item.name}
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-800 text-lg">
              {item.name}
            </h3>

            {/* Category */}
            <p className="text-gray-400 text-sm mt-1">
              {item.category}
            </p>

            {/* Button */}
            <button className="mt-6 px-5 py-2 border border-yellow-400 text-yellow-600 rounded-full text-sm hover:bg-yellow-50 transition">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStartups;