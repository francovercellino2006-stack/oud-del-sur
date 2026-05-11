export default function Navbar() {
    return (
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-[#0047AB]">
            Oud Del Sur
          </h1>
  
          <nav className="flex gap-6 text-sm text-white">
            <a href="/">Inicio</a>
            <a href="/catalog">Catálogo</a>
          </nav>
        </div>
      </header>
    );
  }