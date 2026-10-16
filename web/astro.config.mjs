import {defineConfig, envField} from 'astro/config'
import netlify from '@astrojs/netlify'

// Pages are rendered on request so price and stock edits show up without a rebuild.
// Cache headers (see src/lib/cache.ts) keep it fast.
export default defineConfig({
  output: 'server',
  // Inline the (small) stylesheet so a phone on cellular makes one request fewer before first paint.
  build: {inlineStylesheets: 'always'},
  // devFeatures off: skips Netlify's local edge-function emulation, which this site doesn't use
  // and which needs a separate helper (Deno) that can fail to start on some machines.
  adapter: netlify({devFeatures: false}),
  env: {
    schema: {
      // Leave SANITY_PROJECT_ID empty to run in preview mode with sample content.
      SANITY_PROJECT_ID: envField.string({context: 'server', access: 'public', optional: true}),
      SANITY_DATASET: envField.string({context: 'server', access: 'public', default: 'production'}),
      // Leave empty until Stripe is set up. Checkout then says it is not connected yet.
      STRIPE_SECRET_KEY: envField.string({context: 'server', access: 'secret', optional: true}),
    },
  },
})
