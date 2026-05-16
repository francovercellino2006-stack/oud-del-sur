"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Perfume } from "../app/data/perfumes";
import { getActivePrice, isOfferActive } from "../utils/price";

const SENSORY: Record<string, { label: string; value: number }[]> = {
  orientales: [
    { label: "Dulzor",     value: 75 },
    { label: "Intensidad", value: 90 },
    { label: "Frescura",   value: 20 },
    { label: "Maderas",    value: 65 },
  ],
  dulces: [
    { label: "Dulzor",     value: 90 },
    { label: "Intensidad", value: 60 },
    { label: "Frescura",   value: 15 },
    { label: "Maderas",    value: 35 },
  ],
  maderosos: [
    { label: "Dulzor",     value: 30 },
    { label: "Intensidad", value: 70 },
    { label: "Frescura",   value: 40 },
    { label: "Maderas",    value: 90 },
  ],
  florales: [
    { label: "Dulzor",     value: 55 },
    { label: "Intensidad", value: 50 },
    { label: "Frescura",   value: 70 },
    { label: "Maderas",    value: 25 },
  ],
  frescos: [
    { label: "Dulzor",     value: 20 },
    { label: "Intensidad", value: 45 },
    { label: "Frescura",   value: 90 },
    { label: "Maderas",    value: 30 },
  ],
};

