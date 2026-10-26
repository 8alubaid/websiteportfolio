/**
 * Command registry. To add a command, append an object to `commands`; help,
 * autocomplete, and suggestions pick it up automatically.
 */
import { getProject, isSectorId, profile, projects, resumeUrl, sectors, skillGroups } from "@/data";
import { pairs } from "@/data/case-study";
import type { Block, Command, CommandResult, Span } from "./types";
import { HOME, canonicalPath, completePath, displayPath, getNode, listDirectory, projectAt, resolvePath } from "./filesystem";
import {
  aboutView,
  certificationsView,
  contactView,
  educationView,
  experienceView,
  projectListView,
  projectView,
  resumeView,
  caseStudyView,
  skillsView,
  whoamiView,
} from "./views";

const error = (...spans: Span[]): CommandResult => ({
  blocks: [{ type: "error", spans }],
  announce: spans.map((s) => (typeof s === "string" ? s : s.text)).join(""),
});

const ok = (blocks: Block[], announce?: string): CommandResult => ({ blocks, announce });

const projectSlugs = projects.map((p) => p.slug);
const sectorIds = sectors.map((s) => s.id);

/** Named Portfolio destinations accepted by `open`. */
const destinations: Record<string, string> = {
  home: "/",
  portfolio: "/",
  about: "/#about",
  projects: "/#projects",
  experience: "/#experience",
  skills: "/#skills",
  education: "/#certifications",
  certifications: "/#certifications",
  contact: "/#contact",
  "case-study": "/case-study/",
  compare: "/compare/",
  design: "/compare/",
};

function externalDestinations(): Record<string, string> {
  const { github, linkedin, email } = profile.contact;
  const out: Record<string, string> = {};
  if (github) out.github = github;
  if (linkedin) out.linkedin = linkedin;
  if (email) out.email = `mailto:${email}`;
  if (resumeUrl) out.resume = resumeUrl;
  return out;
}

const projectCommand: Command = {
  name: "projects",
  aliases: ["project"],
  group: "portfolio",
  summary: "List projects or open one",
  usage: "projects [name | area] [--brief | --deep]",
  details: [
    "With no argument, lists every project.",
    "With an area (cloud, ai, software, embedded), filters the list.",
    "With a project name, shows its full brief. --brief shows the recruiter overview only; --deep shows engineering detail only.",
  ],
  examples: ["projects", "projects ai", "projects high-altitude-balloon", "projects kubernetes-ai-agent --deep"],
  complete: (index) => (index === 0 ? [...projectSlugs, ...sectorIds] : ["--brief", "--deep"]),
  run: ({ args, flags }) => {
    const target = args[0]?.toLowerCase();
    if (!target) return ok(projectListView(), `Listed ${projects.length} projects`);
    if (isSectorId(target)) return ok(projectListView(target), `Listed ${target} projects`);

    const project = getProject(target.replace(/\/$/, ""));
    if (!project) {
      const close = projectSlugs.filter((s) => s.includes(target) || target.includes(s.split("-")[0]));
      return error(
        `No project named "${target}". `,
        ...(close.length ? [{ text: "Did you mean ", tone: "muted" as const }, ...close.flatMap((s) => [{ text: s, command: `projects ${s}` }, " "])] : []),
        { text: "projects", command: "projects", tone: "strong" },
        { text: " lists them all.", tone: "muted" },
      );
    }
    const mode = flags.has("deep") ? "deep" : flags.has("brief") ? "brief" : "full";
    return {
      blocks: projectView(project, mode),
      effects: [{ type: "focus-project", slug: project.slug }],
      announce: `Showing project ${project.title}`,
    };
  },
};

