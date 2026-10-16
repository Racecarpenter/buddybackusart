import {toHTML} from '@portabletext/to-html'

/** Turns Sanity rich text (paragraphs, bold, italic, links) into safe HTML. */
export const richText = (blocks?: unknown[]): string =>
  blocks && blocks.length ? toHTML(blocks as Parameters<typeof toHTML>[0]) : ''
