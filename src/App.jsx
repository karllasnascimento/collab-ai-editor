import { useDocument } from './hooks/useDocument.js'
import { useAIChat } from './hooks/useAIChat.js'
import { Layout } from './components/Layout.jsx'

export default function App() {
  const { content, setContent, proposal, setProposal, applyProposal, clearProposal } = useDocument()
  const { send, loading, error } = useAIChat()

  async function handleSend(instruction) {
    const result = await send(instruction, content)
    if (result) setProposal(result)
  }

  return (
    <Layout
      content={content}
      onContentChange={setContent}
      proposal={proposal}
      onAccept={applyProposal}
      onReject={clearProposal}
      onSend={handleSend}
      loading={loading}
      error={error}
    />
  )
}
