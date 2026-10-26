import type { PipelineStep, Result } from "@/types/portfolio";

/**
 * Renderer-agnostic terminal output. Commands return these structures and the
 * React renderer decides how to draw them, so command logic never touches JSX.
 */

/**
 * Monochrome emphasis levels. The renderer maps these to type weight, never to color:
 * the whole interface uses three colors (see globals.css).
 */
export type Tone = "default" | "strong" | "muted";

export type Span =
  | string
  | { text: string; tone?: Tone; bold?: boolean }
  /** Link. Internal hrefs start with `/`. */
  | { text: string; href: string; external?: boolean }
  /** Clickable span that runs a terminal command. */
  | { text: string; command: string; tone?: Tone };

export interface Action {
  label: string;
  command?: string;
  href?: string;
  external?: boolean;
}

export type Block =
  | { type: "line"; spans: Span[] }
  | { type: "paragraph"; text: string; tone?: Tone }
  | { type: "heading"; text: string; meta?: string }
  | { type: "section"; text: string }
  | { type: "blank" }
  | { type: "rows"; rows: { key: Span[]; value: Span[] }[] }
  | { type: "list"; items: Span[][]; bullet?: string }
  | { type: "grid"; items: Span[] }
  | { type: "tags"; tags: string[] }
  | { type: "pipeline"; steps: PipelineStep[] }
  | { type: "results"; results: Result[] }
  | { type: "actions"; actions: Action[] }
  | { type: "error"; spans: Span[] };

export type Effect =
  | { type: "clear" }
  | { type: "navigate"; href: string; external?: boolean }
  | { type: "cwd"; path: string }
  /** Remember the project the visitor is looking at, for mode switching. */
  | { type: "focus-project"; slug: string };

export interface CommandResult {
  blocks: Block[];
  effects?: Effect[];
  /** Short plain-text summary for screen readers. */
  announce?: string;
}

export interface ParsedInput {
  raw: string;
  /** Lower-cased command name, or "" for empty input. */
  name: string;
  /** Positional arguments in original case. */
  args: string[];
  /** Flags without leading dashes, lower-cased (`--deep` → `deep`, `-l` → `l`). */
  flags: Set<string>;
}

export interface CommandContext {
  cwd: string;
  history: readonly string[];
  /** Project the visitor last viewed (in either mode), used by `mode portfolio`. */
  focusProject?: string;
}

export type CommandGroup = "portfolio" | "navigation" | "system";

export interface Command {
  name: string;
  aliases?: string[];
  group: CommandGroup;
  /** One-line description for the help directory. */
  summary: string;
  usage: string;
  details?: string[];
  examples?: string[];
  /** Hidden commands work but aren't listed in `help`. */
  hidden?: boolean;
  /** Candidates for the argument at `index` (0-based). */
  complete?: (index: number, args: string[], ctx: CommandContext) => string[];
  run: (input: ParsedInput, ctx: CommandContext) => CommandResult;
}
