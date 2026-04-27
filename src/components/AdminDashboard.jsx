// 


import { useState } from "react";
import {
  Home,
  Users,
  BarChart2,
  Settings,
  Menu,
  Bell,
  Search,
  AppWindowMac,
  UserRoundPen,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#e9f0f3]">

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 bg-[#F6C85F] text-gray-500  shadow-xl w-64 p-6 text-center space-y-8 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        {/* Profile */}
       

          
        <div className="text-center">
          <div className="w-16 h-16 mx-auto  rounded-full bg-white text-yellow-500 flex items-center justify-center font-bold text-xl">
            D
          </div>
          <h1 className="text-lg font-bold mt-2">Admin Panel</h1>
          <p className="text-xs opacity-90">Divya Namdev</p>
        </div>
         
       

        {/* Menu */}
        <nav className="space-y-2 ml-9 text-sm font-semibold  flex flex-col  items-start  p-2 gap-5 ">
          <NavLink to={"/admin"}>
            <NavItem icon={<Home size={18} />} label="Dashboard" />
          </NavLink>

          <NavLink to={"/admin/alluser"}>
            <NavItem icon={<Users size={18} />} label="AllUsers" />
          </NavLink>
           
           <NavLink  to={"/admin/analytics"}>

          <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
           </NavLink>

          <NavLink to={"/admin/jobs"}>
          <NavItem icon={<AppWindowMac size={18} />} label="Job" />
          </NavLink>

          <NavLink to="/admin/category">
            <NavItem icon={<AppWindowMac size={18}/>} label ="catogory"/>
          </NavLink>

       
           <NavLink to={"/admin/adminsettings"}>

          <NavItem icon={<Settings size={18} />} label="Settings" />
           </NavLink>
        

          <NavLink to={"/admin/profile"}>
          <NavItem icon={<UserRoundPen size={18} />} label="Profile" />
          </NavLink>

          
        </nav>
        <NavLink to={"/"}>

        <div className="pt-10 text-lg text-gray-600 ml-7">
            <NavItem icon={<UserRoundPen size={18} />} label="Logout" />
          </div>
        </NavLink>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md h-16 px-6 flex items-center justify-between z-40 md:ml-64">
        {/* <header className="bg-white   shadow-md h-16 px-6 flex items-center justify-between"> */}
        {/* <header className="fixed top-0 left-0  bg-white shadow-md h-16 px-6 flex items-center justify-between z-50"> */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu />
            </button>

            <h2 className="text-lg font-semibold text-gray-700">
              DASHBOARD
            </h2>

            <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-lg ml-6">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none px-2 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="text-gray-600" />
            <NavLink to={"/admin/profile"}>

            <div className="bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-medium">
              Admin
            </div>
            </NavLink>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">

          {/* Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card title="TOTAL PUBLISHED" value="326" />
            <Card title="MONTHLY PUBLISHED" value="20" />
            <Card title="TOTAL VISITS" value="1,256" />
            <Card title="MONTHLY STATISTICS" value="26%" />
          </div> */}

        
          
          {/* Nested Routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* Nav Item */
function NavItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition hover:bg-white hover:text-yellow-600">
      {icon}
      <span>{label}</span>
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