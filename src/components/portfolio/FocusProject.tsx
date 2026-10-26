"use client";

import { useEffect } from "react";
import { setFocusProject } from "@/lib/focus";

/** Records the project being viewed so the Terminal can pick up the same context. */
export function FocusProject({ slug }: { slug: string }) {
  useEffect(() => setFocusProject(slug), [slug]);
  return null;
}
