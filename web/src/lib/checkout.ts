import type Stripe from 'stripe'
import type {ProductCard} from './types'

/** Stripe will not charge less than 50 cents. */
export const MIN_CHARGE_CENTS = 50

/** How long a Checkout page stays open. Stripe's minimum is 30 minutes. */
const SESSION_MINUTES = 30

export const toCents = (dollars: number) => Math.round(dollars * 100)

type Input = {
  product: Pick<ProductCard, '_id' | 'title' | 'slug' | 'price' | 'editionSize'>
  quantity: number
  shippingCents: number
  /** The site's own address, e.g. https://example.com. Used for the return links. */
  origin: string
  /** Public https image of the print, shown on the Stripe page. Optional. */
  imageUrl?: string
}

/**
 * The one place that decides what the customer is charged and where Stripe sends them back.
 * The price always comes from Sanity, never from the browser.
 * Stripe emails the receipt itself (Dashboard > Settings > Customer emails).
 */
export function buildSessionParams({
  product,
  quantity,
  shippingCents,
  origin,
  imageUrl,
}: Input): Stripe.Checkout.SessionCreateParams {
  const summary = `${product.title}, edition of ${product.editionSize}, x${quantity}`
  // The webhook reads these to lower the stock in Sanity.
  const metadata = {productId: product._id, quantity: String(quantity)}

  return {
    mode: 'payment',
    line_items: [
      {
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: toCents(product.price),
          product_data: {
            name: product.title,
            description: `Limited edition of ${product.editionSize}`,
            ...(imageUrl ? {images: [imageUrl]} : {}),
          },
        },
      },
    ],
    shipping_address_collection: {allowed_countries: ['US']},
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {amount: shippingCents, currency: 'usd'},
          display_name: shippingCents > 0 ? 'Shipping (US)' : 'Free shipping (US)',
        },
      },
    ],
    metadata,
    payment_intent_data: {description: summary, metadata},
    success_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop/${product.slug}`,
    expires_at: Math.floor(Date.now() / 1000) + SESSION_MINUTES * 60,
  }
}
