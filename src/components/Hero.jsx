import React from "react";


const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 py-16">
      
      <div className="max-w-5xl mx-auto text-center px-4">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Search Your Dream Job
        </h1>

        <p className="text-gray-600 mb-8">
          Discover 5 lakh+ Job Opportunities
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-full shadow-md flex flex-col md:flex-row items-center overflow-hidden">
          
          <input
            type="text"
            placeholder="Enter Skills / Roles"
            className="flex-1 px-4 py-3 outline-none"
          />

          <input
            type="text"
            placeholder="Select Experience"
            className="flex-1 px-4 py-3 outline-none border-t md:border-t-0 md:border-l"
          />

          <input
            type="text"
            placeholder="Enter Location"
            className="flex-1 px-4 py-3 outline-none border-t md:border-t-0 md:border-l"
          />

          <button className="bg-yellow-400 px-6 py-3 font-semibold">
            Search
          </button>
        </div>

        {/* Extra Info */}
        <div className="mt-6 inline-block bg-yellow-100 px-6 py-2 rounded-full text-sm border border-yellow-200 hover:-translate-y-1 hover:shadow-md">
          💰 Are you underpaid? Check benchmarks →
        </div>

        {/* Companies */}
        <div className="mt-10 text-gray-400 text-sm font-bold">
          TRUSTED BY TOP ENTERPRISES
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4 text-gray-700 font-semibold">
          <span>Capgemini</span>
          <span>Genpact</span>
          <span>ICICI Bank</span>
          <span>Kotak</span>
          <span>Tech Mahindra</span>
        </div>

        {/* Illustration */}
        <div className="mt-10 flex justify-center">
          <img
            src="./src/assets/hero1.jpg.png"
            alt="illustration"
            className="w-64"
          />
        </div>

      </div>
    </div>

    
  );
};

export default Hero;