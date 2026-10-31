import { describe, expect, it } from "vitest";
import { projects } from "@/data";
import { criteria, designComparison, pairs, stats } from "@/data/case-study";
import { complete } from "./autocomplete";
import { commands } from "./commands";
import { execute } from "./engine";
import { HOME, displayPath, getNode, resolvePath } from "./filesystem";
import { parse, suggest, tokenize } from "./parser";
import type { Block, CommandContext, CommandResult } from "./types";

const ctx = (over: Partial<CommandContext> = {}): CommandContext => ({ cwd: HOME, history: [], ...over });
const P = `${HOME}/projects`;

const textOf = (blocks: Block[]): string => JSON.stringify(blocks);

/** Runs commands in sequence, applying `cwd` effects the way TerminalApp does. */
function shell(...lines: string[]) {
  let cwd = HOME;
  let last: CommandResult = { blocks: [] };
  for (const line of lines) {
    last = execute(line, ctx({ cwd })).result;
    for (const e of last.effects ?? []) if (e.type === "cwd") cwd = e.path;
  }
  return { cwd, out: textOf(last.blocks), result: last };
}

const homeEntries = ["about.txt", "experience.log", "contact.txt", "projects/", "skills/", "credentials/"];

describe("parser", () => {
  it("tokenizes quotes and whitespace", () => {
    expect(tokenize(`echo "hello world"  'a b' c`)).toEqual(["echo", "hello world", "a b", "c"]);
  });

  it("lower-cases the command and separates flags", () => {
    const p = parse("  PROJECTS Fatoorah --Deep -lx ");
    expect(p.name).toBe("projects");
    expect(p.args).toEqual(["Fatoorah"]);
    expect([...p.flags].sort()).toEqual(["deep", "l", "x"]);
  });

  it("suggests close commands", () => {
    expect(suggest("projcts", ["projects", "skills", "help"])).toContain("projects");
    expect(suggest("zzzzzz", ["projects", "skills"])).toEqual([]);
  });
});

describe("filesystem", () => {
  it("uses one absolute path model with ~ as home", () => {
    expect(HOME).toBe("/home/faris");
    expect(displayPath(HOME)).toBe("~");
    expect(displayPath(`${P}/stm32-tetris`)).toBe("~/projects/stm32-tetris");
    expect(displayPath("/")).toBe("/");
    expect(displayPath("/home")).toBe("/home");
  });

  it("resolves relative, absolute, home, . and .. paths", () => {
    expect(resolvePath(P, "stm32-tetris")).toBe(`${P}/stm32-tetris`);
    expect(resolvePath(`${P}/stm32-tetris`, "../..")).toBe(HOME);
    expect(resolvePath(`${HOME}/skills`, "~/projects")).toBe(P);
    expect(resolvePath(`${HOME}/skills`, "/home/faris/projects/")).toBe(P);
    expect(resolvePath(P, "./../skills//")).toBe(`${HOME}/skills`);
    expect(resolvePath(P, "~")).toBe(HOME);
    expect(resolvePath(P, "/")).toBe("/");
    expect(resolvePath("/", "..")).toBe("/");
  });

  it("resolves an empty path to the working directory (the original ls bug)", () => {
    expect(resolvePath(P, "")).toBe(P);
    expect(resolvePath(P)).toBe(P);
  });

  it("exposes a directory per project, built from the shared data", () => {
    for (const p of projects) expect(getNode(`${P}/${p.slug}`)?.kind).toBe("dir");
  });
});

