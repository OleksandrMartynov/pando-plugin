# Pando context

Shared by every Pando skill and agent. One copy: change it here.

- **Pando** is an SMS-first local parenting network. Parents text a number and get recommendations backed
  by other parents, labelled by source and freshness.
- **The founder** is Janet. "You" in a brief or review is the founder.
- **Area:** Pasadena, CA and the towns around it. **Clock:** Pacific time. Days and weeks in Pando's numbers
  are on Pasadena's clock; a week runs Monday–Sunday.
- **Areas** are Pando's neighborhood slugs, e.g. `east-pasadena`, `sierra-madre`, `altadena`.
- **Age bands:** expecting, baby, toddler, preschool, grade, tween, teen.
- **The connector:** the Pando MCP tools come from Pando's connector. Claude's long name for a tool
  (`mcp__<connection>__<tool>`) changes with how Pando was connected, so nothing here uses it: a skill
  names the tool alone (`daily_activity`), and an agent's exact list is `pando-tools:` by the same names,
  held by the plugin's hook (`hooks/agent-tools.mjs`) on any connection.
- **Cost per useful answer** = SMS + AI cost for the period ÷ answers parents rated helpful.
  `costs_summary` gives both halves, `useful_answers` and `cost_per_useful_answer` (null when a half is
  not configured). Twilio counts UTC days and the AI half Pasadena days (`days` in its answer) — say so
  when the period is a single day. Fewer than five rated: say "not enough answers rated yet".
- **Not tracked in Pando yet:** cohort retention, partnerships, attribution, cash. A review says so rather
  than estimating them.
