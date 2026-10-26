/**
 * Case study: the same person building two portfolio sites with Claude, once with
 * short, open-ended prompts and once with detailed briefs.
 *
 * Every quote is verbatim from the session transcripts (typos kept). Every number was
 * computed from those transcripts with one script, applied the same way to both
 * (counts as of 26 Oct 2026). Outcomes describe only what the transcripts show.
 * Rendered by Portfolio mode (`/case-study/`) and the terminal (`case-study`).
 */

export type Criterion = "goal" | "context" | "constraints" | "acceptance" | "verification" | "scope";

export const criteria: { id: Criterion; label: string; question: string }[] = [
  { id: "goal", label: "Concrete goal", question: "Does it say what to build, not just how it should feel?" },
  { id: "context", label: "Context", question: "Does it give the audience, background, and source material?" },
  { id: "constraints", label: "Constraints", question: "Does it say what must and must not happen?" },
  { id: "acceptance", label: "Acceptance criteria", question: "Does it define what done looks like?" },
  { id: "verification", label: "Verification", question: "Does it ask for the result to be tested or checked?" },
  { id: "scope", label: "Scope", question: "Does it say what to leave alone?" },
];

export interface SiteSummary {
  label: "Weaker prompts" | "Stronger prompts";
  name: string;
  url: string;
  session: string;
  period: string;
}

export const sites: [SiteSummary, SiteSummary] = [
  {
    label: "Weaker prompts",
    name: "farisbalubaid.cloud",
    url: "https://farisbalubaid.cloud",
    session: "Personal Website",
    period: "25 Aug – 8 Oct 2026",
  },
  {
    label: "Stronger prompts",
    name: "This site",
    url: "/",
    session: "This portfolio's build session",
    period: "25 – 26 Oct 2026",
  },
];

export interface Stat {
  label: string;
  weak: string;
  strong: string;
  note?: string;
}

export const stats: Stat[] = [
  { label: "Prompts written", weak: "42", strong: "10", note: "Excludes background-task notifications, context summaries, and a re-sent duplicate." },
  { label: "Calendar span", weak: "44 days", strong: "2 days" },
  { label: "Words in the opening prompt", weak: "39", strong: "2,384" },
  {
    label: "Prompts that asked for tests or acceptance checks",
    weak: "0",
    strong: "4",
    note: "Keyword match on verify / validate / test / acceptance / definition of done, then checked by hand (one false match, a video filename, removed).",
  },
];

export interface PromptPair {
  id: string;
  title: string;
  /** What both prompts were trying to achieve. */
  task: string;
  weak: { quote: string; date: string; outcome: string };
  strong: { excerpts: string[]; date: string; outcome: string };
  /** [weak, strong] against each criterion. Author's assessment using the criteria above. */
  scores: Record<Criterion, [boolean, boolean]>;
}

