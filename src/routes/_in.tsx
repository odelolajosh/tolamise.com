import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

export const Route = createFileRoute('/_in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container min-h-screen flex flex-col gap-10 py-10">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}
