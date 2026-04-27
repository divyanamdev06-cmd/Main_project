import React, { useState } from "react";
import { Briefcase, BarChart, Laptop, Database, Headphones, Shield, Building2, User } from "lucide-react";

const categories = [
  { name: "Operations", icon: <Briefcase size={26} /> },
  { name: "Marketing", icon: <BarChart size={26} /> },
  { name: "Sales", icon: <Briefcase size={26} /> },
  { name: "IT & Software", icon: <Laptop size={26} /> },
  { name: "Data Science", icon: <Database size={26} /> },
  { name: "Customer Service", icon: <Headphones size={26} /> },
  { name: "Insurance", icon: <Shield size={26} /> },
  { name: "BFSI", icon: <Building2 size={26} /> },
  { name: "HR", icon: <User size={26} /> },
];

const workModes = [
  { name: "Remote", icon: <Laptop size={26} /> },
  { name: "Hybrid", icon: <Building2 size={26} /> },
  { name: "On-site", icon: <Briefcase size={26} /> },
  { name: "Flexible hours", icon: <Headphones size={26} /> },
  { name: "Shift-based", icon: <BarChart size={26} /> },
];

const ExploreJobs = () => {
  const [activeTab, setActiveTab] = useState("category");
  const items = activeTab === "category" ? categories : workModes;

  return (
    <section className="border-t border-gray-100 bg-gray-50/80 py-12 sm:py-16">
      <div className="container-app text-center">
        <span className="badge badge-soft">Explore jobs</span>

        <h2 className="section-title mx-auto mt-4 max-w-2xl">
          Browse by category or how you like to work
        </h2>
        <p className="section-subtitle mx-auto mt-2 max-w-xl">
          Switch tabs to explore popular functions or work arrangements.
        </p>

        <div className="mt-8 flex w-full justify-center px-1">
          <div
            className="flex w-full max-w-md flex-col gap-1 rounded-2xl border border-gray-200/90 bg-white/95 p-1 shadow-md shadow-gray-900/5 ring-1 ring-black/5 sm:inline-flex sm:w-auto sm:max-w-none sm:flex-row sm:gap-0"
            role="tablist"
            aria-label="Explore jobs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "category"}
              onClick={() => setActiveTab("category")}
              className={`min-h-[44px] w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:w-auto sm:min-h-0 sm:px-6 ${
                activeTab === "category"
                  ? "bg-[#F6C85F] text-gray-900 shadow-sm ring-1 ring-amber-300/50"
                  : "text-gray-600 hover:bg-amber-50/80"
              }`}
            >
              By category
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "mode"}
              onClick={() => setActiveTab("mode")}
              className={`min-h-[44px] w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:w-auto sm:min-h-0 sm:px-6 ${
                activeTab === "mode"
                  ? "bg-[#F6C85F] text-gray-900 shadow-sm ring-1 ring-amber-300/50"
                  : "text-gray-600 hover:bg-amber-50/80"
              }`}
            >
              By work mode
            </button>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                className="card group flex h-full w-full flex-col items-center justify-center gap-3 p-5 text-center transition hover:border-yellow-200/80 hover:shadow-md"
              >
                <span className="text-[#243b6b] transition group-hover:text-yellow-700">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ExploreJobs;