export const pairs: PromptPair[] = [
  {
    id: "kickoff",
    title: "Starting the project",
    task: "Kick off a portfolio site from scratch.",
    weak: {
      quote:
        "Ok, I want you to really have this project outstanding and professional with very creative design.\n\nPlease first of all have a README.md completed. Put it any related works etc.\n\nThen next work on the website design and everything.",
      date: "25 Aug 2026",
      outcome: "Two hours later, the next design prompt asked to “make the design the website a whole lot better”.",
    },
    strong: {
      excerpts: [
        "Act as a Principal Frontend Engineer, Senior UI/UX Designer, Creative Developer, and Software Architect with extensive experience building award-quality interactive developer portfolios.",
        "Accuracy requirement: These are initial content references, not permission to invent achievements. Confirm details against supplied project files, README documents, CV, and other reliable materials. Never fabricate job titles, employment, numbers, credentials, or project results.",
        "Both modes MUST be powered by the same structured portfolio data.",
        "A recruiter with zero terminal experience can browse the entire portfolio easily.",
      ],
      date: "25 Oct 2026",
      outcome:
        "The first delivery had both modes on one typed data model, 23 passing unit tests and a passing production build. The accuracy rule meant project claims were checked against real files, and unverifiable ones were flagged instead of invented.",
    },
    scores: {
      goal: [false, true],
      context: [false, true],
      constraints: [false, true],
      acceptance: [false, true],
      verification: [false, true],
      scope: [false, true],
    },
  },
  {
    id: "redesign",
    title: "Asking for a better design",
    task: "Push the visual design further.",
    weak: {
      quote:
        "Please make the design the website a whole lot better and push it to github, you can do something crazy 3d animations or anything related to computer engineering, cloud engineering, software engineering etc. Make users be amazed by your capabilities.",
      date: "25 Aug 2026",
      outcome:
        "Followed by prompts to change the colour theme and add 3D image effects, then three more prompts to tune the 3D globe (spin speed, drag, sensitivity, extra outlines).",
    },
    strong: {
      excerpts: [
        "Remove the top navigation completely.",
        "On first opening Terminal Mode, users should see only a minimal terminal interface and the active command prompt.",
        `Specifically avoid:

* Identical rounded cards arranged in grids.
* Glowing borders around every component.
* Generic Lucide icons beside every heading.`,
        "Do not prioritize adding more UI. Prioritize making the existing UI exceptional.",
      ],
      date: "26 Oct 2026",
      outcome:
        "Delivered in one pass, then checked against the brief's own validation list: no navbar, a fullscreen terminal opening to a bare prompt, no project icons, and the approved sections left intact.",
    },
    scores: {
      goal: [false, true],
      context: [false, true],
      constraints: [false, true],
      acceptance: [false, true],
      verification: [false, true],
      scope: [false, true],
    },
  },
  {
    id: "ai-look",
    title: "“Don't make it look AI-generated”",
    task: "Make the site look deliberately designed, not generated.",
    weak: {
      quote:
        "Next, I want you to change the whole font of the website to make it \"Inter\". I do not want the website to be looking very AI generated.\n\n(next prompt) yes, tone down the parts that look AI-generated",
      date: "5 Oct 2026",
      outcome: "Deciding what “looks AI-generated” was left to the model, so there was no rule to check the result against.",
    },
    strong: {
      excerpts: [
        "The entire website must use only the following three solid colors:",
        "These are the only permitted UI color values.",
        `- NO gradients.
- NO colored glows.
- NO neon cyan.
- NO purple.`,
        "Use font weight, spacing, scale, borders, decoration, and contrast to create hierarchy instead of introducing additional colors.",
      ],
      date: "26 Oct 2026",
      outcome:
        "The taste became a rule, and the rule became an automated test: the build fails if any color other than the three, a gradient, or a palette class appears in the source.",
    },
    scores: {
      goal: [true, true],
      context: [false, true],
      constraints: [false, true],
      acceptance: [false, true],
      verification: [false, true],
      scope: [false, true],
    },
  },
  {
    id: "bug",
    title: "Reporting a bug",
    task: "Get a layout or behaviour bug fixed.",
    weak: {
      quote:
        "Look at the attached picture. The picture shows that they are all right beside each other with the red boxes. Please fix that.\n\nMake it also that it works with Mobile devices.",
      date: "27 Aug 2026",
      outcome: "The fix depended on reading a screenshot. The prompt described neither the expected layout nor how to check it.",
    },
    strong: {
      excerpts: [
        "The prompt correctly updates to `~/projects`, but `ls` still displays the root-level directory contents.",
        "After entering `projects/`, executing `ls` must show the available projects instead of the root directory.",
        "Fix the actual source of the problem rather than patching the screenshot's specific example.",
        "Create or update automated tests covering:",
        "| `cd projects && ls` | Project directories |",
      ],
      date: "26 Oct 2026",
      outcome:
        "The root cause was found (an empty path resolved to home instead of the working directory), fixed once for every command, and covered by 13 navigation tests taken straight from the brief's table.",
    },
    scores: {
      goal: [true, true],
      context: [false, true],
      constraints: [false, true],
      acceptance: [false, true],
      verification: [false, true],
      scope: [false, true],
    },
  },
];

/** A fair counterexample: a short prompt from the weaker session that worked well. */
export const counterexample = {
  quote:
    "There is a bug, when I move my mouse from top to bottom, my avatar looks down to up which is the opposite. It is supposed to be the same following the mouse pointer.\n\nBut when I move from left to right, my avatar looks at it correctly.",
  date: "30 Sep 2026",
  lesson:
    "Short, but it states the actual behaviour, the expected behaviour, and what already works. It was resolved within two more prompts (“perfect thank you, that fixes it”). Length isn't what made the briefs work; specificity is.",
};

