import { useState } from 'react'
import { systemPrompt } from '../prompts/system.js'
import { sendMessage, estimateCost } from '../services/openrouter.js'

const AI_CONFIRMATION = "Here's my suggestion — review the diff above."
const MAX_COST = 1.00
const MAX_REQUESTS = 20

export function useAIChat() {
  const [history, setHistory] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionCost, setSessionCost] = useState(0)
  const [requestCount, setRequestCount] = useState(0)

  const budgetExceeded = sessionCost >= MAX_COST || requestCount >= MAX_REQUESTS

  async function send(instruction, currentDocument) {
    if (budgetExceeded) {
      setError('Session budget limit reached. Refresh the page to start a new session.')
      return null
    }

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
      const cost = estimateCost(usage, model) ?? 0
      setHistory(prev => [...prev, userMessage, { role: 'assistant', content: reply }])
      setSessionCost(prev => prev + cost)
      setRequestCount(prev => prev + 1)
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: AI_CONFIRMATION,
        tokens: usage?.total_tokens ?? null,
        cost,
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

  return { send, messages, loading, error, clearError, sessionCost, requestCount, budgetExceeded }
}
