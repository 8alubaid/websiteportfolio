"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFocusProject } from "@/lib/focus";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The only persistent global controls: a small floating Portfolio | Terminal switch, plus the theme toggle.
 * Carries project context across modes, so a project open in one mode opens in the other.
 */
export function ModeSwitch() {
  const pathname = usePathname();
  const focus = useFocusProject();
  const inTerminal = pathname.startsWith("/terminal");
  const projectSlug = /^\/projects\/([^/]+)/.exec(pathname)?.[1];

  const portfolioHref = inTerminal ? (focus ? `/projects/${focus}` : "/") : pathname;
  const terminalHref = projectSlug ? `/terminal?run=${encodeURIComponent(`projects ${projectSlug}`)}` : "/terminal";

  const item = "px-2.5 py-1.5 transition-colors duration-150";

  const idle = "hover:bg-surface hover:text-on-surface";

  return (
    <div className="fixed right-3 top-3 z-50 flex items-stretch gap-1.5 sm:right-5 sm:top-5">
      <ThemeToggle />
      <nav aria-label="Interface mode" className="flex border border-surface bg-bg font-mono text-xs">
        <Link href={portfolioHref} aria-current={!inTerminal ? "page" : undefined} className={cn(item, !inTerminal ? "inverse" : idle)}>
          Portfolio
        </Link>
        <span aria-hidden="true" className="w-px bg-surface" />
        <Link href={terminalHref} aria-current={inTerminal ? "page" : undefined} className={cn(item, inTerminal ? "inverse" : idle)}>
          Terminal
        </Link>
      </nav>
    </div>
  );
}
