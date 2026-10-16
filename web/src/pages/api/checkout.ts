import type {APIRoute} from 'astro'
import {stripe} from '../../lib/stripe'
import {buildSessionParams, MIN_CHARGE_CENTS, toCents} from '../../lib/checkout'
import {getProductById, getSettings} from '../../lib/data'
import {availability, MAX_PER_ORDER} from '../../lib/format'
import {imgSrc} from '../../lib/image'

export const prerender = false

const redirect = (to: string) => new Response(null, {status: 303, headers: {Location: to}})
const backToPrint = (slug: string, notice: string) => redirect(`/shop/${slug}?notice=${notice}`)

// Opening this address directly (or refreshing after a Back) just goes to the shop.
export const GET: APIRoute = () => redirect('/shop')

export const POST: APIRoute = async ({request}) => {
  const form = await request.formData().catch(() => null)
  if (!form) return redirect('/shop')
  const id = String(form.get('product') ?? '')
  const quantity = Number(form.get('quantity') ?? 1)

  // Always check against live Sanity data. The page the buyer saw may be a few seconds old.
  const product = id ? await getProductById(id) : null
  if (!product) return redirect('/shop')

  const state = availability(product)
  if (state === 'soldOut') return backToPrint(product.slug, 'soldout')
  if (state !== 'available') return backToPrint(product.slug, 'unavailable')
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > Math.min(product.quantity, MAX_PER_ORDER)) {
    return backToPrint(product.slug, 'limit')
  }

  if (!stripe) return backToPrint(product.slug, 'setup')
  if (toCents(product.price) < MIN_CHARGE_CENTS) {
    console.error(`Checkout blocked: "${product.title}" is priced below Stripe's 50 cent minimum.`)
    return backToPrint(product.slug, 'error')
  }

  const settings = await getSettings()
  const cover = product.cover ? imgSrc(product.cover, 1200, {jpg: true}) : undefined

  try {
    const session = await stripe.checkout.sessions.create(
      buildSessionParams({
        product,
        quantity,
        shippingCents: toCents(settings.shippingCost ?? 0),
        origin: new URL(request.url).origin,
        // Stripe has to fetch the image, so only send real public URLs (not local sample images).
        imageUrl: cover?.startsWith('https://') ? cover : undefined,
      }),
    )
    if (!session.url) throw new Error('Stripe returned no checkout URL')
    return redirect(session.url)
  } catch (error) {
    console.error('Could not create the Stripe Checkout session', error)
    return backToPrint(product.slug, 'error')
  }
}
