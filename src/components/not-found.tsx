import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="m-0 font-display text-7xl text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="m-0 text-muted-foreground">
        It may have moved, or the link may be wrong.
      </p>
      <Link to="/">Go home</Link>
    </main>
  )
}
