import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";
import Benefits from "../components/Benefits";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <ProductGrid />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}