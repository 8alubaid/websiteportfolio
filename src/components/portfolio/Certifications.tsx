import { certifications, education } from "@/data";

/** Education and certifications side by side, in square panels. */
export function Certifications() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="education-title">
        <h3 id="education-title" className="eyebrow mb-4">
          Education
        </h3>
        <ul className="grid gap-4">
          {education.map((e) => (
            <li key={e.id} className="panel p-5 sm:p-6">
              <p className="font-mono text-xs">{e.period}</p>
              <p className="mt-2 text-lg font-semibold leading-snug">{e.credential}</p>
              {e.detail && <p className="text-sm font-medium">{e.detail}</p>}
              <p className="mt-2 text-sm">{e.institution}</p>
              {e.location && <p className="mt-1 font-mono text-xs">{e.location}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="certs-title">
        <h3 id="certs-title" className="eyebrow mb-4">
          Certifications
        </h3>
        <ul className="grid gap-4">
          {certifications.map((c) => (
            <li key={c.id} className="panel p-5 sm:p-6">
              <p className="text-lg font-semibold leading-snug">{c.name}</p>
              <p className="text-sm">{c.issuer}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className={c.status === "earned" ? "inverse px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider" : "border border-fg px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider"}>
                  {c.status === "earned" ? "Earned" : "In progress"}
                </span>
                {c.verifyUrl && (
                  <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-xs underline underline-offset-4 hover:no-underline">
                    Verify credential ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
