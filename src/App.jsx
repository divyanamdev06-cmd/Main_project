import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./Pages/LandingPage";
import Mainlayout from "./Layout/Main";
import ExploreJobsPage from "./Pages/ExploreJobsPage.jsx";
import BlogsPage from "./Pages/BlogsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AdminDashboard from "./components/AdminDashboard";
import AllUsers from "./Pages/AllUsers";
import Admindashboarddefault from "./components/admindashboard/Admindashboarddefault";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";

import UserDashboard from "./components/userDashboard/UserDashboard";
import { UserHome } from "./components/userDashboard/UserHome";
import FindJobs from "./components/userDashboard/FindJobs";
import UserProfile from "./components/userDashboard/UserProfile";
import Applications from "./components/userDashboard/Applications";
import Categories from "./Pages/category";
import AdminSettings from "./Pages/AdminSettings";
import Analytics from "./Pages/Analytics";

import RecruiterDashboard from "./components/recruiterDashboard/RecruiterDashboard.jsx";
import RecruiterHome from "./components/recruiterDashboard/RecruiterHome.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route index element={<LandingPage />} />
          <Route path="explore-jobs" element={<ExploreJobsPage />} />
          <Route path="blogs" element={<BlogsPage />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            // <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Admindashboarddefault />} />
          <Route path="alluser" element={<AllUsers />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="category" element={<Categories />} />
          <Route path="profile" element={<Profile />} />
          <Route path="adminsettings" element={<AdminSettings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserHome />} />
          <Route path="findjobs" element={<FindJobs />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="applications" element={<Applications />} />
        </Route>

        <Route
          path="/recruiter"
          element={
            <ProtectedRoute roles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecruiterHome />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-white">
              <div className="container-app py-16">
                <div className="card p-8 text-center">
                  <div className="text-2xl font-extrabold text-gray-900">Page not found</div>
                  <p className="section-subtitle mt-2">The page you’re looking for doesn’t exist.</p>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
