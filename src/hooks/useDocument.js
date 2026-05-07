import { useState } from 'react'

const INITIAL_CONTENT = `# Welcome to collab-ai-editor

Start typing here, or ask the AI to help you write.

## What you can do

- Write in **Markdown** on the left
- See a live preview on the right
- Chat with the AI to edit your document
`

export function useDocument() {
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [proposal, setProposal] = useState(null)

  function applyProposal() {
    setContent(proposal)
    setProposal(null)
  }

  function clearProposal() {
    setProposal(null)
  }

  return { content, setContent, proposal, setProposal, applyProposal, clearProposal }
}
