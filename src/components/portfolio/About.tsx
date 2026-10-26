import { profile, sectorById } from "@/data";

/** About: the profile paragraphs plus a few plain facts. Shared with the terminal's `about`. */
export function About() {
  const facts = [
    { label: "Focus", value: profile.focus.map((id) => sectorById[id].label).join(" / ") },
    ...(profile.location ? [{ label: "Based in", value: profile.location }] : []),
    { label: "Open to", value: profile.availability },
  ];

  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="grid max-w-[65ch] gap-6 text-lg leading-relaxed lg:col-span-7">
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <dl className="self-start lg:col-span-5">
        {facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-surface py-4 last:border-b">
            <dt className="eyebrow pt-0.5">{f.label}</dt>
            <dd className="leading-relaxed">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
