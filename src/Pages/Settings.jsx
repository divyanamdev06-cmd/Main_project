export default function Settings() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">

      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Profile Settings
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Name" />
          <input className="border p-2 rounded" placeholder="Email" />
          <input className="border p-2 rounded" placeholder="Mobile" />
          <input className="border p-2 rounded" placeholder="Bio" />
        </div>

        <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>

      {/* Password */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Change Password
        </h2>

        <input className="border p-2 rounded w-full mb-3" placeholder="New Password" />
        <input className="border p-2 rounded w-full" placeholder="Confirm Password" />

        <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded">
          Update Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Notifications
        </h2>

        <div className="space-y-3">
          <label className="flex justify-between">
            <span>New User</span>
            <input type="checkbox" />
          </label>

          <label className="flex justify-between">
            <span>Job Posted</span>
            <input type="checkbox" />
          </label>

          <label className="flex justify-between">
            <span>Applications</span>
            <input type="checkbox" />
          </label>
        </div>
      </div>

    </div>
  );
}