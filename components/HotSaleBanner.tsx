export default function HotSaleBanner() {
  const text = "🔥 HOT SALE — 20% OFF EN TODA LA TIENDA · HASTA EL 20 DE MAYO · ";
  const repeated = Array(6).fill(text).join("");

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] overflow-hidden flex"
      style={{ background: "#D4AF37", height: "32px" }}>
      <div
        className="flex items-center whitespace-nowrap animate-ticker"
        style={{ width: "max-content" }}
      >
        {repeated.split("").map((char, i) => (
          <span key={i} className="text-[11px] font-medium tracking-[0.2em]"
            style={{ color: "#0B0B0B", fontFamily: "sans-serif" }}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
