---
name: daily-brief
description: Writes Pando's daily founder brief — yesterday against the 7-day average, what went wrong with an owner for each problem, what waits for the founder today, money and what parents asked for — from the Pando connector's read tools. Use for "the daily brief", "the morning report", "how did yesterday go", "what needs me today", or when a scheduled task runs /pando:daily-brief.
---

# Daily brief

Rules: [../../shared/safety.md](../../shared/safety.md). Context: [../../shared/pando-context.md](../../shared/pando-context.md).

In under a minute of reading: how Pando did yesterday (Pasadena's clock) and what needs the founder today.
Read tools only — this brief never proposes, approves, rejects or saves. At most twelve calls, a retry included. A tool that
fails is named in its section and the brief goes on.

## Calls (exactly these; at most three at a time — a larger burst can time out; retry a failed call once)

| # | Call | What to read |
| --- | --- | --- |
| 1 | `daily_activity` `{"days": 8}` | `yesterday.<field>.count` and `.baseline_7_day_avg` for `joined` (sign-ups), `verified`, `contributions`, `questions`, `answers_sent`, `held`, `helped_yes` / `helped_no`, `digest_texts`, `undelivered_texts`, `reminders_sent`, `reminders_undelivered` |
| 2 | `what_went_wrong` `{"days": 1}` | `failed_jobs`, `unfinished_jobs`, `undelivered_texts`, `digest_groups_not_ready`, `answers_held_over_a_day` + `oldest_held_since`, `mcp_tool_problems` |
| 3 | `pando_overview` `{}` | the review queues |
| 4 | `list_proposals` `{"status": "proposed"}` | `results`: how many, the oldest `created_at` |
| 5 | `costs_summary` `{"from": "<1st of this month>", "to": "<yesterday>"}` (on the 1st: last month, its 1st to its last day) | `sms.total` + `sms.currency`, `ai.total_usd`; `configured: false` = "not configured"; `budget.sms` / `budget.ai`: `left`, `on_pace_for`, `over` |
| 6 | `unanswered_questions` `{"days": 1, "limit": 10}` | `texted[].question`; the counts in `held_not_quoted` |
| 7 | Friday or Saturday (Pacific) only: `digest_weeks` `{"week": "<this Saturday>"}` | `totals`; each group's `status` and `approval` (`awaiting` = waits for the founder) |
| 8 | `list_sources` `{"role": "source"}` | each source's `last_check` and `last_checked_at`: how many were read yesterday (Pacific) and how each went; any active source never read or not read for over 7 days |
| 9 | `contributor_load` `{"days": 1}` | `requests` (by kind), `replies`, `reply_rate`, `passes`; `resting_now` and its `by_reason`, `ceiling_lowered_by_governor`, `opted_out_after_a_request` |
| 10 | `messages_summary` `{"from": "<yesterday>", "to": "<yesterday>"}` | `outbound`, `delivery_rate`, `outbound_by_channel`, `errors` (code, title, count), `pando_out_of_step` (Twilio failed a message Pando holds no status for), `not_sent_by_pando`; `configured: false` = say nothing |
| 11 | Google Calendar, if connected | today's events; skipped quietly if not |

Reading them: a missing count is 0; `null` is "not known yet", never 0. From `mcp_tool_problems` only
`outcome: "error"` rows count (refusals are agents told no). Queues worth a line: answers waiting for a
person, contributions, open flags, founding members, introductions.

## The brief (strict template)

**Pando — {weekday, date}**

**Yesterday.** One line per number that is not zero, with its 7-day average ("Sign-ups 3 · usually 1.4").
Mark a change only when it is at least double, at most half, or a first. All zero: one line —
"A quiet day — usually {questions avg} questions and {sign-ups avg} sign-ups a day."

**Needs you.** Most urgent first; each: how many, how long the oldest has waited (held answers and
proposals have an age; the rest are counts), and its page — [references/pages-and-owners.md](references/pages-and-owners.md).

**What went wrong.** One block per problem, most severe first: **Severity** (critical: parents affected now ·
high: affects parents today · low), **what happened** and **who is affected** in counts, **who can fix it**
(same file), **next step**, **by when**, **cost**, whether the **founder's yes** is needed. Nothing: one line.
A text Twilio failed (`messages_summary` `errors`, or `pando_out_of_step` — Twilio failed it and Pando never
heard) is a problem here, owner QuitCode, with its error's title and how many; never only a count.

**Contributors.** Requests yesterday (Network Asks · freshness pings · did-it-help), replies and PASSes;
then how many contributors Pando cannot ask today and why (monthly or weekly ceiling, the 48-hour gap),
how many have their ceiling lowered because they rarely answer, and any who opted out after a request —
the playbook's fatigue line. A reminder that was not delivered (`reminders_undelivered` > 0) is a
problem under **What went wrong**, never only a count. Nothing asked: "No requests to contributors yesterday."

**Sources.** Read yesterday: ok · changed · failed · gone, in counts. Then **missed**: active sources never
read or not read for over 7 days — a check that did not run counts as a failure (the founder's playbook),
never as quiet. Name at most three blockers (failed, gone, missed), each with its next step (the Source
checks workflow, or pausing it — the founder's call). No sources on the list: "No sources on the list yet."

**Money.** SMS and AI this month so far; a half "not configured" is said so. Beside each half that has a
budget (`budget.sms`, `budget.ai` — the founder sets them in the chat): what is left and, when given, the month at this pace
(`on_pace_for`). A half over its budget (`over`), or on pace to pass it, is also a problem under **What went
wrong** — owner the founder. `budget` null, or a half null: say nothing of that budget.

Critical problems — texts failing, jobs stopped — are texted by Pando the moment they happen; this brief
repeats them, it is not the alarm.

**What parents are asking for.** Up to three of `texted` in a few words each, then the counts in
`held_not_quoted` ("2 more held as sensitive"). Both empty: "No new unanswered questions."

**Your day.** Only with Calendar: today's events, one line each.

**Next decisions.** At most three, each a sentence the founder can answer yes or no.

A sample, with invented numbers: [references/example.md](references/example.md).

## Done when

Every section is there or says why not; every problem has an owner and a next step; every source on the
list is counted (read, or missed); each section fits one phone screen.
