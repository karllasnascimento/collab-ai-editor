# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A collaborative Markdown editor where an AI agent suggests edits, shows diffs, and iterates on documents alongside the user.

## Commands

```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview production build
```

> Add lint/test commands here once configured.

## Stack

- React + Vite (JavaScript, not TypeScript)
- CodeMirror 6 for the Markdown editor
- react-markdown + remark-gfm for the preview pane
- diff (npm) for client-side diff computation
- Tailwind CSS for styling
- OpenRouter API for AI calls (`VITE_OPENROUTER_API_KEY` in `.env`)

## Architecture

State is split across two hooks that never cross concerns:

- `useDocument` — owns the document string; knows nothing about AI
- `useAIChat` — owns API calls and conversation history

`src/services/openrouter.js` is the **only** file that touches the network. The AI always returns the **full updated document** (never a patch); diffs are computed client-side in `src/utils/diff.js`.

The system prompt lives in `src/prompts/system.js` — keep it visible and editable.

## Folder structure

src/
  components/
    Editor.jsx        # CodeMirror wrapper
    Preview.jsx       # Markdown rendered preview
    DiffView.jsx      # Shows proposed changes with accept/reject
    ChatPanel.jsx     # AI conversation UI + skill buttons
    Layout.jsx        # Split-pane shell
  hooks/
    useDocument.js    # Document state, proposal, accept/reject
    useAIChat.js      # API calls, conversation history, loading/error
  services/
    openrouter.js     # Only file that touches the network
  utils/
    diff.js           # Diff computation and formatting
  prompts/
    system.js         # System prompt as exported string
  App.jsx


## ChatPanel skills (quick-action buttons)

- Improve writing
- Make it shorter
- Fix grammar
- Change tone to formal
- Add a conclusion

## Constraints

- No TypeScript
- No auth or multi-user features
- No backend / Docker
- No localStorage persistence
- No mobile responsiveness
- Minimal CodeMirror customization — default config is enough
- No streaming — buffer the full response before diffing

## Code style

- Functional components, named exports
- Clear prop names — no abbreviations
- Always handle error states — never a blank screen on failure
