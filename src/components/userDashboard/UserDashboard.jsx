import { BookOpen, FileText, Home, User } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout.jsx";

const navItems = [
  { to: "/user", end: true, label: "Dashboard", icon: Home },
  { to: "/user/findjobs", label: "Find jobs", icon: BookOpen },
  { to: "/user/applications", label: "Applications", icon: FileText },
  { to: "/user/profile", label: "Profile", icon: User },
];

export default function UserDashboard() {
  return <DashboardLayout variant="seeker" navItems={navItems} />;
}
