import matter from 'gray-matter'
import { ContentNotFoundError, getContentFile, getContentJson } from './content'
import { renderMarkdown } from './markdown'
import type {
  Post,
  PostLink,
  PostMeta,
  Project,
  ProjectCaseStudy,
} from './definition'

type BlogIndex = {
  posts: Array<PostMeta>
}

const SLUG = /^[a-z0-9-]+$/

const toLink = (post?: PostMeta): PostLink | null =>
  post ? { slug: post.slug, title: post.title } : null

/** Reads a markdown file's body, or `null` when it doesn't exist. */
async function readMarkdownBody(file: string) {
  try {
    return matter(await getContentFile(file)).content
  } catch (err) {
    // An index can briefly list a file the cache can't see yet
    if (err instanceof ContentNotFoundError) return null
    throw err
  }
}

export const getProjectRepositories = async () => {
  return getContentJson<Array<Project>>('projects.json')
}

/** Returns `null` unless the project has a `slug` and a case study file. */
export const getProjectBySlug = async (
  slug: string,
): Promise<ProjectCaseStudy | null> => {
  if (!SLUG.test(slug)) return null

  const projects = await getProjectRepositories()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  const body = await readMarkdownBody(`projects/${slug}.md`)
  if (body === null) return null

  const others = projects
    .filter((p) => p !== project)
    .map(({ name, slug: otherSlug, github_url }) => ({
      name,
      slug: otherSlug,
      github_url,
    }))

  return { ...project, slug, ...(await renderMarkdown(body)), others }
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

  const posts = await getPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  if (index === -1) return null

  const body = await readMarkdownBody(`posts/${slug}.md`)
  if (body === null) return null

  return {
    ...posts[index],
    ...(await renderMarkdown(body)),
    newer: toLink(posts[index - 1]),
    older: toLink(posts[index + 1]),
  }
}
