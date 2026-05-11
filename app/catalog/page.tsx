import Navbar from "../../components/Navbar";
import CatalogGrid from "../../components/CatalogGrid";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";

export default function CatalogPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0B0B0B] pt-32">
        <div className="px-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-5xl font-bold text-white">
              Catálogo Premium
            </h1>

            <p className="mt-4 text-gray-400">
              Descubrí perfumes árabes exclusivos
            </p>
          </div>
        </div>

        <CatalogGrid />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}