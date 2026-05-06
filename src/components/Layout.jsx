export function Layout() {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">

      {/* Header */}
      <header className="shrink-0 flex items-center px-4 h-11 border-b border-gray-800">
        <span className="text-sm font-semibold tracking-tight text-gray-200">
          collab-ai-editor
        </span>
      </header>

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Editor */}
        <div className="flex flex-col w-1/2 border-r border-gray-800">
          <PanelLabel>Editor</PanelLabel>
          <div className="flex-1 overflow-auto p-4 text-sm text-gray-600">
            Markdown editor will go here
          </div>
        </div>

        {/* Right column — Preview + Chat stacked */}
        <div className="flex flex-col w-1/2">

          {/* Top right — Preview */}
          <div className="flex flex-col flex-1 overflow-hidden border-b border-gray-800">
            <PanelLabel>Preview</PanelLabel>
            <div className="flex-1 overflow-auto p-4 text-sm text-gray-600">
              Rendered Markdown preview will go here
            </div>
          </div>

          {/* Bottom right — Chat */}
          <div className="flex flex-col h-72 shrink-0">
            <PanelLabel>Chat</PanelLabel>
            <div className="flex-1 overflow-auto p-4 text-sm text-gray-600">
              AI chat panel will go here
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function PanelLabel({ children }) {
  return (
    <div className="shrink-0 px-3 py-1.5 text-xs font-medium text-gray-500 border-b border-gray-800 bg-gray-900">
      {children}
    </div>
  )
}
