import type { SkillGroup } from "@/types/portfolio";

/**
 * Skills grouped by system. No proficiency percentages: every entry is backed by
 * a project, course, or certification elsewhere in the portfolio.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "C"],
  },
  {
    id: "cloud",
    label: "Cloud Platforms",
    skills: [
      "AWS: EKS, Bedrock, IAM / Pod Identity",
      "Google Cloud: Cloud Run, Cloud Build, Artifact Registry, GKE",
    ],
  },
  {
    id: "devops",
    label: "Containers & DevOps",
    skills: ["Docker", "Kubernetes", "Kustomize", "RBAC & NetworkPolicy", "CI/CD pipelines", "Prometheus metrics", "Linux"],
  },
  {
    id: "ai",
    label: "AI & Machine Learning",
    skills: [
      "PyTorch & torchvision",
      "CNNs & transfer learning",
      "LLM agents (LangGraph)",
      "Amazon Bedrock",
      "YOLO object detection",
      "Model evaluation & comparison",
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    skills: ["Next.js", "React", "React Native & Expo", "Flask", "FastAPI", "Tailwind CSS"],
  },
  {
    id: "hardware",
    label: "Hardware & Embedded",
    skills: ["STM32 (F429 Discovery)", "Arduino", "Sensor integration (I²C)", "Data logging", "PCB design", "Environmental testing"],
  },
  {
    id: "tools",
    label: "Developer Tools",
    skills: ["Git & GitHub", "VS Code", "Google Colab", "MATLAB", "Wireshark"],
  },
];
