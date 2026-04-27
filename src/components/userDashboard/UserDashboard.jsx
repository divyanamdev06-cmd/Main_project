import { useState } from "react";
import {
    Home,
    BookOpen,
    FileText,
    User,
    Menu,
    Bell,
    LogOut,
    X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";

export default function UserDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authUser = useSelector((s) => s.auth.user);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        closeSidebar();
        navigate("/", { replace: true });
    };

    return (
        <div className="relative flex h-screen overflow-hidden bg-linear-to-b from-[#e9f0f3] via-amber-50/30 to-[#e9f0f3]">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-40 bg-gray-900/45 backdrop-blur-[2px] transition-opacity md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col justify-between border-r border-amber-200/50 bg-linear-to-b from-amber-50 via-[#fff8e7] to-amber-100/90 p-4 pb-5 shadow-[4px_0_32px_-12px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out sm:max-w-none ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div>
                    <div className="mb-2 flex justify-end md:hidden">
                        <button
                            type="button"
                            onClick={closeSidebar}
                            className="rounded-xl p-2 text-gray-600 transition hover:bg-white/80"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="card mb-6 border-amber-100/80 bg-white/90 p-4 text-center shadow-sm ring-1 ring-amber-100/60">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#F6C85F] to-amber-400 text-sm font-bold text-gray-900 shadow-inner ring-2 ring-white">
                            U
                        </div>
                        <h1 className="mt-3 text-base font-bold tracking-tight text-gray-900">User Panel</h1>
                        <p className="mt-0.5 text-xs font-medium text-gray-500">{authUser?.name || "Your career hub"}</p>
                    </div>

                    <nav className="flex flex-col gap-1 text-sm font-semibold">
                        <NavLink
                            to="/user"
                            end
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                                    isActive
                                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-amber-200/80"
                                        : "text-gray-700 hover:bg-white/70"
                                }`
                            }
                        >
                            <NavItem icon={<Home size={18} strokeWidth={2} />} label="Dashboard" />
                        </NavLink>

                        <NavLink
                            to="/user/findjobs"
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                                    isActive
                                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-amber-200/80"
                                        : "text-gray-700 hover:bg-white/70"
                                }`
                            }
                        >
                            <NavItem icon={<BookOpen size={18} strokeWidth={2} />} label="Find Jobs" />
                        </NavLink>

                        <NavLink
                            to="/user/applications"
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                                    isActive
                                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-amber-200/80"
                                        : "text-gray-700 hover:bg-white/70"
                                }`
                            }
                        >
                            <NavItem icon={<FileText size={18} strokeWidth={2} />} label="Applications" />
                        </NavLink>

                        <NavLink
                            to="/user/profile"
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                                    isActive
                                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-amber-200/80"
                                        : "text-gray-700 hover:bg-white/70"
                                }`
                            }
                        >
                            <NavItem icon={<User size={18} strokeWidth={2} />} label="Profile" />
                        </NavLink>
                    </nav>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 flex w-full items-center gap-3 rounded-xl border border-amber-200/60 bg-white/50 px-3 py-2.5 text-left text-gray-800 transition hover:bg-white/90"
                >
                    <NavItem icon={<LogOut size={18} strokeWidth={2} />} label="Logout" />
                </button>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col md:ml-64">
                <header className="fixed top-0 right-0 left-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-amber-100/80 bg-white/90 px-3 shadow-sm backdrop-blur-md sm:h-16 sm:px-5 md:left-64">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen((o) => !o)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-700 transition hover:bg-amber-50 md:hidden"
                            aria-expanded={sidebarOpen}
                            aria-label="Toggle menu"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700/90 sm:text-xs">Workspace</p>
                            <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg">User dashboard</h2>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                        <button
                            type="button"
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-amber-50 hover:text-gray-900"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F6C85F] ring-2 ring-white" />
                        </button>
                        <NavLink
                            to="/user/profile"
                            onClick={closeSidebar}
                            className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-linear-to-r from-amber-50 to-white py-1 pl-1 pr-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-amber-300 hover:shadow"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6C85F] text-xs font-bold text-gray-900">
                                U
                            </span>
                            <span className="hidden sm:inline">Account</span>
                        </NavLink>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto pt-17 sm:pt-20">
                    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon, label }) {
    return (
        <>
            <span className="shrink-0 text-gray-600">{icon}</span>
            <span className="truncate">{label}</span>
        </>
    );
}
