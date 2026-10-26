import type { PipelineStep } from "@/types/portfolio";

/**
 * Architecture / data-flow illustration drawn with rules instead of boxes:
 * a horizontal signal line on wide screens, a vertical one on phones.
 */
export function PipelineDiagram({ steps, label }: { steps: PipelineStep[]; label: string }) {
  return (
    <figure>
      <figcaption className="eyebrow">{label}</figcaption>
      <ol className="mt-6 grid gap-0 border-l border-fg md:grid-flow-col md:auto-cols-fr md:border-l-0 md:border-t">
        {steps.map((step, i) => (
          <li key={step.label} className="relative pb-6 pl-6 md:pb-0 md:pl-0 md:pr-4 md:pt-6">
            <span
              aria-hidden="true"
              className="absolute -left-[4px] top-1.5 size-2 bg-fg md:-top-[4px] md:left-0"
            />
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute -top-[9px] right-3 hidden bg-bg px-1 font-mono text-xs md:block">
                ▸
              </span>
            )}
            <span className="font-mono text-[0.7rem]">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-1 font-semibold leading-snug">{step.label}</p>
            {step.detail && <p className="mt-1 font-mono text-[0.72rem] leading-snug">{step.detail}</p>}
          </li>
        ))}
      </ol>
    </figure>
  );
}
