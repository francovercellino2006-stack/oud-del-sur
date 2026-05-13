import { perfumes } from "../../../app/data/perfumes";
import type { Metadata } from "next";
 
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const perfume = perfumes.find((p) => p.slug === slug);
 
  if (!perfume) {
    return {
      title: "Perfume no encontrado",
    };
  }
 
  return {
    title: `${perfume.name} - ${perfume.brand}`,
    description: `${perfume.description} Fragancia ${perfume.category} de ${perfume.ml}ml con duración de ${perfume.duration}. Comprá por WhatsApp con envío a todo el país.`,
    openGraph: {
      title: `${perfume.name} | Oud Del Sur`,
      description: perfume.description,
      url: `https://ouddelsurperfumes.com/product/${perfume.slug}`,
      images: [
        {
          url: perfume.image,
          alt: perfume.name,
        },
      ],
    },
  };
}