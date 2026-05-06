import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Preview({ content }) {
  if (!content.trim()) {
    return <p className="text-sm italic text-gray-600">Nothing to preview yet.</p>
  }

  return (
    <div className="markdown-preview text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
