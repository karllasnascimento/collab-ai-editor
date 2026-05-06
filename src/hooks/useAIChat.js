import { useState } from 'react'
import { systemPrompt } from '../prompts/system.js'
import { sendMessage } from '../services/openrouter.js'

export function useAIChat() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function send(instruction, currentDocument) {
    const userMessage = {
      role: 'user',
      content: `Document:\n\n${currentDocument}\n\nInstruction: ${instruction}`,
    }

    setLoading(true)
    setError(null)

    try {
      const reply = await sendMessage([
        { role: 'system', content: systemPrompt },
        ...history,
        userMessage,
      ])
      setHistory(prev => [...prev, userMessage, { role: 'assistant', content: reply }])
      return reply
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { send, history, loading, error }
}
