export default function  Admindashboarddefault() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">

        <Card title="TOTAL USERS" value="120" />
        <Card title="ACTIVE USERS" value="98" />
        <Card title="TOTAL JOBS" value="45" />
        <Card title="APPLICATIONS" value="210" />

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Graph */}
        <div className="card p-6 h-72 flex items-center justify-center text-gray-400">
          📊 Graph Area
        </div>

        {/* Activity */}
        <div className="card p-6">
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
    <div className="card p-5">
      <h3 className="text-gray-500 text-xs font-semibold">{title}</h3>
      <p className="text-3xl font-extrabold mt-2 text-gray-900">{value}</p>
      <div className="mt-3 h-1.5 w-16 rounded-full bg-yellow-200 mx-auto" />
    </div>
  );
}