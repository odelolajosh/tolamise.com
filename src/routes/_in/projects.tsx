import { createFileRoute } from '@tanstack/react-router'
import { Card, Grid } from '@/components/grid'
import { getProjectRepositories } from '@/lib/api'
import { GithubIcon } from '@/components/icons'

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
        <h3>Projects</h3>
        <div className="text-muted-foreground">
          Brick on brick; those bricks being TS, Python and Go, I built these
          few wonders.
        </div>
      </header>
      <section aria-label="project grid" className="flex-1">
        <Grid className="mx-auto">
          {projects.map((item, i) => (
            <Card
              key={i}
              title={item.name}
              description={item.description}
              icon={<GithubIcon className="h-4 w-4 text-neutral-500" />}
              className={item.estimate > 1 ? 'md:col-span-2' : ''}
            />
          ))}
        </Grid>
      </section>
    </>
  )
}
