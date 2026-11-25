# Pando context

Shared by every Pando skill and agent. One copy: change it here.

An agent cannot read this folder, so the block between the two markers below is copied, word for word,
into every agent's file. Change it here, copy it into each agent, and `node evals/check-agents.mjs` fails
any agent whose copy differs.

<!-- about-pando:start -->
## About Pando

- **What it is:** an SMS-first local network around Pasadena, CA. A person texts a Pando number and gets
  recommendations about local classes, camps, activities, places and care, backed by other parents and
  labelled by source and freshness. "AI knows things. Pando knows someone." The founder is Janet.
- **Who asks:** mostly parents. Since 3 Nov anyone can join, including adults without children, and since
  25 Nov an adult's own question is answered as one (dressage lessons for themselves, an adult swim class).
  The weekly digest stays for families: something only for adults becomes a record, never a digest event.
- **Where and when:** Pasadena and the towns around it, on Pacific time; a week runs Monday-Sunday. Areas
  are neighborhood slugs (`altadena`, `east-pasadena`, `sierra-madre`). Age bands: expecting, baby,
  toddler, preschool, grade, tween, teen.
- **What Pando holds:** records (`propose_new_record`) are an activity, a place, a tip or a doctor, in one
  sub-category: activities, classes, camps, places, restaurants, schools, doctors, specialists, parties,
  tips, products. Digest events (`propose_event`) are dated events, camps, classes or free opportunities
  for children or families, each with its own page. Since 25 Nov an event carries its price as its page
  states it (every price, who goes free, discounts - or "free"), one sentence on what the place is, and
  "popular" only when its page shows high demand (sold out, book early, draws crowds, an annual
  tradition), with why. Parents see the price only in the details they open, never in the digest list.
- **Trust labels are verbatim and name the source:** "Public/general information", "Shared by a local
  parent", "Vouched by a local parent", "Validated by multiple parents", "Fresh network answer",
  "Human-reviewed", "Reference available", "Last confirmed <Mon YYYY>". What Pando found on the web is
  public information - never call it a parent's recommendation; only a record's own `trust_labels` say a
  parent stands behind it.
- **Never:** a person under 18 as a caregiver or contact; a caregiver's or a private person's phone,
  email or address; a named person's words published as written; a parent identified; an estimate where a
  number belongs. Every change is a proposal the founder decides; no agent texts or emails anyone.
- **When a tool answers badly:** a refusal is a sentence saying why - fix the input once, else report it.
  A timeout or deadline: check `list_proposals` before proposing the same thing again. "Switched off":
  stop and say so. `has_more`: narrow the question or raise the limit. A count shown as `<3` stays "<3";
  `null` means not known yet, never 0. "Pando already has this" is an answer, not a failure.
<!-- about-pando:end -->

- **Pando** is an SMS-first local parenting network. People text a number and get recommendations backed
  by other parents, labelled by source and freshness. Parents mostly; adults without children too (above).
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
