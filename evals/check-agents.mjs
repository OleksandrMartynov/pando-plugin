// A check with no Claude and no network (23 Nov): what every agent may call, against the tools Pando MCP
// has. Run before a release, and after Pando MCP gains a tool:  node evals/check-agents.mjs
//
// Why: an agent with `disallowedTools:` may call every tool that list leaves out — so a tool Pando MCP
// adds later is that agent's by default. The 23 Nov review found exactly that (the deny lists still
// named approve_proposal and save_skill, and not the tools that replaced them).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const P = "mcp__plugin_pando_pando__";

/** Pando MCP's tools (web/lib/server/mcp/server.ts in the Pando repo, 23 Nov): 24. */
const READS = [
  "pando_overview", "parents_totals", "questions_totals", "records_totals", "demand_by_place", "delivery_health",
  "impact_totals", "digest_weeks", "daily_activity", "unanswered_questions", "what_went_wrong", "search_records",
  "get_record", "digest_candidates", "list_proposals", "list_sources", "costs_summary",
];
const WRITES = ["propose_record_edit", "propose_new_record", "propose_fact_check", "propose_event", "propose_source", "propose_skill", "record_source_check"];
const ALL = new Set([...READS, ...WRITES]);
/** Tools that no longer exist and must not be named anywhere: approval happens only on /admin/proposals. */
const GONE = /\b(approve_proposal|reject_proposal|save_skill|admin_said_(yes|no|save))\b/;

/** Which agent may write what. Anything else that writes is a failure. */
const MAY_WRITE = {
  "fact-checker": ["propose_record_edit", "propose_new_record", "propose_fact_check", "propose_event"],
  "partner-analyst": ["propose_source"],
  "source-agent": ["record_source_check"],
};

let failed = 0;
const fail = (m) => {
  failed++;
  console.log(`FAIL  ${m}`);
};

for (const file of fs.readdirSync(path.join(root, "agents")).filter((f) => f.endsWith(".md"))) {
  const name = file.replace(/\.md$/, "");
  const text = fs.readFileSync(path.join(root, "agents", file), "utf8").replace(/\r\n/g, "\n");
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? "";
  const line = (k) => new RegExp(`^${k}:\\s*(.*)$`, "m").exec(front)?.[1]?.split(",").map((s) => s.trim()).filter(Boolean) ?? null;
  const allow = line("tools");
  const deny = line("disallowedTools");
  if (!allow && !deny) {
    fail(`${name}: neither tools: nor disallowedTools: — it may call everything`);
    continue;
  }
  const pando = (list) => (list ?? []).filter((t) => t.startsWith(P)).map((t) => t.slice(P.length));
  for (const t of [...pando(allow), ...pando(deny)]) if (!ALL.has(t)) fail(`${name}: names ${t}, which Pando MCP does not have`);
  const may = new Set(MAY_WRITE[name] ?? []);
  const writes = allow ? pando(allow).filter((t) => WRITES.includes(t)) : WRITES.filter((t) => !pando(deny).includes(t));
  for (const w of writes) if (!may.has(w)) fail(`${name}: may call ${w}`);
  if (GONE.test(text)) fail(`${name}: names a tool that no longer exists (${GONE.exec(text)[0]})`);
  if (!failed) console.log(`ok    ${name.padEnd(18)} ${allow ? "allowlist" : "deny list"}; writes: ${writes.join(", ") || "none"}`);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
for (const f of [...walk(path.join(root, "skills")), ...walk(path.join(root, "shared")), path.join(root, "README.md")].filter((f) => f.endsWith(".md"))) {
  const text = fs.readFileSync(f, "utf8");
  if (GONE.test(text)) fail(`${path.relative(root, f)}: names a tool that no longer exists (${GONE.exec(text)[0]})`);
}

console.log(failed ? `\n${failed} problem(s).` : "\nEvery agent's tools are what it should have.");
process.exit(failed ? 1 : 0);
