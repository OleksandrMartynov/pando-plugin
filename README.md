# Pando plugin for Claude

Pando's own agents and workflows for Claude Cowork, built and updated by QuitCode. Everything the plugin
knows about Pando comes through **Pando MCP** (`https://pando.is/api/mcp`): totals with no names, Pando's
records and the parents' approved words about them, costs, and proposals that change nothing until an admin
approves them.

## Use it

Pando is on Claude **Team**, so the plugin reaches everyone through the organization:

1. **Owner, once:** Organization settings → Connectors → add **Pando** (`https://pando.is/api/mcp`).
   Then Organization settings → Plugins & skills → Add → Sync from GitHub → this repository (through the
   Claude GitHub App), and set the plugin to *Installed by default*. Turn on automatic sync.
2. **Each person:** on the plugin's **Connectors** tab, connect **Pando** and sign in with your Pando
   admin login. Also connect **Gmail** and **Google Calendar** under Customize → Connectors — the
   partner and daily-brief work reads them. An admin must have switched Pando MCP on at
   pando.is/admin/mcp.
3. **Scheduled work** (the 8am daily brief, the weekly review) is a scheduled task you create in Cowork
   that runs the plugin's skill; set the Pando read tools to *allow* so it can run unattended. Approving
   proposals and saving skills always waits for you.
4. Ask for numbers ("how did sign-ups do this month?"), look up a record, or ask an agent to check a fact —
   any change comes back as a proposal for you to approve here in chat or at pando.is/admin/proposals.

In Claude Code: `/plugin install pando --marketplace OleksandrMartynov/pando-plugin`.

Emails and posts are drafts: Claude's Gmail connector reads mail but cannot send it, and there is no
Instagram or Facebook connector, so you send and post them yourself.

## Updates

Every release raises `version` in `.claude-plugin/plugin.json` — Cowork's sync and Claude Code's update
key on it. Skills the Agent builder saves (`save_skill` in Pando MCP) are committed here by Pando with the
version raised in the same commit; a skill QuitCode maintains is never overwritten by it.

## Data

The plugin stores nothing itself. Claude sends tool calls to pando.is with your sign-in; Pando answers with
counts and record facts, never a parent's name or phone. The one place a parent's words come back is the
questions Pando could not answer yet — the question only, phone numbers and emails masked, never who asked.
Every call is logged by Pando, and
one switch in the Pando admin turns the connector off.

## What is here

- `.mcp.json` — the Pando MCP connector.
- `skills/pando-data` — which tool answers what; propose, never write.
- `skills/numbers-on-demand` — short, sourced number summaries.

The nine agents on the architecture diagram (Source agent, Researcher, Partner analyst, Fact-checker,
Marketing, Writer, Report builder, Strategy analyst, Agent builder) and the workflows come next.
