

"use client";
import { perfumes } from "../app/data/perfumes";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
 
const brands = [
  {
    name: "Lattafa",
    origin: "Emiratos Árabes",
    description: "La casa de perfumería árabe más reconocida del mundo. Creadores del icónico Oud Mood y Raghba.",
    specialty: "Orientales · Dulces · Oud",
    founded: "2007",
    accent: "#FFFFFF",
  },

  {
    name: "Armaf",
    origin: "Emiratos Árabes",
    description: "Fragancias de alta gama con inspiración en los grandes clásicos europeos, a precios accesibles.",
    specialty: "Frescos · Maderosos · Amaderado",
    founded: "2012",
    accent: "#C0C0C0",
  },
  {
    name: "Afnan",
    origin: "Arabia Saudita",
    description: "Perfumería niche del Medio Oriente. Almizcles blancos y composiciones únicas de autor.",
    specialty: "Almizcle · Florales · Niche",
    founded: "2000",
    accent: "#FFFFFF",
  },
  {
    name: "Maison Alhambra",
    origin: "Emiratos Árabes",
    description: "El lujo árabe moderno. Frascos de colección con fragancias de proyección extraordinaria.",
    specialty: "Unisex · Exclusivos · Premium",
    founded: "2019",
    accent: "#C0C0C0",
  },
  {
    name: "Rasasi",
    origin: "Emiratos Árabes",
    description: "Tradición perfumera árabe desde hace décadas. Maestros del oud puro y especias orientales.",
    specialty: "Oud · Especiados · Clásicos",
    founded: "1979",
    accent: "#FFFFFF",
  },
];
 
export default function Brands() {
    
  return (
    <section id="marcas" className="relative py-28 px-6" style={{ background: "#000000" }}>
      {/* Top accent */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
      />
 
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p
            className="text-xs tracking-[0.45em] uppercase font-light mb-5"
            style={{ color: "#FFFFFF", fontFamily: "sans-serif" }}
          >
            Casas de Perfumería
          </p>
          <h2
            className="text-5xl md:text-6xl font-light text-white mb-5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Marcas{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #CCCCCC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Destacadas
            </span>
          </h2>
          <p
            className="text-sm font-light max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
          >
            Las casas de perfumería árabe más reconocidas del mundo, traídas directamente para vos.
          </p>
          <div
            className="mt-8 mx-auto w-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)" }}
          />
        </motion.div>
 
        {/* Brand cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand, i) => {

const brandPerfumes = perfumes.filter(
  (perfume) => perfume.brand === brand.name
);

return (
            <motion.a
              key={brand.name}
              href={`/catalog?brand=${brand.name}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative flex flex-col p-7 overflow-hidden transition-all duration-500"
              style={{
                background: "linear-gradient(160deg, #141414 0%, #0f0f0f 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.3 },
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Gold glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)",
                }}
              />
 
              {/* Top row: name + arrow */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3
                    className="text-2xl font-light text-white mb-1 group-hover:text-[#FFFFFF] transition-colors duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {brand.name}
                  </h3>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase font-light"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                  >
                    {brand.origin}
                  </p>
                </div>
                <div
                  className="flex items-center justify-center w-9 h-9 shrink-0 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-400"
                  style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  <ArrowRight size={14} style={{ color: "#FFFFFF" }} />
                </div>
              </div>
 
              {/* Description */}
              <p
                className="text-xs leading-relaxed mb-6 font-light flex-1"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
              >
                {brand.description}
              </p>
 
              {/* Bottom row */}
              <div className="flex items-center justify-between pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span
                  className="text-[10px] tracking-[0.15em] font-light"
                  style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}
                >
                  {brand.specialty}
                </span>
                <span
                  className="text-[10px] tracking-[0.2em] font-light"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}
                >
                  Est. {brand.founded}
                </span>
              </div>
              </motion.a>
  );
})}
          
 
          {/* "Ver todas" card */}
          <motion.a
            href="/catalog"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: brands.length * 0.09 }}
            className="group flex flex-col items-center justify-center p-7 transition-all duration-500 min-h-[200px]"
            style={{
              border: "1px dashed rgba(255,255,255,0.2)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <ArrowRight size={18} style={{ color: "#FFFFFF" }} />
            </div>
            <p
              className="text-sm tracking-[0.2em] uppercase font-light text-center"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}
            >
              Ver catálogo
              <br />completo
            </p>
          </motion.a>
        </div>
 
        {/* Bottom strip — brand name ticker */}
        <div className="mt-16 overflow-hidden relative">
          <div
            className="h-px mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
          />
          <div className="flex items-center gap-10 opacity-20 animate-ticker" style={{ width: "max-content" }}>
            {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="shrink-0 text-2xl font-light tracking-widest text-white whitespace-nowrap"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </div>
 
      {/* Bottom accent */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
      />
    </section>
  );
}