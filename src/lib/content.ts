const CONTENT_OWNER = process.env.CONTENT_OWNER
const CONTENT_REPO = process.env.CONTENT_REPO
const CONTENT_BRANCH = process.env.CONTENT_BRANCH
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

function queryContent(path: string) {
  return fetch(`https://api.github.com/repos/${CONTENT_OWNER}/${CONTENT_REPO}/contents/${path}?ref=${CONTENT_BRANCH}`, {
    headers: {
      Accept: 'application/vnd.github.raw+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })
}

export async function getContentFile(path: string, options?: { format?: "json" }) {
  const res = await queryContent(path)

  if (options?.format === "json")
    return res.json()

  return res.text()
}