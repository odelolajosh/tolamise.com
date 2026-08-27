export interface Project {
  name: string
  description: string
  github_url: string
  /** The estimated points for the project ranging from 1 to 3 */
  estimate: number
}

export const projects = [] as Array<Project>
