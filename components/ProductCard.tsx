"use client";
 
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShoppingBag } from "lucide-react";
import type { Perfume } from "../app/data/perfumes";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import { applyDiscount, getActivePrice, isOfferActive } from "../utils/price";
 
const BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  "Más vendido": { bg: "#D4AF37",              color: "#0B0B0B", border: "transparent" },
  "Nuevo":       { bg: "transparent",          color: "#ffffff", border: "rgba(255,255,255,0.25)" },
  "Top":         { bg: "transparent",          color: "#D4AF37", border: "rgba(212,175,55,0.5)" },
  "Exclusivo":   { bg: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "rgba(212,175,55,0.4)" },
};
 
interface ProductCardProps {
  perfume: Perfume;
  index?: number;
}
 
export default function ProductCard({ perfume, index = 0 }: ProductCardProps) {
  const badgeStyle = perfume.badge ? BADGE_STYLES[perfume.badge] : null;
  const { toggle, isFav } = useFavorites();
  const fav = isFav(perfume.slug);
  const { add, remove, inCart } = useCart();
  const cart = inCart(perfume.slug);
 
  const activePrice = getActivePrice(perfume.price, perfume.offer);
  const waMessage = encodeURIComponent(
    `Hola! Me interesa el perfume *${perfume.name}* (${perfume.brand}) - ${activePrice}. ¿Tienen stock?`
  );
  const waUrl = `https://wa.me/542920528440?text=${waMessage}`;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #141414 0%, #0e0e0e 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.5s ease",
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.12)",
      }}
    >
      {/* Overlay agotado */}
      {perfume.outOfStock && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(11,11,11,0.6)", backdropFilter: "blur(2px)" }}>
          <span className="px-4 py-2 text-xs tracking-[0.3em] uppercase font-light"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
            Agotado
          </span>
        </div>
      )}

      {/* Badges column — top left */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {!perfume.outOfStock && isOfferActive(perfume.offer) && (
          <span className="px-2 py-1 text-[10px] tracking-[0.15em] uppercase font-medium"
            style={{ background: "rgba(200,40,40,0.92)", color: "white", fontFamily: "sans-serif" }}>
            −{perfume.offer!.discount}%
          </span>
        )}
        {perfume.badge && badgeStyle && (
          <span
            className="flex items-center gap-1 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium"
            style={{
              background: badgeStyle.bg,
              color: badgeStyle.color,
              border: `1px solid ${badgeStyle.border}`,
              fontFamily: "sans-serif",
            }}
          >
            {perfume.badge === "Más vendido" && <Sparkles size={9} />}
            {perfume.badge}
          </span>
        )}
      </div>

      {/* Favorite button */}
      <button
        onClick={() => toggle(perfume.slug)}
        className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 transition-all duration-300"
        style={{
          background: fav ? "rgba(212,175,55,0.15)" : "rgba(0,0,0,0.4)",
          border: `1px solid ${fav ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.1)"}`,
          backdropFilter: "blur(8px)",
        }}
        aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart
          size={13}
          style={{
            color: fav ? "#D4AF37" : "rgba(255,255,255,0.4)",
            fill: fav ? "#D4AF37" : "none",
          }}
        />
      </button>

      {/* Clickeable: imagen + info */}
      <Link href={`/product/${perfume.slug}`} className="flex flex-col flex-1 cursor-pointer">

        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <img
            src={perfume.image}
            alt={perfume.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, transparent 40%, rgba(11,11,11,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "rgba(212,175,55,0.04)" }}
          />

          {/* Quick info on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0"
            style={{ transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          >
            <div
              className="p-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p
                className="text-[10px] tracking-[0.25em] uppercase mb-1.5 font-light"
                style={{ color: "rgba(212,175,55,0.8)", fontFamily: "sans-serif" }}
              >
                {perfume.duration} · {perfume.ml}ml · {perfume.category}
              </p>
              <p
                className="text-[11px] font-light capitalize"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif" }}
              >
                Familia: {perfume.family}
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col p-5 pb-3">
          <span
            className="text-[10px] tracking-[0.35em] uppercase font-light mb-1"
            style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}
          >
            {perfume.brand}
          </span>

          <h3
            className="text-xl font-normal text-white mb-2 leading-snug"
            style={{ fontFamily: "var(--font-perfume)" }}
          >
            {perfume.name}
          </h3>

          <p
            className="text-xs leading-relaxed mb-5 font-light"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
          >
            {perfume.description}
          </p>

          <div className="flex items-baseline gap-3 mb-5">
            <span
              className="text-2xl font-light"
              style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}
            >
              {getActivePrice(perfume.price, perfume.offer)}
            </span>
            {isOfferActive(perfume.offer) && (
              <span
                className="text-sm line-through font-light"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
              >
                {perfume.price}
              </span>
            )}
            {!isOfferActive(perfume.offer) && perfume.priceOriginal && (
              <span
                className="text-sm line-through font-light"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
              >
                {perfume.priceOriginal}
              </span>
            )}
          </div>
        </div>

      </Link>

      {/* Botones — fuera del Link para que no naveguen */}
      <div className="flex gap-2 px-5 pb-5">
        <button
          onClick={() => cart
            ? remove(perfume.slug)
            : add({ slug: perfume.slug, name: perfume.name, brand: perfume.brand, price: perfume.price, image: perfume.image })
          }
          className="flex items-center justify-center gap-2 py-3 px-4 text-xs tracking-[0.15em] uppercase font-light transition-all duration-300"
          style={{
            border: `1px solid ${cart ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.08)"}`,
            color: cart ? "#D4AF37" : "rgba(255,255,255,0.4)",
            background: cart ? "rgba(212,175,55,0.08)" : "transparent",
            fontFamily: "sans-serif",
          }}
          aria-label={cart ? "Quitar de lista" : "Agregar a lista"}
        >
          <ShoppingBag size={13} />
        </button>

        <Link
          href={`/product/${perfume.slug}`}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-xs tracking-[0.15em] uppercase font-light transition-all duration-300"
          style={{
            border: "1px solid rgba(212,175,55,0.4)",
            color: "#D4AF37",
            fontFamily: "sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#D4AF37";
            e.currentTarget.style.color = "#0B0B0B";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#D4AF37";
          }}
        >
          Ver perfume
          <ArrowRight size={13} />
        </Link>
      </div>

    </motion.div>
  );
}