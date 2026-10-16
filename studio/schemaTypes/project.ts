import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Portfolio project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({name: 'year', type: 'number'}),
    defineField({
      name: 'cover',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
      validation: (r) => r.required(),
    }),
    defineField({name: 'summary', type: 'text', rows: 3}),
    defineField({
      name: 'gallery',
      type: 'array',
      description: 'Drag to reorder. Large originals are fine; the site resizes them.',
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
      name: 'relatedProducts',
      type: 'array',
      description: 'Optional: prints from this body of work, linked from the project page.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({name: 'sortOrder', type: 'number', description: 'Lower numbers appear first.'}),
  ],
  orderings: [
    {title: 'Manual order', name: 'manual', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'year', media: 'cover'}},
})
