// Fetches the content repo into src/generated/content-snapshot.json so the
// site can still serve content when GitHub is unreachable. Runs before build.
import * as fs from 'node:fs'

const { CONTENT_OWNER, CONTENT_REPO, GITHUB_TOKEN } = process.env
const CONTENT_BRANCH = process.env.CONTENT_BRANCH || 'main'
const OUT = 'src/generated/content-snapshot.json'

async function fetchFile(file) {
  const res = await fetch(
    `https://api.github.com/repos/${CONTENT_OWNER}/${CONTENT_REPO}/contents/${file}?ref=${CONTENT_BRANCH}`,
    {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'joshua-content-loader',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )
  if (!res.ok) throw new Error(`GitHub returned ${res.status} for "${file}"`)
  return res.text()
}

function write(snapshot) {
  fs.mkdirSync('src/generated', { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(snapshot))
}

if (!CONTENT_OWNER || !CONTENT_REPO || !GITHUB_TOKEN) {
  console.warn('Content env vars missing; writing an empty content snapshot')
  write({})
} else {
  const snapshot = {}
  snapshot['blog.json'] = await fetchFile('blog.json')
  snapshot['projects.json'] = await fetchFile('projects.json')

  const { posts } = JSON.parse(snapshot['blog.json'])
  await Promise.all(
    posts.map(async ({ slug }) => {
      snapshot[`posts/${slug}.md`] = await fetchFile(`posts/${slug}.md`)
    }),
  )

  write(snapshot)
  console.log(`Content snapshot: ${posts.length} posts`)
}
