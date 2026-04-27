import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectEffectiveRole } from "../store/authSlice.js";

function workspacePath(role) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/user";
}

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const role = useSelector(selectEffectiveRole);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="container-app flex flex-wrap items-center justify-between gap-3 py-4">
        <NavLink to="/">
          <div className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            Jobnest<span className="text-yellow-500">.com</span>
          </div>
        </NavLink>

        <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/explore-jobs", label: "Explore Jobs" },
            { to: "/blogs", label: "Blogs" },
          ].map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 transition ${
                  isActive ? "bg-yellow-50 text-yellow-800" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {token ? (
            <>
              <NavLink
                to={workspacePath(role)}
                className="btn btn-primary text-sm sm:text-base no-underline"
              >
                Dashboard
              </NavLink>
              <button type="button" onClick={handleLogout} className="btn btn-outline text-sm sm:text-base">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signup" className="btn btn-primary text-sm sm:text-base no-underline">
                Register
              </NavLink>
              <NavLink to="/login" className="btn btn-outline text-sm sm:text-base no-underline">
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
