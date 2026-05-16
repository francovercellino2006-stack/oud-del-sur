"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Perfume } from "../app/data/perfumes";
import { getActivePrice, isOfferActive } from "../utils/price";

export default function Hero({ perfumes = [] }: { perfumes?: Perfume[] }) {
  // Tomamos hasta 3 perfumes con oferta activa, si no hay suficientes completamos con bestsellers
  const offerPerfumes = perfumes
    .filter((p) => !p.outOfStock && isOfferActive(p.offer))
    .slice(0, 3);

  const featured = offerPerfumes.length >= 2
    ? offerPerfumes
    : perfumes.filter((p) => !p.outOfStock && p.badge === "Más vendido").slice(0, 3);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      {/* Gold glow */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "30%", left: "30%",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="h-px w-10" style={{ background: "#D4AF37" }} />
              <span
                className="text-xs tracking-[0.45em] uppercase font-light"
                style={{ color: "#D4AF37", fontFamily: "sans-serif" }}
              >
                Perfumería Árabe · Viedma, Argentina
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="mb-7 leading-[1.05]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span className="block text-5xl md:text-7xl font-light text-white">
                Perfumes Árabes
              </span>
              <span
                className="block text-5xl md:text-7xl font-light"
                style={{
                  background: "linear-gradient(90deg, #D4AF37 0%, #F0D875 40%, #B8941F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Originales
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg leading-relaxed mb-12 max-w-lg font-light tracking-wide"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
            >
              Fragancias árabes originales con proyección y duración extrema.
              Importadas directamente, con envíos a todo el país.
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <a
                href="/catalog"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: "#D4AF37",
                  color: "#0B0B0B",
                  boxShadow: "0 4px 30px rgba(212,175,55,0.3)",
                  fontFamily: "sans-serif",
                }}
              >
                Ver Catálogo
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-8 mt-16"
            >
              {[
                { value: "5",    label: "Casas Árabes" },
                { value: "100%", label: "Originales" },
                { value: "48hs", label: "Envío" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span
                    className="text-2xl font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#D4AF37" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase font-light"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Ofertas */}
          {featured.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="hidden lg:flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-1">
                <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.2)" }} />
                <span
                  className="text-[10px] tracking-[0.45em] uppercase font-light"
                  style={{ color: "#D4AF37", fontFamily: "sans-serif" }}
                >
                  {isOfferActive(featured[0]?.offer) ? "Ofertas del día" : "Destacados"}
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.2)" }} />
              </div>

              {/* Cards */}
              {featured.map((p, i) => {
                const active = isOfferActive(p.offer);
                const price  = getActivePrice(p.price, p.offer);
                return (
                  <motion.a
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.65 + i * 0.12 }}
                    className="flex items-center gap-4 p-4 transition-all duration-300 group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(212,175,55,0.06)";
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    }}
                  >
                    {/* Image */}
                    <div
                      className="shrink-0 w-16 h-16 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[9px] tracking-[0.3em] uppercase font-light mb-0.5"
                        style={{ color: "rgba(212,175,55,0.55)", fontFamily: "sans-serif" }}
                      >
                        {p.brand}
                      </p>
                      <p
                        className="text-base font-light truncate group-hover:text-[#D4AF37] transition-colors duration-300"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {p.name}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-right">
                      <p
                        className="text-base font-light"
                        style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {price}
                      </p>
                      {active && (
                        <p
                          className="text-[10px] line-through font-light"
                          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
                        >
                          {p.price}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      size={13}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: "#D4AF37" }}
                    />
                  </motion.a>
                );
              })}

              {/* Footer link */}
              <motion.a
                href="/catalog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center text-[10px] tracking-[0.35em] uppercase font-light pt-2 transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = "#D4AF37"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
              >
                Ver todos los perfumes →
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.6), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
