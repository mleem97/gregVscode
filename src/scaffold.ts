// Pure scaffold helpers (node fs/path only — no vscode dependency).
// Templates live in <extension>/templates/<kind>-mod/ with
// __MOD_ID__ / __MOD_NAME__ / __AUTHOR__ / __DESCRIPTION__ placeholders.

import * as fs from "node:fs";
import * as path from "node:path";

export interface ScaffoldVars {
  modId: string;
  modName: string;
  author: string;
  description: string;
}

export function isValidModId(modId: string): boolean {
  return /^[a-z0-9][a-z0-9_.-]*$/.test(modId);
}

/** crate-name safe (dashes/dots become underscores). */
export function sanitizeCrateName(modId: string): string {
  const clean = modId.replace(/[-.]/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  return /^[0-9]/.test(clean) ? `mod_${clean}` : clean || "greg_mod";
}

function applyVars(text: string, vars: ScaffoldVars): string {
  return text
    .replaceAll("__MOD_ID__", vars.modId)
    .replaceAll("__MOD_NAME__", vars.modName)
    .replaceAll("__AUTHOR__", vars.author)
    .replaceAll("__DESCRIPTION__", vars.description)
    .replaceAll("__CRATE_NAME__", sanitizeCrateName(vars.modId));
}

function copyDir(src: string, dst: string, vars: ScaffoldVars): string[] {
  const written: string[] = [];
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      written.push(...copyDir(from, to, vars));
    } else if (entry.isFile()) {
      const raw = fs.readFileSync(from, "utf8");
      fs.writeFileSync(to, applyVars(raw, vars), "utf8");
      written.push(to);
    }
  }
  return written.sort();
}

/**
 * Copies a bundled template into `<targetParent>/<modId>/` with
 * placeholders replaced. Throws when the target exists or the
 * template is missing. Returns written files (sorted).
 */
export function scaffold(
  templateDir: string,
  targetParent: string,
  vars: ScaffoldVars
): string[] {
  if (!isValidModId(vars.modId)) {
    throw new Error(`Invalid mod id "${vars.modId}" (lowercase, digits, _ . -).`);
  }
  if (!fs.existsSync(templateDir) || !fs.statSync(templateDir).isDirectory()) {
    throw new Error(`Template not found: ${templateDir}`);
  }
  const target = path.join(targetParent, vars.modId);
  if (fs.existsSync(target)) {
    throw new Error(`Target exists: ${target}`);
  }
  return copyDir(templateDir, target, vars);
}
