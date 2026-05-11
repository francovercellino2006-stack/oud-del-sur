export default function Footer() {
    return (
      <footer className="border-t border-white/10 bg-black px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold text-[#0047AB]">
                Oud Del Sur
              </h2>
  
              <p className="mt-4 max-w-md text-gray-400">
                Perfumes árabes premium importados.
                Fragancias exclusivas con duración extrema.
              </p>
            </div>
  
            <div className="flex gap-6 text-gray-300">
            <a
  href="https://instagram.com/oudelsurperfumes"
  target="_blank"
  className="hover:text-[#0047AB] transition"
>
  Instagram
</a>
             
              <a href="#">WhatsApp</a>
            </div>
          </div>
  
          <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
            © 2026 Oud Del Sur. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    );
  }