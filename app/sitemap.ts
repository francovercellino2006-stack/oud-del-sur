import { MetadataRoute } from "next";
import { getPerfumes } from "../lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://ouddelsurperfumes.com";
  const perfumes = await getPerfumes();

  const productUrls = perfumes.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${base}/catalog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${base}/quiz`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...productUrls,
  ];
}
