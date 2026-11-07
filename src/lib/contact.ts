export const EMAIL = 'hello@tolamise.com'

export type ChannelKey = 'email' | 'github' | 'linkedin' | 'x'

export type Channel = {
  key: ChannelKey
  label: string
  handle: string
  href: string
  /** Single-key shortcut on the contact page */
  shortcut: string
}

export const channels: Array<Channel> = [
  {
    key: 'email',
    label: 'Email',
    handle: EMAIL,
    href: `mailto:${EMAIL}`,
    shortcut: 'e',
  },
  {
    key: 'github',
    label: 'GitHub',
    handle: '@odelolajosh',
    href: 'https://github.com/odelolajosh',
    shortcut: 'g',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'in/joshua-odelola',
    href: 'https://www.linkedin.com/in/joshua-odelola/',
    shortcut: 'l',
  },
  {
    key: 'x',
    label: 'X',
    handle: '@odelolajosh',
    href: 'https://x.com/odelolajosh',
    shortcut: 'x',
  },
]
