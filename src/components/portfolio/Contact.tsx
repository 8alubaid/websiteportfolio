import Link from "next/link";
import { profile, resumeUrl } from "@/data";
import { CopyButton } from "@/components/ui/CopyButton";

/** Closing section: a plain list of ways to get in touch. The page ends here, with no footer. */
export function Contact() {
  const { email, github, linkedin } = profile.contact;
  const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

  const channels: { label: string; value: string; href: string; external?: boolean; download?: boolean }[] = [];
  if (email) channels.push({ label: "Email", value: email, href: `mailto:${email}` });
  if (github) channels.push({ label: "GitHub", value: strip(github), href: github, external: true });
  if (linkedin) channels.push({ label: "LinkedIn", value: strip(linkedin), href: linkedin, external: true });
  if (resumeUrl) channels.push({ label: "Résumé", value: "Download PDF", href: resumeUrl, download: true });

  return (
    <div className="pb-14">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">Get in touch.</p>
          <p className="mt-8 max-w-md leading-relaxed">{profile.availability}</p>
        </div>

        <ul className="lg:col-span-7">
          {channels.map((c) => (
            <li key={c.label} className="group grid grid-cols-[6.5rem_1fr_auto] items-center gap-4 border-b border-surface py-6 first:border-t">
              <span className="eyebrow">{c.label}</span>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(c.download ? { download: true } : {})}
                className="min-w-0 truncate font-display text-xl underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors hover:decoration-fg sm:text-2xl"
              >
                {c.value}
                {c.external && <span className="ml-2 text-base">↗</span>}
              </a>
              {c.label === "Email" && email ? <CopyButton value={email} label="Copy email address" /> : <span />}
            </li>
          ))}
          <li className="grid grid-cols-[6.5rem_1fr] items-center gap-4 border-b border-surface py-6">
            <span className="eyebrow">Terminal</span>
            <Link href="/terminal?run=contact" className="font-mono underline decoration-transparent underline-offset-4 hover:decoration-fg">
              $ contact
            </Link>
          </li>
        </ul>
      </div>

      <p className="mt-28 font-mono text-xs">© {profile.name}</p>
    </div>
  );
}
