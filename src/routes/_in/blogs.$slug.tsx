import { createServerFn } from '@tanstack/react-start'
import { createFileRoute, notFound } from '@tanstack/react-router'
import katexCss from 'katex/dist/katex.min.css?url'
import { getPostBySlug } from '@/lib/api'
import { Markdown } from '@/components/markdown'

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
      { title: loaderData?.post.title },
      { name: 'description', content: loaderData?.post.excerpt },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: katexCss,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { post } = Route.useLoaderData()
  return (
    <>
      <header className="flex flex-col gap-2" aria-label="blog header">
        <h1 className="font-display">{post.title}</h1>
        <div className="text-muted-foreground">{post.excerpt}</div>
        <div>{post.readingTime}</div>
      </header>
      <article
        aria-label="blog content"
        className="max-w-full flex-1 prose dark:prose-invert"
      >
        <Markdown content={post.body} />
      </article>
    </>
  )
}
