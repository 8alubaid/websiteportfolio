import type { Certification, Education } from "@/types/portfolio";

export const education: Education[] = [
  {
    id: "cu-boulder",
    institution: "University of Colorado Boulder",
    credential: "B.S. Electrical & Computer Engineering",
    detail: "Minor in Engineering Management",
    // EDIT: replace with your exact graduation term, e.g. "2022 – May 2026".
    period: "2022 – Graduated",
    location: "Boulder, Colorado",
  },
  {
    id: "kau",
    institution: "King Abdulaziz University",
    credential: "Preparatory Year",
    period: "2021 – 2022",
    location: "Jeddah, Saudi Arabia",
  },
];

export const certifications: Certification[] = [
  {
    id: "aws-ccp",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    status: "earned",
    // EDIT: add your Credly verification link as `verifyUrl`.
  },
  {
    id: "aws-aip",
    name: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services",
    status: "earned",
    // EDIT: add your Credly verification link as `verifyUrl`.
  },
];
