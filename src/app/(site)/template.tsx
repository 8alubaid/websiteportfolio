import type { ReactNode } from "react";

/** Re-mounts on every navigation between sections, so each page's content settles in. */
export default function SectionTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-enter">{children}</div>;
}