export const commands: Command[] = [
  {
    name: "help",
    aliases: ["man", "?"],
    group: "system",
    summary: "Show this command directory",
    usage: "help [command]",
    examples: ["help", "help projects"],
    complete: (index) => (index === 0 ? visibleCommandNames() : []),
    run: ({ args }) => (args[0] ? helpFor(args[0]) : ok(helpDirectory(), "Showing command directory")),
  },
  {
    name: "whoami",
    group: "portfolio",
    summary: "Identify the engineer",
    usage: "whoami",
    run: () => ok(whoamiView(), `${profile.name}, ${profile.headline}`),
  },
  {
    name: "about",
    aliases: ["bio"],
    group: "portfolio",
    summary: "Read personal introduction",
    usage: "about",
    run: () => ok(aboutView(), "Showing about"),
  },
  projectCommand,
  {
    name: "skills",
    aliases: ["stack"],
    group: "portfolio",
    summary: "List technical skills",
    usage: "skills [group]",
    examples: ["skills", "skills cloud"],
    complete: (index) => (index === 0 ? skillGroups.map((g) => g.id) : []),
    run: ({ args }) => {
      const id = args[0]?.toLowerCase().replace(/\.txt$/, "");
      if (id && !skillGroups.some((g) => g.id === id)) {
        return error(`Unknown skill group "${id}". Groups: ${skillGroups.map((g) => g.id).join(", ")}`);
      }
      return ok(skillsView(id), "Showing skills");
    },
  },
  {
    name: "experience",
    aliases: ["log", "timeline"],
    group: "portfolio",
    summary: "View experience and training",
    usage: "experience",
    run: () => ok(experienceView(), "Showing experience"),
  },
  {
    name: "education",
    group: "portfolio",
    summary: "View academic background",
    usage: "education",
    run: () => ok(educationView(), "Showing education"),
  },
  {
    name: "certifications",
    aliases: ["certs", "credentials"],
    group: "portfolio",
    summary: "Show verified credentials",
    usage: "certifications",
    run: () => ok(certificationsView(), "Showing certifications"),
  },
  {
    name: "contact",
    aliases: ["email"],
    group: "portfolio",
    summary: "Establish communication",
    usage: "contact",
    run: () => ok(contactView(), "Showing contact details"),
  },
  {
    name: "resume",
    aliases: ["cv", "résumé"],
    group: "portfolio",
    summary: "Open downloadable resume",
    usage: "resume",
    run: () => {
      const blocks = resumeView();
      const href = resumeUrl;
      return href
        ? { blocks, effects: [{ type: "navigate", href, external: true }], announce: "Opening résumé" }
        : ok(blocks, "Résumé not yet published");
    },
  },
  {
    name: "case-study",
    aliases: ["prompts", "compare", "casestudy"],
    group: "portfolio",
    summary: "Compare strong vs weak prompts",
    usage: "case-study [round]",
    details: ["With no argument, shows the numbers, the rounds, and the takeaways. With a round name, shows both prompts in full."],
    examples: ["case-study", `case-study ${pairs[0].id}`],
    complete: (index) => (index === 0 ? pairs.map((p) => p.id) : []),
    run: ({ args }) => {
      const blocks = caseStudyView(args[0]);
      if (!blocks) return error(`case-study: no round named "${args[0]}". Rounds: ${pairs.map((p) => p.id).join(", ")}`);
      return ok(blocks, args[0] ? `Showing case study round ${args[0]}` : "Showing case study");
    },
  },
  {
    name: "ls",
    aliases: ["dir", "ll"],
    group: "navigation",
    summary: "List available directories",
    usage: "ls [path]",
    examples: ["ls", "ls projects", "ls projects/stm32-tetris"],
    complete: (index, args, ctx) => (index === 0 ? completePath(ctx.cwd, args[0] ?? "") : []),
    run: ({ args }, ctx) => {
      // Same resolver as `cd` and `cat`; listing never changes the working directory.
      const path = resolvePath(ctx.cwd, args[0]);
      const entries = listDirectory(path);
      if (!entries) return error(`ls: cannot access '${args[0]}': No such file or directory`);
      if (getNode(path)?.kind === "file") return ok([{ type: "line", spans: [entries[0].name] }]);

      // Clickable entries run the same commands a visitor would type.
      const base = canonicalPath(path);
      const rel = (name: string) => (base === ctx.cwd ? name : displayPath(base === "/" ? `/${name}` : `${base}/${name}`));
      if (!entries.length) return ok([]);
      return ok(
        [
          {
            type: "grid",
            items: entries.map((c): Span =>
              c.kind === "dir"
                ? { text: `${c.name}/`, command: `cd ${rel(c.name)}`, tone: "strong" }
                : { text: c.name, command: `cat ${rel(c.name)}` },
            ),
          },
        ],
        `${entries.length} entries`,
      );
    },
  },
  {
    name: "cd",
    group: "navigation",
    summary: "Change directory",
    usage: "cd [path]",
    examples: ["cd projects", "cd ..", "cd ~", "cd /"],
    complete: (index, args, ctx) => (index === 0 ? completePath(ctx.cwd, args[0] ?? "", true) : []),
    run: ({ args }, ctx) => {
      // Bare `cd` goes home, like a real shell.
      const path = args[0] === undefined ? HOME : resolvePath(ctx.cwd, args[0]);
      const node = getNode(path);
      if (!node) return error(`cd: no such file or directory: ${args[0]}`);
      if (node.kind !== "dir") return error(`cd: not a directory: ${args[0]}`);
      const cwd = canonicalPath(path);
      const slug = projectAt(cwd);
      return {
        blocks: [],
        effects: [{ type: "cwd", path: cwd }, ...(slug ? [{ type: "focus-project" as const, slug }] : [])],
        announce: `Changed directory to ${displayPath(cwd)}`,
      };
    },
  },
  {
    name: "pwd",
    group: "navigation",
    summary: "Print working directory",
    usage: "pwd",
    run: (_, ctx) => ok([{ type: "line", spans: [ctx.cwd] }], ctx.cwd),
  },
  {
    name: "cat",
    aliases: ["less", "more", "read"],
    group: "navigation",
    summary: "Print a file",
    usage: "cat <file>",
    examples: ["cat about.txt", "cat projects/stm32-tetris/README.md"],
    complete: (index, args, ctx) => (index === 0 ? completePath(ctx.cwd, args[0] ?? "") : []),
    run: ({ args }, ctx) => {
      if (!args[0]) return error("cat: missing file operand. Try ", { text: "ls", command: "ls", tone: "strong" });
      const node = getNode(resolvePath(ctx.cwd, args[0]));
      if (!node) return error(`cat: ${args[0]}: No such file or directory`);
      if (node.kind === "dir") return error(`cat: ${args[0]}: Is a directory. Try `, { text: `ls ${args[0]}`, command: `ls ${args[0]}`, tone: "strong" });
      const slug = projectAt(resolvePath(ctx.cwd, args[0]));
      return { blocks: node.view(), effects: slug ? [{ type: "focus-project", slug }] : [], announce: `Showing ${node.name}` };
    },
  },
  {
    name: "open",
    aliases: ["explore", "view"],
    group: "navigation",
    summary: "Open something in Portfolio mode",
    usage: "open [project | section | path | github | linkedin]",
    details: ["With no argument inside a project directory, opens that project in Portfolio mode."],
    examples: ["open computer-vision", "open skills", "open github"],
    complete: (index, args, ctx) =>
      index === 0
        ? [...projectSlugs, ...Object.keys(destinations), ...Object.keys(externalDestinations()), ...completePath(ctx.cwd, args[0] ?? "")]
        : [],
    run: ({ args }, ctx) => {
      const raw = args[0];
      const key = raw?.toLowerCase().replace(/\/$/, "");
      const external = externalDestinations();

      let href: string | undefined;
      let isExternal = false;
      if (!key) href = getNode(ctx.cwd)?.href ?? "/";
      else if (getProject(key)) href = `/projects/${key}`;
      else if (destinations[key]) href = destinations[key];
      else if (external[key]) [href, isExternal] = [external[key], true];
      else href = getNode(resolvePath(ctx.cwd, raw))?.href;

      if (!href) return error(`open: nothing called "${raw}". Try a project name, a section (skills, contact), or a path.`);
      return {
        blocks: [{ type: "line", spans: [{ text: isExternal ? "Opening " : "Opening in Portfolio → ", tone: "muted" }, { text: href, href, external: isExternal }] }],
        effects: [{ type: "navigate", href, external: isExternal }],
        announce: `Opening ${href}`,
      };
    },
  },
  {
    name: "mode",
    group: "system",
    summary: "Switch interface mode",
    usage: "mode <portfolio | terminal>",
    examples: ["mode portfolio"],
    complete: (index) => (index === 0 ? ["portfolio", "terminal"] : []),
    run: ({ args }, ctx) => {
      const target = args[0]?.toLowerCase();
      if (target === "terminal") return ok([{ type: "line", spans: [{ text: "Already in terminal mode.", tone: "muted" }] }]);
      // `explorer`, `gui` and `visual` are kept as undocumented aliases for older links and habits.
      if (!["portfolio", "explorer", "gui", "visual"].includes(target ?? "")) {
        return error("Usage: mode portfolio. Switches to the visual interface.");
      }
      const slug = projectAt(ctx.cwd) ?? ctx.focusProject;
      const href = slug ? `/projects/${slug}` : "/";
      return {
        blocks: [{ type: "line", spans: [{ text: "Switching to Portfolio mode…", tone: "strong" }] }],
        effects: [{ type: "navigate", href }],
        announce: "Switching to Portfolio mode",
      };
    },
  },
  {
    name: "clear",
    aliases: ["cls"],
    group: "system",
    summary: "Clear terminal output",
    usage: "clear (or Ctrl+L)",
    run: () => ({ blocks: [], effects: [{ type: "clear" }], announce: "Terminal cleared" }),
  },
  {
    name: "history",
    group: "system",
    summary: "Show command history",
    usage: "history",
    run: (_, ctx) =>
      ctx.history.length
        ? ok([
            {
              type: "rows",
              rows: ctx.history.map((h, i) => ({
                key: [{ text: String(i + 1).padStart(3), tone: "muted" }],
                value: [{ text: h, command: h }],
              })),
            },
          ])
        : ok([{ type: "line", spans: [{ text: "No commands yet.", tone: "muted" }] }]),
  },
  {
    name: "echo",
    group: "system",
    hidden: true,
    summary: "Print text",
    usage: "echo <text>",
    run: ({ raw }) => ok([{ type: "line", spans: [raw.replace(/^\S+\s?/, "")] }]),
  },
  {
    name: "date",
    group: "system",
    hidden: true,
    summary: "Show the current time",
    usage: "date",
    run: () => ok([{ type: "line", spans: [new Date().toUTCString()] }]),
  },
  {
    name: "exit",
    aliases: ["logout", "quit"],
    group: "system",
    hidden: true,
    summary: "Leave the terminal",
    usage: "exit",
    run: (_, ctx) => ({
      blocks: [{ type: "line", spans: [{ text: "Closing terminal. Switching to Portfolio…", tone: "muted" }] }],
      effects: [{ type: "navigate", href: ctx.focusProject ? `/projects/${ctx.focusProject}` : "/" }],
    }),
  },
  {
    name: "sudo",
    group: "system",
    hidden: true,
    summary: "",
    usage: "sudo",
    run: () => error(`${profile.handle} is not in the sudoers file. This incident will be reported.`),
  },
  {
    name: "rm",
    aliases: ["mv", "touch", "mkdir", "vim", "nano", "chmod"],
    group: "system",
    hidden: true,
    summary: "",
    usage: "",
    run: ({ name }) => error(`${name}: read-only filesystem. This console is a portfolio interface, not a real shell.`),
  },
];

