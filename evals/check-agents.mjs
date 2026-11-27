// A check with no Claude and no network (23 Nov): what every agent may call, against the tools Pando MCP
// has. Run before a release, and after Pando MCP gains a tool:  node evals/check-agents.mjs
//
// Since 24 Nov an agent's exact list is `pando-tools:` by each tool's own name, held by hooks/agent-tools.mjs
// on any connection — never a `tools:` of long `mcp__…` names, which named one connection only and left the
// agent with nothing (Claude refused to start it) when Pando was connected another way.
import fs from "node:fs";
import path from "node:path";
import { NEVER, PANDO_ALL, PANDO_DECIDES, PANDO_WRITES, SAFE_BUILTINS, decide, readAgent } from "../hooks/agent-tools.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
/** Tools that no longer exist and must not be named anywhere. */
const GONE = /\b(save_skill|propose_skill|admin_said_(yes|no|save))\b/;
const NAMES_DECIDING = /\b(approve_proposal|reject_proposal|set_budget|remove_digest_candidate)\b/;
/** A long name ties a file to one way of connecting Pando. */
const LONG_NAME = /\bmcp__[A-Za-z0-9_-]+__[A-Za-z0-9_-]+/;

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

/**
 * A connector's own tools a QuitCode agent may name (27 Nov: Marketing designs posts in Canva). Held by name
 * like Pando's, and only while the connector is in .mcp.json — remove the connector and the agent fails here.
 */
const CONNECTOR_TOOLS = {
  canva: ["generate-design", "get-create-design-async-job", "create-design-from-candidate", "create-design-from-brand-template", "get-design", "get-design-content", "get-design-pages", "get-design-thumbnail", "start-editing-transaction", "perform-editing-operations", "commit-editing-transaction", "cancel-editing-transaction", "list-brand-kits", "search-brand-templates", "upload-asset-from-url", "get-export-formats", "export-design"],
};
const declared = Object.keys(JSON.parse(fs.readFileSync(path.join(root, ".mcp.json"), "utf8")).mcpServers ?? {});
const connectorOwns = (t) => Object.entries(CONNECTOR_TOOLS).some(([c, tools]) => declared.includes(c) && tools.includes(t) && !PANDO_ALL.has(t));

let failed = 0;
const fail = (m) => {
  failed++;
  console.log(`FAIL  ${m}`);
};

/* "About Pando" (25 Nov): an agent cannot read shared/, so each of QuitCode's agents carries the block word for word. */
const ABOUT = /<!-- about-pando:start -->[\s\S]*?<!-- about-pando:end -->/;
const aboutSource = ABOUT.exec(fs.readFileSync(path.join(root, "shared", "pando-context.md"), "utf8").replace(/\r\n/g, "\n"))?.[0] ?? null;
if (!aboutSource) fail("shared/pando-context.md: the about-pando block is missing");

/* The Operating Playbook's agent instruction template (v1.2, 26 Nov): a Brief with these thirteen fields, in order, then Cases. */
const BRIEF_FIELDS = ["Objective", "Why it matters to Pando", "Inputs", "Data and tools", "Permissions", "Geography and time", "Output", "Evidence", "Cost and time cap", "Failure states", "Acceptance test", "Owner", "Escalation"];
const briefProblem = (text) => {
  const brief = /\n## Brief\n([\s\S]*?)\n## Cases\n([\s\S]*?)(?=\n## |\n[A-Z0-9])/.exec(text);
  if (!brief) return "no ## Brief followed by ## Cases";
  const fields = [...brief[1].matchAll(/^- \*\*([^*]+):\*\* \S/gm)].map((m) => m[1]);
  if (fields.join("|") !== BRIEF_FIELDS.join("|")) return `Brief fields are ${fields.join(", ") || "none"} — want ${BRIEF_FIELDS.join(", ")}`;
  if ((brief[2].match(/^- \S/gm) ?? []).length < 3) return "Cases has fewer than three cases";
  return null;
};

