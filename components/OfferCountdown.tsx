"use client";

import { useEffect, useState } from "react";

function getTimeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export default function OfferCountdown({ discount, endsAt }: { discount: number; endsAt: string }) {
  const [time, setTime] = useState(getTimeLeft(endsAt));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!time) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-4 px-4 py-3 mb-6"
      style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
      <div className="flex flex-col">
        <span className="text-[9px] tracking-[0.35em] uppercase font-light mb-1"
          style={{ color: "rgba(212,175,55,0.6)", fontFamily: "sans-serif" }}>
          Oferta especial
        </span>
        <span className="text-2xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#D4AF37" }}>
          −{discount}%
        </span>
      </div>

      <div className="w-px h-10 shrink-0" style={{ background: "rgba(212,175,55,0.2)" }} />

      <div className="flex flex-col">
        <span className="text-[9px] tracking-[0.3em] uppercase font-light mb-2"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
          Termina en
        </span>
        <div className="flex items-center gap-2">
          {[{ v: time.h, l: "hs" }, { v: time.m, l: "min" }, { v: time.s, l: "seg" }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center">
              <span className="text-lg font-light leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "white" }}>
                {pad(v)}
              </span>
              <span className="text-[9px] font-light mt-0.5"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
