import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import LandingPage from "../Pages/LandingPage";
import Footer from "../components/Footer";

export default function Mainlayout(){
    return(
        <>
        <Navbar />
        <Outlet />
        </>
    );
}