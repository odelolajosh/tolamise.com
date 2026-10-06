import * as fs from 'node:fs'
import path from 'node:path'

const CONTENT_OWNER = process.env.CONTENT_OWNER
const CONTENT_REPO = process.env.CONTENT_REPO
const CONTENT_BRANCH = process.env.CONTENT_BRANCH || 'main'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const CONTENT_DIR = process.env.CONTENT_DIR

const TTL_MS = 5 * 60 * 1000

// Written by `scripts/snapshot-content.mjs` at build time. The glob keeps dev
// working when the file doesn't exist.
const snapshot: Record<string, string> =
  Object.values(
    import.meta.glob<Record<string, string>>(
      '/src/generated/content-snapshot.json',
      { eager: true, import: 'default' },
    ),
  )[0] ?? {}

type CacheEntry = { body: string; etag: string | null; fetchedAt: number }
const cache = new Map<string, CacheEntry>()

export class ContentNotFoundError extends Error {
  constructor(file: string) {
    super(`Content file "${file}" not found`)
  }
}

async function fetchFromGitHub(file: string, etag: string | null) {
  if (!CONTENT_OWNER || !CONTENT_REPO || !GITHUB_TOKEN) {
    throw new Error(
      'CONTENT_OWNER, CONTENT_REPO and GITHUB_TOKEN must be set to fetch content',
    )
  }

  const res = await fetch(
    `https://api.github.com/repos/${CONTENT_OWNER}/${CONTENT_REPO}/contents/${file}?ref=${CONTENT_BRANCH}`,
    {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'joshua-content-loader',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(etag ? { 'If-None-Match': etag } : {}),
      },
    },
  )

  if (res.status === 304) return null
  if (res.status === 404) throw new ContentNotFoundError(file)
  if (!res.ok) {
    throw new Error(`GitHub returned ${res.status} for "${file}"`)
  }

  return { body: await res.text(), etag: res.headers.get('etag') }
}

async function readLocal(file: string) {
  try {
    return await fs.promises.readFile(path.join(CONTENT_DIR!, file), 'utf-8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new ContentNotFoundError(file)
    }
    throw err
  }
}

/**
 * Reads a file from the content repo. Tries, in order: the cache while it's
 * fresh, GitHub, the last good copy, and the build snapshot.
 *
 * Throws `ContentNotFoundError` when the file doesn't exist.
 */
export async function getContentFile(file: string): Promise<string> {
  if (CONTENT_DIR) return readLocal(file)

  const cached = cache.get(file)
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return cached.body

  try {
    const fetched = await fetchFromGitHub(file, cached?.etag ?? null)
    const entry = fetched
      ? { ...fetched, fetchedAt: Date.now() }
      : { ...cached!, fetchedAt: Date.now() }
    cache.set(file, entry)
    return entry.body
  } catch (err) {
    if (err instanceof ContentNotFoundError) {
      cache.delete(file)
      throw err
    }
    const fallback = cached?.body ?? snapshot[file]
    if (fallback === undefined) throw err
    console.error(`Serving stale "${file}":`, err)
    // Wait a full TTL before retrying so an outage doesn't hit GitHub per request
    cache.set(file, {
      body: fallback,
      etag: cached?.etag ?? null,
      fetchedAt: Date.now(),
    })
    return fallback
  }
}

export async function getContentJson<T>(file: string): Promise<T> {
  return JSON.parse(await getContentFile(file)) as T
}
