import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/definition'
import { getProjectRepositories } from '@/lib/api'
import { siteTitle } from '@/lib/utils'
import { Divider, PageHeader } from '@/components/page-header'
import { Tags } from '@/components/tags'

export const fetchProjects = createServerFn().handler(async () => {
  return getProjectRepositories()
})

export const Route = createFileRoute('/_in/projects/')({
  loader: async () => fetchProjects(),
  head: () => ({ meta: [{ title: siteTitle('Projects') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const projects = Route.useLoaderData()

  return (
    <>
      <PageHeader
        title="Projects"
        description="I built a few wonders brick on brick."
      />
      <section aria-label="Projects" className="flex-1">
        <Divider />
        {projects.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            Oops! Nothing yet. Check back in a few days.
          </p>
        ) : (
          <ul className="mt-12 m-0 grid w-full list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 [&:has(>*:hover)>*:not(:hover)]:opacity-50 [&:has(>*:focus-within)>*:not(:focus-within)]:opacity-50">
            {projects.map((project) => (
              <li key={project.name} className="m-0 flex transition-opacity duration-300">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

const cardClass =
  'group flex w-full flex-col gap-3 border border-border p-5 no-underline transition-colors hover:border-muted-foreground focus-visible:border-muted-foreground'

function ProjectCard({ project }: { project: Project }) {
  const content = (
    <>
      <h2 className="text-xl text-foreground">{project.name}</h2>
      <p className="m-0 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <Tags tags={project.stack} label="Built with" />
      <span className="inline-flex items-center gap-1 text-sm text-foreground">
        {project.slug ? (
          <>
            Read the case study
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </>
        ) : (
          <>
            View on GitHub
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </>
        )}
      </span>
    </>
  )

  // Projects with a case study open it; the rest go straight to GitHub
  return project.slug ? (
    <Link to="/projects/$slug" params={{ slug: project.slug }} className={cardClass}>
      {content}
    </Link>
  ) : (
    <a href={project.github_url} target="_blank" rel="noreferrer" className={cardClass}>
      {content}
    </a>
  )
}
