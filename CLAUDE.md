# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**collab-ai-editor** — a collaborative AI-powered editor (early stage, no source files yet).

# collab-ai-editor

A collaborative Markdown editor where an AI agent suggests edits, 
shows diffs, and iterates on documents alongside the user.

## Stack
- React + Vite (JavaScript, not TypeScript)
- CodeMirror 6 for the Markdown editor
- react-markdown + remark-gfm for the preview pane
- diff (npm) for client-side diff computation
- Tailwind CSS for styling
- OpenRouter API for AI calls

## Architecture decisions
- AI always returns the full updated document — never a patch
- Diffs are computed client-side using the diff library
- System prompt lives in src/prompts/system.js — keep it visible and editable
- API key stored in .env as VITE_OPENROUTER_API_KEY
- useDocument hook owns document state — knows nothing about AI
- useAIChat hook owns API calls and conversation history
- openrouter.js is the only file that touches the network

## Folder structure
src/
  components/
    Editor.jsx
    Preview.jsx
    DiffView.jsx
    ChatPanel.jsx
    Layout.jsx
  hooks/
    useDocument.js
    useAIChat.js
  services/
    openrouter.js
  utils/
    diff.js
  prompts/
    system.js
  App.jsx

## Skills (AI quick actions)
The ChatPanel should include skill buttons as shortcuts:
- Improve writing
- Make it shorter
- Fix grammar
- Change tone to formal
- Add a conclusion

## Do not
- Use TypeScript
- Add auth or multi-user features
- Add Docker or any backend infrastructure
- Use localStorage for persistence
- Add mobile responsiveness
- Customize CodeMirror heavily — default config is enough
- Stream responses — buffer the full response before diffing

## Code style
- Functional components only
- Named exports for components
- Clear prop names — no abbreviations
- Error states always handled — never a blank screen on failure
