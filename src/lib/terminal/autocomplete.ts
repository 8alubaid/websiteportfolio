import { projects, sectors } from "@/data";
import { findCommand, visibleCommandNames } from "./commands";
import { tokenize } from "./parser";
import type { CommandContext } from "./types";

export interface Completion {
  /** The new input value. Unchanged when nothing could be completed. */
  value: string;
  /** Candidates to show when the completion is ambiguous. */
  options: string[];
}

function commonPrefix(values: string[]): string {
  if (!values.length) return "";
  let prefix = values[0];
  for (const v of values.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < v.length && prefix[i].toLowerCase() === v[i].toLowerCase()) i++;
    prefix = prefix.slice(0, i);
  }
  return prefix;
}

/** Bash-style completion for command names, project slugs, sectors, and paths. */
export function complete(input: string, ctx: CommandContext): Completion {
  const endsWithSpace = /\s$/.test(input);
  const tokens = tokenize(input);
  if (endsWithSpace || tokens.length === 0) tokens.push("");

  const partial = tokens[tokens.length - 1];
  const before = input.slice(0, input.length - partial.length);
  const lower = partial.toLowerCase();

  let candidates: string[];
  if (tokens.length === 1) {
    // Command names, plus bare project slugs which also work as commands.
    candidates = [...visibleCommandNames(), ...projects.map((p) => p.slug), ...sectors.map((s) => s.id)];
  } else {
    const command = findCommand(tokens[0]);
    const args = tokens.slice(1);
    candidates = command?.complete?.(args.length - 1, args, ctx) ?? [];
  }

  const matches = [...new Set(candidates.filter((c) => c.toLowerCase().startsWith(lower)))].sort();
  if (matches.length === 0) return { value: input, options: [] };

  if (matches.length === 1) {
    const match = matches[0];
    const suffix = match.endsWith("/") ? "" : " ";
    return { value: before + match + suffix, options: [] };
  }

  const prefix = commonPrefix(matches);
  return {
    value: prefix.length > partial.length ? before + prefix : input,
    options: matches,
  };
}