export default function ProductDetail({
  perfume,
  allPerfumes = [],
}: {
  perfume: Perfume;
  allPerfumes?: Perfume[];
}) {
  const activePrice  = getActivePrice(perfume.price, perfume.offer);
  const offerActive  = isOfferActive(perfume.offer);
  const sensory      = SENSORY[perfume.family] ?? SENSORY.orientales;

  const waMessage    = encodeURIComponent(`Hola! Quiero comprar *${perfume.name}* (${perfume.brand}) - ${activePrice}. ¿Tienen stock disponible?`);
  const waConsult    = encodeURIComponent(`Hola! Quería consultar sobre *${perfume.name}* (${perfume.brand}) antes de comprarlo. ¿Me podés dar más info?`);
  const waUrl        = `https://wa.me/5492920528440?text=${waMessage}`;
  const waConsultUrl = `https://wa.me/5492920528440?text=${waConsult}`;

  const specs = [
    { label: "Concentración", value: "Eau de Parfum" },
    { label: "Familia",       value: perfume.family.charAt(0).toUpperCase() + perfume.family.slice(1) },
    { label: "Duración",      value: perfume.duration },
    { label: "Categoría",     value: perfume.category.charAt(0).toUpperCase() + perfume.category.slice(1) },
  ];

  const relatedPerfumes = [
    ...allPerfumes.filter((p) => p.slug !== perfume.slug && p.family === perfume.family),
    ...allPerfumes.filter((p) => p.slug !== perfume.slug && p.family !== perfume.family),
  ].slice(0, 3);

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

      {/* Product */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-20">

        {/* Mobile: nombre arriba */}
        <motion.div
          className="lg:hidden mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[10px] tracking-[0.5em] uppercase font-light mb-2"
            style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
            {perfume.brand}
          </p>
          <h1 className="text-3xl font-normal leading-tight"
            style={{ fontFamily: "var(--font-perfume)" }}>
            {perfume.name}
          </h1>
        </motion.div>

        <div className="grid items-start gap-10 lg:gap-16 lg:grid-cols-[1fr_1fr]">

          {/* LEFT — Image + Inspirado en */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Image */}
            <div
              className="relative overflow-hidden mx-auto"
              style={{
                background: "linear-gradient(145deg, #141414 0%, #0d0d0d 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                aspectRatio: "1/1",
                maxWidth: "420px",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse at 50% 20%, rgba(212,175,55,0.05) 0%, transparent 65%)"
              }} />

              <img
                src={perfume.image}
                alt={perfume.name}
                className="w-full h-full object-contain p-8 md:p-12"
              />

              {perfume.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[9px] tracking-[0.25em] uppercase font-medium"
                    style={{
                      background: perfume.badge === "Más vendido" ? "#D4AF37" : "transparent",
                      color: perfume.badge === "Más vendido" ? "#0B0B0B" : "#D4AF37",
                      border: perfume.badge === "Más vendido" ? "none" : "1px solid rgba(212,175,55,0.4)",
                      fontFamily: "sans-serif",
                    }}>
                    {perfume.badge}
                  </span>
                </div>
              )}

              {offerActive && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-medium"
                    style={{ background: "rgba(200,40,40,0.9)", color: "white", fontFamily: "sans-serif" }}>
                    −{perfume.offer!.discount}%
                  </span>
                </div>
              )}

              {perfume.outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.65)" }}>
                  <span className="text-sm tracking-[0.35em] uppercase font-light px-5 py-2"
                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
                    Sin stock
                  </span>
                </div>
              )}
            </div>

            {/* Inspirado en */}
            {perfume.inspiredBy ? (
              <div className="mt-4 px-5 py-4 mx-auto" style={{ maxWidth: "420px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(212,175,55,0.03)" }}>
                <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-1"
                  style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                  Inspirado en
                </p>
                <p className="text-sm font-light"
                  style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif" }}>
                  {perfume.inspiredBy}
                </p>
              </div>
            ) : (
              <div className="mt-4 px-5 py-4 mx-auto" style={{ maxWidth: "420px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(212,175,55,0.02)" }}>
                <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-1"
                  style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                  Importado directamente
                </p>
                <p className="text-sm font-light"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
                  Perfume 100% original. Garantizamos autenticidad en cada frasco.
                </p>
              </div>
            )}
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col"
          >
            {/* Brand + Name — solo desktop */}
            <p className="hidden lg:block text-[10px] tracking-[0.55em] uppercase font-light mb-4"
              style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
              {perfume.brand}
            </p>

            <h1 className="hidden lg:block text-5xl md:text-6xl font-normal leading-[1.05] mb-6"
              style={{ fontFamily: "var(--font-perfume)" }}>
              {perfume.name}
            </h1>

            {/* Description */}
            <p className="text-sm leading-loose mb-8 font-light"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", maxWidth: "38ch" }}>
              {perfume.description}
            </p>

            <div className="h-px mb-8"
              style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.2), transparent)" }} />

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-5xl font-light"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  background: "linear-gradient(90deg, #D4AF37 0%, #F0D875 50%, #B8941F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {activePrice}
              </span>
              {offerActive && (
                <span className="text-xl line-through font-light"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>
                  {perfume.price}
                </span>
              )}
              <span className="ml-auto text-[10px] tracking-[0.3em] uppercase font-light px-3 py-1.5"
                style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.7)", fontFamily: "sans-serif" }}>
                {perfume.ml}ml
              </span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-px mb-8"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.05)" }}>
              {specs.map(({ label, value }) => (
                <div key={label} className="px-5 py-4" style={{ background: "#0B0B0B" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-light mb-1"
                    style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                    {label}
                  </p>
                  <p className="text-sm font-light text-white" style={{ fontFamily: "sans-serif" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Sensory bars */}
            <div className="mb-8 px-5 py-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-5"
                style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                Perfil sensorial
              </p>
              <div className="space-y-4">
                {sensory.map(({ label, value }, i) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.15em] uppercase font-light w-20 shrink-0"
                      style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                      {label}
                    </span>
                    <div className="flex-1 h-px relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1.2, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute top-1/2 -translate-y-1/2 h-[1.5px]"
                        style={{ background: "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.3))" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            {perfume.outOfStock ? (
              <div className="flex items-center justify-center w-full py-5 text-sm tracking-[0.3em] uppercase font-light"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "sans-serif" }}>
                Sin stock disponible
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 text-sm tracking-[0.3em] uppercase font-medium transition-all duration-300"
                  style={{
                    background: "linear-gradient(90deg, #D4AF37 0%, #C9A227 100%)",
                    color: "#0B0B0B",
                    boxShadow: "0 4px 40px rgba(212,175,55,0.2)",
                    fontFamily: "sans-serif",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 6px 50px rgba(212,175,55,0.4)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 4px 40px rgba(212,175,55,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}>
                  <MessageCircle size={16} />
                  Comprar por WhatsApp
                </a>

                <a href={waConsultUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "sans-serif",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
                    e.currentTarget.style.color = "rgba(212,175,55,0.8)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                  }}>
                  Consultar antes de comprar
                </a>
              </div>
            )}

            <p className="text-center text-[10px] mt-5 font-light tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.18)", fontFamily: "sans-serif" }}>
              Respuesta inmediata · Envíos a todo el país · 100% original
            </p>
          </motion.div>
        </div>
      </div>

      {/* Related */}
      {relatedPerfumes.length > 0 && (
        <section className="pb-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="h-px mb-20"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }} />

            <div className="mb-14 text-center">
              <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light"
                style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
                También te puede interesar
              </p>
              <h2 className="text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Otras Fragancias
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedPerfumes.map((rel, i) => (
                <motion.div key={rel.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Link href={`/product/${rel.slug}`}>
                    <div className="group overflow-hidden transition-all duration-500"
                      style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}>
                      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: "#0d0d0d" }}>
                        <img src={rel.image} alt={rel.name}
                          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0"
                          style={{ background: "linear-gradient(180deg, transparent 40%, rgba(11,11,11,0.95) 100%)" }} />
                      </div>
                      <div className="px-6 py-5">
                        <p className="text-[9px] tracking-[0.35em] uppercase mb-1 font-light"
                          style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                          {rel.brand}
                        </p>
                        <h3 className="text-xl font-normal mb-3"
                          style={{ fontFamily: "var(--font-perfume)" }}>
                          {rel.name}
                        </h3>
                        <span className="text-lg font-light"
                          style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}>
                          {getActivePrice(rel.price, rel.offer)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
