import { Link, createFileRoute } from '@tanstack/react-router'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { WarpGrid } from '@/components/home/warp-grid'

export const Route = createFileRoute('/')({
  loader: () => ({
    nameFont: Math.random() < 0.5 ? 'font-display' : 'font-display-secondary',
  }),
  staleTime: Infinity,
  component: App,
})

function App() {
  const { nameFont } = Route.useLoaderData()

  return (
    <div className="relative isolate min-h-svh overflow-hidden py-10 grid grid-rows-[1fr_auto]">
      <WarpGrid />
      {/* Fades the grid out towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-background mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />
      <section className="flex flex-col gap-20 justify-center items-center px-4">
        <Navigation />
        <main className="flex flex-col items-center gap-4">
          <h1
            className={cn(
              'flex flex-col items-center gap-1 text-center uppercase font-semibold',
              nameFont,
              // Limelight has one weight; don't let the browser fake a bold
              nameFont === 'font-display-secondary' && 'font-normal',
            )}
          >
            <span className="text-3xl sm:text-6xl text-foreground opacity-20 dark:text-neutral-500 motion-safe:animate-fade-up">
              Oluwatolamise
            </span>
            <span className="text-5xl sm:text-7xl text-balance text-foreground dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b dark:from-neutral-200 dark:to-neutral-500 motion-safe:animate-fade-up [animation-delay:100ms]">
              Joshua Odelola
            </span>
          </h1>
          <p className="m-0 text-center text-muted-foreground max-w-xl text-balance motion-safe:animate-fade-up [animation-delay:250ms]">
            Software & systems engineer. I spend my days exploring the world of
            seemingly endless technologies; building what you will perhaps use
            one day!
            <br className="hidden md:block" /> Be my guest, check out{' '}
            <Link to="/projects">some of my projects</Link>
          </p>
        </main>
      </section>
      <Footer />
    </div>
  )
}
