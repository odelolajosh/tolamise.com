import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen relative py-10 grid grid-rows-[1fr_auto]">
      <div
        className={cn(
          'absolute inset-0',
          'bg-size-[20px_20px]',
          'bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)]',
          'dark:bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)]',
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <section className="flex flex-col gap-20 justify-center items-center">
        <Navigation />
        <article className="relative space-y-2 p-4">
          <motion.h1
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
            className="uppercase font-display font-semibold text-center text-7xl sm:text-7xl text-foreground dark:text-neutral-500 opacity-20"
          >
            Oluwatolamise
          </motion.h1>
          <motion.h1
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
            className="uppercase font-display font-semibold text-center text-7xl sm:text-7xl text-foreground dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b dark:from-neutral-200 dark:to-neutral-500"
          >
            Joshua Odelola
          </motion.h1>
          <motion.p
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-muted-foreground max-w-xl"
          >
            Software & systems engineer. I spend my days exploring the world of
            seemingly endless technologies; building what you will perhaps use
            one day!
            <br className="hidden md:block" /> Be my guest, check out{' '}
            <Link to="/projects">some of my projects</Link>
          </motion.p>
        </article>
      </section>
      <Footer />
    </div>
  )
}
