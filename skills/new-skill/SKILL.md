---
name: new-skill
description: Builds a new Pando skill when the founder asks — drafts it, test-runs it on Pando's real data, shows the result, and saves it into the Pando plugin only when she says "save", so the next plugin update brings it to everyone's Claude. Use for "make a skill that…", "turn this into a workflow", or the New skill workflow.
argument-hint: "[what the skill should do]"
---

# New skill

Rules: [../../shared/safety.md](../../shared/safety.md).

Each agent below runs **in the foreground**: wait for its report before the next phase, never in the background — a workflow that ends while an agent still works shows nothing (a scheduled task never gets the result).

1. **What it does.** In one line, from the founder's words. Ask only if it is unclear what it should produce.
2. **Draft and test (Agent builder).** Dispatch **pando:agent-builder** with that line and anything the
   founder said about format. It returns name, description, instructions and a test run.
3. **Show it.** The name, the description, the instructions in full, and the test run's output. Ask:
   "Save it into the Pando plugin?" — and say that it then reaches everyone's Claude with the next update.
4. **Save, only on "save".** When the founder says save to this skill: `save_skill` with the name,
   description and instructions exactly as shown, and `admin_said_save: true`. Then say the version it
   landed in. Any change after she saw it means showing it again first.
