// Pure helpers around the greglint CLI (no vscode dependency).
// Output line shape (greglint text format):
//   "<severity> <RULE> <file> <subject>: <message>"

export type GreglintSeverity = "error" | "warning" | "info";

export interface GreglintFinding {
  severity: GreglintSeverity;
  rule: string;
  file: string;
  subject: string;
  message: string;
}

export interface GreglintOptions {
  /** Binary path (default "greglint"). */
  binary?: string;
  /** Fail from this severity up. */
  severityFloor?: "info" | "warning" | "error";
  /** Apply safe auto-fixes. */
  fix?: boolean;
  /** Only these rule IDs. */
  rules?: string[];
}

const LINE_RE =
  /^(error|warning|info)\s+(GL\d+)\s+(\S+)\s+([^:]*):\s+(.*)$/;

/** Parses one greglint text line; null when it is not a finding. */
export function parseLine(line: string): GreglintFinding | null {
  const m = LINE_RE.exec(line.trim());
  if (!m) return null;
  return {
    severity: m[1] as GreglintSeverity,
    rule: m[2],
    file: m[3],
    subject: m[4].trim(),
    message: m[5].trim(),
  };
}

/** Builds the argv for a greglint run. */
export function buildArgs(targetPath: string, opts: GreglintOptions = {}): string[] {
  const args: string[] = [];
  if (opts.severityFloor) args.push("--severity-floor", opts.severityFloor);
  if (opts.fix) args.push("--fix");
  if (opts.rules && opts.rules.length > 0) args.push("--rules", opts.rules.join(","));
  args.push(targetPath);
  return args;
}

/** Summarizes parsed findings. */
export function summarize(findings: GreglintFinding[]): {
  errors: number;
  warnings: number;
  infos: number;
} {
  return {
    errors: findings.filter((f) => f.severity === "error").length,
    warnings: findings.filter((f) => f.severity === "warning").length,
    infos: findings.filter((f) => f.severity === "info").length,
  };
}
