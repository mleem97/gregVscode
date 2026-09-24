# gregCore Mod Tools (VS Code)

IntelliSense, snippets, scaffolding and GregLint integration for
[gregCore](https://github.com/mleem97/gregCore) Data Center mods —
Lua, JS/TS, Rust and C#.

## Install

- Marketplace: *gregCore Mod Tools* (publisher `mleem97`), or
- Manual: download the `.vsix` from
  [Releases](https://github.com/mleem97/gregVscode/releases), then
  `Extensions → … → Install from VSIX`.

Requires VS Code 1.93+. The GregLint features need the
[`greglint` binary](https://github.com/mleem97/gregLint) on `PATH`
(configurable via `gregcore.greglintPath`).

## Features

| Area | What you get |
|---|---|
| **Lua IntelliSense** | `greg.*` completions (130+ API entries with docs) on `greg.` / `greg.<module>.`, hover docs, lifecycle snippets (`on_init`, `on_update`, …). Toggle: `gregcore.luaIntelliSense`. |
| **JS/TS IntelliSense** | Command *GregCore: Setup JS IntelliSense* copies the bundled `greg.d.ts` + writes `jsconfig.json` into the mod folder — full completion via the built-in TS server. |
| **mod.json + manifest.json** | Schema validation, completion and hover for `**/mod.json` (id/entry/name/version/…) and `**/Mods/manifest.json` (Name/Mods/Library/Plugins). |
| **Snippets** | `gregmod` skeletons + API snippets for Lua, JS/TS, Rust (`greg_mod_*` lifecycle) and C# (`GregMod`, hooks, deps). |
| **Scaffolding** | *GregCore: New Lua/JS/Rust Mod…* — target folder + mod id, placeholders filled, entry file opened. |
| **GregLint** | *GregCore: Lint Mod* runs `greglint` on a file/folder with results in the Problems panel (`$greglint` matcher); `greglint` task type for `tasks.json` (path, severityFloor, fix). |

`greg.d.ts` is bundled from gregCore `templates/js/` (same contract);
the Lua API data mirrors `docs/lua-api-reference.md`.

## Configuration

| Setting | Default | Meaning |
|---|---|---|
| `gregcore.greglintPath` | `greglint` | Path to the greglint binary |
| `gregcore.defaultAuthor` | `""` | Author inserted by scaffolds |
| `gregcore.luaIntelliSense` | `true` | Lua completion + hover on/off |

## Development

```bash
npm install
npm test        # tsc + node --test (offline, no vscode download)
npm run package # vsce package
```

See [`docs/development.md`](docs/development.md), [`AGENTS.md`](AGENTS.md),
[`CHANGELOG.md`](CHANGELOG.md).
