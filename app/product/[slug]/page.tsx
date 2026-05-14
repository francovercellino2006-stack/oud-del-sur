import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import ProductDetail from "../../../components/ProductDetail";
import { getPerfume, getPerfumes } from "../../../lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const perfumes = await getPerfumes();
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfume(slug);

  if (!perfume) {
    return { title: "Perfume no encontrado | Oud Del Sur" };
  }

  return {
    title: `${perfume.name} - ${perfume.brand} | Oud Del Sur`,
    description: `Comprá ${perfume.name} de ${perfume.brand} en Oud Del Sur. ${perfume.description} Duración ${perfume.duration}. ${perfume.ml}ml. Envíos a todo el país desde Viedma, Río Negro.`,
    openGraph: {
      title: `${perfume.name} - ${perfume.brand} | Oud Del Sur`,
      description: `Comprá ${perfume.name} de ${perfume.brand} en Oud Del Sur. ${perfume.description}`,
      images: [
        {
          url: perfume.image,
          width: 800,
          height: 800,
          alt: perfume.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [perfume, allPerfumes] = await Promise.all([getPerfume(slug), getPerfumes()]);

  if (!perfume) {
    notFound();
  }

  const numericPrice = parseInt(perfume.price.replace(/[$.,]/g, ""), 10);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": perfume.name,
    "brand": { "@type": "Brand", "name": perfume.brand },
    "description": perfume.description,
    "image": perfume.image,
    "offers": {
      "@type": "Offer",
      "price": numericPrice,
      "priceCurrency": "ARS",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Oud Del Sur" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />
      <ProductDetail perfume={perfume} allPerfumes={allPerfumes} />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
