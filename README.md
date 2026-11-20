# Pando plugin for Claude

Pando's own agents and workflows for Claude Cowork, built and updated by QuitCode. Everything the plugin
knows about Pando comes through **Pando MCP** (`https://pando.is/api/mcp`): totals with no names, Pando's
records and the parents' approved words about them, costs, and proposals that change nothing until an admin
approves them.

## Use it

Pando is on Claude **Team**, so the plugin reaches everyone through the organization:

1. **Owner, once:** Organization settings → Connectors → add **Pando** with exactly the URL in this
   plugin's `.mcp.json` (`https://pando.is/api/mcp`), so Claude shows one Pando, not two.
   Then Organization settings → Plugins & skills → Add → Sync from GitHub → this repository (through the
   Claude GitHub App), and set the plugin to *Installed by default*. Turn on automatic sync.
2. **Each person:** on the plugin's **Connectors** tab, connect **Pando** and sign in with your Pando
   admin login. Also connect **Gmail** and **Google Calendar** under Customize → Connectors — the
   partner and daily-brief work reads them. An admin must have switched Pando MCP on at
   pando.is/admin/mcp.
3. **Scheduled work.** A plugin cannot schedule itself; say *"set up my briefs"* (or run
   `/pando:setup-schedules`) and Claude walks you through two Cowork scheduled tasks — the daily brief at
   8am and the weekly review on Monday (the monthly review rides on the first Monday) — and the Pando
   read tools to set to *Allow* so they run on their own. Approving proposals and saving skills always
   waits for you.
4. Ask for numbers ("how did sign-ups do this month?"), look up a record, or ask an agent to check a fact —
   any change comes back as a proposal for you to approve here in chat or at pando.is/admin/proposals.

In Claude Code: `/plugin marketplace add OleksandrMartynov/pando-plugin`, then `/plugin install pando@pando`
(Claude Code 2.1.275 and later also take `/plugin install pando --marketplace OleksandrMartynov/pando-plugin`).
Claude Code asks before every Pando tool, reads included (tested 20 Nov — Cowork and claude.ai run the
read-only ones without asking); allow the read tools for a session or in your settings, and keep
`approve_proposal`, `reject_proposal` and `save_skill` on ask.

## Workflows

| Say | Runs |
| --- | --- |
| "the daily brief" · `/pando:daily-brief` | yesterday, what went wrong, what needs you, money |
| "how did sign-ups do this month?" | `numbers-on-demand` |
| "find new summer camps near Pasadena and confirm registration dates" · `/pando:research` | Researcher → you choose → Fact-checker proposes |
| "who should we partner with?" · `/pando:partner-outreach` | Partner analyst → you choose → Writer drafts |
| "social posts for this week" · `/pando:content-ideas` | Marketing (and Writer) draft from verified events |
| "check our records" · `/pando:source-checks` | Fact-checker re-checks pages; Source agent reads feeds |
| "the weekly review" · `/pando:weekly-review` | with the monthly review on the first Monday |
| "make a skill that…" · `/pando:new-skill` | Agent builder drafts and tests → you say save |
| "set up my briefs" · `/pando:setup-schedules` | the two scheduled tasks in Cowork |

The agents behind them (`agents/`) only read, except the **Fact-checker**, which proposes. None can approve,
reject or save: that happens only in your conversation, after your yes.

Critical failures — a failed job, texts not delivered, a Saturday digest still unapproved — are not
waiting for the brief: Pando posts them to the team's Slack channel within ten minutes.

Emails and posts are drafts: Claude's Gmail connector reads mail but cannot send it, and there is no
Instagram or Facebook connector, so you send and post them yourself.

## Updates

Every release raises `version` in `.claude-plugin/plugin.json` — Cowork's sync and Claude Code's update
key on it. Skills the Agent builder saves (`save_skill` in Pando MCP) are committed here by Pando with the
version raised in the same commit; a skill QuitCode maintains is never overwritten by it.

## Data

The plugin stores nothing itself. Claude sends tool calls to pando.is with your sign-in; Pando answers with
counts and record facts, never a parent's name or phone. A parent's words come back in two places only:
the approved texts about a record, and the questions Pando could not answer yet — never who wrote or
asked them, phone numbers and emails masked, and a sensitive or caregiver question only counted.
Every call is logged by Pando, and
one switch in the Pando admin turns the connector off.

## What is here

- `.mcp.json` — the Pando MCP connector.
- `shared/` — the Pando context (founder, area, clock, definitions) and the safety rules every skill and
  agent reads, one copy each.
- `skills/pando-data` — the catalogue of the connector's tools (read / propose / approve) and how to make
  a proposal.
- `skills/numbers-on-demand` — short, sourced number summaries.
- `skills/daily-brief` — the founder's 8am brief: yesterday against the week, what went wrong (with an
  owner), what waits for you, money, what parents ask for.
- `skills/weekly-review`, `skills/monthly-review` — demand gaps, the digest, cost per useful answer,
  experiments; stop / continue / scale.
- `skills/setup-schedules` — sets up the scheduled briefs with you in Cowork.
- `skills/research`, `partner-outreach`, `content-ideas`, `source-checks`, `new-skill` — the workflows,
  each a few phases that hand work to the agents and come back to you before anything is proposed or saved.
- `agents/` — researcher, fact-checker, source-agent, partner-analyst, writer, marketing,
  report-builder, strategy-analyst, agent-builder: each with its own tool list (`tools:` allows,
  `disallowedTools:` forbids) and a fixed report format.
- `evals/` — realistic tasks run by real Claude Code with this plugin; run them before a release.

The nine agents on the architecture diagram (Source agent, Researcher, Partner analyst, Fact-checker,
Marketing, Writer, Report builder, Strategy analyst, Agent builder) and the workflows come next.