describe("navigation", () => {
  it("ls from ~ lists home entries", () => {
    const { out } = shell("ls");
    for (const e of homeEntries) expect(out).toContain(`"${e}"`);
  });

  it("cd projects && ls lists project directories, not home", () => {
    const { cwd, out } = shell("cd projects/", "ls");
    expect(cwd).toBe(P);
    for (const p of projects) expect(out).toContain(`"${p.slug}/"`);
    expect(out).not.toContain('"about.txt"');
  });

  it("cd projects && pwd prints the absolute path", () => {
    expect(shell("cd projects", "pwd").out).toContain(`"${P}"`);
  });

  it("cd .. returns to the parent", () => {
    expect(shell("cd projects/high-altitude-balloon", "cd ..").cwd).toBe(P);
  });

  it("cd / goes to root, where ls shows home/", () => {
    const { cwd, out } = shell("cd projects", "cd /", "ls");
    expect(cwd).toBe("/");
    expect(out).toContain('"home/"');
  });

  it("cd ~ and bare cd return home", () => {
    expect(shell("cd projects", "cd ~").cwd).toBe(HOME);
    expect(shell("cd /", "cd").cwd).toBe(HOME);
  });

  it("ls with a path never changes the working directory", () => {
    const listed = shell("cd skills", "ls ../projects/");
    expect(listed.cwd).toBe(`${HOME}/skills`);
    for (const p of projects) expect(listed.out).toContain(`"${p.slug}/"`);

    const fromHome = shell("ls projects/");
    expect(fromHome.cwd).toBe(HOME);
    for (const p of projects) expect(fromHome.out).toContain(`"${p.slug}/"`);

    const root = shell("cd projects", "ls /");
    expect(root.cwd).toBe(P);
    expect(root.out).toContain('"home/"');
  });

  it("ls .. lists the parent", () => {
    const { out } = shell("cd projects", "ls ..");
    for (const e of homeEntries) expect(out).toContain(`"${e}"`);
  });

  it("invalid paths error and keep the working directory", () => {
    const bad = shell("cd projects", "cd invalid-directory");
    expect(bad.cwd).toBe(P);
    expect(bad.result.blocks[0].type).toBe("error");
    expect(shell("cd about.txt").result.blocks[0].type).toBe("error");
    expect(shell("ls nowhere").result.blocks[0].type).toBe("error");
  });

  it("cd into a project lists its files, and README.md shows that project", () => {
    const balloon = projects.find((p) => p.slug === "high-altitude-balloon")!;
    const inside = shell("cd projects/high-altitude-balloon", "ls");
    expect(inside.cwd).toBe(`${P}/high-altitude-balloon`);
    expect(inside.out).toContain('"README.md"');

    const local = shell("cd projects/high-altitude-balloon", "cat README.md").out;
    const fromHome = shell("cat projects/high-altitude-balloon/README.md").out;
    expect(local).toContain(balloon.title.toUpperCase());
    expect(local).toBe(fromHome);
  });

  it("global commands still work inside any directory", () => {
    const { out } = shell("cd projects/high-altitude-balloon", "projects");
    for (const p of projects) expect(out).toContain(`"${p.slug}"`);
    expect(shell("cd projects/high-altitude-balloon", "skills").out).toContain("SKILLS");
    expect(shell("cd /", "help").out).toContain("COMMANDS");
  });

  it("clickable ls entries emit commands that resolve the same way as typed ones", () => {
    expect(shell("ls").out).toContain('"command":"cd projects"');
    const elsewhere = shell("cd skills", "ls ~/projects").out;
    expect(elsewhere).toContain('"command":"cd ~/projects/high-altitude-balloon"');
    expect(shell("cd skills", "cd ~/projects/high-altitude-balloon").cwd).toBe(`${P}/high-altitude-balloon`);
  });
});

describe("commands", () => {
  it("every documented command runs without throwing", () => {
    for (const c of commands) {
      expect(() => execute(c.name, ctx())).not.toThrow();
    }
  });

  it("help lists the core directory", () => {
    const out = textOf(execute("help", ctx()).result.blocks);
    for (const name of ["whoami", "about", "ls", "projects", "skills", "experience", "education", "certifications", "contact", "resume", "clear", "mode portfolio"]) {
      expect(out).toContain(`"${name}"`);
    }
  });

  it("groups the help directory into sections", () => {
    const sections = execute("help", ctx()).result.blocks.filter((b) => b.type === "section");
    expect(sections.map((b) => (b.type === "section" ? b.text : ""))).toEqual(["Portfolio", "Navigation", "System"]);
  });

  it("cd is silent like a real shell", () => {
    expect(execute("cd projects", ctx()).result.blocks).toEqual([]);
  });

  it("is case-insensitive for command names", () => {
    expect(execute("WHOAMI", ctx()).result.blocks.length).toBeGreaterThan(0);
  });

  it("shows every project and focuses it", () => {
    for (const p of projects) {
      const { result } = execute(`projects ${p.slug}`, ctx());
      expect(textOf(result.blocks)).toContain(p.title.toUpperCase());
      expect(result.effects).toContainEqual({ type: "focus-project", slug: p.slug });
    }
  });

  it("filters projects by area", () => {
    const out = textOf(execute("projects embedded", ctx()).result.blocks);
    expect(out).toContain("stm32-tetris");
    expect(out).not.toContain("network-diagnostics");
  });

  it("supports bare project names as shortcuts", () => {
    expect(textOf(execute("stm32-tetris", ctx()).result.blocks)).toContain("TETRIS");
  });

  it("cd changes directory and rejects files", () => {
    expect(execute("cd projects/stm32-tetris", ctx()).result.effects).toContainEqual({ type: "cwd", path: `${P}/stm32-tetris` });
    expect(execute("cd about.txt", ctx()).result.blocks[0].type).toBe("error");
    expect(execute("cd nowhere", ctx()).result.blocks[0].type).toBe("error");
  });

  it("cat reads files relative to cwd", () => {
    const out = textOf(execute("cat README.md", ctx({ cwd: `${P}/stm32-tetris` })).result.blocks);
    expect(out).toContain("TETRIS");
    expect(execute("cat projects", ctx()).result.blocks[0].type).toBe("error");
  });

  it("keeps `mode explorer` as an undocumented alias", () => {
    expect(execute("mode explorer", ctx()).result.effects).toContainEqual({ type: "navigate", href: "/" });
  });

  it("mode portfolio navigates with project context", () => {
    expect(execute("mode portfolio", ctx()).result.effects).toContainEqual({ type: "navigate", href: "/" });
    expect(execute("mode portfolio", ctx({ focusProject: "stm32-tetris" })).result.effects).toContainEqual({
      type: "navigate",
      href: "/projects/stm32-tetris",
    });
  });

  it("open resolves projects, sections and paths", () => {
    expect(execute("open stm32-tetris", ctx()).result.effects?.[0]).toMatchObject({ href: "/projects/stm32-tetris" });
    expect(execute("open skills", ctx()).result.effects?.[0]).toMatchObject({ href: "/experience/#skills" });
    expect(execute("open", ctx({ cwd: `${P}/computer-vision` })).result.effects?.[0]).toMatchObject({
      href: "/projects/computer-vision",
    });
  });

  it("clear emits a clear effect", () => {
    expect(execute("clear", ctx()).result.effects).toContainEqual({ type: "clear" });
  });

  it("unknown commands fail gracefully with suggestions", () => {
    const { result } = execute("skils", ctx());
    expect(result.blocks[0].type).toBe("error");
    expect(textOf(result.blocks)).toContain('"command":"skills"');
  });

  it("never executes or exposes anything real", () => {
    for (const attempt of ["rm -rf /", "sudo ls", "env", "cat /etc/passwd", "cat ../../.env"]) {
      const out = textOf(execute(attempt, ctx()).result.blocks);
      expect(out).not.toMatch(/process\.env|NEXT_PUBLIC/);
    }
  });
});

