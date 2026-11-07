import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getPosts } from '@/lib/api'
import { formatDate, siteTitle } from '@/lib/utils'
import { Divider, PageHeader } from '@/components/page-header'

export const fetchPosts = createServerFn().handler(async () => {
  return getPosts()
})

export const Route = createFileRoute('/_in/blogs/')({
  loader: async () => fetchPosts(),
  head: () => ({ meta: [{ title: siteTitle('Blog') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const posts = Route.useLoaderData()

  return (
    <>
      <PageHeader
        title="Blog"
        description="We write to taste life twice, in the moment and in retrospect. Anaïs Nin!"
      />
      <section aria-label="Posts" className="flex-1">
        <Divider />
        {posts.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            No posts yet. Check back soon.
          </p>
        ) : (
          <ul className="mx-auto mt-12 m-0 flex w-full max-w-3xl list-none flex-col gap-2 [&:has(>*:hover)>*:not(:hover)]:opacity-50 [&:has(>*:focus-within)>*:not(:focus-within)]:opacity-50">
            {posts.map((post) => (
              <li key={post.slug} className="m-0 transition-opacity duration-300">
                <Link
                  to="/blogs/$slug"
                  params={{ slug: post.slug }}
                  className="flex flex-col gap-2 border border-transparent p-4 no-underline transition-colors hover:border-border focus-visible:border-border"
                >
                  <h2 className="text-2xl sm:text-3xl text-foreground">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="m-0 leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <time dateTime={post.createdAt}>
                      {formatDate(post.createdAt)}
                    </time>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