export const takeaways: { title: string; body: string }[] = [
  {
    title: "Define done",
    body: "“Outstanding” and “amazing” can't be checked. A definition of done and a validation list can, and the model will check them for you.",
  },
  {
    title: "Turn taste into rules",
    body: "“Don't look AI-generated” became three colors and a list of banned patterns, a rule precise enough to enforce with a test.",
  },
  {
    title: "Give context and limits up front",
    body: "Audience, source material, and a no-fabrication rule shaped the first delivery instead of being discovered over weeks of follow-ups.",
  },
  {
    title: "Report bugs as actual vs expected",
    body: "Current behaviour, expected behaviour, and the cases to test. That works in two sentences or two pages.",
  },
];

export const caveats =
  "This compares outcomes, not a controlled experiment. The two sites were built at different times, with different stacks and different scope: the earlier site added a 3D globe, a voxel avatar, a live chess replay and a custom domain, which account for some of its prompts. The scores are the author's own assessment against the six criteria.";

/**
 * Design comparison (/compare/): the two homepages cut in half, and the prompts that
 * shaped each design. Screenshots captured 26 Oct 2026 with headless Chrome at exact
 * device sizes (desktop 1440×900, phone 390×844 at 2×). Quotes are verbatim excerpts;
 * "…" marks omitted text.
 */
export const designComparison = {
  captured: "26 Oct 2026",
  weakTrail: [
    {
      date: "25 Aug 2026",
      text: "Please make the design the website a whole lot better and push it to github, you can do something crazy 3d animations or anything related to computer engineering, cloud engineering, software engineering etc. Make users be amazed by your capabilities.",
    },
    {
      date: "26 Aug 2026",
      text: "Also please can you change the theme from purple (what it is now) to something like yellow-ish like me in the background photo.",
    },
    {
      date: "27 Aug 2026",
      text: "You know the 3D sphere you added? I am thinking making it like a transparent globe just like the 3D sphere we have with the countries outlined.",
    },
    {
      date: "27 Aug 2026",
      text: "I want the globe to spin slower. And I want the globe to be more controllable by the user, maybe by holding the left click to scroll through the globe.",
    },
    {
      date: "30 Sep 2026",
      text: "Maybe I am thinking 3D pixelated person of me. Or something like that I am now want to change the website to a better one.",
    },
    {
      date: "30 Sep 2026",
      text: "I am thinking something like this but only with blocks (pixels). Do not have any gap between the squares.",
    },
    {
      date: "5 Oct 2026",
      text: "Next, I want you to change the whole font of the website to make it \"Inter\". I do not want the website to be looking very AI generated.",
    },
  ],
  weakSummary: "7 prompts over 6 weeks",
  strongBrief: {
    date: "26 Oct 2026",
    title: "# Portfolio Redesign — Monochrome Pixel-Inspired Design System",
    summary: "1 brief · 12 sections · 2,348 words",
    outline: [
      "ROLE",
      "CONTEXT",
      "REMOVE THE SPACE / MISSION IDENTITY",
      "STRICT THREE-COLOR DESIGN SYSTEM",
      "PIXEL-INSPIRED VISUAL IDENTITY",
      "PIXEL ANIMATION SYSTEM",
      "PORTFOLIO MODE",
      "TERMINAL MODE — MATCH THE NEW DESIGN",
      "REMOVE GENERIC AI-GENERATED DESIGN PATTERNS",
      "CODE QUALITY AND ARCHITECTURE",
      "IMPLEMENTATION WORKFLOW",
      "FINAL EXPECTATION",
    ],
    highlights: [
      "The entire website must use only the following three solid colors:",
      "Use font weight, spacing, scale, borders, decoration, and contrast to create hierarchy instead of introducing additional colors.",
      "Create ONE distinctive signature animation for the Portfolio home section.",
      "Respect `prefers-reduced-motion`.",
    ],
  },
  note: "The current design came from the third detailed brief in its session, so it also built on the two before it. The earlier site's design also reflects other prompts in its session beyond the seven shown here.",
};
