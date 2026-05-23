"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    handle: "@brenarias85",
    quote: "Si buscas perfumes árabes 100% originales, habla con ellos.",
    perfume: "Emaan · Lattafa",
  },
  {
    handle: "@tthiagogarcia__",
    quote: null,
    perfume: "Eternal Touch · Maison Alhambra",
  },
  {
    handle: "@euge.diiazz",
    quote: null,
    perfume: "Yara · Lattafa",
  },
  {
    handle: "@tomii.vegaa_",
    quote: null,
    perfume: "Club de Nuit · Armaf",
  },
];

export default function Testimonials() {
  return (
    <section className="relative px-6 py-28" style={{ background: "#1C1C1E" }}>
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">

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
            Clientes reales
          </p>
          <h2
            className="text-5xl md:text-6xl font-light text-white mb-5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Lo que dicen{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #CCCCCC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              nuestros clientes
            </span>
          </h2>
          <div
            className="mx-auto w-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)" }}
          />
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.handle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative flex flex-col p-7 overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #141414 0%, #0f0f0f 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 65%)" }}
              />

              {/* Instagram icon */}
              <div className="mb-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.4)"/>
                </svg>
              </div>

              {/* Quote */}
              {t.quote ? (
                <blockquote
                  className="flex-1 text-xl font-light leading-snug mb-7 italic"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  "{t.quote}"
                </blockquote>
              ) : (
                <div className="flex-1 flex items-center mb-7">
                  <span
                    className="text-xs tracking-[0.25em] uppercase font-light px-3 py-1.5"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Compra verificada
                  </span>
                </div>
              )}

              {/* Divider */}
              <div
                className="mb-5 h-px"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)" }}
              />

              {/* Bottom */}
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs tracking-[0.2em] font-light"
                  style={{ color: "#FFFFFF", fontFamily: "sans-serif" }}
                >
                  {t.handle}
                </span>
                <span
                  className="text-[10px] tracking-[0.15em] font-light"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
                >
                  {t.perfume}
                </span>
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 flex items-center justify-center gap-3"
        >
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))" }} />
          <p
            className="text-xs tracking-[0.3em] uppercase font-light"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
          >
            +20 pedidos enviados a todo el país
          </p>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)" }} />
        </motion.div>

      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
      />
    </section>
  );
}
