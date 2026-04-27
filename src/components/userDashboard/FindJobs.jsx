import React, { useEffect, useState } from "react";

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
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Find Jobs
        </h1>
        <p className="section-subtitle mt-1">
          Browse curated roles and apply in one click.
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="card p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900">
              {job.title}
              </h2>
              <span className="badge badge-soft">{job.type}</span>
            </div>

            <p className="text-gray-600 mt-1">{job.company}</p>

            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p>📍 {job.location}</p>
              <p>💰 {job.salary}</p>
            </div>

            <button className="mt-4 w-full btn btn-primary">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}