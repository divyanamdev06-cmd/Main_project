export function UserHome() {
  return (
    <div className="space-y-6 text-center">

      <h2 className="text-xl font-semibold text-gray-700">
        Welcome Student 👋
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <Card title="Enrolled Courses" value="5" />
        <Card title="Applications" value="3" />
        <Card title="Completed" value="2" />

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-400">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}