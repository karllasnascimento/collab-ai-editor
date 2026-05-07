const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-haiku-4-5'

// claude-haiku-4-5 pricing on OpenRouter (USD per token)
const PRICING = {
  input:  0.80 / 1_000_000,
  output: 4.00 / 1_000_000,
}

export function estimateCost(usage) {
  if (!usage) return null
  return usage.prompt_tokens * PRICING.input + usage.completion_tokens * PRICING.output
}

export async function sendMessage(messages) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: MODEL, messages }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `OpenRouter error ${response.status}`)
  }

  const data = await response.json()
  return {
    content: data.choices[0].message.content,
    usage: data.usage ?? null,
  }
}
