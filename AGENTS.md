# AGENTS.md — Notes for AI Agents (gregVscode)

Repo: [https://github.com/mleem97/gregVscode](https://github.com/mleem97/gregVscode) · License: Apache-2.0 · Version: see `VERSION`.

## Duties

1. **Read first:** `README.md`, `docs/development.md` — only then make changes.
2. **Do not commit secrets** (keys, tokens, `.env`). Only via environment variables.
3. **Preserve history:** no `push --force`, no history rewrite without instruction.
4. **Verify changes:** `npm test` (tsc + node --test, offline) and `npm run package` (vsce) before reporting done.
5. **Keep docs in sync:** API data changes update `src/data/*` + tests + `CHANGELOG.md` (Unreleased) together. The bundled `templates/js-mod/greg.d.ts` mirrors gregCore `templates/js/greg.d.ts` — note upstream drift in the changelog.
6. **Conventions:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …), one logical change per commit. Marketplace version in `package.json` and `VERSION` move together.
7. **If unsure:** stop and ask instead of guessing — especially for deletes, marketplace publishes, CI.

## Architecture rules

- Keep vscode-dependent code thin (`src/extension.ts` = glue only).
- All logic (`src/data/*`, `src/lua.ts`, `src/scaffold.ts`, `src/greglint.ts`) stays import-free of `vscode` so `node --test` covers it without a VS Code download.
- No runtime npm dependencies (zero-dependency extension).
- Problem-matcher regex and greglint text format move together (see `src/greglint.ts` + `package.json`).
- Snippet files must stay valid JSON; template files use `__PLACEHOLDER__` (replaced by `scaffold.ts`), never snippet `$`-syntax.

## Layout

- `src/` — `extension.ts` (glue), `data/` (Lua API), `lua.ts`/`scaffold.ts`/`greglint.ts` (logic).
- `test/` — `node:test` suites mirroring `src/`.
- `snippets/`, `schemas/`, `templates/` — contributed assets.
- `docs/development.md` — build/test/package flow.
