---
name: partner-outreach
description: Finds schools, camps, PTAs and local organizations worth contacting for Pando, explains why each fits what parents ask for, and drafts a personal email to each for the founder to send herself. Use for "who should we partner with", "find partners for babysitting questions", "draft partner emails", or to read partner replies.
argument-hint: "[topic or area]"
---

# Partner outreach

Rules: [../../shared/safety.md](../../shared/safety.md). Context: [../../shared/pando-context.md](../../shared/pando-context.md).

Each agent below runs **in the foreground**: wait for its report before the next phase, never in the background — a workflow that ends while an agent still works shows nothing (a scheduled task never gets the result).

## Phase 1 — the goal

A topic ("babysitting"), an area ("Altadena"), or none ("who should we talk to"). Gmail is optional: with it
the analyst can read partner replies.

## Phase 2 — the partner brief (Partner analyst)

Dispatch **pando:partner-analyst** with the goal, and "read replies" if the founder asked about replies.

## Phase 3 — choose

Show the brief: name, why it fits (the parents' need in counts), warm or cold, the ask (the lowest rung
that would work: a public link or calendar first), the public contact route. Ask which to write to.
The analyst may have proposed new partners for the sources & partners list: show each — name, page, why —
and ask the founder yes or no; decide each only on her own word (shared rule 3).

## Phase 4 — drafts (Writer)

Dispatch **pando:writer** with the chosen organizations' brief entries, verbatim, and "one email each".

## Phase 5 — hand over

The drafts, each with To and Subject, ready to copy. Nothing is sent: Claude's Gmail connector cannot
send, and the founder sends each herself.
