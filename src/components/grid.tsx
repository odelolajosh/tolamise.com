import { cn } from '@/lib/utils'

export const Grid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const Card = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'row-span-1 rounded-xs group/bento hover:shadow-lg transition duration-200 shadow-input dark:shadow-none bg-card border border-border justify-between flex flex-col space-y-4',
        className,
      )}
    >
      <div className="relative flex flex-1 w-full h-full min-h-24 rounded-xl bg-grid-black/[0.07] dark:bg-grid-white/[0.08]">
        <div className="absolute pointer-events-none inset-0 rounded-xl bg-inherit dark:bg-black mask-[linear-gradient(to_bottom,transparent_70%,hsl(var(--card)))]" />
        {header}
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex flex-col gap-4 p-4">
        {icon}
        <div>
          <h4 className="text-foreground">{title}</h4>
          <p className="mt-0! text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}
