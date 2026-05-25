"use client";

import { useState } from "react";
import { X, Copy, Check, MessageCircle } from "lucide-react";

const CBU = "0000003100005867776398";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  price: string;
}

export default function TransferModal({ open, onClose, productName, price }: TransferModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CBU);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waText = encodeURIComponent(
    `Hola! Acabo de hacer la transferencia para *${productName}* (${price}). Te mando el comprobante.`
  );
  const waUrl = `https://wa.me/5492920528440?text=${waText}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center px-4 pb-0 lg:pb-0"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md pb-safe"
        style={{
          background: "#1C1C1E",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
              Paso 1
            </p>
            <h3 className="text-base font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Transferí el importe
            </h3>
          </div>
          <button onClick={onClose} style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Producto */}
        <div className="px-6 py-4" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
            Producto
          </p>
          <p className="text-sm font-light text-white" style={{ fontFamily: "sans-serif" }}>{productName}</p>
          <p className="text-xl font-medium mt-1" style={{ fontFamily: "'Montserrat', sans-serif", color: "#FFFFFF" }}>
            {price}
          </p>
        </div>

        {/* CBU */}
        <div className="px-6 py-5">
          <p className="text-[10px] tracking-[0.3em] uppercase font-light mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
            Datos de transferencia
          </p>

          <div className="flex items-center justify-between p-4 mb-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>CBU</p>
              <p className="text-sm font-mono tracking-wider text-white">{CBU}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-200"
              style={{
                background: copied ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                color: copied ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "sans-serif",
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <p className="text-[10px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
            Podés transferir desde cualquier banco o billetera virtual (Mercado Pago, Ualá, etc.)
          </p>
        </div>

        {/* Paso 2 */}
        <div className="px-6 pb-6">
          <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.05)" }} />
          <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-3" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
            Paso 2 — Envianos el comprobante
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300"
            style={{
              background: "#FFFFFF",
              color: "#1C1C1E",
              fontFamily: "sans-serif",
            }}
          >
            <MessageCircle size={14} />
            Enviar comprobante por WhatsApp
          </a>
          <p className="text-center text-[9px] mt-3 font-light" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>
            Confirmamos y coordinamos el envío en el día
          </p>
        </div>
      </div>
    </div>
  );
}
