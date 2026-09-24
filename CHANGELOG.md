# Changelog — gregVscode

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Version: see [`VERSION`](VERSION)
and `package.json` (both move together).

## [Unreleased]

## [1.0.0]

### Added

- Initial release: gregCore Mod Tools for VS Code.
- Lua IntelliSense: `greg.*` completions (130+ entries) + hover docs +
  lifecycle snippets (data mirrors `docs/lua-api-reference.md`).
- JS/TS IntelliSense via bundled `greg.d.ts` + setup command
  (`greg.d.ts` + `jsconfig.json`).
- JSON schemas for `mod.json` and `Mods/manifest.json`.
- Snippets for Lua, JS/TS, Rust, C#.
- Scaffolding commands (Lua/JS/Rust mods with placeholder fill).
- GregLint task provider, `$greglint` problem matcher, lint command.
- 22 offline tests (`node:test`, no VS Code download).
