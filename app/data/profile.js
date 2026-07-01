export const profileIdentity = {
  name: "Jaswanth Narravula",
  role: "Software Engineer",
  headline:
    "Building intelligent systems, distributed platforms, and product experiences with measurable outcomes.",
  location: "Birmingham, Alabama",
  email: "jaswanthnarravula@gmail.com",
  githubUsername:
    process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Jaswanthnarravula",
  githubUrl: "https://github.com/Jaswanthnarravula",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  resumePath: "/resume",
};

export const profileSocialLinks = [
  {
    label: "GitHub",
    href: profileIdentity.githubUrl,
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: profileIdentity.linkedinUrl,
    icon: "linkedin",
  },
  {
    label: "Email",
    href: `mailto:${profileIdentity.email}`,
    icon: "email",
  },
].filter((entry) => entry.href);

export const certifications = [
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    status: "In Progress",
    issued: "Target Completion: 2026",
    credentialId: "Credential ID will be added after verification",
    verificationUrl: "https://www.credly.com",
    focus: ["Cloud Fundamentals", "Security Basics", "Cost Optimization"],
    accent: "#2563eb",
  },
  {
    title: "Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    status: "In Progress",
    issued: "Target Completion: 2026",
    credentialId: "Credential ID will be added after verification",
    verificationUrl: "https://learn.microsoft.com/credentials/",
    focus: ["Azure Services", "Identity", "Governance"],
    accent: "#0ea5a3",
  },
  {
    title: "TensorFlow Developer Certificate",
    issuer: "Google / TensorFlow",
    status: "In Progress",
    issued: "Target Completion: 2026",
    credentialId: "Credential ID will be added after verification",
    verificationUrl: "https://www.tensorflow.org/certificate",
    focus: ["Neural Networks", "Model Validation", "Deployment"],
    accent: "#f97316",
  },
];

export const educationJourney = [
  {
    period: "2024 - Present",
    title: "Master of Science in Computer Science",
    institution: "The University of Alabama at Birmingham",
    detail:
      "Focused on distributed systems, machine intelligence, and large-scale backend architecture.",
    highlights: [
      "Advanced algorithms and performance analysis",
      "Database systems and optimization",
      "Cloud-native system design and deployment",
    ],
  },
  {
    period: "2024 - Present",
    title: "Applied Engineering Portfolio",
    institution: "Hands-on Product Development",
    detail:
      "Built production-style systems and documented architecture decisions, metrics, and tradeoffs.",
    highlights: [
      "Task scheduling intelligence platform",
      "Fault-tolerant distributed storage architecture",
      "Real-time collaboration and indoor navigation systems",
    ],
  },
  {
    period: "Continuous",
    title: "Certification and Skill Growth",
    institution: "Professional Upskilling Track",
    detail:
      "Structured learning roadmap across cloud, ML engineering, and reliable software delivery.",
    highlights: [
      "Weekly systems design deep dives",
      "Practical cloud and container orchestration practice",
      "Model lifecycle and observability patterns",
    ],
  },
];

export const resumeHighlights = [
  "Designed and delivered intelligent scheduling workflows with forecast-aware orchestration and policy-safe execution.",
  "Implemented distributed storage and replication workflows with strong availability and recovery behavior under node failure.",
  "Built real-time collaborative engineering experiences with low-latency sync, secure execution, and operational observability.",
  "Translated architecture complexity into usable product surfaces with measurable engineering outcomes.",
];

export const primaryTechStack = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "TensorFlow",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
];
