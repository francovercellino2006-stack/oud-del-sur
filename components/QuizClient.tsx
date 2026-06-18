"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Perfume } from "../app/data/perfumes";
import { getActivePrice, isOfferActive } from "../utils/price";

const steps = [
  {
    id: "estilo",
    question: "¿Qué estilo de fragancia te atrae?",
    subtitle: "Elegí el que más te representa",
    options: [
      { value: "dulces",             label: "Dulce",    emoji: "🍯", desc: "Vainilla, caramelo, gourmand" },
      { value: "frescos",            label: "Fresco",   emoji: "🌊", desc: "Cítrico, acuático, limpio" },
      { value: "orientales",         label: "Seductor", emoji: "🔥", desc: "Oud, ámbar, especias orientales" },
      { value: "maderosos",          label: "Maderoso", emoji: "🌿", desc: "Sándalo, cedro, tabaco" },
      { value: "florales",           label: "Floral",   emoji: "🌸", desc: "Rosa, jazmín, flores blancas" },
      { value: "aromaticas acuaticas", label: "Acuático", emoji: "💧", desc: "Marino, ozónico, fresco intenso" },
    ],
  },
  {
    id: "momento",
    question: "¿Para qué momento del día?",
    subtitle: "Pensá cuándo lo vas a usar más",
    options: [
      { value: "dia",    label: "Día",         emoji: "☀️", desc: "Trabajo, salidas casuales" },
      { value: "noche",  label: "Noche",        emoji: "🌙", desc: "Salidas, cenas, eventos" },
      { value: "todo",   label: "Todo el día",  emoji: "⏰", desc: "Versátil, para cualquier momento" },
    ],
  },
  {
    id: "genero",
    question: "¿Para quién es el perfume?",
    subtitle: "Esto nos ayuda a afinar la recomendación",
    options: [
      { value: "hombre", label: "Para él",   emoji: "👔", desc: "Fragancias masculinas" },
      { value: "mujer",  label: "Para ella", emoji: "💄", desc: "Fragancias femeninas" },
      { value: "unisex", label: "Unisex",    emoji: "✨", desc: "Para cualquier persona" },
    ],
  },
  {
    id: "intensidad",
    question: "¿Qué intensidad preferís?",
    subtitle: "Pensá en la proyección y duración",
    options: [
      { value: "ligero",   label: "Ligero",   emoji: "🌬️", desc: "Sutil, cercano, cotidiano" },
      { value: "moderado", label: "Moderado", emoji: "🎯", desc: "Equilibrado, versátil" },
      { value: "intenso",  label: "Intenso",  emoji: "💥", desc: "Potente, larga duración, se nota" },
    ],
  },
];

type Answers = {
  estilo?: string;
  momento?: string;
  genero?: string;
  intensidad?: string;
};

const NOCHE_FAMILIES  = ["orientales", "dulces", "maderosos"];
const DIA_FAMILIES    = ["frescos", "florales", "aromaticas acuaticas", "aromaticas"];
const LIGERO_FAMILIES = ["frescos", "florales", "aromaticas acuaticas", "aromaticas"];
const INTENSO_FAMILIES = ["orientales", "maderosos"];

