export default function HotSaleBanner() {
  const text = "🔥 HOT SALE — 20% OFF EN TODA LA TIENDA · HASTA EL 20 DE MAYO · ";
  const items = Array(8).fill(text);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] overflow-hidden flex items-center"
      style={{ background: "#D4AF37", height: "32px" }}>
      <div className="flex items-center whitespace-nowrap animate-ticker" style={{ width: "max-content" }}>
        {items.map((t, i) => (
          <span key={i} className="text-[11px] font-medium tracking-[0.18em] mx-2"
            style={{ color: "#0B0B0B", fontFamily: "sans-serif" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
