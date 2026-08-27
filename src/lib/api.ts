// import { Octokit } from "@octokit/core";
//
import * as fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post } from './definition'
import { projects } from '@/data/projects'

export const getProjectRepositories = async () => {
  return projects
}

const POSTS_DIRECTORY = 'src/data/posts'

export const getPosts = async () => {
  const files = await fs.promises.readdir(POSTS_DIRECTORY)

  const postsPromises = files.map(readPost)

  const results = await Promise.allSettled(postsPromises)

  const posts = results
    .filter((r): r is PromiseFulfilledResult<Post> => r.status === 'fulfilled')
    .map((r) => r.value)

  // Sort newest first
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export const getPostBySlug = async (slug: string) => {
  try {
    const filename = slug + '.md'
    const post = await readPost(filename)
    return post
  } catch (err) {
    return null
  }
}

const readPost = async (filename: string) => {
  try {
    const filePath = path.join(POSTS_DIRECTORY, filename)
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    const slug = filename.replace(/\.md$/, '')
    const stats = readingTime(content)

    if (['yes', 'true'].includes(data.draft?.toLowerCase())) {
      throw new Error('Coming soon')
    }

    return {
      slug,
      title: data.title,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
      description: data.description,
      tags: data.tags || [],
      readingTime: stats.text,
      body: content,
    } as Post
  } catch (err) {
    throw new Error(
      `Error reading post "${filename}": ${(err as Error).message}`,
    )
  }
}
