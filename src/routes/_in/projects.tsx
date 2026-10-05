import { createFileRoute } from '@tanstack/react-router'
import { getProjectRepositories } from '@/lib/api'
import * as motion from "motion/react-client"
import { MoveUpRightIcon } from 'lucide-react'

export const Route = createFileRoute('/_in/projects')({
  loader: async () => getProjectRepositories(),
  component: RouteComponent,
})

function RouteComponent() {
  const projects = Route.useLoaderData()

  if (!projects.length) {
    return (
      <section className="flex-1" aria-label="Empty page">
        <h3>Ops! Nothing yet</h3>
        <p>Check back in a few days.</p>
      </section>
    )
  }

  return (
    <>
      <header className="flex flex-col gap-1" aria-label="Projects header">
        <h1 className="font-display effect-font-styling text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] effect-font-gradient mb-2 text-center">
          Projects
        </h1>
        <div className="text-base md:text-lg md:leading-[1.5] text-muted-foreground font-normal text-balance text-center">
          I built a few wonders brick on brick.
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
          className="group/grid relative z-20 mt-12 grid w-full grid-cols-1 gap-12 sm:grid-cols-2 md:gap-20 lg:grid-cols-3 [&:has(>*:hover)>*:not(:hover)]:opacity-50 [&:has(>*:focus-within)>*:not(:focus-within)]:opacity-50"
        >
          {projects.map((p) => (
            <div
              key={p.name}
              className="group/card flex w-full flex-col gap-3 transition-opacity duration-300 md:gap-2 cursor-pointer border border-transparent hover:border-border p-1"
            >
              <div className="flex flex-row items-center gap-3 md:flex-col md:items-start md:gap-4">
                <h2 className="effect-font-styling text-xl text-foreground leading-[32px] md:leading-none">
                  {p.name}
                  <MoveUpRightIcon className="size-4 ml-2 hidden group-hover/card:inline-block" />
                </h2>
              </div>
              <p className="text-sm leading-[1.6] text-muted-foreground font-normal m-0">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
