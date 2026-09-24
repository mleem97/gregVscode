# Development — gregVscode

## Prereqs

Node 20+ and npm (registry access for the one-time install).

```bash
npm install
```

## Build / test / package

```bash
npm test        # tsc compile + node --test out/test/ (offline)
npm run package # vsce package -> gregcore-vscode-<version>.vsix
```

Tests are plain `node:test` suites (no `@vscode/test-electron`, no VS Code
download): `test/` mirrors `src/`, and all logic under test imports
nothing from `vscode` (`src/extension.ts` is glue only — keep it that way).

## Debug the extension

Open this folder in VS Code, press F5 (a stock launch config works:
type `extensionHost`, request `launch`, `runtimeExecutable` default).
Use an Extension Development Host with a Lua/JS test workspace.

## Publish checklist

1. `VERSION` + `package.json` version moved together.
2. `CHANGELOG.md` Unreleased entry written.
3. `npm test` green, `npm run package` clean (no vsce warnings except
   the known punycode deprecation).
4. Publish via Marketplace (manual upload or `vsce publish`), then tag
   `v<version>` on the release commit.
