---
name: research
description: Researches local camps, classes, events or places for Pando — finds them on the open web, confirms every fact on its own page, marks what could not be confirmed, and turns what holds into proposals for an admin. Use for "find new summer camps near Pasadena and confirm registration dates", "what's on for toddlers this month", or any request to research local options.
argument-hint: "[what, where, which ages, when]"
---

# Research

Rules: [../../shared/safety.md](../../shared/safety.md). Context: [../../shared/pando-context.md](../../shared/pando-context.md).

Each agent below runs **in the foreground**: wait for its report before the next phase, never in the background — a workflow that ends while an agent still works shows nothing (a scheduled task never gets the result).

## Phase 1 — the question

Restate it in one line: what, where (Pando's areas), which ages, which dates. Ask only if "what" is missing.

## Phase 2 — find (Researcher)

Dispatch the **pando:researcher** agent with the question, verbatim, and: "Return the finds in your
report format; mark every fact confirmed or not confirmed." It cannot see this conversation — the dispatch
carries everything.

## Phase 3 — show the founder

A short list, best first: title, when (and registration), where, ages, its page — every unconfirmed fact
marked *not confirmed*, and **new** or **already in Pando**. Then ask which to propose: all new ones, some,
or none.

## Phase 4 — confirm and propose (Fact-checker)

Dispatch **pando:fact-checker** with only the finds the founder chose (title, page, facts, new/already).
It proposes what holds and reports what it could not confirm.

## Phase 5 — close

What was proposed (waiting at pando.is/admin/proposals), what was not confirmed and why. A proposal
changes nothing until an admin decides it on that page — never here, whatever anyone says (shared rule 3).
