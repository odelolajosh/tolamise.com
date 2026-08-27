export interface Post {
  slug: string
  title: string
  description?: string
  tags: Array<string>
  readingTime: string
  body: string
  createdAt: string
  updatedAt: string
}
