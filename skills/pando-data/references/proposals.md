# Making proposals

Every proposal waits for an admin; nothing changes before. Search first (`search_records`,
`digest_candidates`) — a proposal for something Pando has is refused.

| To | Tool | Needs |
| --- | --- | --- |
| Rename, retire, mark ready / not ready to answer with | `propose_record_edit` (`change`: rename, retire, answer_ready) | the record's `id`; `name` for a rename; `ready` for answer_ready |
| Correct facts | `propose_record_edit` (`change`: facts) | `id`, the page that shows it (`source_url`), and only the fields that change: `venue`, `areas`, `age_bands`, `subcategory` |
| Add an activity, place, tip or doctor | `propose_new_record` | `kind`, `name`, the page it comes from (`source_url`). Never a caregiver or a private person |
| Record a check of a record's page | `propose_fact_check` | `id`, `verdict`, the page checked. `confirmed` only when the page shows it is still true and current; `stale` when it no longer is; `unreachable` when the page could not be read |
| Add a dated event, camp, class or free day to the weekly digest | `propose_event` | `kind`, `title`, `when_text`, `starts_on`/`ends_on`, `summary`, ages as the page states them, and the event's own page as `url` — never a listing or round-up |
| Add an organisation or feed to the sources & partners list | `propose_source` | `role` (source / partner), `kind`, `name`, its official page as `url`, `area`, a one-line `note` — never a person's name, email or phone. Read `list_sources` first |
| Change, pause or retire an entry on that list | `propose_source` | its `source_id` and only what changes (`status`: paused / retired) |
| Add, change or remove a skill, agent or connector of this plugin | `propose_plugin_change` | `target`, `action`, `name`, and the fields of that target — the `customize` workflow walks through them. An admin reads the change line by line and commits it |

Rules Pando checks (a refusal says which): areas are neighborhood slugs, age bands the ladder in
[../../../shared/pando-context.md](../../../shared/pando-context.md); dates are real calendar dates; an
event's link is a public site typed in plain ASCII; no phone, email or link inside names or summaries.

Add a short `note` for the admin: how you checked it.
