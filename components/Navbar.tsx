
  "use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
 
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites } = useFavorites();
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
                fontFamily: "'Cormorant Garamond', serif",
                background:
                  "linear-gradient(90deg, #D4AF37 0%, #F0D875 40%, #B8941F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Oud Del Sur
            </span>
            <span
              className="text-[9px] tracking-[0.45em] uppercase font-light mt-0.5"
              style={{ color: "rgba(212,175,55,0.5)", fontFamily: "sans-serif" }}
            >
              Perfumería Árabe
            </span>
          </Link>
 
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "Inicio", href: "/" },
              { label: "Catálogo", href: "/catalog" },
              { label: "Quiz", href: "/quiz" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
               className="text-xs tracking-[0.25em] uppercase font-light transition-colors duration-300 hover:text-[#D4AF37]"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif" }}
               
              >
                {link.label}
              </Link>
            ))}
          </nav>
 
          {/* CTA button desktop + mobile hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/favorites" className="relative hidden md:flex items-center justify-center w-8 h-8 transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              aria-label="Favoritos">
              <Heart size={16} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-medium rounded-full"
                  style={{ background: "#D4AF37", color: "#0B0B0B", fontFamily: "sans-serif" }}>
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/catalog"
            className="hidden md:inline-flex items-center px-5 py-2 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
              style={{
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#D4AF37",
                fontFamily: "sans-serif",
              }}
             
            >
              Ver Catálogo
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
            style={{ background: "rgba(11,11,11,0.97)", backdropFilter: "blur(16px)" }}
          >
            <nav className="flex flex-col gap-7">
              {[
                { label: "Inicio", href: "/" },
                { label: "Catálogo", href: "/catalog" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light tracking-widest block transition-colors duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
 
            <div className="mt-auto">
              <div
                className="mb-8 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
                }}
              />
              <Link
                href="/catalog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full py-4 text-sm tracking-[0.25em] uppercase font-medium transition-all duration-300"
                style={{ background: "#D4AF37", color: "#0B0B0B" }}
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