import { createServerFn } from '@tanstack/react-start'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import katexCss from 'katex/dist/katex.min.css?url'
import { getProjectBySlug } from '@/lib/api'
import { siteTitle } from '@/lib/utils'
import { GithubIcon } from '@/components/icons'
import { Prose } from '@/components/prose'
import {
  ArticleLayout,
  AsideSection,
  TableOfContents,
} from '@/components/article-layout'

export const getProject = createServerFn()
  .validator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    return getProjectBySlug(slug)
  })

export const Route = createFileRoute('/_in/projects/$slug')({
  loader: async ({ params: { slug } }) => {
    const project = await getProject({ data: { slug } })
    if (!project) throw notFound()
    return { project }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: siteTitle(loaderData?.project.name) },
      { name: 'description', content: loaderData?.project.description },
    ],
    links: loaderData?.project.hasMath
      ? [{ rel: 'stylesheet', href: katexCss }]
      : [],
  }),
  component: RouteComponent,
})

const asideLink =
  'inline-flex items-center gap-1 text-foreground no-underline hover:underline'

/** "https://github.com/owner/repo" -> "owner/repo" */
const repoName = (url: string) => url.replace(/^https?:\/\/(www\.)?github\.com\//, '')

function RouteComponent() {
  const { project } = Route.useLoaderData()

  return (
    <ArticleLayout
      header={
        <header className="flex flex-col gap-4">
          <Link
            to="/projects"
            className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> All projects
          </Link>
          <h1 className="font-display leading-tight">{project.name}</h1>
          <p className="m-0 max-w-2xl text-lg text-muted-foreground">
            {project.description}
          </p>
        </header>
      }
      aside={
        <>
          <TableOfContents items={project.toc} />
          <AsideSection label="Source">
            <a href={project.github_url} target="_blank" rel="noreferrer" className={asideLink}>
              <GithubIcon className="size-4 shrink-0" aria-hidden="true" />
              <span className="break-all">{repoName(project.github_url)}</span>
              <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
            </a>
          </AsideSection>
          {project.demo_url && (
            <AsideSection label="Demo">
              <a href={project.demo_url} target="_blank" rel="noreferrer" className={asideLink}>
                Try it live
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            </AsideSection>
          )}
          {project.stack && project.stack.length > 0 && (
            <AsideSection label="Built with">
              <p className="m-0 font-mono text-xs leading-relaxed text-foreground">
                {project.stack.join(' · ')}
              </p>
            </AsideSection>
          )}
          {project.others.length > 0 && (
            <AsideSection label="More projects" className="col-span-2 lg:col-span-1">
              <ul className="m-0 flex list-none flex-col gap-1.5">
                {project.others.map((other) => (
                  <li key={other.name} className="m-0">
                    {other.slug ? (
                      <Link
                        to="/projects/$slug"
                        params={{ slug: other.slug }}
                        className="text-muted-foreground no-underline hover:text-foreground"
                      >
                        {other.name}
                      </Link>
                    ) : (
                      <a
                        href={other.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground no-underline hover:text-foreground"
                      >
                        {other.name}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </AsideSection>
          )}
        </>
      }
    >
      <Prose html={project.html} />
    </ArticleLayout>
  )
}
