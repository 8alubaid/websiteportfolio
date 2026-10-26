"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFocusProject } from "@/lib/focus";
import { cn } from "@/lib/cn";

/**
 * The only persistent global control: a small floating Portfolio | Terminal switch.
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

  return (
    <nav
      aria-label="Interface mode"
      className="fixed right-3 top-3 z-50 flex border border-surface bg-bg font-mono text-xs sm:right-5 sm:top-5"
    >
      <Link href={portfolioHref} aria-current={!inTerminal ? "page" : undefined} className={cn(item, !inTerminal ? "inverse" : "hover:bg-surface")}>
        Portfolio
      </Link>
      <span aria-hidden="true" className="w-px bg-surface" />
      <Link href={terminalHref} aria-current={inTerminal ? "page" : undefined} className={cn(item, inTerminal ? "inverse" : "hover:bg-surface")}>
        Terminal
      </Link>
    </nav>
  );
}
