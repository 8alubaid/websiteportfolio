import type { Project } from "@/types/portfolio";

/**
 * Projects. Each project is defined exactly once here and rendered by both
 * Portfolio mode (`/projects/[slug]`) and the Terminal (`projects <slug>`).
 * Display order sets the project number (01, 02, …).
 *
 * Accuracy rule: only verified facts. Leave a field out rather than guess.
 */
export const projects: Project[] = [
  {
    slug: "kubernetes-ai-agent",
    name: "Kubernetes AI Agent",
    discipline: "Cloud / AI infrastructure",
    title: "Kubernetes AI Agent on Amazon EKS",
    summary:
      "Deployed a LangGraph agent that diagnoses and, with human approval, fixes Kubernetes problems, running on Amazon EKS with Bedrock.",
    sectors: ["cloud", "ai"],
    role: "Deployment & operations",
    period: "2026",
    featured: true,
    recruiter: {
      overview:
        "This is an AI assistant for Kubernetes, the system many companies use to run their software. It looks at a cluster, works out what's broken, proposes a fix, and applies it only after a person approves.",
      contribution:
        "I deployed and operated an open-source agent on Amazon's managed Kubernetes service (EKS). That covered container images, Kubernetes manifests, permissions, a database for the agent's memory, and secure, keyless access to AWS's AI models.",
      whyItMatters:
        "Running an AI agent that can change production infrastructure means getting permissions, approvals, and observability right, which are the core skills of cloud engineering.",
    },
    engineering: {
      problem:
        "Run an LLM agent that can read and modify cluster state safely: least-privilege access, human approval before writes, and durable state across restarts.",
      architecture:
        "FastAPI backend hosting a LangGraph state machine, a Next.js chat UI behind a server-side proxy, and Postgres for durable checkpoints. Models are served by Amazon Bedrock (Amazon Nova Pro). Everything is deployed with Kustomize into an isolated namespace on EKS.",
      pipeline: [
        { label: "Diagnose", detail: "read-only K8s tools" },
        { label: "Propose fix" },
        { label: "Human approval", detail: "/api/decision" },
        { label: "Apply", detail: "write tools" },
        { label: "Verify / retry" },
      ],
      decisions: [
        {
          title: "EKS Pod Identity instead of static keys",
          detail:
            "An IAM role is mapped to the agent's ServiceAccount, so no AWS credentials live in manifests. Static env vars would override the role in boto3's credential chain.",
        },
        {
          title: "Defense in depth on the cluster",
          detail:
            "RBAC scoped to the agent, a NetworkPolicy, ClusterIP-only Services, and liveness/readiness probes that check both the Kubernetes API and Bedrock connectivity.",
        },
        {
          title: "Durable agent memory",
          detail:
            "LangGraph checkpoints are stored in Postgres (5Gi PVC), so an in-flight approval survives pod restarts.",
        },
      ],
      challenges: [
        "Ordering startup: the backend exits until Postgres finishes its first init, then recovers on restart.",
        "Keeping secrets out of version control while still using Kustomize secret generators.",
      ],
    },
    stack: ["AWS EKS", "Amazon Bedrock", "Kubernetes", "Kustomize", "Docker", "LangGraph", "FastAPI", "Next.js", "PostgreSQL", "Prometheus"],
    links: [
      {
        label: "Upstream project (techiescamp)",
        href: "https://github.com/techiescamp/kubernetes-ai-projects",
        kind: "upstream",
      },
    ],
    notes: [
      "The agent's application code is an open-source project by techiescamp / DevOpsCube. My work was deploying and operating it on AWS.",
    ],
  },
  {
    slug: "high-altitude-balloon",
    name: "High-Altitude Balloon",
    discipline: "Embedded systems / telemetry",
    title: "High-Altitude Balloon Payload",
    summary:
      "Engineering capstone: a sensor and radiation-measurement payload carried by a high-altitude balloon to roughly 25 km.",
    sectors: ["embedded"],
    role: "Team project",
    context: "CU Boulder engineering capstone",
    featured: true,
    recruiter: {
      overview:
        "Our capstone team built an instrument payload that rode a weather balloon to the edge of space, about 25 km up. It recorded temperature, humidity, motion, magnetic field, power use, and radiation levels throughout the flight.",
      contribution:
        "I worked on the payload's sensing and data side, including logging from two Geiger-counter radiation sensors, a two-hour cold-soak test, and a side-by-side lab comparison of the two counters.",
      whyItMatters:
        "Hardware that flies can't be patched mid-flight. It has to be tested against cold, power limits, and failure before launch.",
    },
    engineering: {
      problem:
        "Collect reliable environmental, inertial, power, and radiation data through a flight with extreme cold, low pressure, and no chance of intervention.",
      architecture:
        "An onboard flight computer initializes the sensor suite at power-up and writes one timestamped CSV row per sample to an SD card. Two independent Geiger counters log radiation counts.",
      pipeline: [
        { label: "Sensors", detail: "BME, LSM IMU, LIS3MDL, INA" },
        { label: "Flight computer", detail: "timestamped sampling" },
        { label: "SD-card CSV log", detail: "20 channels" },
        { label: "Radiation counters", detail: "2 Geiger modules" },
        { label: "Post-flight analysis" },
      ],
      decisions: [
        {
          title: "Redundant radiation sensing",
          detail:
            "Two different Geiger counter modules were logged side by side so readings could be cross-checked.",
        },
        {
          title: "Environmental pre-testing",
          detail:
            "Payload electronics went through a two-hour cold test, and both counters ran a 45-minute lab comparison before flight.",
        },
      ],
      challenges: [
        "Logging 20 channels per sample (temperature, humidity, altitude, gas resistance, 3-axis magnetometer, accelerometer, gyroscope, bus voltage, current, internal/external temperature) without data loss.",
      ],
    },
    stack: ["Embedded data logging", "BME environmental sensor", "LSM IMU", "LIS3MDL magnetometer", "INA power monitor", "Geiger counters"],
    results: [{ label: "Flight altitude", value: "≈ 25 km" }],
  },
  {
    slug: "computer-vision",
    name: "Computer Vision",
    discipline: "Machine learning / research",
    title: "Facial Emotion Recognition: CNN vs Transfer Learning",
    summary:
      "Compared a custom CNN, frozen EfficientNet-B0 transfer learning, and partial fine-tuning on the FER2013 emotion dataset.",
    sectors: ["ai"],
    role: "Training project",
    period: "Oct 2026",
    context: "SDAIA computer vision program, final project",
    recruiter: {
      overview:
        "This project teaches a computer to recognise seven facial expressions (angry, disgust, fear, happy, neutral, sad, surprise) from small grayscale photos, and compares three ways of building that model.",
      contribution:
        "I built and trained all three approaches in PyTorch, evaluated them on 7,178 held-out test images, and compared the results.",
      whyItMatters:
        "Knowing when a big pretrained model helps, and when it doesn't, saves real compute and time. This experiment showed that the off-the-shelf approach alone wasn't enough.",
    },
    engineering: {
      problem:
        "FER2013 is hard: 48×48 grayscale faces, noisy labels, and heavy class imbalance (436 'disgust' vs 7,215 'happy' training images).",
      architecture:
        "PyTorch on a Colab T4 GPU. A custom convolutional network is trained from scratch at native resolution, then compared with EfficientNet-B0 pretrained on ImageNet (images resized to 224×224, grayscale to 3 channels), first as a frozen feature extractor and then with its last blocks unfrozen.",
      pipeline: [
        { label: "FER2013", detail: "28,709 train / 7,178 test" },
        { label: "Custom CNN", detail: "from scratch" },
        { label: "EfficientNet-B0", detail: "frozen backbone" },
        { label: "Partial fine-tune", detail: "last blocks unfrozen" },
        { label: "Compare on test set" },
      ],
      decisions: [
        {
          title: "Baseline before transfer learning",
          detail:
            "Training a small CNN first set an honest baseline to judge whether a pretrained backbone actually helps.",
        },
        {
          title: "Partial unfreezing",
          detail:
            "ImageNet features transfer poorly to tiny grayscale faces, so the last blocks plus the classifier were unfrozen with a 90/10 train/validation split.",
        },
      ],
      challenges: [
        "A frozen ImageNet backbone barely beat the scratch CNN (44.57% vs 44.25%), which pointed to domain mismatch rather than model capacity.",
      ],
    },
    stack: ["Python", "PyTorch", "torchvision", "EfficientNet-B0", "Google Colab", "NumPy", "Matplotlib"],
    results: [
      { label: "Custom CNN", value: "44.25%", note: "test accuracy, 7 classes, 5 epochs" },
      { label: "EfficientNet-B0 (frozen)", value: "44.57%", note: "test accuracy, 20 epochs" },
    ],
  },
  {
    slug: "network-diagnostics",
    name: "Network Diagnostic API",
    discipline: "Cloud / containerized services",
    title: "Network Diagnostic API on Cloud Run",
    summary:
      "A containerized Flask API for ping and DNS diagnostics, built and deployed to Google Cloud Run through Cloud Build.",
    sectors: ["cloud", "software"],
    role: "Solo project",
    period: "Jul 2026",
    recruiter: {
      overview:
        "A small web service that answers two common network questions: is a host reachable, and what IP address does a domain resolve to? It runs on Google Cloud and redeploys automatically from a build pipeline.",
      contribution:
        "I wrote the API, packaged it as a container, and set up the pipeline that builds the image, stores it in Google's registry, and deploys it to Cloud Run.",
    },
    engineering: {
      architecture:
        "Flask app served by gunicorn inside a python:3.11-slim image with ping and DNS tools installed. Cloud Build builds and pushes to Artifact Registry, then runs `gcloud run deploy` to a managed Cloud Run service in us-central1.",
      pipeline: [
        { label: "git push" },
        { label: "Cloud Build", detail: "docker build" },
        { label: "Artifact Registry", detail: "push image" },
        { label: "Cloud Run", detail: "us-central1" },
      ],
      decisions: [
        {
          title: "No shell interpolation",
          detail:
            "Commands run via subprocess with argument lists and a 10-second timeout, never through a shell string.",
        },
        {
          title: "Clear endpoint contract",
          detail:
            "`/health`, `/ping?host=`, and `/dns?domain=` return JSON with explicit 400 errors for missing parameters and DNS lookup timing in ms.",
        },
      ],
    },
    stack: ["Python", "Flask", "gunicorn", "Docker", "Google Cloud Run", "Cloud Build", "Artifact Registry"],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/8alubaid/NaveraioNetworkDiagnosticAPI",
        kind: "github",
      },
    ],
  },
  {
    slug: "personal-finance",
    name: "Fatoorah",
    discipline: "Mobile / personal finance",
    title: "Fatoorah: Receipts & Spending App",
    summary:
      "A cross-platform mobile app for receipts, budgets, and reminders, with a swappable bank-data layer for Saudi Open Banking.",
    sectors: ["software"],
    role: "Solo project",
    period: "Jun 2026",
    recruiter: {
      overview:
        "Fatoorah is a personal finance app in the style of Rocket Money. It tracks receipts and spending, shows budgets and trends, and reminds you about warranties, return deadlines, subscriptions, and bills. It runs on phones and in the browser.",
      contribution:
        "I designed and built the app: four main screens, light and dark themes, and a bank-connection flow. A small backend keeps the banking provider's secret key off the phone.",
    },
    engineering: {
      architecture:
        "Expo + Expo Router (React Native) with a provider interface for bank data. A mock provider supplies demo data for Expo Go and web, and a Lean Technologies provider talks to a Node backend that holds API secrets for real Open Banking sandbox linking.",
      pipeline: [
        { label: "Screens", detail: "Dashboard, Receipts, Insights, Reminders" },
        { label: "useBank() context" },
        { label: "Provider interface", detail: "mock | lean" },
        { label: "Node backend", detail: "holds secrets" },
        { label: "Lean Open Banking", detail: "sandbox" },
      ],
      decisions: [
        {
          title: "Swappable data provider",
          detail:
            "Screens never know whether data is mock or real. One config flag switches providers.",
        },
        {
          title: "Platform-split native SDK",
          detail:
            "The Lean LinkSDK needs a native WebView, so it is split into .native/.web files and bundled only on real devices. Mock mode still works in Expo Go and the browser.",
        },
        {
          title: "Secrets stay server-side",
          detail: "The app calls a backend for tokens instead of shipping provider keys in the client bundle.",
        },
      ],
    },
    stack: ["React Native", "Expo", "Expo Router", "JavaScript", "Node.js", "Lean Open Banking API", "EAS Build"],
  },
  {
    slug: "stm32-tetris",
    name: "STM32 Tetris",
    discipline: "Embedded / bare-metal firmware",
    title: "Tetris on STM32",
    summary: "A Tetris game written for the STM32F429 Discovery board, running directly on the microcontroller.",
    sectors: ["embedded"],
    role: "Solo project",
    recruiter: {
      overview:
        "A playable version of Tetris built for a small development board with a built-in screen. There's no operating system: the game runs directly on the microcontroller.",
      contribution: "I implemented the game on the STM32F429 Discovery board.",
    },
    engineering: {
      architecture: "Bare-metal firmware on the STM32F429 Discovery board, drawing the game to the board's on-board LCD.",
    },
    stack: ["C", "STM32F429 Discovery", "Embedded firmware"],
  },
];

export const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

export const getProject = (slug: string): Project | undefined => projectBySlug.get(slug.toLowerCase());

/** Two-digit project number derived from display order, e.g. `01`. */
export const projectNumber = (project: Project): string => String(projects.indexOf(project) + 1).padStart(2, "0");
