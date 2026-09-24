// Pure Lua completion/hover logic (no vscode dependency).
// The vscode providers in extension.ts are thin adapters over this.

import { LUA_API, LIFECYCLE, topLevel, membersOf } from "./data/luaApi";

export interface Completion {
  label: string;
  detail: string;
  doc: string;
  snippet: string;
  kind: "function" | "module" | "snippet";
}

/**
 * Extracts the dotted path directly before the cursor, keeping a
 * trailing dot when present (e.g. "greg.player." or "greg.player.mo").
 * Returns null when there is no identifier prefix.
 */
export function dottedPrefix(lineBeforeCursor: string): string | null {
  const raw = /([\w.]+)$/.exec(lineBeforeCursor);
  if (!raw) return null;
  const word = raw[1].replace(/^\.+/, "");
  if (!/^[A-Za-z_]/.test(word)) return null;
  return word;
}

/** Completions for a dotted prefix (e.g. "greg.player." or "greg.player.mo"). */
export function completeFor(prefix: string): Completion[] {
  if (!prefix.startsWith("greg")) return lifecycleCompletions();
  if (!prefix.includes(".")) return lifecycleCompletions();

  const withDot = prefix.endsWith(".") ? prefix : null;
  if (withDot) {
    const base = withDot.slice(0, -1);
    if (base === "greg") {
      return topLevel().map(toCompletion);
    }
    return membersOf(base).map(toCompletion);
  }
  // Partial member, e.g. "greg.player.mo" -> filter members of greg.player
  const lastDot = prefix.lastIndexOf(".");
  const base = prefix.slice(0, lastDot);
  const partial = prefix.slice(lastDot + 1).toLowerCase();
  const pool = base === "greg" ? topLevel() : membersOf(base);
  return pool
    .filter((s) => lastSegment(s.name).toLowerCase().startsWith(partial))
    .map(toCompletion);
}

function toCompletion(s: {
  name: string;
  signature: string;
  doc: string;
  snippet?: string;
}): Completion {
  const label = lastSegment(s.name);
  const hasMembers = LUA_API.some(
    (o) => o.name !== s.name && o.name.startsWith(s.name + ".")
  );
  return {
    label,
    detail: s.signature,
    doc: s.doc,
    snippet: s.snippet ?? label,
    kind: hasMembers ? "module" : "function",
  };
}

function lifecycleCompletions(): Completion[] {
  return LIFECYCLE.map((l) => ({
    label: l.name,
    detail: l.signature,
    doc: l.doc,
    snippet: l.body,
    kind: "snippet" as const,
  }));
}

function lastSegment(dotted: string): string {
  const i = dotted.lastIndexOf(".");
  return i < 0 ? dotted : dotted.slice(i + 1);
}

/** Hover lookup for an exact dotted word. */
export function lookup(word: string):
  | { signature: string; doc: string }
  | null {
  const hit =
    LUA_API.find((s) => s.name === word) ??
    LIFECYCLE.find((l) => l.name === word);
  if (!hit) return null;
  return { signature: hit.signature, doc: hit.doc };
}
