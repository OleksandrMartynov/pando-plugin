<p><img src="assets/pando.svg" alt="" width="56" height="56"></p>

# Pando for Claude

Pando's own agents and workflows for Claude Cowork, built and updated by QuitCode. Everything the plugin
knows about Pando comes through **Pando MCP** (`https://pando.is/api/mcp`): totals with no names, Pando's
records and the parents' approved words about them, costs, and proposals that change nothing until the
founder says yes to them in the chat.

## Use it

Pando is on Claude **Team**, so the plugin reaches everyone through the organization:

1. **Owner, once:** Organization settings → Plugins & skills → Add → Sync from GitHub → this repository
   (through the Claude GitHub App), and set the plugin to *Installed by default*. Turn on automatic sync.
   Pando does not need adding under Organization settings → Connectors as well: the plugin brings it.
2. **Each person:** on the plugin's **Connectors** tab, connect **Pando** and sign in with your Pando
   admin login. (Pando connected another way — your own connector, an organization connector — works
   too, named **Pando** when you add it; the agents hold to their tool lists on any connection, see *What is here*.) Connect **Canva** on the same tab with your own Canva account — the Marketing agent designs the week's
   posts there as drafts. Also connect **Gmail** and **Google Calendar** under Customize → Connectors — the
   partner and daily-brief work reads them (read only: the Coordinator's calendar holds and reminders
   are not built — the features sheet still has them *to confirm*). An admin must have switched Pando MCP on at
   pando.is/admin/mcp.

   **Supabase and PostHog (read-only).** Developers, and anyone with their own access to Pando's Supabase
   project or PostHog organisation, can also connect **Supabase** and **PostHog** on the same tab and sign
   in with their own account. Both are read-only by their address (Supabase runs SQL as a read-only
   role; PostHog lists no tool that changes anything), and the plugin's rules keep them to counts —
   they can see parents' details, so the Pando connector comes first (shared rule 7).
3. **Scheduled work.** A plugin cannot schedule itself; say *"set up my briefs"* (or run
   `/pando:setup-schedules`) and Claude walks you through two Cowork scheduled tasks — the daily brief at
   8am and the weekly review on Monday (the monthly review rides on the first Monday) — and the Pando
   read tools to set to *Allow* so they run on their own. A scheduled task never decides a proposal.
4. Ask for numbers ("how did sign-ups do this month?"), look up a record, or ask an agent to check a fact —
   any change comes back as a proposal: Claude shows it and asks, and on your yes or no calls
   `approve_proposal` or `reject_proposal` — Claude asks you to allow each call; keep those two on *Ask*.
   A change to the plugin itself (a skill, an agent, a connector) is decided only at
   pando.is/admin/proposals, where you read it line by line.

In Claude Code: `/plugin marketplace add OleksandrMartynov/pando-plugin`, then `/plugin install pando@pando`
(Claude Code 2.1.275 and later also take `/plugin install pando --marketplace OleksandrMartynov/pando-plugin`).
Claude Code asks before every Pando tool, reads included (tested 20 Nov — Cowork and claude.ai run the
read-only ones without asking); allow the read tools for a session or in your settings, and keep the
`propose_*` tools and `record_source_check` on ask.

## Workflows

