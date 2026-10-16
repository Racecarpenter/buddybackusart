import {defineArrayMember, defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Print / Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      description:
        'Draft/Coming soon hide the Buy button. "Available" sells until quantity hits 0, then the site shows Sold out automatically.',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Coming soon', value: 'comingSoon'},
          {title: 'Sold out (manual override)', value: 'soldOut'},
          {title: 'Hidden', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'comingSoon',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price (USD)',
      description: 'In dollars, e.g. 85 or 85.50',
      validation: (r) => r.required().positive().precision(2),
    }),
    defineField({
      name: 'editionSize',
      type: 'number',
      title: 'Edition size',
      description: 'Total prints in the edition (shown as "Edition of 25").',
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: 'quantity',
      type: 'number',
      title: 'Quantity remaining',
      description: 'Decrements automatically on each paid order. Edit manually to restock or correct.',
      validation: (r) =>
        r
          .required()
          .integer()
          .min(0)
          .custom((qty, ctx) => {
            const size = (ctx.document as {editionSize?: number})?.editionSize
            return size && typeof qty === 'number' && qty > size
              ? 'Remaining quantity cannot exceed the edition size'
              : true
          }),
    }),
    defineField({
      name: 'images',
      type: 'array',
      description: 'First image is the cover. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt text'}),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [defineArrayMember({type: 'block', styles: [], lists: []})],
    }),
    defineField({
      name: 'details',
      type: 'object',
      description: 'Shown as a spec list on the product page.',
      fields: [
        defineField({name: 'medium', type: 'string', description: 'e.g. Giclée on cotton rag'}),
        defineField({name: 'dimensions', type: 'string', description: 'e.g. 12 × 18 in'}),
        defineField({name: 'signed', type: 'boolean', title: 'Signed & numbered', initialValue: true}),
        defineField({name: 'shippingNote', type: 'string', description: 'e.g. Ships flat in 3–5 business days'}),
      ],
    }),
    defineField({name: 'sortOrder', type: 'number', description: 'Lower numbers appear first.'}),
  ],
  orderings: [
    {title: 'Manual order', name: 'manual', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', media: 'images.0', qty: 'quantity', status: 'status'},
    prepare: ({title, media, qty, status}) => ({
      title,
      media,
      subtitle: status === 'available' ? `${qty ?? 0} left` : status,
    }),
  },
})
