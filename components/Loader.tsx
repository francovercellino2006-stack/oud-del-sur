"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#000000" }}
        >
          {/* Gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 65%)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-3"
          >
            <span
              className="text-3xl font-light tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 40%, #CCCCCC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Oud Del Sur
            </span>

            <div
              className="w-12 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)" }}
            />

            <span
              className="text-[9px] tracking-[0.55em] uppercase font-light"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif" }}
            >
              Perfumería Árabe
            </span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 overflow-hidden"
            style={{ width: "80px", height: "1px", background: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              className="h-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.6, delay: 0.3, ease: "easeInOut" }}
              style={{ background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)", width: "100%" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
