import type {StructureResolver} from 'sanity/structure'

/** The left-hand menu he sees in the Studio. Orders to ship come first. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Studio')
    .items([
      S.listItem()
        .title('Orders to ship')
        .child(
          S.documentList()
            .title('Orders to ship')
            .filter('_type == "order" && status == "paid"')
            .defaultOrdering([{field: 'createdAt', direction: 'desc'}]),
        ),
      S.documentTypeListItem('product').title('Prints'),
      S.documentTypeListItem('project').title('Portfolio'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.documentTypeListItem('order').title('All orders'),
    ])
