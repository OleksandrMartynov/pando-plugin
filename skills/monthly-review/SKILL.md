---
name: monthly-review
description: Pando's monthly stop / continue / scale review — the month against the one before, what worked and what did not, with evidence from Pando's numbers rather than anecdotes, ending in decisions for Janet. Use when asked for "the monthly review", "how was the month", or on the first Monday of a month, after the weekly review (Cowork has no monthly schedule, so the weekly task runs it).
---

# Monthly review

Rules: [../../shared/safety.md](../../shared/safety.md). Context and definitions: [../../shared/pando-context.md](../../shared/pando-context.md).

What to stop, continue or scale next month, from Pando's numbers — "experiment evidence, never anecdotes
alone" (the founder's playbook). The last full calendar month (Pasadena) against the one before. Read tools
only; at most fifteen calls (a retry included), at most three at a time (a larger burst can time out); a
tool that fails or times out is retried once, then named and skipped.

## Calls (exactly these)

| # | Call | What to read |
| --- | --- | --- |
| 1 | `parents_totals` `{"weeks": 10}` | `joined_by_week`, summed into each month by the week's Monday |
| 2 | `questions_totals` `{"weeks": 10}` | `asked_by_week` (`asked`, `sent`, `held`, `helped_yes`, `helped_no`) per month |
| 3 | `impact_totals` `{"from": "<1st of last month>", "to": "<its last day>"}` | helped yes / no / awaiting / never asked, for last month's answers |
| 4 | `records_totals` `{}` | approved by freshness, waiting for review |
| 5 | `demand_by_place` `{}` | where Pando is wanted |
| 6 | `costs_summary` `{"from": "<1st of last month>", "to": "<its last day>"}` | `sms.total`, `ai.total_usd`, `useful_answers`, `cost_per_useful_answer` |
| 7 | `costs_summary` `{"from": "<1st of the month before>", "to": "<its last day>"}` | the same, to compare |
| 8 | `digest_weeks` `{}` | the month's Saturdays: groups, families, failed |
| 9 | `unanswered_questions` `{"days": 31, "limit": 50}` | topics, and the counts not quoted |
| 10 | `what_went_wrong` `{"days": 30}` | problems, and whether one repeated |
| 11 | `list_sources` `{"role": "source"}` | active sources, and how many failed, went or were not read this month |

## The review (strict template)

**Pando — {month}**

1. **The month in five numbers**, each beside the month before: sign-ups, questions, answers that helped,
   digest families, total cost.
2. **Cost per useful answer**, this month and the one before (shared definition).
3. **What worked** and **what did not**, one line each with the number that shows it.
4. **Biggest demand gaps** — up to five topics from the unanswered questions, with counts.
5. **Reliability** — how often something went wrong, and whether the same thing repeated; how many active
   sources there are and how many failed, went or were not read this month.
6. **Decisions.** For each candidate — a digest change, a kind of record to add, an outreach push, a cost
   to cut — **Stop**, **Continue** or **Scale**, with its evidence in one line and what it would cost. At
   most five. Too little evidence: "test first", and the test.

## Done when

Every decision has a number behind it, or says it needs a test first. Decisions are the founder's.
