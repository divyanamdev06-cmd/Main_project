import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./Pages/LandingPage";
import Mainlayout from "./Layout/Main";

//admin dashboard side
import AdminDashboard from "./components/AdminDashboard";
import AllUsers from "./Pages/AllUsers";
import Admindashboarddefault from "./components/admindashboard/Admindashboarddefault";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";

//user dashboard side
import UserDashboard from "./components/userDashboard/UserDashboard";
import { UserHome } from "./components/userDashboard/UserHome";
import FindJobs from "./components/userDashboard/FindJobs";
import UserProfile from "./components/userDashboard/UserProfile";
import Applications from "./components/userDashboard/Applications";
import Categories from "./Pages/category";
import AdminSettings from "./Pages/AdminSettings";
import Analytics from "./Pages/Analytics";





function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Mainlayout />}>
            <Route index element={<LandingPage />} />
             
          </Route>

    //login/sighnup router
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

    //admin dashboard router
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Admindashboarddefault />} />
            <Route path="alluser" element={<AllUsers />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="category" element={<Categories />} />
            <Route path="profile" element={<Profile />} />
            <Route path="adminsettings" element={<AdminSettings />} />
             <Route path="analytics" element={<Analytics />} />
          </Route>


    //user dashboard router
          <Route path="/user" element={<UserDashboard />}>
            <Route index element={<UserHome />} />
            <Route path="Findjobs" element={<FindJobs />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="/user/applications" element={<Applications />} />


          </Route>



        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
