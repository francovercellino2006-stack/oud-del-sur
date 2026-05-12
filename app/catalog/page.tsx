import Navbar from "../../components/Navbar";
import CatalogGrid from "../../components/CatalogGrid";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";

interface CatalogPageProps {
  searchParams: { brand?: string; category?: string; family?: string };
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0B0B0B]">

        {/* Header */}
        <div className="relative pt-36 pb-16 px-6 border-b border-white/5">
          {/* Gold glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="mx-auto max-w-7xl relative z-10">
            <p
              className="text-xs tracking-[0.45em] uppercase font-light mb-4"
              style={{ color: "#D4AF37", fontFamily: "sans-serif" }}
            >
              {searchParams.brand
                ? `Marca · ${searchParams.brand}`
                : "Colección completa"}
            </p>
            <h1
              className="text-5xl md:text-6xl font-light text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {searchParams.brand ? searchParams.brand : "Catálogo"}{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #F0D875, #B8941F)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Premium
              </span>
            </h1>
            <p
              className="text-sm font-light"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
            >
              Perfumes árabes originales importados · Envíos a todo el país
            </p>
          </div>
        </div>

        <CatalogGrid
          initialBrand={searchParams.brand}
          initialCategory={searchParams.category}
          initialFamily={searchParams.family}
        />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}