import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectEffectiveRole } from "../store/authSlice.js";

function homePathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/user";
}

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @param {string[]} [props.roles] — if set, user must have one of these roles (after normalization).
 */
export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const token = useSelector((s) => s.auth.token);
  const effectiveRole = useSelector(selectEffectiveRole);

  const allowed = useMemo(() => {
    if (!roles?.length) return true;
    return roles.includes(effectiveRole);
  }, [roles, effectiveRole]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowed) {
    return <Navigate to={homePathForRole(effectiveRole)} replace />;
  }

  return children;
}
