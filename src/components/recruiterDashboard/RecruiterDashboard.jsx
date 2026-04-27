import { BarChart2, Briefcase, FileText, Home, Tags, User } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout.jsx";

const navItems = [
  { to: "/recruiter", end: true, label: "Dashboard", icon: Home },
  { to: "/recruiter/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/recruiter/jobs", label: "Job posts", icon: Briefcase },
  { to: "/recruiter/applications", label: "Applications", icon: FileText },
  { to: "/recruiter/categories", label: "Categories", icon: Tags },
  { to: "/recruiter/profile", label: "Company profile", icon: User },
];

export default function RecruiterDashboard() {
  return <DashboardLayout variant="recruiter" navItems={navItems} />;
}
