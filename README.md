# Collab AI Editor

A collaborative Markdown editor where an AI agent works alongside you — suggesting edits, showing diffs, and iterating on documents. You stay in control: every suggestion requires explicit acceptance before the document changes.

## What it does

- Write Markdown in a live editor with real-time preview
- Send instructions to the AI in natural language, or use quick-action buttons (Improve writing, Fix grammar, Make it shorter, Change tone to formal, Add a conclusion)
- Review the AI's proposed changes as a line-by-line diff before deciding
- Accept or reject suggestions — the document never changes without your approval
- Undo the last accepted suggestion if you change your mind
- Track token usage and estimated cost per request, and cumulative session usage

## How to run it locally

**Prerequisites:** Node.js 18+, an [OpenRouter](https://openrouter.ai) API key.

```bash
git clone https://github.com/karllasnascimento/collab-ai-editor
cd collab-ai-editor
npm install --legacy-peer-deps
cp .env.example .env
# Add your OpenRouter API key to .env
npm run dev
```

Open `http://localhost:5173`.

## Architecture decisions

### State is split into two hooks that never cross concerns

`useDocument` owns the document string, the pending proposal, and the undo snapshot. `useAIChat` owns API calls, conversation history, loading state, and session tracking. They never import each other.

This follows the same principle I apply in infrastructure: each component should have a single responsibility and fail in isolation. If the AI integration breaks, the editor still works. If document state goes corrupted, the chat history is unaffected. When something goes wrong, you know exactly where to look.

### Model routing based on task complexity

Requests are routed between two models depending on the instruction:

| Task | Model |
|---|---|
| Fix grammar, Make it shorter, Change tone to formal | `claude-haiku-4-5` |
| Improve writing, Add a conclusion, free-text input | `claude-sonnet-4-5` |

This comes from experience routing LLM requests at scale: fix grammar, make shorter, and change tone are mechanical tasks — Haiku handles them well at a fraction of the cost. Improve writing, add a conclusion, and open-ended instructions require more judgment — that's where Sonnet pays off. The goal was to protect the $5 session budget without sacrificing quality where it matters.

### Client-side rate limiting and session observability

Two limits are enforced client-side: block after 20 requests or $1.00 spent per session. This is distinct from the $5 cap on the OpenRouter side — that's a hard stop at the provider level that kills the key entirely. Client-side limiting is proactive: it protects the budget before hitting that ceiling.

The session indicator in the header (requests used, cost so far) exists for the same reason I add observability to any system — the user should always know the current state. A user who sees "$0.80 used" will naturally be more careful than one who has no visibility until the key stops working.

### Timeout on every API call

Every request has a 30-second ceiling enforced via `AbortController`. Without it, the user gets stuck in a loading state with no way out except refreshing the page. The same principle applies in infrastructure: always define a ceiling on external calls, even if you rarely hit it.

### The AI always returns the full document — never a patch

The AI rewrites the entire document on every instruction and returns it as plain text. Diffs are computed client-side using the `diff` library. This keeps the AI's job simple and the diffing logic independent and testable.

### No agent framework

The AI integration is a direct API call — one function in `openrouter.js`, one hook in `useAIChat`. The skill buttons demonstrate the concept of structured AI actions without the overhead of a tool-calling or agent framework. I apply the same principle in infrastructure: don't add layers you don't need yet. I'd reach for something more complex if the use case required the AI to autonomously chain actions or decide which tool to use based on context — this editor doesn't need that.

## Trade-offs

**No streaming** — Streaming would make the experience feel more alive, but it breaks the diff flow. You can't compute a meaningful diff against a half-written response. Shipping a reliable diff was more important than a typing animation.

**No TypeScript** — The time cost of types in a focused sprint doesn't pay off. It would have slowed development without adding value for evaluation.

**No backend** — A backend proxy would have solved the API key exposure problem (see Security below), but it would have added infrastructure unrelated to what's being evaluated here.

**No localStorage, no mobile responsiveness** — Honest next steps, not oversights.

## Security

The OpenRouter API key is stored in `.env` and loaded via Vite's `VITE_` prefix, which embeds it in the client-side JavaScript bundle at build time. This is a known architectural constraint of client-side apps — there is no way around it without a backend proxy. The mitigation is the $5 spending cap on the OpenRouter key, which limits the blast radius if the key is extracted from the bundle.

Never commit `.env`. The `.env.example` file documents the required variables for anyone cloning the project.

## How AI was used to build this project

This project was built collaboratively with [Claude Code](https://claude.ai/code) as the primary development tool. The full session transcript — covering scope definition, architecture planning, step-by-step implementation, bug fixes, and the SRE review — is available as part of the submission.

The development followed a structured delivery plan broken into 8 validated steps: scaffold → layout → editor/preview → API integration → diff/accept/reject → skill buttons → error handling → README. Each step was validated in the browser before committing.

AI was used for: generating boilerplate, implementing features from specifications, identifying bugs (including two found during the SRE review), and writing commit messages. All architectural decisions — model routing, hook separation, rate limiting design, intentional exclusions — were made by the developer and are documented in this README in their own words.
