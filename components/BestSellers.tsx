"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { perfumes } from "../app/data/perfumes";

const bestsellers = perfumes.filter((p) => p.badge === "Más vendido").slice(0, 4);

export default function BestSellers() {
  return (
    <section id="destacados" className="relative px-6 py-28" style={{ background: "#0B0B0B" }}>
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)" }}
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
            style={{ color: "#D4AF37", fontFamily: "sans-serif" }}
          >
            Los más elegidos
          </p>
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
          <div
            className="mx-auto w-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
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
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
                e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={perfume.image}
                  alt={perfume.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge */}
                <div
                  className="absolute top-3 left-3 px-2 py-1 text-[9px] tracking-[0.25em] uppercase font-medium"
                  style={{ background: "#D4AF37", color: "#0B0B0B" }}
                >
                  Más vendido
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5">
                <p
                  className="text-[9px] tracking-[0.3em] uppercase font-light mb-1"
                  style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}
                >
                  {perfume.brand}
                </p>
                <h3
                  className="text-lg font-light text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {perfume.name}
                </h3>
                <p
                  className="text-[11px] leading-relaxed font-light mb-4 flex-1"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}
                >
                  {perfume.description}
                </p>

                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-base font-light"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      background: "linear-gradient(90deg, #D4AF37 0%, #F0D875 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {perfume.price}
                  </span>
                  <div
                    className="flex items-center justify-center w-7 h-7 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                  >
                    <ArrowRight size={12} style={{ color: "#D4AF37" }} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }}
      />
    </section>
  );
}
