import type { Sector, SectorId } from "@/types/portfolio";

export const sectors: Sector[] = [
  {
    id: "cloud",
    label: "Cloud",
    description: "Containers, Kubernetes, and managed services on AWS and Google Cloud.",
  },
  {
    id: "ai",
    label: "AI",
    description: "Computer vision, LLM agents, and honest model evaluation.",
  },
  {
    id: "software",
    label: "Software",
    description: "Full-stack web and mobile apps, APIs, and developer tooling.",
  },
  {
    id: "embedded",
    label: "Embedded",
    description: "Microcontrollers, sensors, and hardware/software integration.",
  },
];

export const sectorById = Object.fromEntries(sectors.map((s) => [s.id, s])) as Record<SectorId, Sector>;

export const isSectorId = (value: string): value is SectorId => value in sectorById;
