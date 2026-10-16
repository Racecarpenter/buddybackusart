import {defineArrayMember, defineField, defineType} from 'sanity'

/** One document that drives the header, footer, home line and About page. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      type: 'string',
      title: 'Name in the header',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'text',
      rows: 2,
      title: 'Line under the header on the home page',
      description: 'One or two sentences. Also used as the description in search results.',
    }),
    defineField({
      name: 'about',
      type: 'array',
      title: 'About text',
      of: [defineArrayMember({type: 'block', styles: [], lists: []})],
    }),
    defineField({
      name: 'aboutImage',
      type: 'image',
      title: 'About photo',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({name: 'email', type: 'string', title: 'Contact email'}),
    defineField({
      name: 'instagram',
      type: 'string',
      title: 'Instagram handle',
      description: 'Without the @',
    }),
    defineField({
      name: 'shippingCost',
      type: 'number',
      title: 'Shipping charge (USD)',
      description:
        'Charged once per order, US addresses only. Leave at 0 for free shipping and build the cost into your prices.',
      initialValue: 0,
      validation: (r) => r.min(0).precision(2),
    }),
    defineField({
      name: 'shippingPolicy',
      type: 'text',
      rows: 3,
      title: 'Shipping and returns',
      description: 'Shown on print pages and the About page, unless a print has its own shipping note.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
