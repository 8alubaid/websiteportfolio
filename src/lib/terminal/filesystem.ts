/**
 * A read-only virtual filesystem generated from portfolio data.
 * It exists only so `ls`, `cd`, and `cat` feel natural. There is no real file access.
 *
 * Path model (one model for every command, the prompt, and `pwd`):
 *   - Paths are absolute and normalized internally: `/`, `/home`, `/home/faris/projects`.
 *   - `~` is the home directory, `/home/faris`, where the portfolio lives.
 *   - The prompt shows paths under home abbreviated with `~` (see `displayPath`).
 */
import { profile, projects, resumeUrl, skillGroups } from "@/data";
import type { Block } from "./types";
import {
  aboutView,
  caseStudyView,
  certificationsView,
  contactView,
  educationView,
  experienceView,
  projectView,
  resumeView,
  skillsView,
} from "./views";

export const ROOT = "/";
export const HOME = `/home/${profile.handle}`;

export interface FileNode {
  kind: "file";
  name: string;
  view: () => Block[];
  /** Matching Portfolio location, used by `open`. */
  href?: string;
}

export interface DirNode {
  kind: "dir";
  name: string;
  children: FsNode[];
  href?: string;
  /** Project slug when this directory represents a project. */
  project?: string;
}

export type FsNode = FileNode | DirNode;

const file = (name: string, view: () => Block[], href?: string): FileNode => ({ kind: "file", name, view, href });

function buildHome(): DirNode {
  const children: FsNode[] = [
    file("about.txt", aboutView, "/#top"),
    file("experience.log", experienceView, "/#experience"),
    file("contact.txt", contactView, "/#contact"),
    file("case-study.md", () => caseStudyView() ?? [], "/case-study/"),
    {
      kind: "dir",
      name: "projects",
      href: "/#projects",
      children: projects.map(
        (p): DirNode => ({
          kind: "dir",
          name: p.slug,
          project: p.slug,
          href: `/projects/${p.slug}`,
          children: [
            file("README.md", () => projectView(p, "full"), `/projects/${p.slug}`),
            file("overview.txt", () => projectView(p, "brief"), `/projects/${p.slug}`),
            file("engineering.md", () => projectView(p, "deep"), `/projects/${p.slug}`),
          ],
        }),
      ),
    },
    {
      kind: "dir",
      name: "skills",
      href: "/#skills",
      children: skillGroups.map((g) => file(`${g.id}.txt`, () => skillsView(g.id), "/#skills")),
    },
    {
      kind: "dir",
      name: "credentials",
      href: "/#certifications",
      children: [
        file("education.txt", educationView, "/#certifications"),
        file("certifications.txt", certificationsView, "/#certifications"),
      ],
    },
  ];

  if (resumeUrl) children.push(file("resume.pdf", resumeView, resumeUrl));

  return { kind: "dir", name: profile.handle, children, href: "/" };
}

/** `/` contains `home/`, which contains the portfolio home directory. */
export const root: DirNode = {
  kind: "dir",
  name: "",
  href: "/",
  children: [{ kind: "dir", name: "home", href: "/", children: [buildHome()] }],
};

const segments = (path: string) => path.split("/").filter(Boolean);
const join = (parts: string[]) => "/" + parts.join("/");

/**
 * Resolve a user-supplied path against `cwd` (an absolute path) and normalize it.
 * Handles absolute (`/…`), home-relative (`~`, `~/…`) and relative paths, `.`, `..`,
 * repeated and trailing slashes. An empty input resolves to `cwd` itself.
 * The result may not exist; check it with `getNode`.
 */
export function resolvePath(cwd: string, input = ""): string {
  const target = input.trim();
  let base: string[];
  let rest: string;

  if (target === "~" || target.startsWith("~/")) {
    base = segments(HOME);
    rest = target.slice(1);
  } else if (target.startsWith("/")) {
    base = [];
    rest = target;
  } else {
    base = segments(cwd);
    rest = target;
  }

  const stack = [...base];
  for (const part of segments(rest)) {
    if (part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return join(stack);
}

/** Look up a node by absolute path. Names match case-insensitively. */
export function getNode(path: string): FsNode | undefined {
  let node: FsNode = root;
  for (const part of segments(path)) {
    if (node.kind !== "dir") return undefined;
    const next: FsNode | undefined = node.children.find((c) => c.name.toLowerCase() === part.toLowerCase());
    if (!next) return undefined;
    node = next;
  }
  return node;
}

/** Canonical (correct-case) form of an existing absolute path. */
export function canonicalPath(path: string): string {
  const out: string[] = [];
  let node: FsNode = root;
  for (const part of segments(path)) {
    if (node.kind !== "dir") break;
    const next: FsNode | undefined = node.children.find((c) => c.name.toLowerCase() === part.toLowerCase());
    if (!next) break;
    out.push(next.name);
    node = next;
  }
  return join(out);
}

/** How a path appears in the prompt and in clickable output: home abbreviated as `~`. */
export function displayPath(path: string): string {
  if (path === HOME) return "~";
  if (path.startsWith(`${HOME}/`)) return `~${path.slice(HOME.length)}`;
  return path;
}

/** List a directory (or a single file) at `path`. `undefined` when the path doesn't exist. */
export function listDirectory(path: string): FsNode[] | undefined {
  const node = getNode(path);
  if (!node) return undefined;
  return node.kind === "dir" ? node.children : [node];
}

/** Path completion candidates for a partial path, e.g. `projects/hi` → `projects/high-altitude-balloon/`. */
export function completePath(cwd: string, partial: string, dirsOnly = false): string[] {
  const slash = partial.lastIndexOf("/");
  const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : "";
  const namePart = (slash >= 0 ? partial.slice(slash + 1) : partial).toLowerCase();
  const dir = getNode(resolvePath(cwd, dirPart));
  if (!dir || dir.kind !== "dir") return [];

  return dir.children
    .filter((c) => (!dirsOnly || c.kind === "dir") && c.name.toLowerCase().startsWith(namePart))
    .map((c) => `${dirPart}${c.name}${c.kind === "dir" ? "/" : ""}`);
}

/** Project slug for a path inside `~/projects/<slug>`, if any. */
export function projectAt(path: string): string | undefined {
  const prefix = `${HOME}/projects/`;
  if (!path.toLowerCase().startsWith(prefix.toLowerCase())) return undefined;
  const slug = segments(path.slice(prefix.length))[0];
  const node = slug ? getNode(prefix + slug) : undefined;
  return node?.kind === "dir" ? node.project : undefined;
}
