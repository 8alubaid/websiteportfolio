import Link from "next/link";
import { profile } from "@/data";

/**
 * Home: a short, personal introduction. Every claim here is backed by the project,
 * experience, and credential data the other sections render.
 */
export default function HomePage() {
  const { email, github } = profile.contact;

  return (
    <article className="grid gap-7">
      <h1 className="sr-only">
        {profile.name}, {profile.headline}
      </h1>

      <p>Hey! I&apos;m {profile.firstName}. I enjoy building things across cloud computing, software engineering, AI, and systems.</p>

      <p>
        Have a look at my{" "}
        <Link href="/projects/" className="text-link">
          projects
        </Link>
        : an AI agent I deployed and operated on Amazon EKS, a containerized network diagnostics API on Google Cloud Run, a comparison of
        deep-learning approaches for computer vision, and the sensor payload for a high-altitude balloon.
      </p>

      <p>
        Most of my recent work is in cloud infrastructure: Kubernetes, CI/CD, and DevOps on AWS and Google Cloud. Alongside that I build full-stack
        apps with Next.js and React Native, and AI systems with LLM agents and computer vision.
      </p>

      <p>
        I studied Electrical &amp; Computer Engineering at the University of Colorado Boulder, with a minor in Engineering Management, and I&apos;ve
        completed{" "}
        <Link href="/certifications/" className="text-link">
          training
        </Link>{" "}
        with Google Cloud and SDAIA. I care about the parts that make systems trustworthy: honest metrics, human approval where it matters, and
        infrastructure that can be redeployed from scratch.
      </p>

      <p>
        If anything here looks interesting, or you&apos;d like to build something together,{" "}
        {email && (
          <a href={`mailto:${email}`} className="text-link">
            email me
          </a>
        )}
        {email && github && " or find me on "}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-link">
            GitHub
          </a>
        )}
        . You can also explore the whole site from a{" "}
        <Link href="/terminal/" className="text-link">
          terminal
        </Link>
        , if you&apos;d rather type.
      </p>
    </article>
  );
}
