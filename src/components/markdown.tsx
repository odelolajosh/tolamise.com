import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

export function Markdown({ content }: { content: string }) {
  try {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            if (!inline && match?.[1] === 'math') {
              return (
                <pre className="math-block">
                  <code>{children}</code>
                </pre>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    )
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return <div>Error rendering content</div>
  }
}
