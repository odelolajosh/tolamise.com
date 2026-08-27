import { Link, useLocation } from '@tanstack/react-router'
import { Joshua } from './joshua'
import type { FileRoutesByPath } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export type NavigationTo = keyof FileRoutesByPath

const navigation = [
  {
    to: '/projects',
    label: 'Projects',
  },
  {
    to: '/blogs',
    label: 'Blog',
  },
] as Array<{ to: Omit<NavigationTo, '/'>; label: string }>

export type NavigationProps = {
  exclude?: Array<NavigationTo> | NavigationTo
}

export const Navigation = ({ exclude }: NavigationProps) => {
  const { pathname } = useLocation()

  const indexed = pathname == '/'

  return (
    <nav
      className={cn('relative flex flex-col md:flex-row gap-2 items-center', {
        'pb-4 border-b border-solid border-border': !indexed,
      })}
    >
      {!indexed && (
        <ul className="w-full flex gap-4 list-none m-0">
          <li className="m-0">
            <Link
              to="/"
              className="no-underline text-foreground transition-colors"
            >
              <Joshua />
            </Link>
          </li>
        </ul>
      )}
      <ul className="w-full flex gap-8 list-none m-0">
        {navigation.map(({ to, label }) => {
          if (exclude && (exclude.includes(to) || exclude === to)) return null
          return <NavigationLink key={to} to={to} label={label} />
        })}
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
