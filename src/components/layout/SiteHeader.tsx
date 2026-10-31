"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFocusProject } from "@/lib/focus";
import { pageContainer } from "@/lib/layout";
import { SiteNav } from "./SiteNav";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Top of every page: the section navigation, plus the theme toggle in the corner.
 * The fullscreen terminal gets only a way back to the portfolio (to the project in
 * view, if there is one) and the toggle.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const focus = useFocusProject();

  if (pathname.startsWith("/terminal")) {
    return (
      <div className="fixed right-3 top-3 z-50 flex items-center gap-3 bg-bg pl-2 sm:right-4 sm:top-4">
        <Link href={focus ? `/projects/${focus}/` : "/"} className="text-nav text-muted transition-colors duration-200 hover:text-fg">
          ← portfolio
        </Link>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <>
      <header className={`${pageContainer} pt-16 md:pt-20`}>
        <SiteNav />
      </header>
      <div className="fixed right-3 top-3 z-50 sm:right-4 sm:top-4">
        <ThemeToggle />
      </div>
    </>
  );
}
