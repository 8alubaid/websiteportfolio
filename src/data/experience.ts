import type { LogEntry, LogKind } from "@/types/portfolio";

/**
 * Experience timeline: a chronological record that clearly separates employment, education,
 * training, certifications, and projects. Newest first.
 *
 * No employment is listed because none has been verified yet. Add entries with
 * `kind: "employment"` and they'll appear with their own badge in both modes.
 */
export const timeline: LogEntry[] = [
  {
    id: "sdaia-cv",
    kind: "training",
    title: "Computer Vision Developer program",
    organization: "SDAIA",
    period: "Oct 2026",
    description:
      "Image processing, CNNs, transfer learning, fine-tuning, and YOLO object detection. Final project on facial emotion recognition.",
    project: "computer-vision",
  },
  {
    id: "gcp-training",
    kind: "training",
    title: "Google Cloud: Kubernetes Engine & Data Engineering",
    organization: "Google Cloud (instructor-led)",
    period: "Aug 2026",
    description:
      "Instructor-led courses on containers, Kubernetes architecture and operations on GKE, and data pipeline patterns (EL, ELT, ETL) on Google Cloud.",
  },
  {
    id: "network-api",
    kind: "project",
    title: "Network Diagnostic API",
    organization: "Personal project",
    period: "Jul 2026",
    description: "Containerized Flask API deployed to Google Cloud Run through a Cloud Build pipeline.",
    project: "network-diagnostics",
  },
  {
    id: "fatoorah",
    kind: "project",
    title: "Fatoorah personal finance app",
    organization: "Personal project",
    period: "Jun 2026",
    description: "Expo / React Native app with a swappable Open Banking data layer.",
    project: "personal-finance",
  },
  {
    id: "aws-certs",
    kind: "certification",
    title: "AWS Certified Cloud Practitioner & AI Practitioner",
    organization: "Amazon Web Services",
    period: "Earned",
    description: "Foundational AWS cloud and AI/ML certifications.",
  },
  {
    id: "cu-boulder",
    kind: "education",
    title: "B.S. Electrical & Computer Engineering, Minor in Engineering Management",
    organization: "University of Colorado Boulder",
    period: "2022 – Graduated",
    location: "Boulder, Colorado",
    description: "Capstone: high-altitude balloon sensor and radiation payload.",
    project: "high-altitude-balloon",
  },
  {
    id: "kau",
    kind: "education",
    title: "Preparatory Year",
    organization: "King Abdulaziz University",
    period: "2021 – 2022",
    location: "Jeddah, Saudi Arabia",
    description: "University preparatory program before transferring to CU Boulder.",
  },
];

export const logKindLabel: Record<LogKind, string> = {
  employment: "Employment",
  education: "Education",
  training: "Training",
  certification: "Certification",
  project: "Project",
};
