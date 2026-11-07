import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { siteTitle } from '@/lib/utils'
import { Divider, PageHeader } from '@/components/page-header'
import { Channels } from '@/components/contact/channels'
import { Composer } from '@/components/contact/composer'

export const Route = createFileRoute('/_in/contact')({
  head: () => ({
    meta: [
      { title: siteTitle('Contact') },
      {
        name: 'description',
        content:
          'Get in touch with Joshua Odelola by email, GitHub, LinkedIn or X.',
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader
        title="Contact"
        description="An idea, a role, a question about a post, or just a hello. My inbox is open, and I read everything."
      />
      <div className="flex flex-1 flex-col gap-16">
        <Divider />
        <Section id="reach-me" title="Reach me directly" className="[animation-delay:50ms]">
          <Channels />
        </Section>
        <Section id="write" title="Or write it here" className="[animation-delay:150ms]">
          <Composer />
        </Section>
      </div>
    </>
  )
}

function Section({
  id,
  title,
  className,
  children,
}: {
  id: string
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className={`flex flex-col gap-8 motion-safe:animate-fade-up ${className ?? ''}`}
    >
      <h2 id={id} className="m-0">
        {title}
      </h2>
      {children}
    </section>
  )
}