function getRecommendations(answers: Answers, perfumes: Perfume[]): Perfume[] {
  const eligible = perfumes.filter((p) => !p.outOfStock && !p.isDecant);

  const scored = eligible.map((p) => {
    let score = 0;

    // Estilo → family match (strongest signal)
    if (answers.estilo && p.family === answers.estilo) score += 5;

    // Momento × family
    if (answers.momento === "noche"  && NOCHE_FAMILIES.includes(p.family))  score += 2;
    if (answers.momento === "dia"    && DIA_FAMILIES.includes(p.family))     score += 2;
    if (answers.momento === "todo")                                           score += 1;

    // Género
    if (answers.genero) {
      if (p.category === answers.genero) score += 3;
      else if (p.category === "unisex")  score += 1;
    }

    // Intensidad × family
    if (answers.intensidad === "ligero"   && LIGERO_FAMILIES.includes(p.family))  score += 2;
    if (answers.intensidad === "intenso"  && INTENSO_FAMILIES.includes(p.family)) score += 2;
    if (answers.intensidad === "moderado" &&
      !LIGERO_FAMILIES.includes(p.family) && !INTENSO_FAMILIES.includes(p.family)) score += 2;

    // Badge bonus
    if (p.badge === "Más vendido") score += 1;
    if (p.badge === "Top")         score += 0.5;

    return { perfume: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.perfume);
}

export default function QuizClient({ perfumes }: { perfumes: Perfume[] }) {
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

  const results = done ? getRecommendations(answers, perfumes) : [];

  return (
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
                  style={{ background: i <= step ? "#E8D5B0" : "rgba(255,255,255,0.1)" }}
                />
              ))}
              <span className="text-[10px] tracking-[0.3em] uppercase font-light ml-2 shrink-0"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                {step + 1} / {steps.length}
              </span>
            </div>

            {/* Question */}
            <p className="text-[10px] tracking-[0.45em] uppercase font-light mb-4"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
              {current.subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-10 leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
                    className="group flex items-center gap-4 p-5 text-left transition-all duration-200"
                    style={{
                      background:  selected ? "rgba(232,213,176,0.08)" : "linear-gradient(160deg, #141414, #0f0f0f)",
                      border:      selected ? "1px solid #E8D5B0"       : "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    }}
                  >
                    <span className="text-2xl shrink-0">{opt.emoji}</span>
                    <div>
                      <span className="block text-base font-light mb-0.5"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          color: selected ? "#E8D5B0" : "#FFFFFF",
                        }}>
                        {opt.label}
                      </span>
                      <span className="text-xs font-light"
                        style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back */}
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
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.45em] uppercase font-light mb-4"
                style={{ color: "#E8D5B0", fontFamily: "sans-serif" }}>
                Tu recomendación personalizada
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Estos son tus perfumes
              </h2>
              <div className="mx-auto w-16 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
            </div>

            {/* Results grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {results.map((p, i) => {
                const activePrice = getActivePrice(p.price, p.offer);
                const offerOn     = isOfferActive(p.offer);
                return (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    {i === 0 && (
                      <div className="absolute -top-3 left-4 z-10 flex items-center gap-1 px-2 py-1 text-[9px] tracking-[0.2em] uppercase font-medium"
                        style={{ background: "#E8D5B0", color: "#1A1510", fontFamily: "sans-serif" }}>
                        <Sparkles size={8} /> Mejor match
                      </div>
                    )}
                    <Link href={`/product/${p.slug}`}
                      className="group flex flex-col overflow-hidden h-full transition-all duration-300"
                      style={{
                        background: "linear-gradient(160deg, #141414, #0f0f0f)",
                        border: i === 0 ? "1px solid rgba(232,213,176,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = i === 0 ? "rgba(232,213,176,0.4)" : "rgba(255,255,255,0.06)"}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                        <img src={p.image} alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, rgba(26,21,16,0.8) 0%, transparent 50%)" }} />
                        <span className="absolute bottom-3 left-3 text-[9px] tracking-[0.2em] uppercase font-light px-2 py-1 capitalize"
                          style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif", backdropFilter: "blur(4px)" }}>
                          {p.family}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-[9px] tracking-[0.3em] uppercase mb-1 font-light"
                          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                          {p.brand}
                        </p>
                        <h3 className="text-base font-light text-white mb-1 leading-snug flex-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {p.name}
                        </h3>
                        <p className="text-[10px] mb-3 font-light"
                          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                          {p.duration} · {p.ml}ml
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-light" style={{ color: "#FFFFFF", fontFamily: "'Montserrat', sans-serif" }}>
                              {activePrice}
                            </span>
                            {offerOn && (
                              <span className="text-xs line-through font-light" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                                {p.price}
                              </span>
                            )}
                          </div>
                          <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "rgba(255,255,255,0.6)" }} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={back}
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                <ArrowLeft size={13} /> Volver
              </button>
              <button onClick={reset}
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                <RotateCcw size={13} /> Repetir quiz
              </button>
              <Link href="/catalog"
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{ background: "#E8D5B0", color: "#1A1510", fontFamily: "sans-serif" }}>
                Ver catálogo completo <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
