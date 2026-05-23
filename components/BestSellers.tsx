"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Perfume } from "../app/data/perfumes";
import { getActivePrice, isOfferActive } from "../utils/price";

export default function BestSellers({ perfumes }: { perfumes: Perfume[] }) {
  const bestsellers = perfumes.filter((p) => p.badge === "Más vendido" && !p.outOfStock).slice(0, 4);
  return (
    <section id="destacados" className="relative px-6 py-28" style={{ background: "#1C1C1E" }}>
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
            Los más elegidos
          </p>
          <h2
            className="text-5xl md:text-6xl font-light text-white mb-5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Más{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #CCCCCC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Vendidos
            </span>
          </h2>
          <div
            className="mx-auto w-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)" }}
          />
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((perfume, i) => (
            <motion.a
              key={perfume.slug}
              href={`/product/${perfume.slug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative flex flex-col overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #141414 0%, #0f0f0f 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.boxShadow = "0 16px 50px rgba(17,17,17,0.7), 0 0 0 1px rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge */}
                <div
                  className="absolute top-3 left-3 px-2 py-1 text-[9px] tracking-[0.25em] uppercase font-medium"
                  style={{ background: "#FFFFFF", color: "#1C1C1E" }}
                >
                  Más vendido
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5">
                <p
                  className="text-[9px] tracking-[0.3em] uppercase font-light mb-1"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                >
                  {perfume.brand}
                </p>
                <h3
                  className="text-lg font-normal text-white mb-2 group-hover:text-[#FFFFFF] transition-colors duration-300 leading-tight"
                  style={{ fontFamily: "var(--font-perfume)" }}
                >
                  {perfume.name}
                </h3>
                <div className="flex-1" />

                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-base font-light"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {getActivePrice(perfume.price, perfume.offer)}
                    </span>
                    {isOfferActive(perfume.offer) && (
                      <span className="text-xs line-through font-light" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "sans-serif" }}>
                        {perfume.price}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-center w-7 h-7 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    <ArrowRight size={12} style={{ color: "#FFFFFF" }} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
      />
    </section>
  );
}
