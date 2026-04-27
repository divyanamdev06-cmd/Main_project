import Hero from "../components/Hero";
import Cards from "../components/Cards";
import ExploreJobs from "../components/ExploreJobs";
import TopStartups from "../components/TopStartups";
import Testimonials from "../components/Testimonials";
import CoolPlaces from "../components/CoolPlaces";
import Blogs from "../components/Blogs";
import Footer from "../components/Footer";

/**
 * Landing story: promise (Hero) → who we serve (Cards) → live product (ExploreJobs)
 * → sectors → testimonials → education → footer.
 */
export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Hero />
      <Cards />
      <ExploreJobs />
      <TopStartups />
      <Testimonials />
      <CoolPlaces />
      <Blogs />
      <Footer />
    </main>
  );
}
