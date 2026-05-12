import ProductCard from "./ProductCard";
import { perfumes } from "../app/data/perfumes";
 
export default function ProductGrid() {
  const featuredPerfumes = perfumes.filter(
    (perfume) => perfume.badge === "Más vendido"
  );
  return (
    <section id="destacados" className="relative py-28 px-6" style={{ background: "#0B0B0B" }}>
      {/* Top border accent */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
        }}
      />
 
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          {/* Eyebrow */}
          <p
            className="text-xs tracking-[0.45em] uppercase font-light mb-5"
            style={{ color: "#D4AF37", fontFamily: "sans-serif" }}
          >
            Colección
          </p>
 
          {/* Title */}
          <h2
            className="text-5xl md:text-6xl font-light text-white mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Más{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #D4AF37 0%, #F0D875 50%, #B8941F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Vendidos
            </span>
          </h2>
 
          {/* Subtitle */}
          <p
            className="text-sm font-light max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
          >
            Perfumes árabes premium importados, seleccionados por proyección y duración.
          </p>
 
          {/* Divider */}
          <div
            className="mt-8 mx-auto w-16 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
        </div>
 
        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPerfumes.map((perfume, i) => (
            <ProductCard key={perfume.slug} perfume={perfume} index={i} />
          ))}
        </div>
 
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/catalog"
           className="inline-flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-light transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
            style={{
              border: "1px solid rgba(212,175,55,0.35)",
              color: "#D4AF37",
              fontFamily: "sans-serif",
            }}
           
          >
            Ver catálogo completo
          </a>
        </div>
      </div>
 
      {/* Bottom border accent */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)",
        }}
      />
    </section>
  );
}