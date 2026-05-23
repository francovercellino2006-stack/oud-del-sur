"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
export default function Hero() {

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
          background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
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
              <div className="h-px w-10" style={{ background: "#FFFFFF" }} />
              <span
                className="text-xs tracking-[0.45em] uppercase font-light"
                style={{ color: "#FFFFFF", fontFamily: "sans-serif" }}
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
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="block text-5xl md:text-7xl font-light text-white">
                Perfumes Árabes
              </span>
              <span
                className="block text-5xl md:text-7xl font-light"
                style={{
                  background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 40%, #CCCCCC 100%)",
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
                  background: "#FFFFFF",
                  color: "#1C1C1E",
                  boxShadow: "0 4px 30px rgba(255,255,255,0.3)",
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
                    style={{ fontFamily: "'Montserrat', sans-serif", color: "#FFFFFF" }}
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

          {/* RIGHT — Quiz */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="hidden lg:flex items-center justify-center"
          >
            <motion.a
              href="/quiz"
              className="group relative flex flex-col items-center justify-center text-center p-14 w-full transition-all duration-500"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
                minHeight: "380px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: "#FFFFFF" }} />
              <span className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: "#FFFFFF" }} />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: "#FFFFFF" }} />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: "#FFFFFF" }} />

              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-[9px] tracking-[0.55em] uppercase font-light mb-8"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}
              >
                Descubrí tu fragancia
              </motion.p>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-4xl font-light leading-snug mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ¿Cuál es tu<br />
                <span style={{
                  background: "linear-gradient(90deg, #FFFFFF, #FFFFFF, #CCCCCC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  perfume ideal?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm font-light leading-relaxed mb-10 max-w-xs"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}
              >
                Respondé 5 preguntas y te recomendamos la fragancia perfecta para vos.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex items-center gap-3 text-sm tracking-[0.25em] uppercase font-medium transition-all duration-300"
                style={{ color: "#FFFFFF", fontFamily: "sans-serif" }}
              >
                Comenzar quiz
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.div>
            </motion.a>
          </motion.div>
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
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
