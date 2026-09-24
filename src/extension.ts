// gregCore Mod Tools — thin vscode glue. All logic lives in the
// pure modules (./data/luaApi, ./lua, ./scaffold, ./greglint)
// so it stays unit-testable without the vscode host.

import * as path from "node:path";
import * as fs from "node:fs";
import * as vscode from "vscode";
import { completeFor, dottedPrefix, lookup } from "./lua";
import { scaffold, isValidModId } from "./scaffold";
import { buildArgs } from "./greglint";

function templatesDir(ctx: vscode.ExtensionContext): string {
  return path.join(ctx.extensionPath, "templates");
}

function cfg<T>(key: string, fallback: T): T {
  try {
    const v = vscode.workspace.getConfiguration("gregcore").get<T>(key);
    return v === undefined || v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

function luaEnabled(): boolean {
  return cfg<boolean>("luaIntelliSense", true);
}

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "lua",
      {
        provideCompletionItems(doc, pos) {
          if (!luaEnabled()) return undefined;
          const line = doc.lineAt(pos.line).text.slice(0, pos.character);
          const prefix = dottedPrefix(line);
          if (prefix === null) return undefined;
          return completeFor(prefix).map((c) => {
            const item = new vscode.CompletionItem(
              c.label,
              c.kind === "module"
                ? vscode.CompletionItemKind.Module
                : c.kind === "snippet"
                  ? vscode.CompletionItemKind.Snippet
                  : vscode.CompletionItemKind.Function
            );
            item.detail = c.detail;
            item.documentation = new vscode.MarkdownString(c.doc);
            item.insertText = new vscode.SnippetString(c.snippet);
            // Replace the whole dotted prefix with the snippet.
            const start = Math.max(0, pos.character - prefix.length);
            item.range = new vscode.Range(pos.line, start, pos.line, pos.character);
            return item;
          });
        },
      },
      "."
    ),
    vscode.languages.registerHoverProvider("lua", {
      provideHover(doc, pos) {
        if (!luaEnabled()) return undefined;
        const range = doc.getWordRangeAtPosition(pos, /[\w.]+/);
        if (!range) return undefined;
        const hit = lookup(doc.getText(range));
        if (!hit) return undefined;
        return new vscode.Hover(
          new vscode.MarkdownString(`\`${hit.signature}\`\n\n${hit.doc}`)
        );
      },
    }),
    vscode.commands.registerCommand("gregcore.newLuaMod", () =>
      newMod(ctx, "lua-mod", "UserData/gregCore/Mods/Lua")
    ),
    vscode.commands.registerCommand("gregcore.newJsMod", () =>
      newMod(ctx, "js-mod", "UserData/gregCore/Mods/JS")
    ),
    vscode.commands.registerCommand("gregcore.newRustMod", () =>
      newMod(ctx, "rust-mod", undefined)
    ),
    vscode.commands.registerCommand("gregcore.setupJsIntelliSense", () =>
      setupJs(ctx)
    ),
    vscode.commands.registerCommand("gregcore.lintMod", () => lintMod()),
    vscode.tasks.registerTaskProvider("greglint", {
      provideTasks() {
        return [];
      },
      resolveTask(task) {
        const def = task.definition as {
          path?: string;
          severityFloor?: string;
          fix?: boolean;
        };
        if (!def || typeof def.path !== "string") return undefined;
        const binary = cfg<string>("greglintPath", "greglint");
        const args = buildArgs(def.path, {
          severityFloor: (def.severityFloor as "info" | "warning" | "error") ?? "error",
          fix: def.fix ?? false,
        });
        const shell = new vscode.ShellExecution(
          `"${binary}" ${args.map((a) => `"${a}"`).join(" ")}`
        );
        return new vscode.Task(
          task.definition,
          task.scope ?? vscode.TaskScope.Workspace,
          task.name,
          "greglint",
          shell,
          "$greglint"
        );
      },
    })
  );
}

