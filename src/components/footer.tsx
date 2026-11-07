import { Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { GithubIcon, LinkedInIcon, XIcon } from './icons'
import { ModeToggle } from './theme/theme-toggle'
import { channels } from '@/lib/contact'

const profileIcons = { github: GithubIcon, linkedin: LinkedInIcon, x: XIcon }

export const Footer = () => (
  <footer id="contact-me" className="relative px-8 flex flex-col gap-4">
    <ul className="flex gap-4 justify-center items-center text-muted-foreground m-0 list-none">
      <li className="m-0">
        <Link to="/contact" aria-label="Contact" className="flex hover:text-foreground">
          <Mail className="w-6 h-6" aria-hidden="true" />
        </Link>
      </li>
      {channels.map((channel) => {
        if (channel.key === 'email') return null
        const Icon = profileIcons[channel.key]
        return (
          <li key={channel.key} className="m-0">
            <a
              aria-label={`${channel.label} profile`}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className="flex hover:text-foreground"
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        )
      })}
      <li className="m-0 border-l border-border pl-4">
        <ModeToggle />
      </li>
    </ul>
    <div className="flex justify-center">
      <small className="font-normal text-muted-foreground">
        &copy; Joshua Odelola {new Date().getFullYear()}
      </small>
    </div>
  </footer>
)
