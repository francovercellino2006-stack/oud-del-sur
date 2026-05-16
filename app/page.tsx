import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import BestSellers from "../components/BestSellers";
import Testimonials from "../components/Testimonials";
import Brands from "../components/Brands";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import { getPerfumes } from "../lib/queries";

export default async function Home() {
  const perfumes = await getPerfumes();

  return (
    <>
      <Navbar />
      <Hero perfumes={perfumes} />
      <Benefits />
      <BestSellers perfumes={perfumes} />
      <Testimonials />
      <Brands />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
