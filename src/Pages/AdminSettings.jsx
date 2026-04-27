import { useState } from "react";

export default function AdminSettings() {
  const [form, setForm] = useState({
    name: "Admin",
    email: "admin@gmail.com",
    password: "",
  });

  return (
    <div className="mt-20 md:mt-16">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        ⚙ Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar Settings Menu */}
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          <p className="font-semibold text-gray-600">Settings Menu</p>

          <button className="w-full text-left px-4 py-2 rounded-lg bg-[#F6C85F] text-white">
            Profile Settings
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Security
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Notifications
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            System
          </button>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Profile Settings
          </h2>

          <div className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Save Button */}
            <button className="bg-[#F6C85F] hover:bg-yellow-400 text-white px-6 py-2 rounded-lg transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Extra Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="font-semibold text-gray-700 mb-2">
            Notification Settings
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Manage alerts & emails
          </p>

          <button className="bg-[#F6C85F] text-white px-4 py-2 rounded-lg">
            Enable Notifications
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="font-semibold text-gray-700 mb-2">
            System Settings
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Control system behavior
          </p>

          <button className="bg-red-400 text-white px-4 py-2 rounded-lg">
            Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  );
}