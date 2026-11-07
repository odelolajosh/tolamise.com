import { cn } from '@/lib/utils'

/** Renders HTML produced by `renderMarkdown` from the content repo. */
export function Prose({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        'prose dark:prose-invert lg:prose-lg max-w-none prose-sections',
        'prose-headings:font-semibold prose-a:underline-offset-4',
        'prose-code:before:content-none prose-code:after:content-none',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
