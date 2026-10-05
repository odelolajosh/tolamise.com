import { Link, useLocation } from '@tanstack/react-router'
import { Joshua } from './joshua'
import { cn } from '@/lib/utils'
import { FileRoutesByTo } from '@/routeTree.gen'

export type NavigationTo = keyof FileRoutesByTo

const navigation = [
  {
    to: '/projects',
    label: 'Projects',
  },
  {
    to: '/blogs',
    label: 'Blog',
  },
] as Array<{ to: NavigationTo; label: string }>

export const Navigation = () => {
  const { pathname } = useLocation()
  const indexed = pathname == '/'

  return (
    <nav className={cn('relative flex flex-col sm:flex-row gap-2 items-center')}>
      <ul className={cn("absolute left-0 top-1/2 z-10 -translate-y-1/2 flex gap-4 list-none m-0", { "hidden": indexed })}>
        <li className="m-0">
          <Link
            to="/"
            className="no-underline text-foreground transition-colors"
          >
            <Joshua />
          </Link>
        </li>
      </ul>
      <ul className="w-full flex justify-center gap-8 list-none m-0">
        {navigation.map(({ to, label }) => (
          <NavigationLink key={to} to={to} label={label} />
        ))}
      </ul>
    </nav>
  )
}

const NavigationLink = ({ to, label }: { to: NavigationTo; label: string }) => {
  return (
    <li className="relative m-0 text-muted-foreground hover:text-foreground transition-colors">
      <Link to={to} className="no-underline hover:underline">
        {label}
      </Link>
    </li>
  )
}
