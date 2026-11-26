// Each Pando agent's tools, held by name whatever the connection is called (24 Nov).
//
// Why a hook: Claude names a connected tool `mcp__<connection>__<tool>`, and the connection's part depends
// on how Pando was connected — `plugin_pando_pando` through this plugin, `pando` as a connector of one's
// own, `claude_ai_Pando` from claude.ai, a UUID in the desktop app, different for each teammate. An agent's
// `tools:` list must name the whole thing, so a list written for one connection left the agent with no
// tools at all on another, and Claude refused to start it. Claude Code has no name for "this plugin's
// own server" (tested 24 Nov: `mcp__*__tool` and `*__tool` are not recognised).
//
// So an agent's frontmatter has no `tools:`; its exact list is `pando-tools:`, by the tool's own name
// (`digest_candidates`, `WebFetch`), which this hook holds before every call the agent makes:
//
//   - a built-in tool runs only if the list names it;
//   - a connected tool runs only if the list names the part after the last `__`, on any connection;
//   - `pando-accounts: true` (an agent that reads Gmail and other connected accounts, whose tool names are
//     not known ahead) also lets through connected tools that are not Pando's — never a Pando tool the list
//     leaves out;
//   - anything it cannot read is refused for a Pando agent: fail closed.
//
// `disallowedTools: Bash, Write, Edit, NotebookEdit` stays in every agent as a fence that does not depend
// on this hook. And Pando's own server is still the boundary that does not depend on Claude at all: a
// read-only sign-in cannot propose, a change is only ever a proposal, and only the person decides one.
//
// The main conversation and other plugins' agents are not touched (no `pando:` agent type).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Pando MCP's tools (web/lib/mcp/tool-names.ts in the Pando repo). evals/check-agents.mjs reads these. */
export const PANDO_READS = [
  "pando_overview", "parents_totals", "questions_totals", "records_totals", "demand_by_place", "delivery_health",
  "impact_totals", "digest_weeks", "daily_activity", "unanswered_questions", "what_went_wrong", "search_records",
  "get_record", "digest_candidates", "list_proposals", "list_sources", "read_plugin", "costs_summary", "contributor_load",
];
export const PANDO_WRITES = ["propose_record_edit", "propose_new_record", "propose_fact_check", "propose_event", "propose_source", "propose_plugin_change", "record_source_check"];
/** Decided only by the person, in the main conversation (shared rule 3): never in an agent's list. */
export const PANDO_DECIDES = ["approve_proposal", "reject_proposal", "set_budget"];
export const PANDO_ALL = new Set([...PANDO_READS, ...PANDO_WRITES, ...PANDO_DECIDES]);
/** Built-in tools an agent's list may name: they read. */
export const SAFE_BUILTINS = ["Read", "Grep", "Glob", "WebFetch", "WebSearch"];
/** Built-in tools no Pando agent gets: they change files or run commands. */
export const NEVER = ["Bash", "Write", "Edit", "NotebookEdit"];
/** Lets an agent load a connected tool's description before calling it; it reads nothing of Pando's. */
const ALWAYS = new Set(["ToolSearch"]);

/** The part of a connected tool's name that does not depend on the connection. */
export const ownName = (tool) => (tool.startsWith("mcp__") ? tool.slice(tool.lastIndexOf("__") + 2) : tool);

/** An agent file's `pando-tools:` and `pando-accounts:`; `tools: null` when it has no list. */
export function readAgent(text) {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
  const field = (k) => new RegExp(`^${k}:[ \\t]*(.*)$`, "m").exec(front)?.[1]?.trim() ?? null;
  const list = field("pando-tools");
  return {
    tools: list === null ? null : list.split(",").map((s) => s.trim()).filter(Boolean),
    accounts: field("pando-accounts") === "true",
  };
}

/** May this agent make this call? `agent` is readAgent's answer, or null when the file could not be read. */
export function decide(tool, agent) {
  if (ALWAYS.has(tool)) return { allow: true };
  if (!agent || !agent.tools) return { allow: false, reason: "This Pando agent has no pando-tools list, so it may call nothing." };
  const own = ownName(tool);
  if (agent.tools.includes(own)) return { allow: true };
  if (agent.accounts && tool.startsWith("mcp__") && !PANDO_ALL.has(own)) return { allow: true };
  return { allow: false, reason: `${own} is not in this Pando agent's pando-tools list (${agent.tools.join(", ")}).` };
}

function agentFile(agentType) {
  const root = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const name = agentType.slice("pando:".length);
  if (!/^[a-z][a-z0-9-]{1,40}$/.test(name)) return null;
  try {
    return fs.readFileSync(path.join(root, "agents", `${name}.md`), "utf8");
  } catch {
    return null;
  }
}

async function main() {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  let call;
  try {
    call = JSON.parse(input);
  } catch {
    return; // not a call we can read: not ours to judge
  }
  const agentType = typeof call.agent_type === "string" ? call.agent_type : "";
  if (!agentType.startsWith("pando:")) return;
  const text = agentFile(agentType);
  const verdict = decide(String(call.tool_name ?? ""), text === null ? null : readAgent(text));
  if (verdict.allow) return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: verdict.reason },
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    /* Something broke while judging a call: refuse it rather than let it through unread. */
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "Pando's tool check failed, so the call was refused." },
    }));
  });
}
