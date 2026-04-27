import React from "react";

const Cards = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* LEFT CARD */}
        <div className="bg-[#f3e9df] rounded-xl p-8 flex items-center justify-between">
          
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold leading-snug">
              Empower <span className="text-orange-500">Skills</span><br />
              Elevate <span className="text-orange-500">Career</span>
            </h2>

            <p className="text-gray-600 mt-3">
              Connect with top 1% mentors
            </p>

            <button className="mt-6 bg-white px-5 py-2 rounded-lg shadow font-medium">
              Upcoming Events →
            </button>
          </div>

          {/* Image */}
          <img
            src="https://i.pinimg.com/1200x/6f/e2/aa/6fe2aa853ec78e80c1e977ac21423187.jpg"
            alt="skills"
            className="w-32 hidden md:block"
          />
        </div>

        {/* RIGHT CARD */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-8 flex items-center justify-between">
          
          {/* Text */}
          <div>
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              NOW LIVE
            </span>

            <h2 className="text-3xl font-bold mt-3">
              Jobnest <span className="text-blue-600">Express</span>
            </h2>

            <p className="text-gray-700 mt-2">
              AI That Hires For You
            </p>

            <p className="text-gray-600 mt-1">
              Post a job today. Find the right talent
            </p>

            <button className="mt-6 bg-white px-5 py-2 rounded-lg shadow font-medium">
              Post a Job →
            </button>
          </div>

          {/* Image */}
          <img
            src="https://i.pinimg.com/736x/b7/75/05/b7750506d2603c7387be7fa687465de2.jpg"
            alt="express"
            className="w-32 hidden md:block"
          />
        </div>

      </div>
    </div>
  );
};

export default Cards;