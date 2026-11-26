---
name: pando-data
description: Catalogue of the Pando connector's tools — which one answers which question about Pando's parents, questions, records, weekly digest, delivery and costs — the read-only Supabase and PostHog connectors for what Pando's own tools cannot answer, and the rules for changing Pando, which only ever happens through a proposal an admin approves. Use when a task needs Pando's own data or a change to a Pando record.
---

# Pando's data

Read [../../shared/pando-context.md](../../shared/pando-context.md) and [../../shared/safety.md](../../shared/safety.md) first.

The Pando connector is the way into Pando. If a tool answers "Pando MCP is switched off", an admin
switched it off at pando.is/admin/mcp: say so and stop. If the connector is missing, it is connected from
the plugin's **Connectors** tab with the Pando admin login. For what it cannot answer, two read-only
connectors reach Pando's raw data — see [Supabase and PostHog](#supabase-and-posthog-read-only) below.

## Catalogue

Kind: **read** — runs without changing anything; **propose** — creates a proposal that waits for the
founder's yes in the conversation; **check** — records when a source was read and how that went. Two
more tools decide a waiting proposal — used only as shared rule 3 says, never as a step of a workflow.

| Question | Tool | Kind |
| --- | --- | --- |
| How is Pando doing today; what waits for an admin | `pando_overview` | read |
| Yesterday against the 7 days before | `daily_activity` (`days` ≥ 8) | read |
| Parents: how many, per week, founding, digest on, opted out, sign-ups by channel | `parents_totals` (`weeks`) | read |
| Questions: asked, answered, held, did it help — per week | `questions_totals` (`weeks`) | read |
| Did answers help, overall or between two days | `impact_totals` (`from`, `to`) | read |
| Records by kind, status, freshness | `records_totals` | read |
| Where Pando is wanted | `demand_by_place` | read |
| Texts delivered | `delivery_health` (`days`) | read |
| What went wrong | `what_went_wrong` (`days`) | read |
| The weekly digest | `digest_weeks` (`week` = a Saturday, or none for the list) | read |
| Events approved for the digest | `digest_candidates` | read |
| Take an event out of the digest — only on the person's word about that event | shared rule 3 | decide |
| Find a record | `search_records` (query, kind, area, age_band, status — approved unless asked; source_check, not_checked_since) | read |
| One record, with what parents said | `get_record` (`id`) | read |
| Questions Pando could not answer | `unanswered_questions` (`days`) | read |
| What Pando spent, useful answers, cost per useful answer, each monthly budget beside its spend | `costs_summary` (`from`, `to`: YYYY-MM-DD) | read |
| Set or change the monthly SMS or AI budget — only the figure the person says here | shared rule 3 (the half not named stays) | decide |
| How hard Pando leans on contributors: requests, replies, PASSes, who cannot be asked today and why, opt-outs after a request | `contributor_load` (`days`: 1 for a day, 7 for a week) | read |
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

## Supabase and PostHog (read-only)

Two more connectors in this plugin, each signed in with the person's **own** Supabase or PostHog account
(only someone with access to Pando's project can use them). Both are **read-only by their address**:
Supabase runs SQL as a read-only Postgres role, and PostHog lists no tool that creates, changes or deletes.
Nothing can be written through them, and their address is locked against proposals.

| Question | Connector | How |
| --- | --- | --- |
| A count or breakdown the Pando tools do not give (e.g. records by subcategory and area, answers by hold reason per week) | `supabase` | `list_tables` to see the schema, then `execute_sql` with a `select count(*) … group by …` |
| What changed in the schema, which migrations ran | `supabase` | `list_migrations`, `list_tables` |
| Errors and slow queries in the database | `supabase` | `get_logs`, `get_advisors` |
| Product usage, funnels, sign-up and SMS events over time | `posthog` | insights, trends and SQL (HogQL) queries |
| AI cost and latency by model or step, failed model calls | `posthog` | LLM analytics — totals only, see the rule below |
| Errors in the app | `posthog` | error tracking |

Rules — [shared rule 7](../../shared/safety.md): the Pando connector first; counts and aggregates only;
never select or show a name, phone, email, address or a parent's words (no `select *` on `people`,
`answers`, `message_log`, `share_contributions` or caregiver tables; no trace's input or output text);
always exclude test rows (`not is_test`). A query that would need personal columns is not run: say what
the person would need to look up in the Pando admin instead.

## Changing Pando

How to make each kind of proposal: [references/proposals.md](references/proposals.md).

A proposal changes nothing until the founder says yes to it here in the conversation (shared rule 3);
a change to the plugin itself only at pando.is/admin/proposals. Tell the user what you proposed and ask.
A record's `trust_labels` are the only words for where it came from (shared rule 6).
