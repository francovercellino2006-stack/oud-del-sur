"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { useFavorites } from "../../hooks/useFavorites";
import { perfumes } from "../data/perfumes";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const favPerfumes = perfumes.filter((p) => favorites.includes(p.slug));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1A1510]">

        {/* Header */}
        <div className="relative pt-36 pb-16 px-6 border-b border-white/5">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
          />
          <div className="mx-auto max-w-7xl relative z-10">
            <p className="text-xs tracking-[0.45em] uppercase font-light mb-4"
              style={{ color: "#FFFFFF", fontFamily: "sans-serif" }}>
              Tu selección
            </p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Mis{" "}
              <span style={{
                background: "linear-gradient(90deg, #FFFFFF, #FFFFFF, #CCCCCC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Favoritos
              </span>
            </h1>
            <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
              {favPerfumes.length} {favPerfumes.length === 1 ? "perfume guardado" : "perfumes guardados"}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16">
          {favPerfumes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {favPerfumes.map((p, i) => (
                <ProductCard key={p.slug} perfume={p} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-6"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                <Heart size={20} style={{ color: "rgba(255,255,255,0.4)" }} />
              </div>
              <p className="text-2xl font-light mb-3"
                style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(255,255,255,0.6)" }}>
                Todavía no tenés favoritos
              </p>
              <p className="text-xs font-light mb-8"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                Tocá el ♡ en cualquier perfume para guardarlo acá
              </p>
              <Link href="/catalog"
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF", fontFamily: "sans-serif" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; (e.currentTarget as HTMLElement).style.color = "#1A1510"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}>
                Ver catálogo <ArrowRight size={13} />
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
