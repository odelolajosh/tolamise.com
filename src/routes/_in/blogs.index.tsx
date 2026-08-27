import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { BlogCard } from '@/components/blog-card'
import { getPosts } from '@/lib/api'

export const fetchPosts = createServerFn().handler(async () => {
  return getPosts()
})

export const Route = createFileRoute('/_in/blogs/')({
  loader: async () => fetchPosts(),
  component: RouteComponent,
})

function RouteComponent() {
  const blogs = Route.useLoaderData()

  return (
    <>
      <header className="flex flex-col gap-1">
        <h3>Blog</h3>
        <div className="text-muted-foreground">
          We write to taste life twice, in the moment and in retrospect. Anais
          Nin!
        </div>
      </header>
      <section aria-label="project grid" className="flex-1">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((item) => (
            <BlogCard key={item.slug} blog={item} />
          ))}
        </div>
      </section>
    </>
  )
}
