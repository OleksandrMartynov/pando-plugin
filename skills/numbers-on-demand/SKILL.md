---
name: numbers-on-demand
description: Use when the user asks for Pando's numbers — "how are we doing", sign-ups this week, questions and answers, records, the digest, delivery, costs, or a quick report for Janet. Produces a short, sourced summary from Pando MCP.
---

# Numbers on demand

1. Work out the period. "Yesterday" or "today" → `daily_activity` (yesterday beside the 7-day average,
   on Pasadena's clock). Otherwise default to the last 4 weeks (pass `weeks: 4`; the tools' own default is 12); for costs, from the first of this month
   to today.
2. Call only the tools the question needs (see the `pando-data` skill), in parallel when they are independent.
3. Answer in a few short lines, biggest change first: the number, what it is compared with, and one line on
   what stands out. Weeks are Monday–Sunday; say which.
4. When a tool says something is "not configured" (for example costs), say that plainly instead of a number.
5. No names or phones — the tools do not return them; never ask for them. Quote a parent's question only
   from `unanswered_questions`, and never try to work out who asked it.

Example: "Sign-ups: 7 in the last 4 weeks (5 in the week of Nov 9). Questions: 70 asked, 57 answered, 13
held for a person (11 sensitive). Records: 11 approved, all fresh. Costs: SMS not configured yet."