const byName = new Map<string, Command>();
for (const c of commands) {
  byName.set(c.name, c);
  for (const a of c.aliases ?? []) byName.set(a, c);
}

export const findCommand = (name: string) => byName.get(name.toLowerCase());

export const visibleCommandNames = () => commands.filter((c) => !c.hidden).map((c) => c.name);

export const allCommandNames = () => [...byName.keys()];

/** Sections of the help directory: [command, argument hint, label override]. */
const directory: { title: string; rows: [string, string?, string?][] }[] = [
  {
    title: "Portfolio",
    rows: [
      ["whoami"],
      ["about"],
      ["projects", "[name | area]"],
      ["skills", "[group]"],
      ["experience"],
      ["education"],
      ["certifications"],
      ["contact"],
      ["resume"],
      ["case-study", "[round]"],
    ],
  },
  {
    title: "Navigation",
    rows: [["ls", "[path]"], ["cd", "<path>"], ["cat", "<file>"], ["open", "<target>"], ["pwd"]],
  },
  {
    title: "System",
    rows: [["history"], ["clear"], ["mode portfolio", undefined, "Switch to Portfolio mode"]],
  },
];

function helpDirectory(): Block[] {
  const blocks: Block[] = [{ type: "heading", text: "COMMANDS", meta: "Read-only portfolio terminal" }];
  for (const section of directory) {
    blocks.push({ type: "section", text: section.title });
    blocks.push({
      type: "rows",
      rows: section.rows.map(([name, args, label]) => ({
        key: [{ text: name, command: name, tone: "strong" }, ...(args ? [{ text: ` ${args}`, tone: "muted" as const }] : [])],
        value: [label ?? findCommand(name.split(" ")[0])?.summary ?? ""],
      })),
    });
  }
  blocks.push(
    { type: "blank" },
    {
      type: "line",
      spans: [
        { text: "Tab", tone: "strong" },
        { text: " complete   ", tone: "muted" },
        { text: "↑ ↓", tone: "strong" },
        { text: " history   ", tone: "muted" },
        { text: "Ctrl+L", tone: "strong" },
        { text: " clear   ", tone: "muted" },
        { text: "help <command>", tone: "strong" },
        { text: " details", tone: "muted" },
      ],
    },
  );
  return blocks;
}

function helpFor(name: string): CommandResult {
  const cmd = findCommand(name);
  if (!cmd || (cmd.hidden && !cmd.summary)) return error(`help: no entry for "${name}"`);
  const blocks: Block[] = [
    { type: "heading", text: cmd.name.toUpperCase(), meta: cmd.summary },
    { type: "rows", rows: [{ key: [{ text: "usage", tone: "muted" }], value: [{ text: cmd.usage, tone: "strong" }] }] },
  ];
  if (cmd.aliases?.length) {
    blocks.push({ type: "rows", rows: [{ key: [{ text: "aliases", tone: "muted" }], value: [cmd.aliases.join(", ")] }] });
  }
  for (const d of cmd.details ?? []) blocks.push({ type: "paragraph", text: d });
  if (cmd.examples?.length) {
    blocks.push({ type: "section", text: "Examples" });
    blocks.push({ type: "list", bullet: "$", items: cmd.examples.map((e) => [{ text: e, command: e, tone: "strong" }]) });
  }
  return ok(blocks, `Help for ${cmd.name}`);
}

export { HOME };
