import { computeDiff } from '../utils/diff.js'

export function DiffView({ original, proposal, onAccept, onReject }) {
  const parts = computeDiff(original, proposal)
  const hasChanges = parts.some(p => p.added || p.removed)

  if (!hasChanges) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center gap-4 p-4">
        <p className="text-sm text-gray-500">No changes suggested.</p>
        <button
          onClick={onReject}
          className="px-4 py-1.5 text-sm rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto p-3">
        <pre className="font-mono text-xs leading-5 whitespace-pre-wrap">
          {parts.map((part, partIndex) => {
            const lines = part.value.split('\n')
            if (lines[lines.length - 1] === '') lines.pop()

            return lines.map((line, lineIndex) => (
              <div
                key={`${partIndex}-${lineIndex}`}
                className={
                  part.added
                    ? 'bg-green-950/60 text-green-300'
                    : part.removed
                    ? 'bg-red-950/60 text-red-400 line-through'
                    : 'text-gray-600'
                }
              >
                <span className="select-none mr-2 text-gray-700">
                  {part.added ? '+' : part.removed ? '-' : ' '}
                </span>
                {line || ' '}
              </div>
            ))
          })}
        </pre>
      </div>

      <div className="shrink-0 flex gap-2 p-3 border-t border-gray-800 bg-gray-900/60">
        <button
          onClick={onAccept}
          className="flex-1 py-2 text-sm font-medium rounded bg-green-800/70 text-green-100 hover:bg-green-700/70 transition-colors"
        >
          ✓ Accept
        </button>
        <button
          onClick={onReject}
          className="flex-1 py-2 text-sm font-medium rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          ✕ Reject
        </button>
      </div>
    </div>
  )
}
