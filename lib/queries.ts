import { client } from './sanity'
import type { Perfume } from '../app/data/perfumes'

const PERFUME_FIELDS = `
  "slug": slug.current,
  name, brand, description, price, priceOriginal,
  "image": coalesce(imageUrl, image.asset->url),
  "imageDecant": coalesce(imageDecantUrl, imageDecant.asset->url),
  badge, category, family, duration, ml,
  inspiredBy, outOfStock, isDecant, offerDiscount, offerEndsAt,
  variants[]{ ml, price }
`

function mapPerfume(raw: any): Perfume {
  const p = { ...raw }
  if (p.offerDiscount && p.offerEndsAt) {
    p.offer = { discount: p.offerDiscount, endsAt: p.offerEndsAt }
  }
  delete p.offerDiscount
  delete p.offerEndsAt
  return p as Perfume
}

export async function getPerfumes(): Promise<Perfume[]> {
  const raw = await client.fetch(
    `*[_type == "perfume"] | order(order asc) { ${PERFUME_FIELDS} }`,
    {},
    { next: { revalidate: 30 } }
  )
  return raw.map(mapPerfume)
}

export async function getPerfume(slug: string): Promise<Perfume | null> {
  const raw = await client.fetch(
    `*[_type == "perfume" && slug.current == $slug][0] { ${PERFUME_FIELDS} }`,
    { slug },
    { next: { revalidate: 30 } }
  )
  return raw ? mapPerfume(raw) : null
}
