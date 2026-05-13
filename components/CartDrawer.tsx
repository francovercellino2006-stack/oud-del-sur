"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "../hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, clear, waMessage } = useCart();
  const waUrl = `https://wa.me/5492920528440?text=${waMessage()}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 z-[70] flex flex-col w-full max-w-sm"
            style={{ background: "#0f0f0f", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} style={{ color: "#D4AF37" }} />
                <span className="text-xs tracking-[0.3em] uppercase font-light"
                  style={{ color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>
                  Mi consulta
                </span>
                {items.length > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-[10px] font-medium rounded-full"
                    style={{ background: "#D4AF37", color: "#0B0B0B", fontFamily: "sans-serif" }}>
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag size={32} style={{ color: "rgba(212,175,55,0.2)" }} />
                  <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                    Tu lista está vacía
                  </p>
                  <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>
                    Agregá perfumes desde el catálogo
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.slug}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-3"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div className="relative w-14 h-14 shrink-0 overflow-hidden"
                        style={{ background: "#141414" }}>
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[0.2em] uppercase font-light mb-0.5"
                          style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}>
                          {item.brand}
                        </p>
                        <p className="text-sm font-light text-white truncate"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {item.name}
                        </p>
                        <p className="text-xs font-light mt-0.5"
                          style={{ color: "#D4AF37", fontFamily: "sans-serif" }}>
                          {item.price}
                        </p>
                      </div>
                      <button onClick={() => remove(item.slug)}
                        className="shrink-0 transition-colors duration-200 p-1"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,100,100,0.7)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}>
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 space-y-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center justify-center gap-3 w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300"
                  style={{ background: "#D4AF37", color: "#0B0B0B", fontFamily: "sans-serif",
                    boxShadow: "0 4px 30px rgba(212,175,55,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E8C84A")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#D4AF37")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <button onClick={clear}
                  className="w-full py-2 text-xs tracking-[0.2em] uppercase font-light transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                  Vaciar lista
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
