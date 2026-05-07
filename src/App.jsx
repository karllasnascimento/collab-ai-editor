import { useDocument } from './hooks/useDocument.js'
import { useAIChat } from './hooks/useAIChat.js'
import { Layout } from './components/Layout.jsx'

export default function App() {
  const { content, setContent, proposal, setProposal, applyProposal, clearProposal, canUndo, undoAccept } = useDocument()
  const { send, messages, loading, error, clearError, sessionCost, requestCount, budgetExceeded } = useAIChat()

  async function handleSend(instruction) {
    const result = await send(instruction, content)
    if (result !== null) setProposal(result)
  }

  return (
    <Layout
      content={content}
      onContentChange={setContent}
      proposal={proposal}
      onAccept={applyProposal}
      onReject={clearProposal}
      canUndo={canUndo}
      onUndo={undoAccept}
      onSend={handleSend}
      messages={messages}
      loading={loading}
      error={error}
      onClearError={clearError}
      sessionCost={sessionCost}
      requestCount={requestCount}
      budgetExceeded={budgetExceeded}
    />
  )
}