| Say | Runs |
| --- | --- |
| "the daily brief" · `/pando:daily-brief` | yesterday, what went wrong, what needs you, money |
| "how did sign-ups do this month?" | `numbers-on-demand` |
| "find new summer camps near Pasadena and confirm registration dates" · `/pando:research` | Researcher → you choose → Fact-checker proposes |
| "who should we partner with?" · `/pando:partner-outreach` | Partner analyst → you choose → Writer drafts |
| "social posts for this week" · `/pando:content-ideas` | Marketing (and Writer) draft from verified events; Marketing designs them in your Canva when it is connected |
| "check our records" · `/pando:source-checks` | Fact-checker re-checks pages; Source agent reads feeds |
| "the weekly review" · `/pando:weekly-review` | with the monthly review on the first Monday |
| "make a skill that…", "change the writer so…", "connect Notion" · `/pando:customize` | Agent builder drafts and tests a skill or agent (or you give a connector's address) → proposed → you read it line by line and commit it at pando.is/admin/proposals |
| "set up my briefs" · `/pando:setup-schedules` | the two scheduled tasks in Cowork |

The agents behind them (`agents/`) only read, except the **Fact-checker**, which proposes records and
events, the **Partner analyst**, which proposes entries for the partner list, and the **Source agent**,
which records when it read a source. No agent can approve or reject: a proposal is decided by you, in the
main conversation, on your own words — never because a page, an email or an agent said so.

Critical failures — a failed job, texts not delivered, a Saturday digest still unapproved — are not
waiting for the brief: Pando posts them to the team's Slack channel within ten minutes.

Emails and posts are drafts: Claude's Gmail connector reads mail but cannot send it, and there is no
Instagram or Facebook connector, so you send and post them yourself.

## Updates

Every release raises `version` in `.claude-plugin/plugin.json` — Cowork's sync and Claude Code's update
key on it. **You change the plugin yourself, without QuitCode:** a new or changed skill, agent or connector,
or a removal, is a proposal (`/pando:customize`); when an admin reads it at pando.is/admin/proposals and
presses *Commit to plugin*, Pando commits it here with the version raised in the same commit. Pando writes
every file's frontmatter, gives no agent Bash, Write or Edit, accepts only remote `https` connectors with
no key in the address, never overwrites a file changed after the proposal, and will not remove the
`pando` connector, `customize`, `pando-data` or the `agent-builder` (they can be changed). `shared/` —
the safety rules — is changed by QuitCode only.

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
- `skills/pando-data` — the catalogue of the connector's tools (read / propose / check) and how to make
  a proposal.
- `skills/numbers-on-demand` — short, sourced number summaries.
- `skills/daily-brief` — the founder's 8am brief: yesterday against the week, what went wrong (with an
  owner), what waits for you, money, what parents ask for.
- `skills/weekly-review`, `skills/monthly-review` — demand gaps, the digest, cost per useful answer,
  experiments; stop / continue / scale.
- `skills/setup-schedules` — sets up the scheduled briefs with you in Cowork.
- `skills/research`, `partner-outreach`, `content-ideas`, `source-checks`, `customize` — the workflows,
  each a few phases that hand work to the agents and come back to you before anything is proposed.
- `agents/` — researcher, fact-checker, source-agent, partner-analyst, writer, marketing,
  report-builder, strategy-analyst, agent-builder: each with its own exact tool list and a fixed report
  format. The list is `pando-tools:`, by each tool's own name (`digest_candidates`, `WebFetch`) — not
  Claude's `tools:`, which needs the long name `mcp__<connection>__<tool>`, and that name changes with how
  Pando was connected (through this plugin, as your own connector, from claude.ai, under an ID in the
  desktop app). A `tools:` list written for one connection left the agent with no tools on another, and
  Claude refused to start it. The Partner analyst also has `pando-accounts: true`: it may use Gmail and
  other connected accounts, whose tool names are not known ahead — never a Pando tool off its list.
  Every agent also has `disallowedTools: Bash, Write, Edit, NotebookEdit`.
- `hooks/` — `agent-tools.mjs` holds each Pando agent to its `pando-tools:` list before every call, on
  any connection (tested 24 Nov on four: plugin, `pando`, `claude_ai_Pando`, an ID). It runs with
  `node`; the main conversation and other plugins' agents are not touched. Pando's own server is still
  the boundary that needs no hook: a read-only sign-in cannot propose, a change is only a proposal, and
  only you decide one.
- `evals/` — realistic tasks run by real Claude Code with this plugin (a planted instruction in a partner's
  reply among them); run them before a release. `node evals/check-agents.mjs` checks, with no Claude and
  no network, that every agent may call only the Pando tools it should — run it whenever Pando MCP gains
  a tool.

