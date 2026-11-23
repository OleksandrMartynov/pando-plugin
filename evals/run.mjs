// Pando plugin evals (20 Nov): realistic tasks run by real Claude Code with this plugin, checked on what
// was called (the agents' calls included), what must never be called, and the answer.
//
//   node evals/run.mjs --plugin-dir <a copy of the plugin whose .mcp.json reaches a Pando lab> [--all] [--only id] [--model sonnet]
//
// The copy's .mcp.json may carry a lab token in "headers" so no sign-in is needed; never point it at
// production. `slow` tasks (the web) run only with --all. Costs real tokens: each task prints its cost.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : null;
};
const pluginDir = opt("--plugin-dir");
if (!pluginDir) {
  console.error("--plugin-dir is required");
  process.exit(2);
}
const model = opt("--model") ?? "sonnet";
const tasks = JSON.parse(fs.readFileSync(new URL("./tasks.json", import.meta.url), "utf8")).filter((t) =>
  opt("--only") ? t.id === opt("--only") : args.includes("--all") || !t.slow,
);

const short = (n) => n.replace(/^mcp__plugin_pando_pando__/, "");
const matches = (name, pattern) => (pattern.endsWith("*") ? name.startsWith(pattern.slice(0, -1)) : name === pattern);
let failed = 0;

for (const t of tasks) {
  const run = spawnSync(
    "claude",
    [
      "-p", t.prompt,
      "--plugin-dir", path.resolve(pluginDir),
      "--model", model,
      "--allowedTools", "mcp__plugin_pando_pando", "Agent", "Task", "Read", "WebSearch", "WebFetch",
      "--output-format", "stream-json", "--verbose",
    ],
    { encoding: "utf8", input: "", maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 },
  );
  const lines = (run.stdout ?? "")
    .trim()
    .split("\n")
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const calls = [];
  const agents = [];
  for (const l of lines) {
    if (l.type !== "assistant") continue;
    for (const c of l.message.content) {
      if (c.type !== "tool_use") continue;
      if (c.name === "Agent" || c.name === "Task") agents.push(c.input?.subagent_type ?? "?");
      calls.push(short(c.name));
    }
  }
  const result = lines.find((l) => l.type === "result");
  const text = result?.result ?? "";
  const problems = [];
  if (result?.subtype !== "success") problems.push(`run ended ${result?.subtype ?? "without a result"}`);
  for (const n of t.expect_all ?? []) if (!calls.includes(n)) problems.push(`never called ${n}`);
  if (t.expect_any && !t.expect_any.some((n) => calls.includes(n))) problems.push(`called none of ${t.expect_any.join(", ")}`);
  for (const f of t.forbid ?? []) for (const c of calls) if (matches(c, f)) problems.push(`called ${c}`);
  if (t.expect_agent && !agents.includes(t.expect_agent)) problems.push(`did not dispatch ${t.expect_agent} (dispatched: ${agents.join(", ") || "none"})`);
  if (t.expect_text && !new RegExp(t.expect_text).test(text)) problems.push(`answer lacks /${t.expect_text}/`);
  if (problems.length) failed++;
  const cost = (result?.total_cost_usd ?? 0).toFixed(2);
  console.log(`${problems.length ? "FAIL" : "ok  "}  ${t.id.padEnd(34)} $${cost}  ${calls.length} calls${agents.length ? `, agents: ${agents.join(", ")}` : ""}`);
  for (const p of problems) console.log(`        - ${p}`);
  /* A failed answer is shown (23 Nov: a check that failed one run in two could not be read otherwise). */
  if (problems.length && text) console.log(text.split("\n").map((l) => `        | ${l}`).join("\n").slice(0, 3000));
}
console.log(`\n${tasks.length - failed} of ${tasks.length} passed.`);
process.exit(failed ? 1 : 0);
