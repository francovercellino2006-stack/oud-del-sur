"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Clock, Droplets, Tag, Star } from "lucide-react";
import Link from "next/link";
import type { Perfume } from "../app/data/perfumes";
import { getActivePrice } from "../utils/price";

const SENSORY: Record<string, { dulzor: number; intensidad: number; frescura: number; maderas: number }> = {
  orientales: { dulzor: 75, intensidad: 90, frescura: 20, maderas: 65 },
  dulces:     { dulzor: 90, intensidad: 60, frescura: 15, maderas: 35 },
  maderosos:  { dulzor: 30, intensidad: 70, frescura: 40, maderas: 90 },
  florales:   { dulzor: 55, intensidad: 50, frescura: 70, maderas: 25 },
  frescos:    { dulzor: 20, intensidad: 45, frescura: 90, maderas: 30 },
};

export default function ProductDetail({
  perfume,
  allPerfumes = [],
}: {
  perfume: Perfume;
  allPerfumes?: Perfume[];
}) {
  const [activeImage] = useState(0);

  const activePrice = getActivePrice(perfume.price, perfume.offer);

  const waMessage = encodeURIComponent(
    `Hola! Quiero comprar *${perfume.name}* (${perfume.brand}) - ${activePrice}. ¿Tienen stock disponible?`
  );
  const waConsult = encodeURIComponent(
    `Hola! Quería consultar sobre *${perfume.name}* (${perfume.brand}) antes de comprarlo. ¿Me podés dar más info?`
  );
  const waUrl      = `https://wa.me/5492920528440?text=${waMessage}`;
  const waConsultUrl = `https://wa.me/5492920528440?text=${waConsult}`;

  const specs = [
    { icon: Droplets, label: "Concentración", value: "Eau de Parfum" },
    { icon: Tag,      label: "Familia",        value: perfume.family.charAt(0).toUpperCase() + perfume.family.slice(1) },
    { icon: Clock,    label: "Duración",       value: perfume.duration },
    { icon: Star,     label: "Categoría",      value: perfume.category.charAt(0).toUpperCase() + perfume.category.slice(1) },
  ];

  const highlights = [
    "Eau de Parfum 100% original importado",
    `Duración aproximada: ${perfume.duration}`,
    "Proyección intensa y elegante",
    `Fragancia ${perfume.category} · ${perfume.ml}ml`,
  ];

  const sensory = SENSORY[perfume.family] ?? SENSORY.orientales;

  const relatedPerfumes = allPerfumes
    .filter((p) => p.slug !== perfume.slug && p.family === perfume.family)
    .slice(0, 3)
    .concat(
      allPerfumes
        .filter((p) => p.slug !== perfume.slug && p.family !== perfume.family)
        .slice(0, Math.max(0, 3 - allPerfumes.filter((p) => p.slug !== perfume.slug && p.family === perfume.family).slice(0, 3).length))
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 px-6 border-b border-white/5">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-light"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#D4AF37"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
            Inicio
          </Link>
          <span>/</span>
          <Link href="/catalog" style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#D4AF37"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
            Catálogo
          </Link>
          <span>/</span>
          <span style={{ color: "rgba(212,175,55,0.7)" }}>{perfume.name}</span>
        </div>
      </div>

      {/* Main product section */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #141414, #0e0e0e)",
                border: "1px solid rgba(255,255,255,0.06)",
                aspectRatio: "1/1",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.06) 0%, transparent 70%)"
              }} />

              <img
                src={perfume.image}
                alt={perfume.name}
                className="w-full h-full object-contain p-10 transition-opacity duration-300"
              />

              {perfume.badge && (
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium"
                    style={{
                      background: perfume.badge === "Más vendido" ? "#D4AF37" : "transparent",
                      color: perfume.badge === "Más vendido" ? "#0B0B0B" : "#D4AF37",
                      border: perfume.badge === "Más vendido" ? "none" : "1px solid rgba(212,175,55,0.5)",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {perfume.badge}
                  </span>
                </div>
              )}

              {perfume.outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <span className="text-sm tracking-[0.3em] uppercase font-light px-4 py-2"
                    style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>
                    Sin stock
                  </span>
                </div>
              )}
            </div>

            {/* Sensory profile */}
            <div className="mt-6 p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] tracking-[0.35em] uppercase font-light mb-5"
                style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
                Perfil sensorial
              </p>
              <div className="space-y-3">
                {Object.entries(sensory).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-light w-20 shrink-0"
                      style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
                      {key}
                    </span>
                    <div className="flex-1 h-px relative" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="absolute top-1/2 -translate-y-1/2 h-[2px]"
                        style={{ background: "linear-gradient(90deg, #D4AF37, #F0D875)" }}
                      />
                    </div>
                    <span className="text-[10px] font-light w-8 text-right"
                      style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col"
          >
            <span
              className="text-xs tracking-[0.4em] uppercase font-light mb-3"
              style={{ color: "rgba(212,175,55,0.65)", fontFamily: "sans-serif" }}
            >
              {perfume.brand}
            </span>

            <h1
              className="text-4xl md:text-5xl font-light leading-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {perfume.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} style={{ fill: "#D4AF37", color: "#D4AF37" }} />
              ))}
              <span className="text-[11px] font-light ml-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
                (47 reseñas)
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-8 max-w-md font-light"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
            >
              {perfume.description}
            </p>

            <div className="h-px mb-8" style={{ background: "rgba(255,255,255,0.06)" }} />

            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-4xl font-light"
                style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}
              >
                {activePrice}
              </span>
              {perfume.offer && (
                <span className="text-lg line-through font-light" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                  {perfume.price}
                </span>
              )}
              <span
                className="text-xs tracking-widest uppercase font-light px-2 py-1"
                style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)", fontFamily: "sans-serif" }}
              >
                {perfume.ml}ml
              </span>
            </div>

            <div className="space-y-3 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span style={{ color: "#D4AF37", fontSize: "12px" }}>✦</span>
                  <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px mb-8" style={{ background: "rgba(255,255,255,0.06)" }} />

            <div className="grid grid-cols-2 gap-3 mb-10">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="p-4"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={12} style={{ color: "rgba(212,175,55,0.6)" }} />
                    <span className="text-[10px] tracking-[0.2em] uppercase font-light"
                      style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                      {label}
                    </span>
                  </div>
                  <p className="text-sm font-light text-white" style={{ fontFamily: "sans-serif" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {perfume.outOfStock ? (
              <div
                className="flex items-center justify-center w-full py-5 text-sm tracking-[0.25em] uppercase font-medium"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "sans-serif" }}
              >
                Sin stock disponible
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 text-sm tracking-[0.25em] uppercase font-medium transition-all duration-300"
                  style={{
                    background: "#D4AF37",
                    color: "#0B0B0B",
                    boxShadow: "0 4px 30px rgba(212,175,55,0.25)",
                    fontFamily: "sans-serif",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#E8C84A";
                    e.currentTarget.style.boxShadow = "0 6px 40px rgba(212,175,55,0.45)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#D4AF37";
                    e.currentTarget.style.boxShadow = "0 4px 30px rgba(212,175,55,0.25)";
                  }}
                >
                  <MessageCircle size={18} />
                  Comprar por WhatsApp
                </a>

                <a
                  href={waConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 text-sm tracking-[0.2em] uppercase font-light transition-all duration-300"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "sans-serif",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
                    e.currentTarget.style.color = "#D4AF37";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <MessageCircle size={15} />
                  Consultar antes de comprar
                </a>
              </div>
            )}

            <p
              className="text-center text-[11px] mt-4 font-light tracking-wide"
              style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
            >
              Respuesta inmediata · Envíos a todo el país · 100% original
            </p>
          </motion.div>
        </div>
      </div>

      {/* Related products */}
      {relatedPerfumes.length > 0 && (
        <section className="py-20 px-6">
          <div className="h-px mb-20" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }} />
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: "#D4AF37", fontFamily: "sans-serif" }}>
                También te puede interesar
              </p>
              <h2 className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Otras Fragancias
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPerfumes.map((rel) => (
                <Link key={rel.slug} href={`/product/${rel.slug}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="overflow-hidden transition-all duration-500"
                    style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="relative" style={{ aspectRatio: "4/3", background: "#0e0e0e" }}>
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-contain p-6" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(11,11,11,0.9) 100%)" }} />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-light" style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
                        {rel.brand}
                      </p>
                      <h3 className="text-lg font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {rel.name}
                      </h3>
                      <span className="text-lg font-light" style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}>
                        {getActivePrice(rel.price, rel.offer)}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
