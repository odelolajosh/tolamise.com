import { Link } from '@tanstack/react-router'
import type { Post } from '@/lib/definition'

interface BlogCardProps {
  blog: Post
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  const createdAt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(blog.createdAt))

  return (
    <Link to={blog.slug} className="no-underline">
      <div className="grid gap-2 border border-solid border-transparent hover:border-border transition-colors">
        <div aria-description={`${blog.title} created on ${createdAt}`}>
          <h3>{blog.title}</h3>
          <small className="italic">{createdAt}</small>
        </div>
        <div className="text-muted-foreground">{blog.description}</div>
      </div>
    </Link>
  )
}
