import { useDocument } from './hooks/useDocument.js'
import { useAIChat } from './hooks/useAIChat.js'
import { Layout } from './components/Layout.jsx'

export default function App() {
  const { content, setContent } = useDocument()
  const { send, loading, error } = useAIChat()

  async function handleSend(instruction) {
    const result = await send(instruction, content)
    if (result) console.log('AI response:', result)
  }

  return (
    <Layout
      content={content}
      onContentChange={setContent}
      onSend={handleSend}
      loading={loading}
      error={error}
    />
  )
}
