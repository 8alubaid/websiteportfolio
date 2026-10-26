import { PixelReveal } from "@/components/pixel/PixelReveal";

interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
  description?: string;
}

/** Section opener: index number on the left, title (with a one-time pixel reveal) on the right. */
export function SectionHeading({ id, index, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-14 grid gap-6 border-t border-fg pt-6 lg:grid-cols-12">
      <p className="pixel-label lg:col-span-4">{index}</p>
      <div className="lg:col-span-8">
        <h2 id={`${id}-title`} className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          <PixelReveal>{title}</PixelReveal>
        </h2>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}
