import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { apiGet, extractList, getApiErrorMessage } from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const payload = await apiGet("/user/getalluser");
        setUsers(extractList(payload, ["data", "users"]));
      } catch (err) {
        setUsers([]);
        const msg = getApiErrorMessage(err);
        const lower = msg.toLowerCase();
        if (lower.includes("no users")) {
          toast({
            type: "info",
            title: "No users",
            message: msg,
          });
        } else {
          toast({
            type: "error",
            title: "Failed to load users",
            message: msg,
          });
        }
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full max-w-6xl space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge badge-soft inline-flex items-center gap-1.5">
            <Users size={14} strokeWidth={2} aria-hidden />
            Directory
          </span>
          <h2 className="section-title mt-3">All users</h2>
          <p className="section-subtitle mt-1 max-w-xl">
            Everyone registered on the platform — same look as the rest of your admin workspace.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200/90 bg-white/90 px-4 py-2.5 text-center shadow-sm sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</p>
          <p className="text-2xl font-bold tabular-nums text-gray-900">{users.length}</p>
        </div>
      </div>

      <div className="card overflow-hidden border-amber-100/60 shadow-sm ring-1 ring-black/5">
        <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[640px] w-full border-collapse text-left text-sm sm:min-w-[720px]">
            <thead>
              <tr className="border-b border-amber-100/80 bg-linear-to-r from-amber-50/95 to-yellow-50/80">
                <th className="whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-4">
                  Name
                </th>
                <th className="whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-4">
                  Email
                </th>
                <th className="whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-4">
                  Contact
                </th>
                <th className="whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-4">
                  Role
                </th>
                <th className="whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-4">
                  Status
                </th>
                <th className="min-w-32 px-3 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 sm:px-4">
                  Skills
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((user) => (
                <tr
                  key={user._id || user.email}
                  className="transition hover:bg-amber-50/40"
                >
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-gray-900 sm:px-4">
                    {user.name}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-3 text-gray-600 sm:max-w-none sm:whitespace-nowrap sm:px-4">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">{user.mobile || "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3 capitalize text-gray-700 sm:px-4">{user.role}</td>
                  <td className="px-3 py-3 sm:px-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === "Active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {user.status || "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-600 sm:px-4">
                    <span className="line-clamp-2 sm:line-clamp-none">
                      {Array.isArray(user.skills) ? user.skills.join(", ") : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-12 text-center">
            <p className="text-sm font-medium text-gray-600">No users found</p>
            <p className="mt-1 text-xs text-gray-400">Try again later or check your API connection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
