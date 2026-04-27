export default function  Admindashboarddefault() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 mt-16 md:ml-64">

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">

        <Card title="TOTAL USERS" value="120" />
        <Card title="ACTIVE USERS" value="98" />
        <Card title="TOTAL JOBS" value="45" />
        <Card title="APPLICATIONS" value="210" />

      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Graph */}
        <div className="bg-white p-6 rounded-xl shadow-md h-64 flex items-center justify-center text-gray-400">
          📊 Graph Area
        </div>

        {/* Activity */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-600 font-semibold mb-4">
            Recent Activity
          </h3>

          <ul className="space-y-3 text-sm text-gray-500">
            <li>✅ New user registered</li>
            <li>📌 Job posted</li>
            <li>👤 Profile updated</li>
            <li>📄 Application submitted</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

/* Card */
function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition border-l-4 border-yellow-400">
      <h3 className="text-gray-400 text-xs font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-gray-700">{value}</p>
    </div>
  );
}