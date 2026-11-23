---
name: customize
description: Changes the Pando plugin itself when the founder asks — a new or changed skill (workflow), a new or changed agent, a connector to another service, or removing one — drafted and test-run on Pando's real data, then proposed; she reads the change line by line and commits it at pando.is/admin/proposals, and the next plugin update brings it to everyone's Claude. Use for "make a skill that…", "change the daily brief so…", "make an agent that…", "the writer should also…", "connect Notion", "remove the … workflow".
argument-hint: "[what to add, change or remove]"
---

# Customize the plugin

Rules: [../../shared/safety.md](../../shared/safety.md).

Each agent below runs **in the foreground**: wait for its report before the next phase, never in the
background — a workflow that ends while an agent still works shows nothing.

## 1. What changes

From the founder's words, one change at a time: a **skill** (a workflow or brief), an **agent** (a
specialist the workflows hand work to), or a **connector** (another service's MCP server) — and whether
it is **new**, a **change** to one that exists, or a **removal**. Ask only if it is unclear.

`read_plugin` (no arguments) lists what the plugin has now; use it to find the exact name.

## 2. Draft and test (Agent builder)

For a skill or an agent, dispatch **pando:agent-builder** with: the target (skill or agent), new or
change, the name, what the founder wants, and — for a change — "start from the current file". It reads
the file with `read_plugin`, drafts the whole new version and test-runs it on Pando's real data.

For a connector there is nothing to draft: its name (lowercase-with-hyphens) and the **https address** of
the service's remote MCP server, from that service's own documentation. A local program, an address with
a key in it, or a plain `http://` address is refused — each person signs in to the service in Claude.

For a removal, nothing to draft: say what will stop working (a workflow that names it, an agent that uses
it). The `pando` connector, the `customize` and `pando-data` skills and the `agent-builder` agent cannot
be removed — they can be changed.

## 3. Show it

The change in full: for a new one, everything; for a change, what is different, in plain words, then the
whole new text; for an agent, its tools in plain words (what it can read, whether it can propose changes
in Pando, whether it uses Gmail and other connected accounts). Ask: "Propose it?"

## 4. Propose, when she wants it

`propose_plugin_change` with exactly what was shown:

| Target | Fields |
| --- | --- |
| skill | `name`, `description` (one line: what it does, then "Use when…"), `instructions` (no frontmatter), `argument_hint` if it takes one |
| agent | `name`, `description`, `instructions` (its system prompt), `tools`, `model` (sonnet unless asked), `account_connectors: true` only for one that uses Gmail or other connected accounts |
| connector | `name`, `url` |

`action` is `create`, `update` or `delete`. A refusal says why: fix it once and show it again, or tell her.
Then say: it waits at pando.is/admin/proposals, where she sees each line removed and added and presses
*Commit to plugin*; the plugin's next update brings it to everyone's Claude. Nothing is committed from
the chat. Any change after she saw it means showing it again first.
