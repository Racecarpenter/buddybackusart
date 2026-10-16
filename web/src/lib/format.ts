import type {Status} from './types'

/** Most prints one customer can buy in a single order. */
export const MAX_PER_ORDER = 3

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n)

export type Availability = 'available' | 'soldOut' | 'comingSoon'

/** Sold out is automatic when quantity reaches 0, or when he sets it by hand. */
export function availability(p: {status: Status; quantity: number}): Availability {
  if (p.status === 'comingSoon') return 'comingSoon'
  if (p.status === 'soldOut' || p.quantity <= 0) return 'soldOut'
  return 'available'
}
