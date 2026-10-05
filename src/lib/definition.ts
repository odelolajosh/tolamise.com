export interface Post {
  slug: string
  title: string
  excerpt?: string
  tags: Array<string>
  readingTime: string
  body: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  name: string
  description: string
  github_url: string
  estimate: number
}
