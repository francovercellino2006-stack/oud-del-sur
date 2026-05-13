"use client";

import { use, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import { perfumes } from "../../../app/data/perfumes";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Droplets, Tag, Star } from "lucide-react";
import Link from "next/link";
import OfferCountdown from "../../../components/OfferCountdown";
import { applyDiscount } from "../../../utils/price";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const perfume = perfumes.find((p) => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!perfume) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-6">
            Perfume no encontrado
          </p>
          <Link
            href="/catalog"
            className="text-xs tracking-[0.25em] uppercase px-6 py-3 font-light transition-all duration-300"
            style={{ border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const images = [perfume.image];

  const waMessage = encodeURIComponent(
    `Hola! Quiero comprar *${perfume.name}* (${perfume.brand}) - ${perfume.price}. ¿Tienen stock disponible?`
  );
  const waUrl = `https://wa.me/5492920528440?text=${waMessage}`;

  const waConsultMessage = encodeURIComponent(
    `Hola! Me gustaría consultar sobre *${perfume.name}* (${perfume.brand}). ¿Tienen disponible? ¿Cuánto tarda el envío?`
  );
  const waConsultUrl = `https://wa.me/5492920528440?text=${waConsultMessage}`;

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

  const intensityMap: Record<string, { dulzor: number; proyeccion: number; duracion: number }> = {
    dulces:     { dulzor: 9, proyeccion: 7, duracion: 7 },
    orientales: { dulzor: 6, proyeccion: 9, duracion: 9 },
    maderosos:  { dulzor: 3, proyeccion: 8, duracion: 9 },
    frescos:    { dulzor: 2, proyeccion: 6, duracion: 6 },
    florales:   { dulzor: 5, proyeccion: 5, duracion: 6 },
  };
  const intensity = intensityMap[perfume.family] ?? { dulzor: 5, proyeccion: 5, duracion: 5 };

  const sameBrand = perfumes.filter((p) => p.slug !== perfume.slug && p.brand === perfume.brand);
  const sameFamily = perfumes.filter((p) => p.slug !== perfume.slug && p.brand !== perfume.brand && p.family === perfume.family);
  const relatedPerfumes = [...sameBrand, ...sameFamily].slice(0, 3);

  return (
    <>
      <Navbar />

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

            {/* Image gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                className="relative overflow-hidden mb-4"
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
                  src={images[activeImage]}
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

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 transition-all duration-300"
                      style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    >
                      <ChevronLeft size={18} style={{ color: "rgba(255,255,255,0.6)" }} />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-all duration-300"
                      style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    >
                      <ChevronRight size={18} style={{ color: "rgba(255,255,255,0.6)" }} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      border: activeImage === i ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.06)",
                      aspectRatio: "1/1",
                      background: "#141414",
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-3 opacity-70 hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>}
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
                  {perfume.offer ? applyDiscount(perfume.price, perfume.offer.discount) : perfume.price}
                </span>
                {perfume.offer && (
                  <span className="text-lg line-through font-light" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                    {perfume.price}
                  </span>
                )}
                {!perfume.offer && perfume.priceOriginal && (
                  <span className="text-lg line-through font-light" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                    {perfume.priceOriginal}
                  </span>
                )}
                <span
                  className="text-xs tracking-widest uppercase font-light px-2 py-1"
                  style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)", fontFamily: "sans-serif" }}
                >
                  {perfume.ml}ml
                </span>
              </div>

              {perfume.offer && (
                <OfferCountdown discount={perfume.offer.discount} endsAt={perfume.offer.endsAt} />
              )}

              {perfume.inspiredBy && (
                <div className="flex items-center gap-3 mb-8 px-4 py-3"
                  style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <span className="text-[10px] tracking-[0.3em] uppercase font-light shrink-0"
                    style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
                    Inspirado en
                  </span>
                  <div className="w-px h-3 shrink-0" style={{ background: "rgba(212,175,55,0.25)" }} />
                  <span className="text-xs font-light"
                    style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
                    {perfume.inspiredBy}
                  </span>
                </div>
              )}

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

              {/* Intensity bars */}
              <div className="space-y-4 mb-8">
                {[
                  { label: "Dulzor",      value: intensity.dulzor },
                  { label: "Proyección",  value: intensity.proyeccion },
                  { label: "Duración",    value: intensity.duracion },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-light w-20 shrink-0"
                      style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
                      {label}
                    </span>
                    <div className="flex-1 h-px relative" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full"
                        style={{
                          width: `${value * 10}%`,
                          background: "linear-gradient(90deg, #B8941F, #D4AF37, #F0D875)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-light w-6 text-right shrink-0"
                      style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                      {value}/10
                    </span>
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

              {/* CTA buttons */}
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Comprar por WhatsApp
                </a>

              </div>

              <a
                href={waConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-4 transition-all duration-300 group"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(212,175,55,0.7)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >
                <span className="text-xs font-light tracking-[0.15em]">¿Tenés dudas? Consultanos</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </a>

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
                          {rel.price}
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

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}