async function pickTargetDir(hint?: string): Promise<string | undefined> {
  const folders = vscode.workspace.workspaceFolders;
  const defaultUri =
    folders && folders.length > 0
      ? vscode.Uri.joinPath(folders[0].uri, ...(hint ? hint.split("/") : []))
      : undefined;
  const picked = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri,
    openLabel: "Select target folder",
  });
  return picked && picked.length > 0 ? picked[0].fsPath : undefined;
}

async function newMod(
  ctx: vscode.ExtensionContext,
  template: string,
  hint: string | undefined
): Promise<void> {
  const parent = await pickTargetDir(hint);
  if (!parent) return;
  const modId = await vscode.window.showInputBox({
    prompt: "Mod id (lowercase, folder name)",
    validateInput: (v) =>
      isValidModId(v) ? null : "Lowercase letters, digits, _ . - only.",
  });
  if (!modId) return;
  const author = cfg<string>("defaultAuthor", "");
  const vars = {
    modId,
    modName: modId,
    author,
    description: `${modId} — gregCore mod`,
  };
  try {
    const written = scaffold(
      path.join(templatesDir(ctx), template),
      parent,
      vars
    );
    const first = written.find(
      (f) =>
        f.endsWith("main.lua") || f.endsWith("main.js") || f.endsWith("lib.rs")
    );
    if (first) {
      const doc = await vscode.workspace.openTextDocument(first);
      await vscode.window.showTextDocument(doc);
    }
    vscode.window.showInformationMessage(`gregCore mod created: ${modId}`);
  } catch (ex) {
    vscode.window.showErrorMessage(
      `Scaffold failed: ${ex instanceof Error ? ex.message : String(ex)}`
    );
  }
}

async function setupJs(ctx: vscode.ExtensionContext): Promise<void> {
  const dir = await pickTargetDir("UserData/gregCore/Mods/JS");
  if (!dir) return;
  try {
    fs.copyFileSync(
      path.join(templatesDir(ctx), "js-mod", "greg.d.ts"),
      path.join(dir, "greg.d.ts")
    );
    const jsconfig = path.join(dir, "jsconfig.json");
    if (!fs.existsSync(jsconfig)) {
      fs.writeFileSync(
        jsconfig,
        JSON.stringify(
          {
            compilerOptions: {
              target: "es2020",
              allowJs: true,
              checkJs: false,
            },
            include: ["*.js", "greg.d.ts"],
          },
          null,
          2
        ) + "\n",
        "utf8"
      );
    }
    vscode.window.showInformationMessage(
      "JS IntelliSense ready (greg.d.ts + jsconfig.json)."
    );
  } catch (ex) {
    vscode.window.showErrorMessage(
      `Setup failed: ${ex instanceof Error ? ex.message : String(ex)}`
    );
  }
}

async function lintMod(): Promise<void> {
  const active = vscode.window.activeTextEditor?.document.uri;
  let fallback: string | undefined;
  if (active?.scheme === "file") {
    fallback = path.dirname(active.fsPath);
  } else if (vscode.workspace.workspaceFolders?.length) {
    fallback = vscode.workspace.workspaceFolders[0].uri.fsPath;
  }
  const picked = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri: fallback ? vscode.Uri.file(fallback) : undefined,
    openLabel: "Lint this mod / folder",
  });
  const target = picked && picked.length > 0 ? picked[0].fsPath : fallback;
  if (!target) return;
  const binary = cfg<string>("greglintPath", "greglint");
  const task = new vscode.Task(
    { type: "greglint", path: target, severityFloor: "error" },
    vscode.TaskScope.Workspace,
    "greglint",
    "greglint",
    new vscode.ShellExecution(`"${binary}" "${target}"`),
    "$greglint"
  );
  task.presentationOptions = {
    reveal: vscode.TaskRevealKind.Silent,
    clear: true,
  };
  await vscode.tasks.executeTask(task);
}

export function deactivate(): void {
  // No background work to stop.
}
