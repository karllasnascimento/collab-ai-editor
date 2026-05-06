const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-haiku-4-5'

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
  return data.choices[0].message.content
}
