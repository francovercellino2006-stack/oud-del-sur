import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t px-6 py-16" style={{ background: "#1C1C1E", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
          {/* Brand */}
          <div>
            <Link href="/" className="flex flex-col leading-none">
              <span
                className="text-2xl font-light tracking-[0.18em] uppercase"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 40%, #CCCCCC 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Oud Del Sur
              </span>
              <span
                className="text-[9px] tracking-[0.45em] uppercase font-light mt-1"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif" }}
              >
                Perfumería Árabe Premium
              </span>
            </Link>
            <p
              className="mt-5 max-w-xs text-xs leading-relaxed font-light"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}
            >
              Perfumes árabes 100% originales importados.
              Fragancias exclusivas con duración extrema, directo a tu puerta.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <p
              className="text-[10px] tracking-[0.35em] uppercase font-light"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
            >
              Navegación
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Inicio", href: "/" },
                { label: "Catálogo", href: "/catalog" },
                { label: "Quiz de Fragancias", href: "/quiz" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs tracking-[0.15em] font-light transition-colors duration-300 hover:text-[#FFFFFF]"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <p
              className="text-[10px] tracking-[0.35em] uppercase font-light"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}
            >
              Contacto
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com/oudelsurperfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.15em] font-light transition-colors duration-300 hover:text-[#FFFFFF]"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
              >
                Instagram
              </a>
              <a
                href="https://wa.me/5492920528440"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.15em] font-light transition-colors duration-300 hover:text-[#FFFFFF]"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-14 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
        />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
          <p
            className="text-[10px] tracking-[0.25em] uppercase font-light"
            style={{ color: "rgba(255,255,255,0.18)", fontFamily: "sans-serif" }}
          >
            © 2026 Oud Del Sur. Todos los derechos reservados.
          </p>
          <p
            className="text-[10px] tracking-[0.15em] font-light"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}
          >
            Perfumería Árabe · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
