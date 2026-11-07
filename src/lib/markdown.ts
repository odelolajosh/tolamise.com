import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

import type { Root } from 'hast'

export type TocItem = { id: string; text: string }
export type RenderedMarkdown = {
  html: string
  hasMath: boolean
  /** Top-level sections (h2), in order */
  toc: Array<TocItem>
}

/** Collects h2s for the table of contents. Runs after rehype-slug adds ids. */
function rehypeToc() {
  return (tree: Root, file: { data: Record<string, unknown> }) => {
    const toc: Array<TocItem> = []
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' && typeof node.properties.id === 'string') {
        toc.push({ id: node.properties.id, text: toString(node) })
      }
    })
    file.data.toc = toc
  }
}

// The JavaScript regex engine avoids loading Shiki's WebAssembly, which not
// every runtime (or Vitest) can import. Languages load on first use.
const shikiTransformer = createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: [],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
}).then((highlighter) =>
  rehypeShikiFromHighlighter(highlighter, {
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: 'light',
    lazy: true,
    fallbackLanguage: 'text',
  }),
)

function rehypeShiki() {
  return async (tree: Root) => {
    const transform = await shikiTransformer
    await transform.call(undefined as never, tree, undefined as never, () => {})
  }
}

// Rendered on the server so neither the parser nor the highlighter ships to
// the browser. Code blocks carry both themes; styles.css picks one.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeToc)
  .use(rehypeKatex)
  .use(rehypeShiki)
  .use(rehypeStringify)

const MAX_CACHED = 50
const cache = new Map<string, Promise<RenderedMarkdown>>()

/** Renders trusted markdown (from the content repo) to HTML. */
export function renderMarkdown(source: string): Promise<RenderedMarkdown> {
  let rendered = cache.get(source)
  if (!rendered) {
    rendered = processor.process(source).then((file) => {
      const html = String(file)
      return {
        html,
        hasMath: html.includes('class="katex'),
        toc: (file.data.toc as Array<TocItem> | undefined) ?? [],
      }
    })
    rendered.catch(() => cache.delete(source))
    if (cache.size >= MAX_CACHED) cache.clear()
    cache.set(source, rendered)
  }
  return rendered
}
