import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Site settings is a single document; orders are created by the Stripe webhook.
// Neither should appear in the "create new" menu.
const noCreate = ['siteSettings', 'order']

export default defineConfig({
  name: 'default',
  title: 'Shop and portfolio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !noCreate.includes(schemaType)),
  },
  document: {
    // Site settings can be edited and published, but not duplicated or deleted.
    actions: (input, {schemaType}) =>
      schemaType === 'siteSettings'
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
