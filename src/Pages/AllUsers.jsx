import { useEffect, useState } from "react";
import axios from "axios";

export default function AllUsers() {
 const [users, setUsers] = useState([]);

  // 👉 API call (backend se data lana)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/getalluser");
        setUsers(res.data.data); // backend me users array hona chahiye
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full max-w-6xl mt-10 p-6">

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        All Users
      </h2>

      {/* Table Card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">

        <table className="w-full text-sm text-left">

          {/* Table Head */}
          <thead className="bg-yellow-400 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Skills</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {user.status || "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {users.length === 0 && (
          <p className="text-center py-6 text-gray-400">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}