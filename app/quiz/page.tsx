"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { perfumes, type Perfume } from "../data/perfumes";

const steps = [
  {
    id: "estilo",
    question: "¿Qué estilo de fragancia te atrae?",
    subtitle: "Elegí el que más te representa",
    options: [
      { value: "dulces",     label: "Dulce",     desc: "Vainilla, caramelo, gourmand" },
      { value: "frescos",    label: "Fresco",     desc: "Cítrico, acuático, limpio" },
      { value: "orientales", label: "Seductor",   desc: "Oud, ámbar, especias" },
      { value: "maderosos",  label: "Maderoso",   desc: "Sándalo, cedro, tabaco" },
    ],
  },
  {
    id: "ocasion",
    question: "¿Para qué momento del día?",
    subtitle: "Pensá cuándo lo vas a usar más",
    options: [
      { value: "dia",   label: "Día",          desc: "Trabajo, salidas casuales" },
      { value: "noche", label: "Noche",         desc: "Salidas, cenas, eventos" },
      { value: "todo",  label: "Todo el día",   desc: "Versátil, para cualquier momento" },
    ],
  },
  {
    id: "genero",
    question: "¿Para quién es el perfume?",
    subtitle: "Esto nos ayuda a afinar la recomendación",
    options: [
      { value: "hombre", label: "Para él",    desc: "Fragancias masculinas" },
      { value: "mujer",  label: "Para ella",  desc: "Fragancias femeninas" },
      { value: "unisex", label: "Unisex",     desc: "Para cualquier persona" },
    ],
  },
];

type Answers = { estilo?: string; ocasion?: string; genero?: string };

function getRecommendations(answers: Answers): Perfume[] {
  const scored = perfumes.map((p) => {
    let score = 0;

    if (answers.estilo && p.family === answers.estilo) score += 3;

    if (answers.ocasion === "dia"   && ["frescos", "florales"].includes(p.family)) score += 2;
    if (answers.ocasion === "noche" && ["orientales", "dulces", "maderosos"].includes(p.family)) score += 2;
    if (answers.ocasion === "todo")  score += 1;

    if (answers.genero && (p.category === answers.genero || p.category === "unisex")) score += 2;

    if (p.badge === "Más vendido" || p.badge === "Top") score += 1;

    return { perfume: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.perfume);
}

export default function QuizPage() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone]       = useState(false);
  const [direction, setDir]   = useState(1);

  const current = steps[step];

  const select = (value: string) => {
    const key = current.id as keyof Answers;
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setDir(1);

    if (step < steps.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 180);
    } else {
      setTimeout(() => setDone(true), 180);
    }
  };

  const back = () => {
    setDir(-1);
    if (done) { setDone(false); return; }
    setStep((s) => s - 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setDir(1);
  };

  const results = done ? getRecommendations(answers) : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] flex flex-col">

        {/* Gold glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%)" }}
        />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-32">
          <AnimatePresence mode="wait" custom={direction}>
            {!done ? (
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-2xl"
              >
                {/* Progress */}
                <div className="flex items-center gap-2 mb-12">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className="h-px flex-1 transition-all duration-500"
                      style={{ background: i <= step ? "#D4AF37" : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                  <span className="text-[10px] tracking-[0.3em] uppercase font-light ml-2 shrink-0"
                    style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                    {step + 1} / {steps.length}
                  </span>
                </div>

                {/* Question */}
                <p className="text-[10px] tracking-[0.45em] uppercase font-light mb-4"
                  style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
                  {current.subtitle}
                </p>
                <h2 className="text-4xl md:text-5xl font-light text-white mb-12 leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {current.question}
                </h2>

                {/* Options */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {current.options.map((opt) => {
                    const selected = answers[current.id as keyof Answers] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => select(opt.value)}
                        className="group flex flex-col items-start p-6 text-left transition-all duration-300"
                        style={{
                          background: selected ? "rgba(212,175,55,0.08)" : "linear-gradient(160deg, #141414, #0f0f0f)",
                          border: selected ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                        }}
                      >
                        <span className="text-lg font-light mb-1 group-hover:text-[#D4AF37] transition-colors duration-300"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: selected ? "#D4AF37" : "white",
                          }}>
                          {opt.label}
                        </span>
                        <span className="text-xs font-light"
                          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Back button */}
                {step > 0 && (
                  <button onClick={back}
                    className="mt-8 flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-light transition-colors duration-300"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                    <ArrowLeft size={13} /> Volver
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl"
              >
                {/* Header */}
                <div className="text-center mb-14">
                  <p className="text-xs tracking-[0.45em] uppercase font-light mb-4"
                    style={{ color: "#D4AF37", fontFamily: "sans-serif" }}>
                    Tu recomendación personalizada
                  </p>
                  <h2 className="text-5xl font-light text-white mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Estos son{" "}
                    <span style={{
                      background: "linear-gradient(90deg, #D4AF37, #F0D875, #B8941F)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      tus perfumes
                    </span>
                  </h2>
                  <div className="mx-auto w-16 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
                </div>

                {/* Results grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                  {results.map((p, i) => (
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={`/product/${p.slug}`}
                        className="group flex flex-col overflow-hidden transition-all duration-500"
                        style={{
                          background: "linear-gradient(160deg, #141414, #0f0f0f)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          display: "flex",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.25)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 50px rgba(0,0,0,0.7)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image src={p.image} alt={p.name} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-5">
                          <p className="text-[9px] tracking-[0.3em] uppercase mb-1 font-light"
                            style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                            {p.brand}
                          </p>
                          <h3 className="text-lg font-light text-white mb-3 group-hover:text-[#D4AF37] transition-colors duration-300 leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {p.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="font-light"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                background: "linear-gradient(90deg, #D4AF37, #F0D875)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}>
                              {p.price}
                            </span>
                            <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: "#D4AF37" }} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.color = "#D4AF37"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                    <RotateCcw size={13} /> Repetir quiz
                  </button>
                  <Link href="/catalog"
                    className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
                    style={{ background: "#D4AF37", color: "#0B0B0B", fontFamily: "sans-serif" }}>
                    Ver catálogo completo <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
