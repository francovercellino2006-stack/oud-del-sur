import ProductCard from "./ProductCard";
import { perfumes } from "../app/data/perfumes";

export default function ProductGrid() {
  return (
    <section className="bg-[#0B0B0B] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-bold text-white">
            Más vendidos
          </h2>

          <p className="mt-4 text-gray-400">
            Perfumes árabes premium importados
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {perfumes.map((perfume) => (
            <ProductCard
              key={perfume.name}
              perfume={perfume}
            />
          ))}
        </div>
      </div>
    </section>
  );
}