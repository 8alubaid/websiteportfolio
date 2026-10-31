import { profile, resumeUrl } from "@/data";

const icon = { width: 17, height: 17, "aria-hidden": true } as const;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...icon}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...icon}>
      <rect x="2.5" y="4.5" width="19" height="15" />
      <path d="m3 5.5 9 7 9-7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...icon}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...icon}>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

/** Only the channels that exist in the profile data; nothing is shown for missing ones. */
export function SocialLinks({ className }: { className?: string }) {
  const { email, github, linkedin } = profile.contact;
  const links = [
    github && { label: "GitHub", href: github, icon: <GitHubIcon />, external: true },
    linkedin && { label: "LinkedIn", href: linkedin, icon: <LinkedInIcon />, external: true },
    email && { label: `Email ${email}`, href: `mailto:${email}`, icon: <MailIcon /> },
    resumeUrl && { label: "Résumé (PDF)", href: resumeUrl, icon: <DocIcon />, external: true },
  ].filter((l): l is Exclude<typeof l, null | "" | undefined> => Boolean(l));

  return (
    <ul className={`flex items-center gap-4 ${className ?? ""}`}>
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            aria-label={l.label}
            title={l.label}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="block text-muted transition-colors duration-200 hover:text-fg"
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
