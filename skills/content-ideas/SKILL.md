---
name: content-ideas
description: Drafts Instagram and Facebook posts and newsletter items from verified local events in Pando's weekly digest and its own numbers, showing part and inviting parents to join for the rest, and designs the posts in Canva when it is connected. Use for "social posts for this week", "content ideas", "a newsletter blurb", or the Social posts workflow.
argument-hint: "[week or theme]"
---

# Content ideas

Rules: [../../shared/safety.md](../../shared/safety.md). Context: [../../shared/pando-context.md](../../shared/pando-context.md).

Each agent below runs **in the foreground**: wait for its report before the next phase, never in the background — a workflow that ends while an agent still works shows nothing (a scheduled task never gets the result).

1. **The week or theme.** Default: the coming Saturday's digest.
2. **Posts (Marketing).** Dispatch **pando:marketing** with the week or theme and "two posts: one carousel,
   one single". Only verified events — digest candidates and the digest's own items. Each post ends by
   inviting people to text Pando a question: the playbook counts content by the questions it brings, not likes.
   When Canva is connected, Marketing also designs each post in the founder's Canva and reads every
   slide back against the text; ask for PNG files only if the founder wants them.
3. **Newsletter (Writer)**, only if asked: dispatch **pando:writer** with the same verified events (with their price and popular when the tools gave
   them) and "a newsletter, in your newsletter format, 120 words".
4. **Hand over.** The drafts with their sources and, for each post, its Canva edit link and thumbnail.
   Nothing is posted or shared: the founder opens the design, posts it herself. Canva not connected:
   the text drafts, and one line on connecting Canva (Customize → Connectors).
