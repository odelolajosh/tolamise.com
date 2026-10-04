import { GithubIcon, LinkedInIcon } from './icons'
import { ModeToggle } from './theme/theme-toggle'

export const Footer = () => (
  <footer id="contact-me" className="relative px-8 flex flex-col gap-4">
    <ul className="flex gap-4 justify-center items-center text-muted-foreground m-0 list-none">
      <li>
        <a
          href="https://github.com/odelolajosh"
          className="hover:text-foreground"
        >
          <GithubIcon />
        </a>
      </li>
      <li>
        <a
          href="https://www.linkedin.com/in/joshua-odelola"
          className="hover:text-foreground"
        >
          <LinkedInIcon />
        </a>
      </li>
      <li>
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
