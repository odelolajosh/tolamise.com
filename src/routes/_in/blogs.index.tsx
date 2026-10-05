import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getPosts } from '@/lib/api'
import * as motion from "motion/react-client"

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
      <header className="flex flex-col gap-1" aria-label="Projects header">
        <h1 className="font-display effect-font-styling text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] effect-font-gradient mb-2 text-center">
          Blog
        </h1>
        <div className="text-base md:text-lg md:leading-[1.5] text-muted-foreground font-normal text-balance text-center">
          We write to taste life twice, in the moment and in retrospect. Anais
          Nin!
        </div>
      </header>
      <section aria-label="project grid" className="relative flex-1 border-t border-border">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 hidden h-px w-[300px] max-w-full dark:block"
          style={{
            x: "-50%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(143, 143, 143, 0.67) 50%, transparent 100%)",
          }}
          initial={false}
          animate={{ scaleX: 1 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        />
        <div
          className="group/grid relative z-20 mt-12 w-full flex flex-col gap-6 [&:has(>*:hover)>*:not(:hover)]:opacity-50 [&:has(>*:focus-within)>*:not(:focus-within)]:opacity-50"
        >
          {blogs.map((b) => {
            const createdAt = new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
            }).format(new Date(b.createdAt))

            return (
              <Link to={"/blogs/$slug"} params={{ slug: b.slug }} className="no-underline">
                <div
                  key={b.slug}
                  className="flex w-full flex-col gap-3 transition-opacity duration-300 md:gap-2 cursor-pointer p-1"
                >
                  <div className='flex flex-col gap-3 mx-auto w-5xl border border-transparent hover:border-border p-1'>
                    <h2 className="effect-font-styling text-3xl text-foreground leading-[32px] md:leading-none">
                      {b.title}
                    </h2>
                    <p className="text-base leading-[1.6] text-muted-foreground font-normal m-0">
                      {b.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <small>{createdAt}</small>
                      <small>{b.readingTime}</small>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
