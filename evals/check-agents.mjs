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

/** Pando MCP's tools (web/lib/mcp/tool-names.ts in the Pando repo, 24 Nov): 27. Keep the two lists equal. */
const READS = [
  "pando_overview", "parents_totals", "questions_totals", "records_totals", "demand_by_place", "delivery_health",
  "impact_totals", "digest_weeks", "daily_activity", "unanswered_questions", "what_went_wrong", "search_records",
  "get_record", "digest_candidates", "list_proposals", "list_sources", "read_plugin", "costs_summary",
];
const WRITES = ["propose_record_edit", "propose_new_record", "propose_fact_check", "propose_event", "propose_source", "propose_plugin_change", "record_source_check"];
/**
 * The tools that decide a proposal (24 Nov): called only in the main conversation, on the person's own word
 * (shared rule 3). No agent may call them — an agent reads pages and mail, and text there must never reach a
 * decision — and no skill or agent names them, because the server refuses a proposed skill or agent that does
 * (so a file naming them could no longer be changed through /pando:customize). Only shared/ and the README may.
 */
const DECIDES = ["approve_proposal", "reject_proposal"];
const ALL = new Set([...READS, ...WRITES, ...DECIDES]);
/** Tools that no longer exist and must not be named anywhere. */
const GONE = /\b(save_skill|propose_skill|admin_said_(yes|no|save))\b/;
const NAMES_DECIDING = /\b(approve_proposal|reject_proposal)\b/;

/**
 * Which of QuitCode's agents may write what; anything else that writes is a failure. An agent the client
 * added through the customize workflow is not in this list: what it may do was shown to an admin and
 * committed by them, so it is listed here, not judged (the server already refused Bash, Write, Edit).
 */
const QUITCODE = ["agent-builder", "fact-checker", "marketing", "partner-analyst", "report-builder", "researcher", "source-agent", "strategy-analyst", "writer"];
const MAY_WRITE = {
  "fact-checker": ["propose_record_edit", "propose_new_record", "propose_fact_check", "propose_event"],
  "partner-analyst": ["propose_source"],
  "source-agent": ["record_source_check"],
};

const NEVER = ["Bash", "Write", "Edit", "NotebookEdit"];
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
  if (QUITCODE.includes(name)) for (const w of writes) if (!may.has(w)) fail(`${name}: may call ${w}`);
  if (deny && !NEVER.every((t) => deny.includes(t))) fail(`${name}: a deny list must deny ${NEVER.join(", ")}`);
  for (const t of allow ?? []) if (NEVER.includes(t)) fail(`${name}: is given ${t}`);
  if (GONE.test(text)) fail(`${name}: names a tool that no longer exists (${GONE.exec(text)[0]})`);
  /* A deciding tool: never in an allowlist, always in a deny list — for every agent, QuitCode's or the client's. */
  for (const d of DECIDES) {
    if (allow && pando(allow).includes(d)) fail(`${name}: is given ${d}; only the person decides, in the main conversation`);
    if (deny && !pando(deny).includes(d)) fail(`${name}: a deny list must deny ${d}`);
  }
  const body = text.replace(/^---\n[\s\S]*?\n---/, "");
  if (NAMES_DECIDING.test(body)) fail(`${name}: names ${NAMES_DECIDING.exec(body)[0]} — a decision is shared rule 3's, never an agent's step`);
  if (!failed) console.log(`ok    ${name.padEnd(18)} ${allow ? "allowlist" : "deny list"}; writes: ${writes.join(", ") || "none"}${QUITCODE.includes(name) ? "" : "  (added by the client)"}`);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
for (const f of [...walk(path.join(root, "skills")), ...walk(path.join(root, "shared")), path.join(root, "README.md")].filter((f) => f.endsWith(".md"))) {
  const text = fs.readFileSync(f, "utf8");
  if (GONE.test(text)) fail(`${path.relative(root, f)}: names a tool that no longer exists (${GONE.exec(text)[0]})`);
  /* Skills never name a deciding tool (the server would refuse to change such a skill later); shared/ and the README may. */
  const rel = path.relative(root, f).replace(/\\/g, "/");
  if (rel.startsWith("skills/") && NAMES_DECIDING.test(text)) fail(`${rel}: names ${NAMES_DECIDING.exec(text)[0]} — say "shared rule 3" instead`);
}

/* Supabase and PostHog are in the plugin read-only (23 Nov): the switch is in their address. */
const servers = JSON.parse(fs.readFileSync(path.join(root, ".mcp.json"), "utf8")).mcpServers ?? {};
const READ_ONLY = { supabase: /[?&]read_only=true(&|$)/, posthog: /[?&]readonly=true(&|$)/ };
for (const [name, rx] of Object.entries(READ_ONLY)) if (servers[name] && !rx.test(servers[name].url ?? "")) fail(`.mcp.json: ${name} is not read-only (${servers[name].url})`);
for (const [name, s] of Object.entries(servers)) if (s.command || s.args || s.env || s.headers) fail(`.mcp.json: ${name} has a command, env or headers; only remote https servers belong in the plugin`);
if (!failed) console.log(`ok    .mcp.json          ${Object.keys(servers).join(", ")}; supabase and posthog read-only`);

console.log(failed ? `\n${failed} problem(s).` : "\nEvery agent's tools are what it should have.");
process.exit(failed ? 1 : 0);
