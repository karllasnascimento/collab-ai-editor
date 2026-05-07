import { Editor } from './Editor.jsx'
import { Preview } from './Preview.jsx'
import { DiffView } from './DiffView.jsx'
import { ChatPanel } from './ChatPanel.jsx'

export function Layout({ content, onContentChange, proposal, onAccept, onReject, onSend, loading, error, onClearError }) {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">

      {/* Header */}
      <header className="shrink-0 flex items-center px-4 h-11 border-b border-gray-800">
        <span className="text-sm font-semibold tracking-tight text-gray-200">
          Collab AI Editor
        </span>
      </header>

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Editor */}
        <div className="flex flex-col w-1/2 border-r border-gray-800 overflow-hidden">
          <PanelLabel>Editor</PanelLabel>
          <div className="flex-1 overflow-hidden">
            <Editor content={content} onChange={onContentChange} />
          </div>
        </div>

        {/* Right column — Preview/Diff + Chat stacked */}
        <div className="flex flex-col w-1/2">

          {/* Top right — Preview or DiffView */}
          <div className="flex flex-col flex-1 overflow-hidden border-b border-gray-800">
            {proposal ? (
              <>
                <PanelLabel highlight>Proposed changes</PanelLabel>
                <DiffView
                  original={content}
                  proposal={proposal}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              </>
            ) : (
              <>
                <PanelLabel hint="AI-suggested changes will appear here">Preview</PanelLabel>
                <div className="flex-1 overflow-auto p-4">
                  <Preview content={content} />
                </div>
              </>
            )}
          </div>

          {/* Bottom right — Chat */}
          <div className="flex flex-col h-72 shrink-0">
            <PanelLabel>Chat</PanelLabel>
            <ChatPanel
              onSend={onSend}
              loading={loading}
              error={error}
              onClearError={onClearError}
              disabled={!!proposal}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

function PanelLabel({ children, highlight, hint }) {
  return (
    <div className={`shrink-0 flex items-center justify-between px-3 py-1.5 text-xs font-medium border-b border-gray-800 ${
      highlight
        ? 'text-amber-400 bg-amber-950/20'
        : 'text-gray-500 bg-gray-900'
    }`}>
      <span>{children}</span>
      {hint && <span className="text-gray-700 font-normal">{hint}</span>}
    </div>
  )
}
