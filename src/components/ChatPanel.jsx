import { useState } from 'react'

const SKILLS = [
  'Improve writing',
  'Make it shorter',
  'Fix grammar',
  'Change tone to formal',
  'Add a conclusion',
]

export function ChatPanel({ onSend, loading, error, disabled }) {
  const [input, setInput] = useState('')
  const isDisabled = loading || disabled

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim() || isDisabled) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      {disabled && (
        <div className="shrink-0 px-3 py-2 text-xs text-amber-400 bg-amber-950/30 border-b border-amber-900">
          Accept or reject the current suggestion first.
        </div>
      )}
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

      {/* Skill buttons */}
      <div className="shrink-0 flex flex-wrap gap-1.5 px-3 py-2 border-t border-gray-800">
        {SKILLS.map(skill => (
          <button
            key={skill}
            onClick={() => onSend(skill)}
            disabled={isDisabled}
            className="px-2.5 py-1 text-xs rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {skill}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 flex gap-2 p-3 border-t border-gray-800">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe what to change…"
          disabled={isDisabled}
          className="flex-1 bg-gray-900 text-gray-200 text-sm px-3 py-1.5 rounded border border-gray-700 placeholder-gray-600 focus:outline-none focus:border-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isDisabled}
          className="px-3 py-1.5 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
