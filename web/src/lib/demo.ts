/**
 * Sample content for preview mode (no SANITY_PROJECT_ID set).
 * It lets you see the design before the Studio is connected. Delete this file
 * and the public/demo folder once real content is in Sanity.
 */
import type {Img, Product, ProductCard, Project, ProjectCard, Settings} from './types'

const img = (name: string, width: number, height: number, alt: string, caption?: string): Img => ({
  demoSrc: `/demo/${name}.jpg`,
  alt,
  caption,
  meta: {dimensions: {width, height}},
})

const I = {
  dunes: img('dunes', 1500, 1000, 'Layered dunes under a peach sky', 'Dune line, 6 a.m.'),
  tide: img('tide', 1200, 1500, 'Bands of teal water and white foam', 'Tide study'),
  ember: img('ember', 1400, 1400, 'A glowing orange field fading to dark red', 'Ember'),
  fog: img('fog', 1800, 900, 'A grey horizon with a small red sun', 'Low fog, one sun'),
  field: img('field', 1000, 1500, 'Vertical stripes of green and yellow', 'Field, late July'),
  night: img('night', 1500, 1200, 'A moon over a deep blue sky of stars', 'Night shift'),
  clay: img('clay', 1200, 1500, 'Overlapping circles in terracotta, ochre and black', 'Three circles'),
  salt: img('salt', 1500, 1000, 'A pale flat horizon over cracked ground', 'Salt, flat'),
}

const para = (text: string) => ({
  _type: 'block',
  _key: text.slice(0, 10),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: 's', text, marks: []}],
})

const settings: Settings = {
  siteTitle: 'Your Name',
  tagline: 'Limited-edition prints and photographs, printed by hand and shipped by the artist.',
  about: [
    para('This is sample text. In the Studio, open Site settings and write a few paragraphs about your work and how you make it.'),
    para('Every print is made in small editions. When an edition sells out, it is closed.'),
  ],
  aboutImage: I.field,
  email: 'hello@example.com',
  shippingCost: 8,
  instagram: 'yourhandle',
  shippingPolicy:
    'Sample policy. Prints ship flat in rigid mailers within five business days. If a print arrives damaged, write to us and we will replace it.',
}

const product = (p: Omit<Product, 'cover' | '_id'> & {id: string}): Product => ({
  ...p,
  _id: `demo-${p.id}`,
  cover: p.images[0],
})

const products: Product[] = [
  product({
    id: 'dunes', title: 'Dune line, 6 a.m.', slug: 'dune-line', price: 85, editionSize: 25, quantity: 18,
    status: 'available', images: [I.dunes],
    description: [para('Sample description. Written about the light, the place and the process in a few sentences.')],
    details: {medium: 'Giclée on cotton rag', dimensions: '12 × 18 in', signed: true},
  }),
  product({
    id: 'tide', title: 'Tide study', slug: 'tide-study', price: 120, editionSize: 15, quantity: 3,
    status: 'available', images: [I.tide, I.salt],
    description: [para('Sample description. Two views of the same print, so you can see the texture of the paper.')],
    details: {medium: 'Giclée on cotton rag', dimensions: '16 × 20 in', signed: true},
  }),
  product({
    id: 'ember', title: 'Ember', slug: 'ember', price: 95, editionSize: 30, quantity: 0,
    status: 'available', images: [I.ember],
    description: [para('Sample description for a print that has sold out.')],
    details: {medium: 'Pigment print on baryta', dimensions: '14 × 14 in', signed: true},
  }),
  product({
    id: 'field', title: 'Field, late July', slug: 'field-late-july', price: 140, editionSize: 10, quantity: 7,
    status: 'available', images: [I.field],
    description: [para('Sample description.')],
    details: {medium: 'Pigment print on baryta', dimensions: '16 × 24 in', signed: true},
  }),
  product({
    id: 'night', title: 'Night shift', slug: 'night-shift', price: 110, editionSize: 20, quantity: 12,
    status: 'available', images: [I.night],
    description: [para('Sample description.')],
    details: {medium: 'Giclée on cotton rag', dimensions: '15 × 12 in', signed: true},
  }),
  product({
    id: 'clay', title: 'Three circles', slug: 'three-circles', price: 75, editionSize: 40, quantity: 40,
    status: 'comingSoon', images: [I.clay],
    description: [para('Sample description for a print that is not on sale yet.')],
    details: {medium: 'Risograph, three colors', dimensions: '12 × 15 in', signed: false},
  }),
]

const card = ({images, description, details, ...rest}: Product): ProductCard => rest

const projects: Project[] = [
  {
    _id: 'demo-dry', title: 'Dry lakes', slug: 'dry-lakes', year: 2025,
    summary: 'Sample text. A few sentences about what this body of work is and how it was made.',
    cover: I.salt, gallery: [I.salt, I.dunes, I.fog, I.tide], related: [card(products[0]), card(products[1])],
  },
  {
    _id: 'demo-night', title: 'Night shift', slug: 'night-shift', year: 2024,
    summary: 'Sample text for a second project.',
    cover: I.night, gallery: [I.night, I.ember, I.clay], related: [card(products[4])],
  },
  {
    _id: 'demo-fields', title: 'Standing water', slug: 'standing-water', year: 2023,
    summary: 'Sample text for a third project.',
    cover: I.field, gallery: [I.field, I.tide, I.clay, I.fog], related: [card(products[3])],
  },
  {
    _id: 'demo-ember', title: 'Slow burn', slug: 'slow-burn', year: 2022,
    summary: 'Sample text for a fourth project.',
    cover: I.ember, gallery: [I.ember, I.dunes], related: [card(products[2])],
  },
]

export const demo = {
  settings,
  projects: projects.map(({gallery, related, ...rest}): ProjectCard => rest),
  project: (slug: string) => projects.find((p) => p.slug === slug) ?? null,
  products: products.map(card),
  product: (slug: string) => products.find((p) => p.slug === slug) ?? null,
}
