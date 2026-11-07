import { createServerFn } from '@tanstack/react-start'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import katexCss from 'katex/dist/katex.min.css?url'
import { getPostBySlug } from '@/lib/api'
import { formatDate, siteTitle } from '@/lib/utils'
import { Prose } from '@/components/prose'
import { Tags } from '@/components/tags'
import {
  ArticleLayout,
  AsideSection,
  TableOfContents,
} from '@/components/article-layout'

export const getPost = createServerFn()
  .validator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    return getPostBySlug(slug)
  })

export const Route = createFileRoute('/_in/blogs/$slug')({
  loader: async ({ params: { slug } }) => {
    const post = await getPost({ data: { slug } })
    if (!post) throw notFound()
    return { post }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: siteTitle(loaderData?.post.title) },
      { name: 'description', content: loaderData?.post.excerpt },
    ],
    // KaTeX's stylesheet is only needed when the post has math
    links: loaderData?.post.hasMath ? [{ rel: 'stylesheet', href: katexCss }] : [],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { post } = Route.useLoaderData()
  const updated = post.updatedAt !== post.createdAt

  return (
    <ArticleLayout
      header={
        <header className="flex flex-col gap-4">
          <Link
            to="/blogs"
            className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> All posts
          </Link>
          <h1 className="font-display leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="m-0 max-w-2xl text-lg text-muted-foreground">
              {post.excerpt}
            </p>
          )}
        </header>
      }
      aside={
        <>
          <TableOfContents items={post.toc} />
          <AsideSection label="Published">
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </AsideSection>
          {updated && (
            <AsideSection label="Updated">
              <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </AsideSection>
          )}
          <AsideSection label="Length">
            {post.readingTime}
            {post.wordCount !== undefined && (
              <span className="text-muted-foreground">
                {' '}
                · {post.wordCount.toLocaleString('en-US')} words
              </span>
            )}
          </AsideSection>
          {post.tags.length > 0 && (
            <AsideSection label="Tags" className="col-span-2 lg:col-span-1">
              <Tags tags={post.tags} label="Tags" />
            </AsideSection>
          )}
        </>
      }
      footer={
        (post.newer || post.older) && (
          <nav
            aria-label="More posts"
            className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
            {post.older ? (
              <Link
                to="/blogs/$slug"
                params={{ slug: post.older.slug }}
                className="flex flex-col gap-1 border border-border p-4 no-underline hover:border-muted-foreground"
              >
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <ArrowLeft className="size-4" aria-hidden="true" /> Older
                </span>
                <span className="text-foreground">{post.older.title}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {post.newer && (
              <Link
                to="/blogs/$slug"
                params={{ slug: post.newer.slug }}
                className="flex flex-col items-end gap-1 border border-border p-4 text-right no-underline hover:border-muted-foreground"
              >
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  Newer <ArrowRight className="size-4" aria-hidden="true" />
                </span>
                <span className="text-foreground">{post.newer.title}</span>
              </Link>
            )}
          </nav>
        )
      }
    >
      <Prose html={post.html} />
    </ArticleLayout>
  )
}
