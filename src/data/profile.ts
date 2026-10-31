import type { Profile } from "@/types/portfolio";
import { withBasePath } from "@/lib/base-path";

export const profile: Profile = {
  name: "Faris Balubaid",
  firstName: "Faris",
  handle: "faris",
  headline: "Electrical & Computer Engineer",
  tagline:
    "I build systems that span cloud infrastructure, applied AI, software, and embedded hardware, from a sensor board on a high altitude balloon with the help of COSGC to an AI agent running on Kubernetes.",
  about: [
    "I'm an Electrical & Computer Engineering graduate from the University of Colorado Boulder, with a minor in Engineering Management.",
    "My work sits where hardware, software, and infrastructure meet. Have deployed an AI agent to Amazon EKS, shipped a containerized API to Google Cloud Run, and compared deep-learning approaches for computer vision.",
    "I care about the portions that make systems trustworthy: good metrics, human approval where it NEEDS, and infrastructure that can be redeployed from scratch.",
  ],
  bio: "Electrical & Computer Engineering graduate from CU Boulder, working across cloud engineering, software, AI, and Cloud on AWS, Google Cloud, and Kubernetes.",
  location: "Riyadh, Saudi Arabia",
  focus: ["cloud", "ai", "software", "embedded"],
  availability:
    "Open to roles in cloud engineering, AI/ML engineering, and software engineering, and to collaborating on hardware meets software projects.",
  contact: {
    // EDIT: confirm this is the address you want recruiters to use.
    email: "iifbalubaid@gmail.com",
    github: "https://github.com/8alubaid",
    // EDIT: add your LinkedIn URL, e.g. "https://www.linkedin.com/in/<your-handle>".
    linkedin: "https://www.linkedin.com/in/farisbalubaid/",
    // EDIT: drop a PDF in /public/resume and set e.g. "/resume/faris-balubaid-resume.pdf".
    resume: null,
  },
};

/** The résumé link as a browser URL, base path included (raw <a> tags don't get it automatically). */
export const resumeUrl: string | null = profile.contact.resume ? withBasePath(profile.contact.resume) : null;
