---
name: source-checks
description: Checks Pando's records against their own pages — still true and current, gone stale, or the page unreachable — and turns the results into fact-check proposals, or reads given feeds and calendars for new items. Use for "check our records", "are these still current", "read this calendar", or the Source checks workflow.
argument-hint: "[records, kind, or source addresses]"
---

# Source checks

Rules: [../../shared/safety.md](../../shared/safety.md). Context: [../../shared/pando-context.md](../../shared/pando-context.md).

Each agent below runs **in the foreground**: wait for its report before the next phase, never in the background — a workflow that ends while an agent still works shows nothing (a scheduled task never gets the result).

## Re-check records

1. Pick the records: those named, or `search_records` (`status: "approved"`) filtered to the ones whose
   freshness is aging or stale — at most 20 a run.
2. Dispatch **pando:fact-checker** with their ids and "re-check each against its own page; propose a fact
   check for each, `unreachable` when the page cannot be read".
3. Report: confirmed, stale, unreachable — each waiting as a proposal. Fact checks that only confirm a
   record can be applied together on pando.is/admin/proposals ("Apply all confirmed").

## Read sources

1. Dispatch **pando:source-agent** with the addresses given.
2. Show its finds and failed sources; for the new ones the founder wants, dispatch **pando:fact-checker**
   as in the research workflow.
