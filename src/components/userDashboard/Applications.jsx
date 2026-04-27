import React, { useEffect, useState } from "react";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  // Dummy Data (replace with API later)
  useEffect(() => {
    const demoApplications = [
      {
        _id: 1,
        jobTitle: "Frontend Developer",
        company: "Tech Solutions",
        status: "Pending",
        appliedAt: "2026-04-20",
      },
      {
        _id: 2,
        jobTitle: "Backend Developer",
        company: "CodeCraft",
        status: "Accepted",
        appliedAt: "2026-04-18",
      },
      {
        _id: 3,
        jobTitle: "UI/UX Designer",
        company: "DesignHub",
        status: "Rejected",
        appliedAt: "2026-04-15",
      },
    ];

    setApplications(demoApplications);
  }, []);

  // Status Color
  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
  };

  return (
    <div>
      {/* Heading */}
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          My Applications
        </h1>
        <p className="section-subtitle mt-1">
          Track your application status and withdraw if needed.
        </p>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="card p-5 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">

              {/* Left */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {app.jobTitle}
                </h2>
                <p className="text-gray-600">{app.company}</p>

                <p className="text-sm text-gray-500 mt-1">
                  Applied on: {app.appliedAt}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center justify-between md:flex-col md:items-end gap-3">

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>

                <button className="btn btn-ghost text-sm text-red-600 hover:bg-red-50">
                  Withdraw
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}