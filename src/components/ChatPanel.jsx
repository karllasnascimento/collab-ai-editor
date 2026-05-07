import { useState } from 'react'

const SKILLS = [
  'Improve writing',
  'Make it shorter',
  'Fix grammar',
  'Change tone to formal',
  'Add a conclusion',
]

export function ChatPanel({ onSend, loading, error, onClearError, disabled }) {
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
        <div className="shrink-0 flex items-start justify-between gap-2 px-3 py-2 text-xs text-red-400 bg-red-950/30 border-b border-red-900">
          <span>{error}</span>
          <button
            onClick={onClearError}
            className="shrink-0 text-red-500 hover:text-red-300 leading-none"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto p-3 text-sm">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 italic">
            <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AI is thinking…
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-gray-300 font-medium">Ask the AI to edit your document.</p>
            <p className="text-gray-500 text-xs">
              Type an instruction below, or use the quick-action buttons to improve writing, fix grammar, and more.
            </p>
          </div>
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
