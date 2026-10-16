import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Orders are created by the Stripe webhook, never by hand.
 * IMPORTANT: the webhook must give these documents an _id containing a dot
 * (e.g. `order.cs_live_abc123`). Sanity treats dotted IDs as private, so
 * customer names/addresses are not readable from the public dataset API.
 */
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({name: 'createdAt', type: 'datetime', readOnly: true}),
    defineField({name: 'customerName', type: 'string', readOnly: true}),
    defineField({name: 'customerEmail', type: 'string', readOnly: true}),
    defineField({
      name: 'shippingAddress',
      type: 'text',
      rows: 5,
      readOnly: true,
      description: 'Formatted address, ready to copy onto a shipping label.',
    }),
    defineField({
      name: 'items',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'product', type: 'reference', to: [{type: 'product'}], weak: true}),
            defineField({name: 'title', type: 'string', description: 'Snapshot of the title at purchase time'}),
            defineField({name: 'quantity', type: 'number'}),
            defineField({name: 'unitAmount', type: 'number', description: 'Cents'}),
          ],
          preview: {
            select: {title: 'title', qty: 'quantity'},
            prepare: ({title, qty}) => ({title, subtitle: `Qty ${qty}`}),
          },
        }),
      ],
    }),
    defineField({name: 'amountTotal', type: 'number', title: 'Total (cents)', readOnly: true}),
    defineField({name: 'stripeSessionId', type: 'string', readOnly: true}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'To ship', value: 'paid'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Needs attention (e.g. oversold, refund needed)', value: 'needsAttention'},
          {title: 'Refunded / cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'paid',
    }),
    defineField({
      name: 'carrier',
      type: 'string',
      options: {list: ['USPS', 'UPS', 'FedEx', 'DHL', 'Other']},
      hidden: ({document}) => document?.status !== 'shipped',
    }),
    defineField({
      name: 'trackingNumber',
      type: 'string',
      hidden: ({document}) => document?.status !== 'shipped',
      description: 'Set status to Shipped and add this. The customer is emailed automatically, once.',
    }),
    defineField({name: 'shipmentEmailSentAt', type: 'datetime', readOnly: true}),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'createdAt', direction: 'desc'}]},
  ],
  preview: {
    select: {name: 'customerName', status: 'status', total: 'amountTotal'},
    prepare: ({name, status, total}) => ({
      title: name || 'Order',
      subtitle: `${status === 'paid' ? 'TO SHIP' : status} · $${((total ?? 0) / 100).toFixed(2)}`,
    }),
  },
})
