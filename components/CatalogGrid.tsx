"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Search } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Perfume } from "../app/data/perfumes";

const BRANDS    = ["Lattafa", "Armaf", "Afnan", "Maison Alhambra", "Rasasi", "Al Wataniah", "French Avenue"];
const CATS      = ["hombre", "mujer", "unisex"] as const;
const FAMILIES  = ["dulces", "frescos", "orientales", "maderosos", "florales", "aromaticas", "aromaticas acuaticas"] as const;

interface CatalogGridProps {
  perfumes:         Perfume[];
  initialBrand?:    string;
  initialCategory?: string;
  initialFamily?:   string;
}

export default function CatalogGrid({
  perfumes,
  initialBrand,
  initialCategory,
  initialFamily,
}: CatalogGridProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [brand,    setBrand]    = useState(initialBrand    ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [family,   setFamily]   = useState(initialFamily   ?? "");
  const [productType, setProductType] = useState<"" | "perfume" | "decant">("");
  const [search,   setSearch]   = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (brand)    params.set("brand",    brand);
    if (category) params.set("category", category);
    if (family)   params.set("family",   family);
    router.replace(`/catalog?${params.toString()}`, { scroll: false });
  }, [brand, category, family]);

  // Sync URL → state (back/forward navigation)
  useEffect(() => {
    setBrand(searchParams.get("brand")    ?? "");
    setCategory(searchParams.get("category") ?? "");
    setFamily(searchParams.get("family")   ?? "");
  }, [searchParams]);

  const filtered = useMemo<Perfume[]>(() => {
    const q = search.toLowerCase().trim();
    return perfumes.filter((p) => {
      if (brand    && p.brand    !== brand)    return false;
      if (category && p.category !== category) return false;
      if (family   && p.family   !== family)   return false;
      if (productType === "decant"  && !p.isDecant)  return false;
      if (productType === "perfume" &&  p.isDecant)  return false;
      if (q && ![p.name, p.brand, p.description, p.family].some((s) => (s ?? "").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [brand, category, family, productType, search]);

  const activeCount = [brand, category, family, productType].filter(Boolean).length;

  const clearAll = () => {
    setBrand("");
    setCategory("");
    setFamily("");
    setProductType("");
  };

  const FilterBtn = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 text-xs tracking-[0.15em] uppercase font-light transition-all duration-300 whitespace-nowrap"
      style={{
        background:   active ? "#FFFFFF"                      : "transparent",
        color:        active ? "#1A1510"                      : "rgba(255,255,255,0.5)",
        border:       active ? "1px solid #FFFFFF"            : "1px solid rgba(255,255,255,0.1)",
        fontFamily:   "sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
          e.currentTarget.style.color       = "#FFFFFF";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color       = "rgba(255,255,255,0.5)";
        }
      }}
    >
      {label}
    </button>
  );

  return (
    <section className="px-6 py-16" style={{ background: "#1A1510" }}>
      <div className="mx-auto max-w-7xl">

        {/* ── Search bar ── */}
        <div className="mb-8 relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(255,255,255,0.5)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, marca o notas..."
            className="w-full py-3 pl-11 pr-10 text-sm font-light bg-transparent outline-none transition-all duration-300"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "sans-serif",
              caretColor: "#FFFFFF",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200 opacity-50 hover:opacity-100"
            >
              <X size={13} style={{ color: "rgba(255,255,255,0.6)" }} />
            </button>
          )}
        </div>

        {/* ── Filter bar ── */}
        <div className="mb-10">

          {/* Mobile toggle */}
          <div className="flex items-center justify-between mb-5 md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-light transition-colors duration-300"
              style={{ color: showFilters ? "#FFFFFF" : "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}
            >
              <SlidersHorizontal size={14} />
              Filtros {activeCount > 0 && `(${activeCount})`}
            </button>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs font-light"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}
              >
                <X size={12} /> Limpiar
              </button>
            )}
          </div>

          {/* Desktop filters always visible, mobile collapsible */}
          <AnimatePresence>
            {(showFilters || true) && (
              <motion.div
                initial={false}
                className="space-y-5"
              >
                {/* Row 1: Brands */}
                <div>
                  <p
                    className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                  >
                    Marca
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <FilterBtn
                      label="Todas"
                      active={brand === ""}
                      onClick={() => setBrand("")}
                    />
                    {BRANDS.map((b) => (
                      <FilterBtn
                        key={b}
                        label={b}
                        active={brand === b}
                        onClick={() => setBrand(brand === b ? "" : b)}
                      />
                    ))}
                  </div>
                </div>

                {/* Row 2: Tipo */}
                <div>
                  <p
                    className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                  >
                    Tipo
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <FilterBtn label="Todos"    active={productType === ""}        onClick={() => setProductType("")} />
                    <FilterBtn label="Perfumes" active={productType === "perfume"} onClick={() => setProductType(productType === "perfume" ? "" : "perfume")} />
                    <FilterBtn label="Decants"  active={productType === "decant"}  onClick={() => setProductType(productType === "decant"  ? "" : "decant")} />
                  </div>
                </div>

                {/* Row 3: Category + Family */}
                <div className="flex flex-wrap gap-x-10 gap-y-5">
                  <div>
                    <p
                      className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light"
                      style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                    >
                      Categoría
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CATS.map((c) => (
                        <FilterBtn
                          key={c}
                          label={c}
                          active={category === c}
                          onClick={() => setCategory(category === c ? "" : c)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light"
                      style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
                    >
                      Familia
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FAMILIES.map((f) => (
                        <FilterBtn
                          key={f}
                          label={f}
                          active={family === f}
                          onClick={() => setFamily(family === f ? "" : f)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filters summary + clear */}
          {activeCount > 0 && (
            <div className="flex items-center gap-3 mt-5 pt-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-xs font-light" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                Filtros activos:
              </span>
              {productType && <Chip label={productType === "decant" ? "Decants" : "Perfumes"} onRemove={() => setProductType("")} />}
              {brand    && <Chip label={brand}    onRemove={() => setBrand("")} />}
              {category && <Chip label={category} onRemove={() => setCategory("")} />}
              {family   && <Chip label={family}   onRemove={() => setFamily("")} />}
              <button
                onClick={clearAll}
                className="ml-auto text-xs font-light flex items-center gap-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >
                <X size={12} /> Limpiar todo
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="mb-10 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
        />

        {/* Results count */}
        <p
          className="text-xs tracking-[0.25em] uppercase mb-8 font-light"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}
        >
          {filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"} encontrados
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid gap-3 grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((perfume, i) => (
                <motion.div
                  key={perfume.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <ProductCard perfume={perfume} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-6"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "24px" }}>✦</span>
            </div>
            <p
              className="text-lg font-light mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(255,255,255,0.6)" }}
            >
              No hay perfumes con esos filtros
            </p>
            <p
              className="text-xs font-light mb-8"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}
            >
              Probá con otra combinación o limpiá los filtros
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-3 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF", fontFamily: "sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.color = "#1A1510"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FFFFFF"; }}
            >
              Ver todos los perfumes
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Small removable chip
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-light capitalize"
      style={{
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
      }}
    >
      {label}
      <button onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={10} />
      </button>
    </span>
  );
}