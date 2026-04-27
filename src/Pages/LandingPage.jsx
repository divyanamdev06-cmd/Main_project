import Hero from "../components/Hero";
import Cards from "../components/Cards";
import CoolPlaces from "../components/CoolPlaces";
import TopStartups from "../components/TopStartups";
import Blogs from "../components/Blogs";
import Footer from "../components/Footer";
import ExploreJobs from "../components/ExploreJobs";

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Hero />
      <Cards />
      <ExploreJobs />
      <CoolPlaces />
      <TopStartups />
      <Blogs />
      <Footer />
    </main>
  );
}
