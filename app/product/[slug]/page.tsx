import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import { perfumes } from "../../../app/data/perfumes";

export default async function ProductPage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
  
    const { slug } = await params;

  const perfume = perfumes.find(
    (perfume) => perfume.slug === slug
  );

  

  if (!perfume) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Perfume no encontrado
      </main>
    );
  }

  const images = [
    perfume.image,
    perfume.image,
    perfume.image,
    perfume.image,
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-6 pb-24 pt-28 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-start gap-10 lg:grid-cols-[420px_1fr]">

  <div className="w-full">

    <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0B0B] p-6">
      <img
        src={perfume.image}
        alt={perfume.name}
        className="h-[260px] w-auto scale-[1.15] object-contain"
      />
    </div>

    <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex h-[90px] min-w-[90px] items-center justify-center rounded-2xl border border-white/10 bg-[#111111] p-3"
        >
          <img
            src={image}
            alt={perfume.name}
            className="h-14 w-auto object-contain"
          />
        </div>
      ))}
    </div>
  </div>

  <div className="pt-6">

    <span className="text-lg text-[#0057D9]">
      {perfume.badge}
    </span>

    <h1 className="mt-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
      {perfume.name}
    </h1>

    <p className="mt-5 max-w-xl text-lg leading-8 text-gray-400">
      {perfume.description}
    </p>

    <div className="mt-8 border-y border-white/10 py-8">
      <div className="text-5xl font-bold text-white">
        {perfume.price}
      </div>
    </div>

    <div className="space-y-4 py-8 text-lg text-gray-300">

      <div className="flex gap-3">
        <span className="text-[#0057D9]">✦</span>
        <p>Eau de Parfum premium</p>
      </div>

      <div className="flex gap-3">
        <span className="text-[#0057D9]">✦</span>
        <p>Duración aproximada: 8 a 12 horas</p>
      </div>

      <div className="flex gap-3">
        <span className="text-[#0057D9]">✦</span>
        <p>Proyección intensa y elegante</p>
      </div>

      <div className="flex gap-3">
        <span className="text-[#0057D9]">✦</span>
        <p>Fragancia unisex exclusiva</p>
      </div>

    </div>

    <a
      href="https://wa.me/5492920528440?text=Hola%20quiero%20consultar%20por%20perfumes"
      target="_blank"
      className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:scale-105"
    >
      Comprar por WhatsApp
    </a>

  </div>
</div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}