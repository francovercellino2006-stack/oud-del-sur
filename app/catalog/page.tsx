import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import CatalogGrid from "../../components/CatalogGrid";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import { getPerfumes } from "../../lib/queries";

// Fuerza renderizado dinámico — necesario por useSearchParams y searchParams
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Perfumes Árabes | Oud Del Sur",
  description: "Explorá nuestra colección completa de perfumes árabes originales. Lattafa, Armaf, Afnan, Maison Alhambra y Rasasi. Envíos a todo el país desde Viedma, Río Negro.",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    brand?: string;
    category?: string;
    family?: string;
  }>;
}) {
  const params = await searchParams;
  const perfumes = await getPerfumes();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#1A1510]">

        {/* Header */}
        <div className="relative pt-36 pb-16 px-6 border-b border-white/5">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="mx-auto max-w-7xl relative z-10">
            <p
              className="text-xs tracking-[0.45em] uppercase font-light mb-4"
              style={{ color: "#FFFFFF", fontFamily: "sans-serif" }}
            >
              {params.brand ? `Marca · ${params.brand}` : "Colección completa"}
            </p>
            <h1
              className="text-5xl md:text-6xl font-light text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {params.brand ?? "Catálogo"}{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FFFFFF, #FFFFFF, #CCCCCC)",
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

        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogGrid
            perfumes={perfumes}
            initialBrand={params.brand}
            initialCategory={params.category}
            initialFamily={params.family}
          />
        </Suspense>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-4">
          <div className="h-3 w-16 animate-pulse rounded-sm" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="flex gap-2 flex-wrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-24 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        </div>
        <div className="mb-10 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="aspect-square" style={{ background: "rgba(255,255,255,0.03)" }} />
              <div className="p-5 space-y-3">
                <div className="h-2 w-16 rounded-sm" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="h-5 w-3/4 rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-3 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-10 rounded-sm" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}