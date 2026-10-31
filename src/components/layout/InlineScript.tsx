"use client";

/**
 * A script that runs once, synchronously, as the server HTML is parsed. React warns when
 * it renders a <script> on the client, so the client copy is inert (`text/plain`); the
 * type mismatch is expected (see the Next.js "Preventing flash before hydration" guide).
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
