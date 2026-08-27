import { createServerFn } from '@tanstack/react-start'
import { createFileRoute, notFound } from '@tanstack/react-router'
import katexCss from 'katex/dist/katex.min.css?url'
import { getPostBySlug } from '@/lib/api'
import { Markdown } from '@/components/markdown'

export const getPost = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    return getPostBySlug(slug)
  })

export const Route = createFileRoute('/_in/blogs/$slug')({
  head: () => ({
    links: [
      {
        rel: 'stylesheet',
        href: katexCss,
      },
    ],
  }),
  loader: async ({ params: { slug } }) => {
    const post = await getPost({ data: { slug } })
    if (!post) throw notFound()
    return { post }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { post } = Route.useLoaderData()
  return (
    <>
      <header className="flex flex-col gap-2" aria-label="blog header">
        <h1>{post.title}</h1>
        <div className="text-muted-foreground">{post.description}</div>
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
