import { useState } from 'react'
import { systemPrompt } from '../prompts/system.js'
import { sendMessage, estimateCost } from '../services/openrouter.js'

const AI_CONFIRMATION = "Here's my suggestion — review the diff above."

export function useAIChat() {
  const [history, setHistory] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function send(instruction, currentDocument) {
    const userMessage = {
      role: 'user',
      content: `Document:\n\n${currentDocument}\n\nInstruction: ${instruction}`,
    }

    setMessages(prev => [...prev, { role: 'user', text: instruction }])
    setLoading(true)
    setError(null)

    try {
      const { content: reply, usage, model } = await sendMessage([
        { role: 'system', content: systemPrompt },
        ...history,
        userMessage,
      ], instruction)
      setHistory(prev => [...prev, userMessage, { role: 'assistant', content: reply }])
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: AI_CONFIRMATION,
        tokens: usage?.total_tokens ?? null,
        cost: estimateCost(usage, model),
        model: model?.label ?? null,
      }])
      return reply
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  function clearError() {
    setError(null)
  }

  return { send, messages, loading, error, clearError }
}
