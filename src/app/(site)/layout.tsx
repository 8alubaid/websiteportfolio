import type { ReactNode } from "react";
import { ProfileAside } from "@/components/site/ProfileAside";
import { pageContainer } from "@/lib/layout";

/** Two columns on every section: the profile on the left, the section's content on the right. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${pageContainer} grid gap-12 pb-28 pt-12 md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-14 md:pt-16 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-24`}
    >
      <ProfileAside />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
