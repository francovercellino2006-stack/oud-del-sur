export type PerfumeBadge = "Más vendido" | "Nuevo" | "Top" | "Exclusivo" | null;
 
export interface Perfume {
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  priceOriginal?: string;
  image: string;
  badge: PerfumeBadge;
  category: "hombre" | "mujer" | "unisex";
  family: "dulces" | "frescos" | "orientales" | "maderosos" | "florales";
  duration: string;
  ml: number;
}
 
export const perfumes: Perfume[] = [
  {
    slug: "amber-oud-gold",
    name: "Amber Oud Gold",
    brand: "Lattafa",
    description: "Ámbar intenso con vainilla cremosa y oud ahumado.",
    price: "$85.000",
    priceOriginal: "$98.000",
    image: "/perfumes/amber.jpg",
    badge: "Más vendido",
    category: "unisex",
    family: "orientales",
    duration: "10-12 hs",
    ml: 100,
  },
  {
    slug: "honor-and-glory",
    name: "Honor & Glory",
    brand: "Lattafa",
    description: "Dulce, elegante y larga duración.",
    price: "$72.000",
    image: "/perfumes/HonorAndGlory.jpg",
    badge: "Nuevo",
    category: "unisex",
    family: "dulces",
    duration: "8-12 hs",
    ml: 100,
  },
  {
    slug: "atlas",
    name: "Atlas",
    brand: "Maison Alhambra",
    description: "Amaderado premium con oud árabe y sándalo.",
    price: "$90.000",
    image: "/perfumes/atlas.jpg",
    badge: "Top",
    category: "hombre",
    family: "maderosos",
    duration: "12-14 hs",
    ml: 100,
  },
];