/**
 * Edge caching for server-rendered pages (Netlify CDN).
 * 'short' is for anything showing price or stock; 'long' is for portfolio pages.
 * Checkout always re-checks stock live, so a few seconds of lag here is harmless.
 */
export function cacheFor(res: {headers: Headers}, kind: 'long' | 'short') {
  const [maxAge, staleFor] = kind === 'long' ? [300, 3600] : [15, 60]
  res.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  res.headers.set(
    'Netlify-CDN-Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleFor}, durable`,
  )
}