/* The hook itself, on the calls that matter: a listed tool on three connections, an unlisted one, a decision. */
{
  const a = { tools: ["WebFetch", "search_records"], accounts: false };
  const ok = (tool, want) => decide(tool, a).allow === want || fail(`hook: ${tool} should be ${want ? "allowed" : "refused"}`);
  for (const p of ["mcp__plugin_pando_pando__", "mcp__pando__", "mcp__claude_ai_Pando__", "mcp__29882e05-23cb-5f75-9c2d-95ba70d8644d__"]) ok(p + "search_records", true);
  ok("mcp__pando__propose_event", false);
  ok("mcp__pando__approve_proposal", false);
  ok("WebFetch", true);
  ok("Bash", false);
  ok("mcp__gmail__search_threads", false);
  ok("ToolSearch", true);
  if (decide("mcp__pando__search_records", null).allow) fail("hook: an agent whose file cannot be read must be refused everything");
  const acc = { tools: ["Read"], accounts: true };
  if (!decide("mcp__claude_ai_Gmail__search_threads", acc).allow) fail("hook: pando-accounts must let an account's tools through");
  if (decide("mcp__claude_ai_Pando__propose_event", acc).allow) fail("hook: pando-accounts must never let an unlisted Pando tool through");
  if (!failed) console.log("ok    hooks/agent-tools.mjs  holds a list on any connection; refuses what is not listed");
}

for (const file of fs.readdirSync(path.join(root, "agents")).filter((f) => f.endsWith(".md"))) {
  const before = failed;
  const name = file.replace(/\.md$/, "");
  const text = fs.readFileSync(path.join(root, "agents", file), "utf8").replace(/\r\n/g, "\n");
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? "";
  const line = (k) => new RegExp(`^${k}:\\s*(.*)$`, "m").exec(front)?.[1]?.split(",").map((s) => s.trim()).filter(Boolean) ?? null;
  const agent = readAgent(text);
  if (line("tools")) fail(`${name}: has tools: — an agent's list is pando-tools:, by each tool's own name`);
  if (!agent.tools || agent.tools.length === 0) {
    fail(`${name}: no pando-tools: list — the hook would refuse it everything`);
    continue;
  }
  if (LONG_NAME.test(front)) fail(`${name}: names ${LONG_NAME.exec(front)[0]} — that name holds on one connection only`);
  const deny = line("disallowedTools") ?? [];
  if (!NEVER.every((t) => deny.includes(t))) fail(`${name}: disallowedTools must deny ${NEVER.join(", ")}`);
  for (const t of agent.tools) {
    if (NEVER.includes(t)) fail(`${name}: is given ${t}`);
    else if (!SAFE_BUILTINS.includes(t) && !PANDO_ALL.has(t) && !connectorOwns(t) && !(!QUITCODE.includes(name) && t.includes(":"))) fail(`${name}: names ${t}, which is neither a read tool, one Pando MCP has, nor one of a connector in .mcp.json`);
  }
  const writes = agent.tools.filter((t) => PANDO_WRITES.includes(t));
  const may = new Set(MAY_WRITE[name] ?? []);
  if (QUITCODE.includes(name)) for (const w of writes) if (!may.has(w)) fail(`${name}: may call ${w}`);
  /* A deciding tool: never in a list — for every agent, QuitCode's or the client's. */
  for (const d of PANDO_DECIDES) if (agent.tools.includes(d)) fail(`${name}: is given ${d}; only the person decides, in the main conversation`);
  if (GONE.test(text)) fail(`${name}: names a tool that no longer exists (${GONE.exec(text)[0]})`);
  const body = text.replace(/^---\n[\s\S]*?\n---/, "");
  if (NAMES_DECIDING.test(body)) fail(`${name}: names ${NAMES_DECIDING.exec(body)[0]} — a decision is shared rule 3's, never an agent's step`);
  if (QUITCODE.includes(name) && aboutSource && ABOUT.exec(text)?.[0] !== aboutSource) fail(`${name}: its "About Pando" block is missing or differs from shared/pando-context.md — copy it word for word`);
  if (QUITCODE.includes(name) && briefProblem(text)) fail(`${name}: ${briefProblem(text)} (the Operating Playbook's agent template)`);
  if (failed === before) console.log(`ok    ${name.padEnd(18)} ${agent.tools.length} tools${agent.accounts ? " + connected accounts" : ""}; writes: ${writes.join(", ") || "none"}${QUITCODE.includes(name) ? "" : "  (added by the client)"}`);
}

/* The hook is wired: every tool call, the script by the plugin's own path. */
{
  const hooks = JSON.parse(fs.readFileSync(path.join(root, "hooks", "hooks.json"), "utf8")).hooks?.PreToolUse ?? [];
  const wired = hooks.some((h) => h.matcher === "*" && h.hooks?.some((c) => /\$\{CLAUDE_PLUGIN_ROOT\}\/hooks\/agent-tools\.mjs/.test(c.command ?? "")));
  if (!wired) fail("hooks/hooks.json: the PreToolUse hook for every tool is not wired to hooks/agent-tools.mjs");
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
