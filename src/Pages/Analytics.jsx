import { useEffect, useState } from "react";

export default function Analytics() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    activeJobs: 0,
  });

  // fake data (later connect API)
  useEffect(() => {
    setStats({
      users: 120,
      jobs: 45,
      applications: 230,
      activeJobs: 30,
    });
  }, []);

  return (
    <div className="mt-20 md:mt-16">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        📊 Analytics Dashboard
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Users" value={stats.users} />
        <Card title="Total Jobs" value={stats.jobs} />
        <Card title="Applications" value={stats.applications} />
        <Card title="Active Jobs" value={stats.activeJobs} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 font-semibold mb-4">
            Jobs Growth
          </h2>

          <div className="h-40 flex items-end gap-2">
            {[10, 20, 15, 25, 30, 18].map((h, i) => (
              <div
                key={i}
                className="bg-[#F6C85F] w-full rounded-t"
                style={{ height: `${h * 3}px` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 font-semibold mb-4">
            User Activity
          </h2>

          <div className="h-40 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-[12px] border-yellow-400 border-t-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white mt-6 p-6 h-48 rounded-xl shadow-md">
        <h2 className="text-gray-700 font-semibold mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>🧑 New user registered</li>
          <li>📄 New job posted</li>
          <li>📩 New application received</li>
          <li>⚙ Settings updated</li>
        </ul>
      </div>
    </div>
  );
}

/* Card Component */
function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-[#F6C85F] hover:shadow-xl transition">
      <h3 className="text-gray-400 text-xs font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-gray-700">{value}</p>
    </div>
  );
}