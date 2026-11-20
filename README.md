# Pando plugin for Claude

Pando's own agents and workflows for Claude Cowork, built and updated by QuitCode. Everything the plugin
knows about Pando comes through **Pando MCP** (`https://pando.is/api/mcp`): totals with no names, Pando's
records and the parents' approved words about them, costs, and proposals that change nothing until an admin
approves them.

## Use it

1. Install the plugin: in Claude Cowork, Customize → Plugins → Add marketplace → this repository; in
   Claude Code, `/plugin install pando --marketplace OleksandrMartynov/pando-plugin`.
2. On the plugin's **Connectors** tab, connect **Pando** and sign in with your Pando admin login. An admin
   must have switched Pando MCP on at pando.is/admin/mcp.
3. Ask for numbers ("how did sign-ups do this month?"), look up a record, or ask an agent to check a fact —
   any change comes back as a proposal for you to approve here in chat or at pando.is/admin/proposals.

## Data

The plugin stores nothing itself. Claude sends tool calls to pando.is with your sign-in; Pando answers with
counts and record facts, never a parent's name, phone or question text. Every call is logged by Pando, and
one switch in the Pando admin turns the connector off.

## What is here

- `.mcp.json` — the Pando MCP connector.
- `skills/pando-data` — which tool answers what; propose, never write.
- `skills/numbers-on-demand` — short, sourced number summaries.

The nine agents on the architecture diagram (Source agent, Researcher, Partner analyst, Fact-checker,
Marketing, Writer, Report builder, Strategy analyst, Agent builder) and the workflows come next.
