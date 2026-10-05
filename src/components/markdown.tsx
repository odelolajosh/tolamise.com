import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remakeGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function Markdown({ content }: { content: string }) {
  try {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath, remakeGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            if (match) {

              return match?.[1] === 'math' ? (
                <pre className="math-block">
                  <code>{children}</code>
                </pre>
              ) : (
                <SyntaxHighlighter
                  {...props}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={vscDarkPlus}
                />
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
