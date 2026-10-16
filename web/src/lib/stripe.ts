import Stripe from 'stripe'
import {STRIPE_SECRET_KEY} from 'astro:env/server'

/** null until STRIPE_SECRET_KEY is set. Checkout then tells the buyer it isn't connected yet. */
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {maxNetworkRetries: 2}) : null
