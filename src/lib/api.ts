import matter from 'gray-matter'
import { ContentNotFoundError, getContentFile, getContentJson } from './content'
import type { Post, Project } from './definition'

type BlogIndex = {
  posts: Array<Omit<Post, 'body'>>
}

const SLUG = /^[a-z0-9-]+$/

export const getProjectRepositories = async () => {
  return getContentJson<Array<Project>>('projects.json')
}

export const getBlogIndex = async () => {
  return getContentJson<BlogIndex>('blog.json')
}

export const getPosts = async () => {
  const blog = await getBlogIndex()

  // Sort newest first
  return blog.posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/** Returns `null` when the post isn't in blog.json, so drafts are never served. */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  if (!SLUG.test(slug)) return null

  const blog = await getBlogIndex()
  const metadata = blog.posts.find((p) => p.slug === slug)
  if (!metadata) return null

  try {
    const raw = await getContentFile(`posts/${slug}.md`)
    const { content: body } = matter(raw)
    return { ...metadata, body }
  } catch (err) {
    // blog.json can briefly list a post the cache can't see yet
    if (err instanceof ContentNotFoundError) return null
    throw err
  }
}
