import { client } from './sanity'

export async function getPerfumes() {
  return client.fetch(`*[_type == "perfume"] | order(order asc) {
    "slug": slug.current,
    name, brand, description, price, priceOriginal,
    "image": coalesce(imageUrl, image.asset->url),
    badge, category, family, duration, ml,
    inspiredBy, outOfStock, offerDiscount, offerEndsAt
  }`)
}

export async function getPerfume(slug: string) {
  return client.fetch(`*[_type == "perfume" && slug.current == $slug][0] {
    "slug": slug.current,
    name, brand, description, price, priceOriginal,
    "image": coalesce(imageUrl, image.asset->url),
    badge, category, family, duration, ml,
    inspiredBy, outOfStock, offerDiscount, offerEndsAt
  }`, { slug })
}