describe("case study", () => {
  it("summarises the numbers and lists every round", () => {
    const out = shell("case-study").out;
    for (const s of stats) {
      expect(out).toContain(s.label);
      expect(out).toContain(`${s.weak}  /  ${s.strong}`);
    }
    for (const p of pairs) expect(out).toContain(`"command":"case-study ${p.id}"`);
  });

  it("shows a round with the weaker prompt quoted in full and every excerpt", () => {
    for (const p of pairs) {
      const out = shell(`case-study ${p.id}`).out;
      expect(out).toContain(JSON.stringify(p.weak.quote).slice(1, -1));
      for (const e of p.strong.excerpts) expect(out).toContain(JSON.stringify(e).slice(1, -1));
    }
  });

  it("scores every round on all six criteria", () => {
    for (const p of pairs) expect(Object.keys(p.scores).sort()).toEqual(criteria.map((c) => c.id).sort());
  });

  it("works through aliases, the file, and completion", () => {
    const summary = shell("case-study").out;
    expect(shell("prompts").out).toBe(summary);
    expect(shell("compare").out).toBe(summary);
    expect(shell("cat case-study.md").out).toBe(summary);
    expect(shell("ls").out).toContain('"case-study.md"');
    expect(complete("case-study ki", ctx()).value).toBe("case-study kickoff ");
  });

  it("links the design comparison from the terminal", () => {
    expect(execute("open compare", ctx()).result.effects?.[0]).toMatchObject({ href: "/compare/" });
    expect(shell("case-study").out).toContain('"href":"/compare/"');
  });

  it("has the full design comparison data", () => {
    expect(designComparison.weakTrail).toHaveLength(7);
    expect(designComparison.strongBrief.outline).toHaveLength(12);
    for (const p of designComparison.weakTrail) expect(p.text.length).toBeGreaterThan(0);
  });

  it("errors on an unknown round", () => {
    expect(shell("case-study nope").result.blocks[0].type).toBe("error");
  });
});

describe("autocomplete", () => {
  it("completes unique command names", () => {
    expect(complete("whoa", ctx()).value).toBe("whoami ");
  });

  it("lists ambiguous options", () => {
    const c = complete("c", ctx());
    expect(c.options).toEqual(expect.arrayContaining(["cat", "cd", "certifications", "clear", "contact"]));
  });

  it("completes project slugs as arguments", () => {
    expect(complete("projects high", ctx()).value).toBe("projects high-altitude-balloon ");
    expect(complete("projects ", ctx()).options.length).toBeGreaterThan(projects.length);
  });

  it("completes paths with trailing slash for directories", () => {
    expect(complete("cd proj", ctx()).value).toBe("cd projects/");
    expect(complete("cat projects/stm32-tetris/RE", ctx()).value).toBe("cat projects/stm32-tetris/README.md ");
  });

  it("completes relative to the working directory, and from absolute or ~ paths", () => {
    expect(complete("cd high", ctx({ cwd: P })).value).toBe("cd high-altitude-balloon/");
    expect(complete("ls ~/proj", ctx({ cwd: "/" })).value).toBe("ls ~/projects/");
    expect(complete("cd /ho", ctx({ cwd: P })).value).toBe("cd /home/");
  });
});
