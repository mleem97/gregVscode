import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LUA_API, LIFECYCLE, topLevel, membersOf } from "../src/data/luaApi.js";

describe("luaApi data", () => {
  it("has unique names", () => {
    const names = LUA_API.map((s) => s.name);
    assert.equal(new Set(names).size, names.length);
  });

  it("every symbol has signature and doc", () => {
    for (const s of LUA_API) {
      assert.ok(s.signature.length > 0, s.name);
      assert.ok(s.doc.length > 0, s.name);
      assert.ok(s.name.startsWith("greg."), s.name);
    }
    assert.ok(LUA_API.length > 100, `only ${LUA_API.length} entries`);
  });

  it("lifecycle has the five callbacks", () => {
    const names = LIFECYCLE.map((l) => l.name).sort();
    assert.deepEqual(names, [
      "on_init",
      "on_reload",
      "on_scene_loaded",
      "on_shutdown",
      "on_update",
    ]);
    for (const l of LIFECYCLE) {
      assert.ok(l.body.includes(l.name), l.name);
    }
  });

  it("topLevel exposes modules once", () => {
    const tops = topLevel().map((t) => t.name);
    assert.ok(tops.includes("greg.player"));
    assert.ok(tops.includes("greg.shop"));
    assert.ok(tops.includes("greg.on"));
    assert.equal(new Set(tops).size, tops.length);
  });

  it("membersOf filters by module", () => {
    const members = membersOf("greg.player");
    assert.ok(members.length > 5);
    for (const m of members) {
      assert.ok(m.name.startsWith("greg.player."));
    }
    assert.deepEqual(membersOf("greg.nope"), []);
  });
});
