import { getProject, isSectorId } from "@/data";
import { findCommand, visibleCommandNames } from "./commands";
import { parse, suggest } from "./parser";
import type { CommandContext, CommandResult, ParsedInput } from "./types";

/**
 * Execute one line of input. Pure apart from `date`: the caller applies the
 * returned effects (clear, navigate, cwd changes) to its own state.
 */
export function execute(raw: string, ctx: CommandContext): { input: ParsedInput; result: CommandResult } {
  const input = parse(raw);
  if (!input.name) return { input, result: { blocks: [] } };

  const command = findCommand(input.name);
  if (command) return { input, result: command.run(input, ctx) };

  // Shortcuts: typing a project name or area on its own opens it.
  if (getProject(input.name) || isSectorId(input.name)) {
    const projects = findCommand("projects")!;
    const forwarded = { ...input, args: [input.name, ...input.args], name: "projects" };
    return { input, result: projects.run(forwarded, ctx) };
  }

  const matches = suggest(input.name, visibleCommandNames());
  return {
    input,
    result: {
      blocks: [
        {
          type: "error",
          spans: [
            `command not found: ${input.name}`,
            ...(matches.length
              ? [
                  { text: "  Did you mean ", tone: "muted" as const },
                  ...matches.flatMap((m, i) => [
                    ...(i ? [{ text: ", ", tone: "muted" as const }] : []),
                    { text: m, command: m, tone: "strong" as const },
                  ]),
                  { text: "?", tone: "muted" as const },
                ]
              : []),
          ],
        },
        ...(matches.length
          ? []
          : [
              {
                type: "line" as const,
                spans: [
                  { text: "Run ", tone: "muted" as const },
                  { text: "help", command: "help", tone: "strong" as const },
                  { text: " for available commands.", tone: "muted" as const },
                ],
              },
            ]),
      ],
      announce: `Command not found: ${input.name}.${matches.length ? ` Did you mean ${matches.join(", ")}?` : ""}`,
    },
  };
}
