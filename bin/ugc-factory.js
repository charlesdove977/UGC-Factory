#!/usr/bin/env node
"use strict";

/**
 * UGC Factory installer.
 * Copies the skill into ~/.claude/skills/ugc-factory (or ./.claude/skills with --project)
 * so Claude Code can load it as /ugc-factory.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const pkg = require(path.join(__dirname, "..", "package.json"));
const SRC = path.join(__dirname, "..", "skill");
const SKILL_NAME = "ugc-factory";

function targetDir(scope) {
  const base =
    scope === "project"
      ? path.join(process.cwd(), ".claude", "skills")
      : path.join(os.homedir(), ".claude", "skills");
  return path.join(base, SKILL_NAME);
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(path.join(dir, entry.name));
    else n += 1;
  }
  return n;
}

function install(scope) {
  const dest = targetDir(scope);
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
  copyRecursive(SRC, dest);
  const files = countFiles(dest);
  console.log(`\n  UGC Factory v${pkg.version} installed.`);
  console.log(`  -> ${dest}`);
  console.log(`  ${files} files, including 15 vendored Seedance style skills.\n`);
  console.log("  Restart Claude Code, then run /ugc-factory.\n");
}

function uninstall(scope) {
  const dest = targetDir(scope);
  if (!fs.existsSync(dest)) {
    console.log(`\n  Nothing to uninstall at ${dest}\n`);
    return;
  }
  fs.rmSync(dest, { recursive: true, force: true });
  console.log(`\n  Removed ${dest}\n`);
}

function help() {
  console.log(`
  UGC Factory v${pkg.version}
  Interview-driven UGC video ad factory for Claude Code (Higgsfield + Seedance 2.0).

  Usage:
    npx ugc-factory install              Install globally to ~/.claude/skills
    npx ugc-factory install --project    Install into ./.claude/skills (this repo only)
    npx ugc-factory uninstall            Remove the global install
    npx ugc-factory uninstall --project  Remove the project install
    npx ugc-factory --version            Print version
    npx ugc-factory --help               Show this help

  After installing, restart Claude Code and run /ugc-factory.
  Requires the Higgsfield MCP: https://higgsfield.ai/s/higgsfield-mcp-ig-charlieautomates-dBaWAw
`);
}

const args = process.argv.slice(2);
const scope = args.includes("--project") ? "project" : "global";
const cmd = args.find((a) => !a.startsWith("-"));

if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version);
} else if (args.includes("--help") || args.includes("-h") || !cmd) {
  help();
} else if (cmd === "install") {
  install(scope);
} else if (cmd === "uninstall") {
  uninstall(scope);
} else {
  console.error(`\n  Unknown command: ${cmd}\n`);
  help();
  process.exit(1);
}
