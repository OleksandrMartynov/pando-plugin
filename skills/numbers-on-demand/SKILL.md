---
name: numbers-on-demand
description: Answers a question about Pando's numbers — sign-ups, questions and answers, records, the digest, delivery, costs — in a few sourced lines, biggest change first. Use when someone asks "how are we doing", "how many joined this week", "what did we spend", or wants a quick number for the founder.
argument-hint: "[question or period]"
---

# Numbers on demand

Rules: [../../shared/safety.md](../../shared/safety.md). Context and definitions: [../../shared/pando-context.md](../../shared/pando-context.md).

1. **Period.** "Yesterday" or "today" → `daily_activity` (`days: 8`). Otherwise the last 4 weeks
   (`weeks: 4` — the tools' own default is 12). Costs: the 1st of this month to today.
2. **Calls.** Only the tools the question needs (catalogue in the `pando-data` skill), independent ones
   together. At most five calls.
3. **Answer.** A few short lines, biggest change first: the number, what it is compared with, one line on
   what stands out. Say which weeks (Monday–Sunday).
4. **Gaps.** "Not configured" or a null is said as such, never as a number.

Sample, invented numbers — the shape, not data:

> Sign-ups: 9 in the last 4 weeks, 4 of them in the week of Nov 9 (the busiest so far). Questions: 52
> asked, 44 answered, 8 held for a person. Costs this month: SMS not configured yet.
