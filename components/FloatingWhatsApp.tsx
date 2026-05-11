import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5492920528440?text=Hola%20quiero%20consultar%20por%20perfumes"
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#0047AB] p-4 shadow-2xl transition hover:scale-110"
    >
      <MessageCircle className="text-white" size={28} />
    </a>
  );
}