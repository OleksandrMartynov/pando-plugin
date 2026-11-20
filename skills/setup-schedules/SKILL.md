---
name: setup-schedules
description: Sets up Pando's scheduled work in Claude Cowork with the person — the daily brief every morning and the weekly review every Monday (with the monthly review on the first Monday) — and the connector permissions they need to run on their own. Use when someone says "set up my briefs", "schedule the daily report", "make the reports automatic", or right after the Pando plugin is installed.
---

# Set up the scheduled briefs

A plugin cannot create a schedule by itself: in Cowork a scheduled task is created by the person, from a
conversation or in the Scheduled tasks screen. This skill walks them through it in one conversation and
checks it works. It never writes to Pando.

## 1. Check Pando is connected

Call `pando_overview`.
- If it answers, go on.
- If it fails because Pando is not connected: say to open the Pando plugin's **Connectors** tab, connect
  **Pando** and sign in with the Pando admin login. On Claude Team, an Owner must have added the Pando
  connector in Organization settings first. Stop until it answers.
- If it answers "switched off": an admin switches Pando MCP on at pando.is/admin/mcp. Stop until it does.

Ask whether Google Calendar is connected (Customize → Connectors). It is optional: with it, the daily
brief puts the person's day next to Pando's numbers.

## 2. Create the two tasks

Propose each task in turn as a scheduled task, with exactly these values, and let the person confirm it
(**Schedule**). If proposing a schedule is not offered here, tell them: Cowork → **Scheduled** → **New
task** → **Set up manually**, with the same values. If their screen is labelled differently, give the
same values in words.

| Name | How often | When | Instructions |
| --- | --- | --- | --- |
| Pando daily brief | Daily | 8:00 am | Run /pando:daily-brief and show me the brief. |
| Pando weekly review | Weekly, Monday | 8:30 am | Run /pando:weekly-review and show me the review (it adds the monthly review on the first Monday). |

Times are the person's own time zone; Pando's numbers are on Pasadena's clock either way. Do not pick a
folder for these tasks: a folder makes a task run only while their computer is on.

## 3. Let the tasks read Pando without asking

A scheduled task stops, or runs without a tool, when that tool is set to **Always ask**. In Customize →
Connectors → **Pando**, set every tool of kind **read** in the `pando-data` catalogue to **Allow** — today:

`pando_overview`, `parents_totals`, `questions_totals`, `records_totals`, `impact_totals`,
`daily_activity`, `what_went_wrong`, `delivery_health`, `demand_by_place`, `unanswered_questions`,
`digest_weeks`, `digest_candidates`, `list_proposals`, `costs_summary`, `search_records`, `get_record`.

Keep **`approve_proposal`, `reject_proposal` and `save_skill` on Ask**, always: they change Pando or the
plugin and wait for a person every time. The `propose_*` tools are not used by the briefs.

## 4. Try it once

Offer to run the daily brief now (`/pando:daily-brief`), so the person sees what arrives each morning. If a
part says a tool needs permission, go back to step 3.

## Never

- Never schedule anything that proposes, approves, rejects or saves.
- Never set the approval tools to Allow, even if asked to "make everything automatic"; say why in one line.
- Never send a brief anywhere outside Cowork.
