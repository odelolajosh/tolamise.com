import { Link, useLocation } from '@tanstack/react-router'
import { Joshua } from './joshua'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { cn } from '@/lib/utils'

export type NavigationTo = keyof FileRoutesByTo

const navigation: Array<{ to: NavigationTo; label: string }> = [
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export const Navigation = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <nav
      aria-label="Main"
      className={cn(
        'flex w-full items-center gap-4',
        isHome ? 'justify-center' : 'justify-between',
      )}
    >
      {!isHome && (
        <Link to="/" aria-label="Home" className="no-underline text-foreground">
          <Joshua />
        </Link>
      )}
      <ul className="m-0 flex list-none gap-6 sm:gap-8">
        {navigation.map(({ to, label }) => (
          <li key={to} className="m-0">
            {/* Link marks the current section with data-status="active" */}
            <Link
              to={to}
              className="no-underline text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
