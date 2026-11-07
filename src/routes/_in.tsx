import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

export const Route = createFileRoute('/_in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container min-h-svh flex flex-col gap-10 py-10">
      <Navigation />
      <main className="flex flex-1 flex-col gap-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
