import type { TocItem } from './markdown'

export interface PostMeta {
  slug: string
  title: string
  excerpt?: string
  tags: Array<string>
  readingTime: string
  wordCount?: number
  createdAt: string
  updatedAt: string
}

export type PostLink = Pick<PostMeta, 'slug' | 'title'>

export interface Post extends PostMeta {
  html: string
  hasMath: boolean
  toc: Array<TocItem>
  /** The next newer post, if any */
  newer: PostLink | null
  /** The next older post, if any */
  older: PostLink | null
}

export interface Project {
  name: string
  /** Set only when `projects/<slug>.md` holds a case study */
  slug?: string
  description: string
  github_url: string
  demo_url?: string
  stack?: Array<string>
  estimate?: number
}

export interface ProjectCaseStudy extends Project {
  slug: string
  html: string
  hasMath: boolean
  toc: Array<TocItem>
  /** The other projects, for navigating between them */
  others: Array<Pick<Project, 'name' | 'slug' | 'github_url'>>
}
