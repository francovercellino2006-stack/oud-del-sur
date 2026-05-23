"use client";

import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft } from "lucide-react";
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
    <main className="bg-[#111111] text-white">

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden">

        {/* Hero image — full width */}
        <div className="relative w-full" style={{ aspectRatio: "1/1", background: "#111", marginTop: "88px" }}>
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

          <img
            src={perfume.image}
            alt={perfume.name}
            className="w-full h-full object-contain p-8"
          />

          {/* Back button */}
          <Link href="/catalog"
            className="absolute top-4 left-4 z-20 flex items-center justify-center w-8 h-8 transition-all duration-200"
            style={{ background: "rgba(17,17,17,0.45)", backdropFilter: "blur(8px)" }}>
            <ArrowLeft size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
          </Link>

          {/* Badge único — solo si hay oferta */}
          {offerActive && (
            <div className="absolute top-4 right-4 z-20">
              <span className="px-2 py-1 text-[9px] tracking-[0.15em] uppercase font-medium"
                style={{ background: "rgba(200,40,40,0.9)", color: "white", fontFamily: "sans-serif" }}>
                −{perfume.offer!.discount}%
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {perfume.outOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center"
              style={{ background: "rgba(17,17,17,0.65)" }}>
              <span className="text-sm tracking-[0.3em] uppercase font-light px-4 py-2"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
                Sin stock
              </span>
            </div>
          )}

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 z-10"
            style={{ background: "linear-gradient(to top, #111111, transparent)" }} />
        </div>

        {/* Mobile info */}
        <div className="px-5 pt-4 pb-32">

          {/* Brand + Name + Price */}
          <p className="text-[9px] tracking-[0.45em] uppercase font-light mb-2"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
            {perfume.brand}
          </p>
          <h1 className="text-3xl font-normal leading-tight mb-4"
            style={{ fontFamily: "var(--font-perfume)" }}>
            {perfume.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-light"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                background: "linear-gradient(90deg, #FFFFFF, #FFFFFF, #CCCCCC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              {activePrice}
            </span>
            {offerActive && (
              <span className="text-base line-through font-light"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                {perfume.price}
              </span>
            )}
            <span className="ml-auto text-[9px] tracking-[0.25em] uppercase font-light px-2 py-1"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
              {perfume.ml}ml
            </span>
          </div>

          <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6 font-light"
            style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif" }}>
            {perfume.description}
          </p>

          {/* Inspirado en */}
          {perfume.inspiredBy && (
            <div className="mb-6 px-4 py-3"
              style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[8px] tracking-[0.4em] uppercase font-light mb-1"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                Inspirado en
              </p>
              <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                {perfume.inspiredBy}
              </p>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 gap-px mb-6"
            style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.05)" }}>
            {specs.map(({ label, value }) => (
              <div key={label} className="px-4 py-3" style={{ background: "#111111" }}>
                <p className="text-[8px] tracking-[0.3em] uppercase font-light mb-1"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                  {label}
                </p>
                <p className="text-sm font-light text-white" style={{ fontFamily: "sans-serif" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Sensory bars */}
          <div className="px-4 py-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[8px] tracking-[0.4em] uppercase font-light mb-4"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
              Perfil sensorial
            </p>
            <div className="space-y-3">
              {sensory.map(({ label, value }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[9px] tracking-[0.1em] uppercase font-light w-18 shrink-0"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif", minWidth: "72px" }}>
                    {label}
                  </span>
                  <div className="flex-1 h-px relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute top-1/2 -translate-y-1/2 h-[1.5px]"
                      style={{ background: "linear-gradient(90deg, #FFFFFF, rgba(255,255,255,0.3))" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky bottom bar — mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4"
          style={{ background: "rgba(17,17,17,0.97)", borderTop: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(20px)" }}>
          <div className="flex gap-3">
            <a href={waConsultUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-4 text-[10px] tracking-[0.2em] uppercase font-light transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", minWidth: "44px" }}>
              <MessageCircle size={16} />
            </a>
            {perfume.outOfStock ? (
              <div className="flex-1 flex items-center justify-center py-4 text-xs tracking-[0.25em] uppercase font-light"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                Sin stock
              </div>
            ) : (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300"
                style={{
                  background: "linear-gradient(90deg, #FFFFFF, #E0E0E0)",
                  color: "#111111",
                  fontFamily: "sans-serif",
                  boxShadow: "0 0 30px rgba(255,255,255,0.2)",
                }}>
                <MessageCircle size={15} />
                Comprar por WhatsApp
              </a>
            )}
          </div>
          <p className="text-center text-[9px] mt-2 font-light tracking-wide"
            style={{ color: "rgba(255,255,255,0.15)", fontFamily: "sans-serif" }}>
            Respuesta inmediata · Envíos a todo el país
          </p>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:block">

        {/* Breadcrumb */}
        <div className="pt-28 pb-4 px-6 border-b border-white/5">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-light"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
              Inicio
            </Link>
            <span>/</span>
            <Link href="/catalog" style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
              Catálogo
            </Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{perfume.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-start gap-16 grid-cols-[1fr_1fr]">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #141414 0%, #0d0d0d 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  aspectRatio: "1/1",
                }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.05) 0%, transparent 65%)" }} />
                <img src={perfume.image} alt={perfume.name} className="w-full h-full object-contain p-12" />
                {perfume.badge && (
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 text-[9px] tracking-[0.25em] uppercase font-medium"
                      style={{
                        background: perfume.badge === "Más vendido" ? "#FFFFFF" : "transparent",
                        color: perfume.badge === "Más vendido" ? "#111111" : "#FFFFFF",
                        border: perfume.badge === "Más vendido" ? "none" : "1px solid rgba(255,255,255,0.4)",
                        fontFamily: "sans-serif",
                      }}>
                      {perfume.badge}
                    </span>
                  </div>
                )}
                {offerActive && (
                  <div className="absolute top-5 right-5">
                    <span className="px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-medium"
                      style={{ background: "rgba(200,40,40,0.9)", color: "white", fontFamily: "sans-serif" }}>
                      −{perfume.offer!.discount}%
                    </span>
                  </div>
                )}
                {perfume.outOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(17,17,17,0.65)" }}>
                    <span className="text-sm tracking-[0.35em] uppercase font-light px-5 py-2"
                      style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
                      Sin stock
                    </span>
                  </div>
                )}
              </div>

              {perfume.inspiredBy ? (
                <div className="mt-5 px-6 py-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>Inspirado en</p>
                  <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif" }}>{perfume.inspiredBy}</p>
                </div>
              ) : (
                <div className="mt-5 px-6 py-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>Importado directamente</p>
                  <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>Perfume 100% original. Garantizamos autenticidad en cada frasco.</p>
                </div>
              )}
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col"
            >
              <p className="text-[10px] tracking-[0.55em] uppercase font-light mb-4" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>{perfume.brand}</p>
              <h1 className="text-5xl font-normal leading-[1.05] mb-6" style={{ fontFamily: "var(--font-perfume)" }}>{perfume.name}</h1>
              <p className="text-sm leading-loose mb-8 font-light" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", maxWidth: "38ch" }}>{perfume.description}</p>
              <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)" }} />

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-light" style={{ fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #CCCCCC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{activePrice}</span>
                {offerActive && <span className="text-xl line-through font-light" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>{perfume.price}</span>}
                <span className="ml-auto text-[10px] tracking-[0.3em] uppercase font-light px-3 py-1.5" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>{perfume.ml}ml</span>
              </div>

              <div className="grid grid-cols-2 gap-px mb-8" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.05)" }}>
                {specs.map(({ label, value }) => (
                  <div key={label} className="px-5 py-4" style={{ background: "#111111" }}>
                    <p className="text-[9px] tracking-[0.3em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>{label}</p>
                    <p className="text-sm font-light text-white" style={{ fontFamily: "sans-serif" }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-8 px-5 py-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-5" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>Perfil sensorial</p>
                <div className="space-y-4">
                  {sensory.map(({ label, value }, i) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="text-[10px] tracking-[0.15em] uppercase font-light w-20 shrink-0" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>{label}</span>
                      <div className="flex-1 h-px relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${value}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 1.2, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="absolute top-1/2 -translate-y-1/2 h-[1.5px]"
                          style={{ background: "linear-gradient(90deg, #FFFFFF, rgba(255,255,255,0.3))" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {perfume.outOfStock ? (
                <div className="flex items-center justify-center w-full py-5 text-sm tracking-[0.3em] uppercase font-light" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "sans-serif" }}>Sin stock disponible</div>
              ) : (
                <div className="flex flex-col gap-3">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-5 text-sm tracking-[0.3em] uppercase font-medium transition-all duration-300"
                    style={{ background: "linear-gradient(90deg, #FFFFFF 0%, #E0E0E0 100%)", color: "#111111", boxShadow: "0 4px 40px rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 50px rgba(255,255,255,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 40px rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <MessageCircle size={16} />
                    Comprar por WhatsApp
                  </a>
                  <a href={waConsultUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300"
                    style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}>
                    Consultar antes de comprar
                  </a>
                </div>
              )}
              <p className="text-center text-[10px] mt-5 font-light tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.18)", fontFamily: "sans-serif" }}>Respuesta inmediata · Envíos a todo el país · 100% original</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedPerfumes.length > 0 && (
        <section className="pb-36 lg:pb-24 pt-4">
          <div className="mx-auto max-w-7xl">
            <div className="h-px mb-12 mx-5 lg:mx-6" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
            <div className="mb-8 px-5 lg:px-6">
              <p className="text-[10px] tracking-[0.5em] uppercase mb-2 font-light" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>También te puede interesar</p>
              <h2 className="text-2xl lg:text-3xl font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>Otras Fragancias</h2>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="lg:hidden flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {relatedPerfumes.map((rel, i) => (
                <Link key={rel.slug} href={`/product/${rel.slug}`}
                  className="flex-shrink-0 snap-start overflow-hidden"
                  style={{ width: "62vw", background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "linear-gradient(145deg, #181818, #111)" }}>
                    <img src={rel.image} alt={rel.name} className="w-full h-full object-contain p-6" style={{ mixBlendMode: "luminosity", opacity: 0.9 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.7) 0%, transparent 50%)" }} />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[8px] tracking-[0.3em] uppercase mb-1 font-light" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>{rel.brand}</p>
                    <h3 className="text-base font-normal mb-1 leading-snug" style={{ fontFamily: "var(--font-perfume)", color: "rgba(255,255,255,0.9)" }}>{rel.name}</h3>
                    <span className="text-sm font-light" style={{ color: "#FFFFFF", fontFamily: "'Montserrat', sans-serif" }}>{getActivePrice(rel.price, rel.offer)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden lg:grid grid-cols-3 gap-5 px-6">
              {relatedPerfumes.map((rel, i) => (
                <motion.div key={rel.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Link href={`/product/${rel.slug}`}>
                    <div className="group overflow-hidden transition-all duration-500"
                      style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}>
                      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "linear-gradient(145deg, #181818, #111)" }}>
                        <img src={rel.image} alt={rel.name} className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.5) 0%, transparent 50%)" }} />
                      </div>
                      <div className="px-6 py-5">
                        <p className="text-[9px] tracking-[0.3em] uppercase mb-1 font-light" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>{rel.brand}</p>
                        <h3 className="text-xl font-normal mb-2" style={{ fontFamily: "var(--font-perfume)" }}>{rel.name}</h3>
                        <span className="text-lg font-light" style={{ color: "#FFFFFF", fontFamily: "'Montserrat', sans-serif" }}>{getActivePrice(rel.price, rel.offer)}</span>
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
