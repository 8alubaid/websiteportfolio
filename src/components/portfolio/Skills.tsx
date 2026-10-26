import { skillGroups } from "@/data";

/** Skill groups in a three-column grid of square panels. No proficiency scores. */
export function Skills() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((g) => (
        <li key={g.id}>
          <section aria-labelledby={`skills-${g.id}`} className="panel h-full p-5 sm:p-6">
            <h3 id={`skills-${g.id}`} className="flex items-center gap-3 font-semibold leading-tight">
              <span className="size-2 bg-fg" aria-hidden="true" />
              {g.label}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {g.skills.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </li>
      ))}
    </ul>
  );
}
