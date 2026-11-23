---
name: pando-data
description: Catalogue of the Pando connector's tools — which one answers which question about Pando's parents, questions, records, weekly digest, delivery and costs — and the rules for changing Pando, which only ever happens through a proposal an admin approves. Use when a task needs Pando's own data or a change to a Pando record.
---

# Pando's data

Read [../../shared/pando-context.md](../../shared/pando-context.md) and [../../shared/safety.md](../../shared/safety.md) first.

The Pando connector is the only way into Pando. If a tool answers "Pando MCP is switched off", an admin
switched it off at pando.is/admin/mcp: say so and stop. If the connector is missing, it is connected from
the plugin's **Connectors** tab with the Pando admin login.

## Catalogue

Kind: **read** — runs without changing anything; **propose** — creates a proposal that waits for an admin
on pando.is/admin/proposals; **check** — records when a source was read and how that went.

| Question | Tool | Kind |
| --- | --- | --- |
| How is Pando doing today; what waits for an admin | `pando_overview` | read |
| Yesterday against the 7 days before | `daily_activity` (`days` ≥ 8) | read |
| Parents: how many, per week, founding, digest on, opted out | `parents_totals` (`weeks`) | read |
| Questions: asked, answered, held, did it help — per week | `questions_totals` (`weeks`) | read |
| Did answers help, overall or between two days | `impact_totals` (`from`, `to`) | read |
| Records by kind, status, freshness | `records_totals` | read |
| Where Pando is wanted | `demand_by_place` | read |
| Texts delivered | `delivery_health` (`days`) | read |
| What went wrong | `what_went_wrong` (`days`) | read |
| The weekly digest | `digest_weeks` (`week` = a Saturday, or none for the list) | read |
| Events approved for the digest | `digest_candidates` | read |
| Find a record | `search_records` (query, kind, area, age_band, status — approved unless asked; source_check, not_checked_since) | read |
| One record, with what parents said | `get_record` (`id`) | read |
| Questions Pando could not answer | `unanswered_questions` (`days`) | read |
| What Pando spent, useful answers, cost per useful answer | `costs_summary` (`from`, `to`: YYYY-MM-DD) | read |
| Sources & partners Pando reads and works with | `list_sources` (role, kind, status) | read |
| Proposals and decisions | `list_proposals` (`status`) | read |
| Change a record | `propose_record_edit` | propose |
| Add a record | `propose_new_record` | propose |
| Report a fact check | `propose_fact_check` | propose |
| Add an event to the digest | `propose_event` | propose |
| Add or change a source or partner | `propose_source` | propose |
| Record that a source was read | `record_source_check` (`ok`, `failed`, `changed`, `gone`) | check |
| The plugin itself: its skills, agents, connectors | `read_plugin` (`target`, `name` for one file) | read |
| Add, change or remove a skill, agent or connector of the plugin | `propose_plugin_change` — use the `customize` workflow | propose |

Lists answer `{ results, has_more, narrow }`: when `has_more` is true, `narrow` says how to ask for less.
For a short summary of numbers, use the `numbers-on-demand` skill.

## Changing Pando

How to make each kind of proposal: [references/proposals.md](references/proposals.md).

A proposal changes nothing until an admin decides it on pando.is/admin/proposals — the only place
proposals are decided (shared rule 3). Tell the user what you proposed, that it waits, and give the link.
A record's `trust_labels` are the only words for where it came from (shared rule 6).
