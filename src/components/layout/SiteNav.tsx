"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/site";
import { cn } from "@/lib/cn";
import { normalizePath } from "@/lib/layout";

/** Which nav item a path belongs to. The writing pieces live at their own URLs. */
function activeHref(pathname: string): string {
  const path = normalizePath(pathname);
  if (path === "/case-study" || path === "/compare") return "/writing/";
  const match = navigation.find((item) => item.href !== "/" && path.startsWith(normalizePath(item.href)));
  return match?.href ?? (path === "/" ? "/" : "");
}

/** The seven sections, lowercase, with a hairline underline under the current one. */
export function SiteNav() {
  const active = activeHref(usePathname());

  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-7 md:justify-between md:gap-x-0">
        {navigation.map((item) => {
          const current = item.href === active;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "relative inline-block pb-1 text-nav tracking-[0.02em] transition-colors duration-200",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-out",
                  current ? "text-fg after:scale-x-100" : "text-muted after:scale-x-0 hover:text-fg hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
