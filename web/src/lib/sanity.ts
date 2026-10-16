import {createClient, type QueryParams} from '@sanity/client'
import {SANITY_PROJECT_ID, SANITY_DATASET} from 'astro:env/server'

/** True until SANITY_PROJECT_ID is set. The site then shows sample content. */
export const isPreview = !SANITY_PROJECT_ID

const make = (useCdn: boolean) =>
  SANITY_PROJECT_ID
    ? createClient({projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: '2025-10-01', useCdn})
    : null

const cdnClient = make(true) // portfolio, settings: cached by Sanity's CDN
const freshClient = make(false) // prices and stock: always current

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  opts: {fresh?: boolean} = {},
): Promise<T> {
  const client = opts.fresh ? freshClient : cdnClient
  if (!client) throw new Error('Sanity is not configured. Set SANITY_PROJECT_ID.')
  return client.fetch<T>(query, params)
}
