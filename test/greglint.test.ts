import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseLine, buildArgs, summarize } from "../src/greglint.js";

describe("parseLine", () => {
  it("parses error/warning/info lines", () => {
    assert.deepEqual(parseLine("error GL104 m/mod.json id: Missing required \"id\"."), {
      severity: "error",
      rule: "GL104",
      file: "m/mod.json",
      subject: "id",
      message: 'Missing required "id".',
    });
    assert.equal(parseLine("warning GL005 a.dll Foo: No identity.")?.severity, "warning");
    assert.equal(parseLine("info GL009 x y: z.")?.severity, "info");
  });

  it("rejects non-findings", () => {
    assert.equal(parseLine(""), null);
    assert.equal(parseLine("greglint: 0 error(s) in 0 files."), null);
    assert.equal(parseLine("fixed normalized m/mod.json (backup .bak)"), null);
    assert.equal(parseLine("bogus GL104 m/mod.json id: x."), null);
  });
});

describe("buildArgs", () => {
  it("builds minimal and full argv", () => {
    assert.deepEqual(buildArgs("Mods/"), ["Mods/"]);
    assert.deepEqual(
      buildArgs("Mods/", {
        severityFloor: "warning",
        fix: true,
        rules: ["GL001", "GL104"],
      }),
      ["--severity-floor", "warning", "--fix", "--rules", "GL001,GL104", "Mods/"]
    );
    assert.deepEqual(buildArgs("a.dll", { rules: [] }), ["a.dll"]);
  });
});

describe("summarize", () => {
  it("counts by severity", () => {
    assert.deepEqual(
      summarize([
        { severity: "error", rule: "GL001", file: "a", subject: "s", message: "m" },
        { severity: "warning", rule: "GL005", file: "a", subject: "s", message: "m" },
        { severity: "warning", rule: "GL007", file: "a", subject: "s", message: "m" },
      ]),
      { errors: 1, warnings: 2, infos: 0 }
    );
    assert.deepEqual(summarize([]), { errors: 0, warnings: 0, infos: 0 });
  });
});
