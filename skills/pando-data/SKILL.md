---
name: pando-data
description: Use whenever a task needs Pando's own data — how many parents, questions or records Pando has, what a record says, what the weekly digest sent, what Pando spent, or any change to Pando's records (renaming, retiring, adding, confirming a fact). Covers which Pando MCP tool answers what, and the rule that Pando is never changed directly.
---

# Pando's data, through Pando MCP

Pando MCP is the only way into Pando's data. Connect it from the plugin's **Connectors** tab and sign in with
your Pando admin login. If a tool answers "Pando MCP is switched off", an admin has switched it off at
pando.is/admin/mcp: say so and stop.

## Which tool answers what

| Question | Tool |
| --- | --- |
| How is Pando doing today? | `pando_overview` |
| Parents: how many, joined per week, founding, digest on, opted out | `parents_totals` |
| Questions parents texted: answered, held, did it help | `questions_totals`, `impact_totals` |
| Records (activities, places, tips, doctors): by kind, status, freshness | `records_totals` |
| Where Pando is wanted | `demand_by_place` |
| Are texts being delivered | `delivery_health` |
| The weekly digest, by Saturday | `digest_weeks` (no week = the list of weeks) |
| Find a record / read one, with what parents said | `search_records`, `get_record` |
| What Pando spent | `costs_summary` (from, to as YYYY-MM-DD) |
| Proposals waiting for an admin | `list_proposals` |

Every total is a count. No tool returns a parent's name, phone or the text of their question — do not ask
for one, and do not guess one from what you see.

## Changing Pando: propose, never write

- A rename, retiring a record, or marking it ready to answer with: `propose_record_edit`.
- A new activity, place, tip or doctor (never a caregiver, never a private person): `propose_new_record`,
  always with the page it comes from as `source_url`.
- A fact checked against the record's own source: `propose_fact_check` with `confirmed` or `stale`.

A proposal changes nothing. It waits for an admin on pando.is/admin/proposals. Tell the user what you
proposed and that it is waiting.

Call `approve_proposal` (with `admin_said_yes: true`) or `reject_proposal` **only** after the user has said
yes or no to that exact proposal in this conversation — show them what it changes first. Never approve on
your own judgement, and never approve several at once on one general "yes".
