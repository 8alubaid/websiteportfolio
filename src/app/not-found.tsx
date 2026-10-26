import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center px-5 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[90rem]">
        <p className="pixel-label">Error 404</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.04em]">Page not found.</h1>
        <p className="mt-8">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm">
          <Link href="/" className="inverse px-4 py-2.5 hover:bg-surface hover:text-fg">
            ← Back to portfolio
          </Link>
          <Link href="/terminal" className="underline underline-offset-4 hover:no-underline">
            Open terminal →
          </Link>
        </div>
      </div>
    </section>
  );
}
