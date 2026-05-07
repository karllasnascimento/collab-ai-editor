import { useState, useRef, useEffect } from 'react'

function formatCost(cost) {
  if (cost == null) return ''
  if (cost < 0.0001) return '<$0.0001'
  return `$${cost.toFixed(4)}`
}

const SKILLS = [
  'Improve writing',
  'Make it shorter',
  'Fix grammar',
  'Change tone to formal',
  'Add a conclusion',
]

export function ChatPanel({ onSend, messages, loading, error, onClearError, disabled }) {
  const [input, setInput] = useState('')
  const isDisabled = loading || disabled
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

      {/* Message area */}
      <div className="flex-1 overflow-auto p-3 text-sm">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col gap-1">
            <p className="text-gray-300 font-medium">Ask the AI to edit your document.</p>
            <p className="text-gray-500 text-xs">
              Type an instruction below, or use the quick-action buttons to improve writing, fix grammar, and more.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} className="flex flex-col items-end gap-0.5">
                  <span className="text-xs text-gray-600">You</span>
                  <div className="max-w-[85%] px-3 py-2 rounded-lg bg-gray-700 text-gray-200">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col items-start gap-0.5">
                  <span className="text-xs text-gray-600">AI</span>
                  <div className="max-w-[85%] px-3 py-2 rounded-lg bg-gray-800 text-gray-400 italic">
                    {msg.text}
                  </div>
                  {msg.tokens != null && (
                    <span className="text-xs text-gray-700">
                      {msg.tokens.toLocaleString()} tokens · {formatCost(msg.cost)}{msg.model ? ` · ${msg.model}` : ''}
                    </span>
                  )}
                </div>
              )
            )}
            {loading && (
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-xs text-gray-600">AI</span>
                <div className="px-3 py-2 rounded-lg bg-gray-800 text-gray-500 flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="italic">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
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
          Send
        </button>
      </form>
    </div>
  )
}
