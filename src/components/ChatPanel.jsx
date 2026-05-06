import { useState } from 'react'

export function ChatPanel({ onSend, loading, error }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="shrink-0 px-3 py-2 text-xs text-red-400 bg-red-950/30 border-b border-red-900">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto p-3 text-sm">
        {loading ? (
          <p className="text-gray-500 italic">AI is thinking…</p>
        ) : (
          <p className="text-gray-600">Send an instruction to edit your document.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 flex gap-2 p-3 border-t border-gray-800">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe what to change…"
          disabled={loading}
          className="flex-1 bg-gray-900 text-gray-200 text-sm px-3 py-1.5 rounded border border-gray-700 placeholder-gray-600 focus:outline-none focus:border-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-3 py-1.5 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
