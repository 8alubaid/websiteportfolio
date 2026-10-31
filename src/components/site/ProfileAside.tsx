"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data";
import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/cn";
import { normalizePath } from "@/lib/layout";
import { SocialLinks } from "./SocialLinks";

/**
 * The profile column beside every section. On phones it sits above the content: in
 * full on the home page, and as a compact name row elsewhere so sections start sooner.
 */
export function ProfileAside() {
  const home = normalizePath(usePathname()) === "/";

  return (
    <aside aria-label="Profile" className="md:sticky md:top-10 md:self-start">
      <div className={cn("md:block", home ? "block" : "flex items-center gap-4")}>
        {/* Pixel portrait from public/profile.png (the favicon is the same artwork). */}
        <Link
          href="/"
          aria-label={`${profile.name}, home`}
          className={cn(
            "grid shrink-0 place-items-center overflow-hidden rounded-full border border-rule md:size-[5.5rem]",
            home ? "size-[5.5rem]" : "size-12",
          )}
        >
          <Image
            src={withBasePath("/profile.png")}
            alt=""
            width={336}
            height={336}
            unoptimized
            priority
            className="size-full object-cover [image-rendering:pixelated]"
          />
        </Link>
        <p
          className={cn(
            "font-display font-light tracking-[-0.015em] md:mt-6 md:text-name md:leading-none",
            home ? "mt-6 text-name leading-none" : "text-2xl",
          )}
        >
          {profile.name}
        </p>
      </div>

      <div className={cn(!home && "hidden md:block")}>
        <p className="mt-5 text-aside text-muted">
          {profile.bio} Based in {profile.location}.
        </p>
        <p className="mt-7 text-aside text-muted">Find me on:</p>
        <SocialLinks className="mt-3" />
      </div>
    </aside>
  );
}
