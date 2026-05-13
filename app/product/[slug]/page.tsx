"use client";

import { use, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import { perfumes } from "../../../app/data/perfumes";
import { motion } from "framer-motion";
import { MessageCircle, ChevronLeft, ChevronRight, Clock, Droplets, Tag, Star } from "lucide-react";
import Link from "next/link";

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

  const images = [
    perfume.image,
    perfume.image,
    perfume.image,
    perfume.image,
  ];

  const waMessage = encodeURIComponent(
    `Hola! Quiero comprar *${perfume.name}* (${perfume.brand}) - ${perfume.price}. ¿Tienen stock disponible?`
  );
  const waUrl = `https://wa.me/5492920528440?text=${waMessage}`;

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

  const relatedPerfumes = perfumes.filter((p) => p.slug !== perfume.slug).slice(0, 3);

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
              </div>

              <div className="grid grid-cols-4 gap-2">
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
                {perfume.description} Una fragancia que combina tradición árabe con sofisticación moderna, perfecta para quienes buscan una identidad olfativa única e irrepetible.
              </p>

              <div className="h-px mb-8" style={{ background: "rgba(255,255,255,0.06)" }} />

              <div className="flex items-baseline gap-4 mb-8">
                <span
                  className="text-4xl font-light"
                  style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {perfume.price}
                </span>
                {perfume.priceOriginal && (
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