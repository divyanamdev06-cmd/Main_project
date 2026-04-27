import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  // const API = "http://localhost:3000/api/v1/job";

  // Dummy data (later replace with API)
  useEffect(() => {
    const demoJobs = [
      {
        _id: 1,
        title: "Frontend Developer",
        company: "Tech Solutions",
        location: "Indore",
        type: "Full-time",
        salary: "₹25,000 - ₹40,000",
      },
      {
        _id: 2,
        title: "Backend Developer",
        company: "CodeCraft",
        location: "Bhopal",
        type: "Part-time",
        salary: "₹20,000 - ₹35,000",
      },
      {
        _id: 3,
        title: "UI/UX Designer",
        company: "DesignHub",
        location: "Remote",
        type: "Internship",
        salary: "₹10,000 - ₹15,000",
      },
    ];

    setJobs(demoJobs);
  }, []);

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        Find Jobs
      </h1>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition border-l-4 border-yellow-400"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {job.title}
            </h2>

            <p className="text-gray-600 mt-1">{job.company}</p>

            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p>📍 {job.location}</p>
              <p>💼 {job.type}</p>
              <p>💰 {job.salary}</p>
            </div>

            <button className="mt-4 w-full bg-[#F6C85F] text-white py-2 rounded-lg hover:bg-yellow-500 transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}