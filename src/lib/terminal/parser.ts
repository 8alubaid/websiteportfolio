import type { ParsedInput } from "./types";

/**
 * Split input into tokens, honouring single and double quotes.
 * Unterminated quotes consume the rest of the line.
 */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let inToken = false;

  for (const char of input) {
    if (quote) {
      if (char === quote) quote = null;
      else current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      inToken = true;
    } else if (/\s/.test(char)) {
      if (inToken) tokens.push(current);
      current = "";
      inToken = false;
    } else {
      current += char;
      inToken = true;
    }
  }
  if (inToken) tokens.push(current);
  return tokens;
}

export function parse(input: string): ParsedInput {
  const raw = input.trim();
  const [first = "", ...rest] = tokenize(raw);
  const args: string[] = [];
  const flags = new Set<string>();

  for (const token of rest) {
    if (/^--[a-z]/i.test(token)) flags.add(token.slice(2).toLowerCase());
    else if (/^-[a-z]+$/i.test(token)) for (const f of token.slice(1)) flags.add(f.toLowerCase());
    else args.push(token);
  }

  return { raw, name: first.toLowerCase(), args, flags };
}

/** Levenshtein distance, used for "did you mean" suggestions. */
export function editDistance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = temp;
    }
  }
  return prev[b.length];
}

/** Closest candidates to `input`, best first. */
export function suggest(input: string, candidates: readonly string[], max = 3): string[] {
  const needle = input.toLowerCase();
  const limit = Math.max(1, Math.floor(needle.length / 3) + 1);
  return candidates
    .map((c) => ({ c, d: c.startsWith(needle) ? 0 : editDistance(needle, c) }))
    .filter(({ d }) => d <= limit)
    .sort((x, y) => x.d - y.d || x.c.localeCompare(y.c))
    .slice(0, max)
    .map(({ c }) => c);
}
