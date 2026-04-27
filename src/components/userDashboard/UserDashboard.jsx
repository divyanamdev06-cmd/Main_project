import { useState } from "react";
import {
    Home,
    BookOpen,
    FileText,
    User,
    Menu,
    Bell,
    LogOut
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function UserDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#e9f0f3]">

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 h-screen z-50 bg-[#F6C85F] text-white w-64 p-6 flex flex-col justify-between    transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition`}
            >
                <div>
                    <h1 className="text-xl font-bold text-center mb-20">
                        User Panel
                    </h1>

                    <nav className="space-y-3 text-center flex flex-col  gap-8 font-semibold text-lg">

                        <NavLink to="/user">
                            <NavItem icon={<Home size={18} />} label="Dashboard" />
                        </NavLink>

                        <NavLink to="/user/Findjobs">
                            <NavItem icon={<BookOpen size={18} />} label="Find Jobs" />
                        </NavLink>

                        <NavLink to="/user/applications">
                            <NavItem icon={<FileText size={18} />} label="Applications" />
                        </NavLink>

                        <NavLink to="/user/profile">
                            <NavItem icon={<User size={18} />} label="Profile" />
                        </NavLink>

                    </nav>
                </div>

                <NavLink to={"/"}>
                    <NavItem icon={<LogOut size={18} />} label="Logout" />
                </NavLink>

            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="sticky top-0 bg-white shadow-md h-25 px-6 flex items-center justify-between z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                            <Menu />
                        </button>

                        <h2 className="text-lg font-semibold text-gray-700">
                            USER DASHBOARD
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Bell className="text-gray-600" />

                        <NavLink to="/user/profile">
                            <div className="bg-yellow-400 text-white px-6 py-1 rounded-full  text-lg">
                                user
                            </div>
                        </NavLink>

                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-5xl mx-auto p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Nav Item */
function NavItem({ icon, label }) {
    return (
        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-white hover:text-yellow-600 transition">
            {icon}
            <span>{label}</span>
        </div>
    );
}