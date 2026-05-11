"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl px-6 text-center"
      >
        <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
          Perfumes árabes
          <span className="block text-[#0047AB]">
            exclusivos
          </span>
        </h1>

        <p className="mt-8 text-lg text-gray-300 md:text-2xl">
          Fragancias premium importadas con proyección y duración extrema
        </p>

        <div className="mt-10 flex justify-center gap-4">
        <a
  href="/catalog"
  className="rounded-full bg-[#0047AB] px-8 py-4 text-white font-semibold transition hover:scale-105"
>
  Ver catálogo
</a>

          <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-white backdrop-blur-md transition hover:bg-white/10">
            Más vendidos
          </button>
        </div>
      </motion.div>
    </section>
  );
}