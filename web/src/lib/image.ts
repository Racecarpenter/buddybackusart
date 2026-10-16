import {createImageUrlBuilder} from '@sanity/image-url'
import {SANITY_PROJECT_ID, SANITY_DATASET} from 'astro:env/server'
import type {Img} from './types'

const builder = SANITY_PROJECT_ID
  ? createImageUrlBuilder({projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET})
  : null

/** Width and height of the image after any crop set in the Studio. */
function size(img: Img) {
  const d = img.meta?.dimensions
  if (!d) return {w: 1500, h: 1000}
  const c = img.crop
  return {
    w: d.width * (1 - (c?.left ?? 0) - (c?.right ?? 0)),
    h: d.height * (1 - (c?.top ?? 0) - (c?.bottom ?? 0)),
  }
}

export function aspect(img: Img): number {
  const {w, h} = size(img)
  return w / h
}

/** Resized image URL from Sanity's image CDN (modern format, never upscaled). */
export function imgSrc(img: Img, width: number, opts: {jpg?: boolean} = {}): string {
  if (img.demoSrc || !builder) return img.demoSrc ?? ''
  const resized = builder
    .image(img as Parameters<typeof builder.image>[0])
    .width(width)
    .fit('max')
    .quality(80)
  // The site uses the best format each phone supports; Stripe wants a plain JPEG.
  return (opts.jpg ? resized.format('jpg') : resized.auto('format')).url()
}

export function imgSrcset(img: Img, widths: number[]): string | undefined {
  if (img.demoSrc || !builder) return undefined
  const max = Math.floor(size(img).w)
  const usable = [...new Set([...widths.filter((w) => w < max), Math.min(max, Math.max(...widths))])]
  return usable.map((w) => `${imgSrc(img, w)} ${w}w`).join(', ')
}
