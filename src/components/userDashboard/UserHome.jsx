export function UserHome() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-sm text-gray-500">Welcome back</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Student Dashboard
            </h2>
            <p className="section-subtitle mt-1">
              Track your applications and discover roles that match your skills.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary">Find Jobs</button>
            <button className="btn btn-outline">Update Profile</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <Card title="Enrolled Courses" value="5" />
        <Card title="Applications" value="3" />
        <Card title="Completed" value="2" />

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card p-5">
      <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
        {value}
      </p>
      <div className="mt-3 h-1.5 w-16 rounded-full bg-yellow-200" />
    </div>
  );
}