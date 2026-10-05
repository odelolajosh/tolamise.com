import matter from 'gray-matter'
import { getContentFile } from './content'
import type { Post, Project } from './definition'

type BlogIndex = {
  posts: Exclude<Post, 'body'>[]
}

export const getProjectRepositories = async (): Promise<Project[]> => {
  return getContentFile("projects.json", { format: "json" })
}

export const getBlogIndex = async (): Promise<BlogIndex> => {
  return getContentFile("blog.json", { format: "json" })
}

export const getPosts = async () => {
  const blog = await getBlogIndex();

  // Sort newest first
  return blog.posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const blog = await getBlogIndex();

  const metadata = blog.posts.find((p) => p.slug === slug);
  if (!metadata) {
    throw new Error("Post not found.")
  }
  
  const raw = await getContentFile(`posts/${slug}.md`)
  const { content: body } = matter(raw)

  return {
    ...metadata,
    body
  }
}
