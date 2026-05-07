const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = {
  haiku: {
    id: 'anthropic/claude-haiku-4-5',
    label: 'haiku',
    pricing: { input: 0.80 / 1_000_000, output: 4.00 / 1_000_000 },
  },
  sonnet: {
    id: 'anthropic/claude-sonnet-4-5',
    label: 'sonnet',
    pricing: { input: 3.00 / 1_000_000, output: 15.00 / 1_000_000 },
  },
}

// Instructions simple enough for Haiku — everything else uses Sonnet
const SIMPLE_TASKS = new Set([
  'Fix grammar',
  'Make it shorter',
  'Change tone to formal',
])

function selectModel(instruction) {
  return SIMPLE_TASKS.has(instruction) ? MODELS.haiku : MODELS.sonnet
}

export function estimateCost(usage, model) {
  if (!usage || !model) return null
  return (
    usage.prompt_tokens * model.pricing.input +
    usage.completion_tokens * model.pricing.output
  )
}

export async function sendMessage(messages, instruction) {
  const model = selectModel(instruction)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: model.id, messages }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.error?.message ?? `OpenRouter error ${response.status}`)
    }

    const data = await response.json()
    const choice = data.choices?.[0]
    if (!choice) throw new Error('No response from model. Please try again.')
    return {
      content: choice.message.content,
      usage: data.usage ?? null,
      model,
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}
