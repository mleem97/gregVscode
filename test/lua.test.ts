import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dottedPrefix, completeFor, lookup } from "../src/lua.js";

describe("dottedPrefix", () => {
  it("keeps trailing dots", () => {
    assert.equal(dottedPrefix("  greg.player."), "greg.player.");
    assert.equal(dottedPrefix("x = greg.player.mo"), "greg.player.mo");
    assert.equal(dottedPrefix("greg"), "greg");
  });

  it("rejects non-identifiers", () => {
    assert.equal(dottedPrefix(""), null);
    assert.equal(dottedPrefix("   "), null);
    assert.equal(dottedPrefix("5"), null);
    assert.equal(dottedPrefix('("'), null);
  });
});

describe("completeFor", () => {
  it("expands greg. to top level", () => {
    const items = completeFor("greg.");
    assert.ok(items.length > 10);
    assert.ok(items.some((i) => i.label === "player" && i.kind === "module"));
    assert.ok(items.some((i) => i.label === "on" && i.kind === "function"));
  });

  it("expands a module", () => {
    const items = completeFor("greg.player.");
    assert.ok(items.every((i) => i.detail.length > 0 && i.doc.length > 0));
    assert.ok(items.some((i) => i.label === "money"));
  });

  it("filters partial members", () => {
    const items = completeFor("greg.player.mo");
    assert.ok(items.length >= 1);
    assert.ok(items.every((i) => i.label.toLowerCase().startsWith("mo")));
  });

  it("falls back to lifecycle snippets off greg", () => {
    const items = completeFor("zzz");
    assert.ok(items.some((i) => i.label === "on_init" && i.kind === "snippet"));
    const bare = completeFor("greg");
    assert.ok(bare.some((i) => i.label === "on_update"));
  });
});

describe("lookup", () => {
  it("finds exact symbols", () => {
    const hit = lookup("greg.player.money");
    assert.ok(hit);
    assert.ok(hit.signature.includes("number"));
    assert.equal(lookup("on_init")?.signature, "on_init()");
  });

  it("misses unknown words", () => {
    assert.equal(lookup("greg.nope"), null);
    assert.equal(lookup("print"), null);
  });
});
