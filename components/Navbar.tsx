
  "use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, ShoppingBag } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import CartDrawer from "./CartDrawer";
 
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { favorites } = useFavorites();
  const { items } = useCart();
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ top: "32px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/5 py-3 backdrop-blur-xl bg-black/60"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="text-xl font-light tracking-[0.18em] uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                background:
                  "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 40%, #CCCCCC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Oud Del Sur
            </span>
            <span
              className="text-[9px] tracking-[0.45em] uppercase font-light mt-0.5"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
            >
              Perfumería Árabe
            </span>
          </Link>
 
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "Catálogo", href: "/catalog" },
              { label: "Quiz", href: "/quiz" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
               className="text-xs tracking-[0.25em] uppercase font-light transition-colors duration-300 hover:text-[#FFFFFF]"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif" }}
               
              >
                {link.label}
              </Link>
            ))}
          </nav>
 
          {/* CTA button desktop + mobile hamburger */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <button onClick={() => setCartOpen(true)}
              className="relative hidden md:flex items-center justify-center w-8 h-8 transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              aria-label="Carrito">
              <ShoppingBag size={16} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-medium rounded-full"
                  style={{ background: "#FFFFFF", color: "#1C1C1E", fontFamily: "sans-serif" }}>
                  {items.length}
                </span>
              )}
            </button>

            <Link href="/favorites" className="relative hidden md:flex items-center justify-center w-8 h-8 transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              aria-label="Favoritos">
              <Heart size={16} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-medium rounded-full"
                  style={{ background: "#FFFFFF", color: "#1C1C1E", fontFamily: "sans-serif" }}>
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.7)" }}
              aria-label="Menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>
 
      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col px-6 pt-24 pb-10"
            style={{ background: "rgba(17,17,17,0.97)", backdropFilter: "blur(16px)" }}
          >
            <nav className="flex flex-col">
              {[
                { label: "Inicio", href: "/" },
                { label: "Catálogo", href: "/catalog" },
                { label: "Quiz", href: "/quiz" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 py-5 text-sm tracking-[0.35em] uppercase font-light block transition-colors duration-300 group"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <span className="w-5 h-px flex-shrink-0 transition-all duration-300 group-hover:w-8"
                      style={{ background: "#FFFFFF", opacity: 0.6 }} />
                    <span className="group-hover:text-[#FFFFFF] transition-colors duration-300">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
 
            <div className="mt-auto">
              <div
                className="mb-8 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
              />
              <Link
                href="/catalog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full py-4 text-sm tracking-[0.25em] uppercase font-medium transition-all duration-300"
                style={{ background: "#FFFFFF", color: "#1C1C1E" }}
              >
                Ver Catálogo Completo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}