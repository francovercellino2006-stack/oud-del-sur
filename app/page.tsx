import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import BestSellers from "../components/BestSellers";
import Testimonials from "../components/Testimonials";
import Brands from "../components/Brands";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <BestSellers />
      <Testimonials />
      <Brands />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}