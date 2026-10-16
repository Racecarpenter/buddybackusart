export type Img = {
  asset?: {_ref: string}
  crop?: {top: number; bottom: number; left: number; right: number}
  hotspot?: {x: number; y: number; width: number; height: number}
  alt?: string
  caption?: string
  meta?: {lqip?: string; dimensions?: {width: number; height: number}}
  /** Only used by preview mode, where images are local files. */
  demoSrc?: string
}

export type Status = 'available' | 'comingSoon' | 'soldOut' | 'hidden'

export type ProductCard = {
  _id: string
  title: string
  slug: string
  price: number
  editionSize: number
  quantity: number
  status: Status
  cover?: Img
}

export type Product = ProductCard & {
  images: Img[]
  description?: unknown[]
  details?: {medium?: string; dimensions?: string; signed?: boolean; shippingNote?: string}
}

export type ProjectCard = {
  _id: string
  title: string
  slug: string
  year?: number
  summary?: string
  cover: Img
}

export type Project = ProjectCard & {
  gallery: Img[]
  related: ProductCard[]
}

export type Settings = {
  siteTitle: string
  tagline?: string
  about?: unknown[]
  aboutImage?: Img
  email?: string
  instagram?: string
  shippingPolicy?: string
  /** Dollars per order. 0 means free shipping. */
  shippingCost?: number
}
