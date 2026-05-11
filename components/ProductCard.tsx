"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProductCard({ perfume }: any) {
    const slug = perfume.slug;
   
  return (
    <Link href={`/product/${slug}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition"
      >
        <img
          src={perfume.image}
          alt={perfume.name}
          className="h-80 w-full object-cover"
        />

        <div className="p-6">
          <span className="rounded-full bg-[#0047AB] px-3 py-1 text-xs text-white">
            {perfume.badge}
          </span>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            {perfume.name}
          </h3>

          <p className="mt-3 text-gray-400">
            {perfume.description}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0047AB]">
              {perfume.price}
            </span>

            <button className="rounded-full bg-[#0047AB] px-5 py-2 text-white transition hover:scale-105">
              Ver perfume
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}