"use client";

import { useState } from "react";
import { X, Copy, Check, MessageCircle, ArrowRight } from "lucide-react";

const CVU = "0000003100005867776398";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  price: string;
}

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
}

const FIELD_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  fontFamily: "sans-serif",
  outline: "none",
  width: "100%",
};

export default function TransferModal({ open, onClose, productName, price }: TransferModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    name: "", phone: "", address: "", city: "", province: "",
  });

  if (!open) return null;

  const handleClose = () => {
    setStep(1);
    setForm({ name: "", phone: "", address: "", city: "", province: "" });
    onClose();
  };

  const allFilled = form.name && form.phone && form.address && form.city && form.province;

  const handleCopy = () => {
    navigator.clipboard.writeText(CVU);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waText = encodeURIComponent(
    `Hola! Acabo de transferir para:\n\n` +
    `*Producto:* ${productName}\n` +
    `*Importe:* ${price}\n\n` +
    `*Datos de envío:*\n` +
    `Nombre: ${form.name}\n` +
    `Teléfono: ${form.phone}\n` +
    `Dirección: ${form.address}\n` +
    `Ciudad: ${form.city}\n` +
    `Provincia: ${form.province}\n\n` +
    `Te mando el comprobante.`
  );
  const waUrl = `https://wa.me/5492920528440?text=${waText}`;

  const inputClass = "w-full px-4 py-3 text-sm font-light transition-all duration-200";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md overflow-y-auto"
        style={{
          background: "#1A1510",
          border: "1px solid rgba(255,255,255,0.08)",
          maxHeight: "90vh",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
              {step === 1 ? "Paso 1 de 2" : "Paso 2 de 2"}
            </p>
            <h3 className="text-base font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {step === 1 ? "Datos de envío" : "Transferí el importe"}
            </h3>
          </div>
          <button onClick={handleClose} style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Producto siempre visible */}
        <div className="px-6 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-sm font-light text-white truncate pr-4" style={{ fontFamily: "sans-serif" }}>{productName}</p>
          <p className="text-base font-medium shrink-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>{price}</p>
        </div>

        {/* STEP 1 — Formulario */}
        {step === 1 && (
          <div className="px-6 py-5">
            <p className="text-[10px] tracking-[0.3em] uppercase font-light mb-4" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
              ¿A dónde enviamos tu perfume?
            </p>

            <div className="flex flex-col gap-3">
              {[
                { key: "name",     label: "Nombre completo",     placeholder: "Juan García" },
                { key: "phone",    label: "Teléfono / WhatsApp",  placeholder: "+54 9 ..." },
                { key: "address",  label: "Dirección y número",   placeholder: "Av. San Martín 1234" },
                { key: "city",     label: "Ciudad",               placeholder: "Buenos Aires" },
                { key: "province", label: "Provincia",            placeholder: "Buenos Aires" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <p className="text-[9px] tracking-[0.25em] uppercase font-light mb-1.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                    {label}
                  </p>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key as keyof ShippingForm]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={inputClass}
                    style={{
                      ...FIELD_STYLE,
                      borderColor: form[key as keyof ShippingForm] ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
                    onBlur={e => e.currentTarget.style.borderColor = form[key as keyof ShippingForm] ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => allFilled && setStep(2)}
              disabled={!allFilled}
              className="flex items-center justify-center gap-2 w-full py-4 mt-6 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300"
              style={{
                background: allFilled ? "#FFFFFF" : "rgba(255,255,255,0.1)",
                color: allFilled ? "#1A1510" : "rgba(255,255,255,0.25)",
                fontFamily: "sans-serif",
                cursor: allFilled ? "pointer" : "not-allowed",
              }}
            >
              Continuar
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* STEP 2 — CVU + WhatsApp */}
        {step === 2 && (
          <div className="px-6 py-5">
            <p className="text-[10px] tracking-[0.3em] uppercase font-light mb-4" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
              Transferí desde cualquier banco o billetera
            </p>

            <div className="flex items-center justify-between p-4 mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>CVU</p>
                <p className="text-sm font-mono tracking-wider text-white">{CVU}</p>
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

            {/* Resumen envío */}
            <div className="p-4 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[9px] tracking-[0.3em] uppercase font-light mb-2" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>Envío a</p>
              <p className="text-sm font-light text-white" style={{ fontFamily: "sans-serif" }}>{form.name}</p>
              <p className="text-xs font-light mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
                {form.address}, {form.city}, {form.province}
              </p>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 text-xs tracking-[0.25em] uppercase font-medium"
              style={{ background: "#E8D5B0", color: "#1A1510", fontFamily: "sans-serif" }}
            >
              <MessageCircle size={14} />
              Enviar comprobante por WhatsApp
            </a>
            <p className="text-center text-[9px] mt-3 font-light" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>
              Confirmamos el pago y coordinamos el envío
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
