import React from "react";
import { NavLink } from "react-router-dom";




const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <NavLink to={"/"}>
          <div className="text-2xl font-bold text-yellow-500">
            Jobnest<span className="text-yellow-500">.com</span>
          </div>

        </NavLink>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <NavLink to={"/"}>
            <a href="#">Home</a>
          </NavLink>

          <NavLink to={"/ExploreJobs"}>
            <a href="#">Exploer Jobs</a>
          </NavLink>

          {/* <a href="#">Job Alerts</a> */}
          {/* <NavLink to="/blogs">Blogs</NavLink> */}
          {/* <NavLink to="/explore-jobs">Explore Jobs</NavLink> */}
          <NavLink to={"/Blogs"}>
            <a href="#">Blogs</a>
          </NavLink>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <NavLink to={"/signup"}>
            <button className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold">
              Register
            </button>
          </NavLink>


          <NavLink to={"/login"}>
            <button className="border px-4 py-2 rounded-lg font-semibold">
              Login
            </button>
          </NavLink>
        </div>

      </div>
    </nav >
  );
};

export default Navbar;
