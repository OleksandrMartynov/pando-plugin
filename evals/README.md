# Evals

Realistic tasks for the Pando plugin, run by real Claude Code and checked on the tools it called (its
agents' calls included), the tools it must never call, and its answer. Run them before every release.

1. Make a copy of the plugin whose `.mcp.json` points at a Pando **lab** (`http://localhost:3100/api/mcp`),
   with a lab token in `headers.Authorization` if you do not want to sign in. Never production.
2. `node evals/run.mjs --plugin-dir <that copy>` — the quick tasks; `--all` adds the web research one;
   `--only <id>` runs one; `--model haiku|sonnet|opus` (default sonnet).

Each task costs real tokens; the runner prints the cost of each.
