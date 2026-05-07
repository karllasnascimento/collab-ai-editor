# Prompt Engineering Approach

This document captures how I used prompting to build this project — the principles I followed, how prompts were structured, how they evolved across the session, and why I treated Claude as a collaborator rather than an executor.

---

## Principles

**Plan before coding.**
The first substantive prompt wasn't a build instruction — it was a request for scope definition, architecture decisions, guardrails, a delivery plan, and a risk assessment. No code was written until I had a clear plan I'd agreed on. This mirrors how I approach infrastructure work: alignment first, execution second.

**One step at a time, validated before moving on.**
Every implementation prompt ended with "Do not commit yet. Wait for my validation before proceeding." This wasn't ceremony — it was a hard gate. I tested each step in the browser, confirmed the behavior matched the spec, and only then committed. Eight steps, eight validation gates. Nothing was batch-committed.

**Specify behavior, not implementation.**
I described what the feature should do from the user's perspective, not how to code it. "When the AI returns a suggestion, the user should see exactly what would change before deciding to accept or reject it. The document should never change without explicit user approval." — that's a behavior spec. Claude chose the implementation (proposal state, diff computation, DiffView component). This produced better decisions than if I'd prescribed the structure.

**Constraints belong in the prompt.**
Every step prompt included what to exclude. Step 3: "No AI yet." Step 4: "No diff yet — just confirm the round-trip works." Step 5: "Do not commit yet." These constraints weren't obvious — stating them prevented Claude from jumping ahead or adding things that would complicate the validation step.

**Use structured review phases.**
After the implementation was complete, I didn't just ship it. I ran a dedicated SRE review: "Act as a senior DevOps/SRE reviewer. Review the current codebase focusing on three areas only: Security, Resilience, Availability." The scope was explicit and narrow. This produced two real bugs (the `if (result)` falsy check and the unguarded `choices[0]` access) that I then fixed in a separate phase.

---

## Prompt Structure

Most prompts in this session follow the same pattern:

1. **Acknowledgment/context** — what was just validated or what phase we're in
2. **Behavior specification** — what the feature should do from the user's perspective
3. **Explicit exclusions** — what to leave out
4. **Gate** — "Do not commit yet. Wait for my validation before proceeding"

Example from Step 5:

> "This is the core UX of the product. When the AI returns a suggestion, the user should see exactly what would change before deciding to accept or reject it. The document should never change without explicit user approval.
> Do not commit yet. Wait for my validation before proceeding."

The behavior is stated as a user guarantee ("the document should never change without explicit user approval"), not a technical spec. The gate is explicit. Nothing about hooks, components, or state shape.

Validation messages embedded the next step. "validated, claude! diff view, Accept and Reject buttons all working correctly. Document only updates after explicit user approval. Commit and push. Proceeding to Step 6: add skill buttons to the ChatPanel." — the confirmation of the previous step and the instruction for the next were in the same message, with commit/push in between as a checkpoint.

Fix prompts were surgical. "the empty state message in the chat area is too subtle and easy to miss. Make it more inviting, increase the contrast, add a small hint about the skill buttons below, and make it feel like a call to action rather than a placeholder." — three specific directions, one target component, one behavior goal. No ambiguity about what "too subtle" meant.

---

## How Prompts Evolved

**Early steps were detailed.** Step 1 specified every library, the `.env` file contents, the folder structure, and the exact validation criteria: "Confirm .env is in .gitignore" and "Start the dev server and confirm it runs with no errors." This level of detail made sense at the scaffold stage where there was no shared context yet.

**Later steps became concise.** By Step 6, the skill buttons prompt was a short paragraph — "same code path as manual input" was enough to specify the implementation because a shared mental model had been established across previous steps.

**Refinement prompts stayed targeted.** When something was wrong ("the undo button is not appearing"), the fix prompt focused only on the visible symptom: where it should appear, when it should show, when it should disappear. No context about the whole codebase — just the observable problem.

**Phase boundaries were explicit.** Moving from implementation to review: "We have completed the implementation phase. Now entering the review phase. Act as a senior DevOps/SRE reviewer." The phase shift was stated directly rather than implied. This produced a different kind of output — a structured review with severity ratings — rather than continuation of the implementation.

The README interview followed the same logic. Rather than asking Claude to write a README, I asked it to interview me — one question at a time — and generate the document from my answers. This kept the architectural reasoning in my voice and ensured the decisions were stated as I actually made them, not as Claude inferred them from the code.

---

## Collaborative vs Executor

The most important decision in this session was treating Claude as a collaborator rather than a code generator.

The planning session happened before any code was written. I didn't ask Claude to scaffold a project — I asked for its best judgment on scope, architecture, trade-offs, and delivery order. The 8-step plan came out of that conversation. I then executed against it, one step at a time, using Claude to do the implementation.

The SRE review was deliberately independent. "Act as a senior DevOps/SRE reviewer. Be direct. Flag only real issues for this scope." Framing it as an independent review produced a more critical output than asking "are there any issues?" The reviewer found two bugs that I, as the developer, had missed.

The README interview inverted the dynamic entirely. I was the decision-maker being interviewed; Claude was the documenter. This produced a README written in my voice, grounded in decisions I actually made, rather than a generic project description. The reasoning for each architectural choice came from my answers, not from Claude reading the code and inferring intent.

The pattern across all three phases: I set the direction and made the decisions. Claude executed, reviewed, and documented. That division kept the judgment where it belongs — with the developer — while still using AI for everything it's genuinely good at.
