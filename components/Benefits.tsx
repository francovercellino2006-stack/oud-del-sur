"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Flame, Truck, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% Originales",
    description: "Importados directamente. Cada frasco con certificado de autenticidad.",
  },
  {
    icon: Flame,
    title: "Duración Extrema",
    description: "8 a 14 horas sobre la piel. Proyección que se hace notar.",
  },
  {
    icon: Truck,
    title: "Envíos a Todo el País",
    description: "Despachamos en 24-48hs. Embalaje premium para cada pedido.",
  },
  {
    icon: MessageCircle,
    title: "Atención Personalizada",
    description: "Te ayudamos a elegir tu fragancia ideal por WhatsApp.",
  },
];

export default function Benefits() {
  return (
    <section className="relative px-6 py-24" style={{ background: "#0B0B0B" }}>
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }}
      />

      <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-4">
        {benefits.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
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
                style={{
                  background: "radial-gradient(ellipse at 0% 0%, rgba(212,175,55,0.06) 0%, transparent 65%)",
                }}
              />

              {/* Icon */}
              <div
                className="mb-5 flex items-center justify-center w-11 h-11"
                style={{ border: "1px solid rgba(212,175,55,0.25)" }}
              >
                <Icon size={18} style={{ color: "#D4AF37" }} strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3
                className="text-base font-light text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="text-xs leading-relaxed font-light"
                style={{ color: "rgba(255,255,255,0.38)", fontFamily: "sans-serif" }}
              >
                {item.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
              />
            </motion.div>
          );
        })}
      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)" }}
      />
    </section>
  );
}
