import {
  AppWindow,
  BarChart2,
  Home,
  Settings,
  Tags,
  UserRoundPen,
  Users,
} from "lucide-react";
import DashboardLayout from "./layout/DashboardLayout.jsx";

const navItems = [
  { to: "/admin", end: true, label: "Dashboard", icon: Home },
  { to: "/admin/alluser", label: "All users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/admin/jobs", label: "Jobs", icon: AppWindow },
  { to: "/admin/category", label: "Categories", icon: Tags },
  { to: "/admin/adminsettings", label: "Settings", icon: Settings },
  { to: "/admin/profile", label: "Profile", icon: UserRoundPen },
];

export default function AdminDashboard() {
  return <DashboardLayout variant="admin" navItems={navItems} showHeaderSearch />;
}
