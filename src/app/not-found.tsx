import Link from "next/link";
import { pageContainer } from "@/lib/layout";

export default function NotFound() {
  return (
    <section className={`${pageContainer} pb-28 pt-24 md:pt-32`}>
      <p className="text-meta text-muted">404</p>
      <h1 className="mt-4 font-display text-heading font-light tracking-[-0.01em]">Page not found.</h1>
      <p className="mt-4 text-muted">The page you were looking for doesn&apos;t exist or has moved.</p>
      <p className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
        <Link href="/" className="text-link">
          ← home
        </Link>
        <Link href="/terminal/" className="text-link">
          open the terminal →
        </Link>
      </p>
    </section>
  );
}
