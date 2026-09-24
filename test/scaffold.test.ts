import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  scaffold,
  isValidModId,
  sanitizeCrateName,
} from "../src/scaffold.js";

const TEMPLATES = path.join(__dirname, "..", "..", "templates");
let work: string;

before(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), "gregvscode-"));
});

after(() => {
  fs.rmSync(work, { recursive: true, force: true });
});

describe("isValidModId", () => {
  it("accepts lowercase ids", () => {
    assert.equal(isValidModId("mymod"), true);
    assert.equal(isValidModId("my-mod_2.0"), true);
  });

  it("rejects the rest", () => {
    assert.equal(isValidModId(""), false);
    assert.equal(isValidModId("MyMod"), false);
    assert.equal(isValidModId("my mod"), false);
    assert.equal(isValidModId("-mod"), false);
  });
});

describe("sanitizeCrateName", () => {
  it("maps mod ids to crate names", () => {
    assert.equal(sanitizeCrateName("my-mod"), "my_mod");
    assert.equal(sanitizeCrateName("a.b"), "a_b");
    assert.equal(sanitizeCrateName("9lives"), "mod_9lives");
    assert.equal(sanitizeCrateName("ok_name2"), "ok_name2");
  });
});

describe("scaffold", () => {
  it("copies lua-mod with placeholders replaced", () => {
    const written = scaffold(path.join(TEMPLATES, "lua-mod"), work, {
      modId: "demo",
      modName: "Demo",
      author: "me",
      description: "demo mod",
    });
    assert.ok(written.length >= 2);
    const main = fs.readFileSync(path.join(work, "demo", "main.lua"), "utf8");
    assert.ok(main.includes("[demo]"));
    assert.ok(!main.includes("__MOD_ID__"));
    const manifest = fs.readFileSync(
      path.join(work, "demo", "mod.json"),
      "utf8"
    );
    assert.ok(manifest.includes('"author": "me"'));
  });

  it("rejects bad ids, existing targets, missing templates", () => {
    assert.throws(() =>
      scaffold(path.join(TEMPLATES, "lua-mod"), work, {
        modId: "Bad!",
        modName: "x",
        author: "",
        description: "",
      })
    );
    assert.throws(() =>
      scaffold(path.join(TEMPLATES, "lua-mod"), work, {
        modId: "demo",
        modName: "x",
        author: "",
        description: "",
      })
    );
    assert.throws(() =>
      scaffold(path.join(TEMPLATES, "nope"), work, {
        modId: "other",
        modName: "x",
        author: "",
        description: "",
      })
    );
  });
});
