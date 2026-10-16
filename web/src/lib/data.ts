import {isPreview, sanityFetch} from './sanity'
import {demo} from './demo'
import type {Product, ProductCard, Project, ProjectCard, Settings} from './types'

// Every image comes back with its size and a tiny blurred placeholder.
const IMG = `{..., "meta": asset->metadata{lqip, dimensions{width, height}}}`

const CARD = `_id, title, "slug": slug.current, price, editionSize,
  "quantity": coalesce(quantity, 0), status, "cover": images[0]${IMG}`

const ORDER = `order(coalesce(sortOrder, 9999) asc`

export async function getSettings(): Promise<Settings> {
  if (isPreview) return demo.settings
  const s = await sanityFetch<Settings | null>(
    `*[_id == "siteSettings"][0]{siteTitle, tagline, about, aboutImage${IMG}, email, instagram, shippingPolicy, "shippingCost": coalesce(shippingCost, 0)}`,
  )
  return {siteTitle: 'Studio', ...s}
}

export async function getProjects(): Promise<ProjectCard[]> {
  if (isPreview) return demo.projects
  return sanityFetch(
    `*[_type == "project" && defined(slug.current) && defined(cover.asset)]
      | ${ORDER}, year desc){_id, title, "slug": slug.current, year, summary, "cover": cover${IMG}}`,
  )
}

export async function getProject(slug: string): Promise<Project | null> {
  if (isPreview) return demo.project(slug)
  return sanityFetch(
    `*[_type == "project" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, year, summary, "cover": cover${IMG},
      "gallery": coalesce(gallery[]${IMG}, []),
      "related": coalesce(relatedProducts[]->[status != "hidden"]{${CARD}}, [])
    }`,
    {slug},
    {fresh: true},
  )
}

export async function getProducts(): Promise<ProductCard[]> {
  if (isPreview) return demo.products
  return sanityFetch(
    `*[_type == "product" && status != "hidden" && defined(slug.current)]
      | ${ORDER}, _createdAt desc){${CARD}}`,
    {},
    {fresh: true},
  )
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (isPreview) return demo.product(slug)
  return sanityFetch(
    `*[_type == "product" && slug.current == $slug && status != "hidden"][0]{
      ${CARD}, "images": coalesce(images[]${IMG}, []), description, details
    }`,
    {slug},
    {fresh: true},
  )
}

/** Live lookup used by checkout. Hidden prints cannot be bought. */
export async function getProductById(id: string): Promise<ProductCard | null> {
  if (isPreview) return demo.products.find((p) => p._id === id) ?? null
  return sanityFetch(
    `*[_type == "product" && _id == $id && status != "hidden"][0]{${CARD}}`,
    {id},
    {fresh: true},
  )
}
