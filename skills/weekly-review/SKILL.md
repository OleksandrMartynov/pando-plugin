---
name: weekly-review
description: Writes Pando's weekly review for the founder — last week's sign-ups and questions against the seven before, the topics Pando could not answer, how the Saturday digest did, cost per useful answer, and up to three experiments to decide — and on the first Monday of a month adds the monthly review. Use for "the weekly review", "how was the week", or when a scheduled task runs /pando:weekly-review.
---

# Weekly review

Rules: [../../shared/safety.md](../../shared/safety.md). Context and definitions (cost per useful answer,
what is not tracked): [../../shared/pando-context.md](../../shared/pando-context.md).

One page on last week (Monday–Sunday, Pasadena) that ends in decisions. Read tools only; at most fifteen
calls (a retry included), at most three at a time (a larger burst can time out); a tool that fails or times out is retried once, then named and skipped.

## Steps

Call these with exactly these arguments:

| # | Call | What to read from it |
| --- | --- | --- |
| 1 | `parents_totals` `{"weeks": 9}` | `joined_by_week` (sign-ups); totals `phone_verified`, `contributors`, `digest_on`, `opted_out` |
| 2 | `questions_totals` `{"weeks": 9}` | `asked_by_week` — per week `asked`, `sent` (answered), `held`, `helped_yes`, `helped_no`; `held_by_reason` and `answered_from_public_only` are all-time totals, say so; `seed_tool_questions_by_category` |
| 3 | `impact_totals` `{"from": "<last Monday>", "to": "<last Sunday>"}` | `answered_yes`, `answered_no`, `awaiting`, `unasked` (never asked "did it help"), `sent` — last week's answers |
| 4 | `unanswered_questions` `{"days": 7, "limit": 30}` and `demand_by_place` `{}` | the questions' topics; where people and questions are |
| 5 | `digest_weeks` `{"week": "<last Saturday, YYYY-MM-DD>"}` | `totals` only: `groups`, `families_texted`, `items`, `item_sends`, `reminders_waiting`, `reminders_sent`, `loved`, `ok`, `didnt_go`; and any group whose `status` is not ready |
| 6 | `costs_summary` `{"from": "<last Monday>", "to": "<last Sunday>"}` | `sms.total`, `ai.total_usd`, `useful_answers`, `cost_per_useful_answer` |
| 7 | `records_totals` `{}` | `approved_by_freshness` (a missing key is 0), records waiting for review |
| 8 | `delivery_health` `{"days": 7}` and `what_went_wrong` `{"days": 7}` | a `null` rate means "no delivery reports yet" |
| 9 | `pando_overview` `{}` | `drop_off`: the sign-up steps |
| 10 | `list_sources` `{"role": "source"}` and `list_sources` `{"role": "partner"}` | every active source's `last_check` and `last_checked_at`; how many partners, and which were `added_at` last week |
| 11 | `contributor_load` `{"days": 7}` | requests by kind, contributors asked, replies, `reply_rate`, `passes`, `resting_now`, `ceiling_lowered_by_governor`, `opted_out_after_a_request` |

Rules:
- **The weeks.** The weekly lists end with the current week, which is not over: leave it out. "Last week"
  is the one before it, and its baseline is the average of the seven weeks before that.
- **The drop-off.** The step with the biggest fall from the step before; a step that shows 0 at the
  start ("Opened the link") is not tracked — skip it.
- Phones verified and contributors have totals only: give the totals, not a week.
- `what_went_wrong` counts the connector's own problems in its window; ignore `relay` in `delivery_health`.
- If `unanswered_questions` is empty, the demand gaps come from `seed_tool_questions_by_category` and
  `demand_by_place`, and say so.

## The review (strict template)

**Pando — week of {Monday date}**

1. **Growth.** Sign-ups, phones verified, contributors: last week, the 7-week average, the trend in one line.
   The sign-up step where most people stopped.
2. **Questions and answers.** Asked, answered, held for a person, answered from public information only;
   "did it help" yes/no. One line on what changed.
3. **Demand gaps.** Group the unanswered questions into at most five topics (a topic, never a parent), each
   with a count and the area if `demand_by_place` shows one. For each, one line: what kind of source or
   partner would answer it. This is the playbook's demand loop. At most five lines.
4. **The digest.** From `totals`: families texted, items and how many times they went out, reminders sent,
   "loved" / ok / didn't go; groups that failed or waited for approval. Test editions are not in
   `digest_weeks`.
5. **Unit economics.** SMS + AI cost for the week and the **cost per useful answer** (definition in the
   shared context). A half "not configured" is said so.
6. **Records.** Approved records that went stale; records waiting for review.
7. **What went wrong this week.** Problems by severity, each with its owner (QuitCode for technical,
   Janet for content and approvals) and whether it is fixed.
8. **Sources and partners.** Every active source accounted for: how many read last week and how each went
   (ok, changed, failed, gone), and **missed** — not read at all last week, which counts as a failure.
   Name each that failed, went or was missed, with its next step (the Source checks workflow, or pausing
   it — the founder decides). Then how many partners are on the list and which were added last week.
   **Contributors:** requests last week by kind, how many were asked, the reply rate, PASSes, and who is
   resting now and why — a rising number at their ceiling or lowered by the governor is fatigue: say so.
   Signed partnerships, attribution,
   cohort retention and cash are not in Pando yet: say so.
9. **Not tracked yet.** The list in the shared context, said plainly.
10. **Experiments to decide.** At most three small, cheap experiments for next week, each tied to a number
   above: what to try, what would count as success, what it costs. Then, when the numbers say so, one
   thing to stop — the playbook's roadmap challenge. Janet decides; nothing starts here.

## On the first Monday of a month

Cowork schedules daily or weekly, not monthly. So when this review runs on the first Monday of a month
(the date is 1–7), finish it, then follow the `monthly-review` skill for the month that just ended and
put it below, under its own heading.

## Done when

Every section has numbers from the tools or says why not, and the review ends with at most three decisions.
