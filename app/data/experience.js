import { certifications } from "./profile";

export const experienceSummary = [
  {
    label: "Experience Streams",
    value: "4",
    detail: "Work, internships, workshops, and certifications",
    accent: "#2563eb",
  },
  {
    label: "Portfolio Systems",
    value: "4",
    detail: "Production-style engineering projects",
    accent: "#0ea5a3",
  },
  {
    label: "Certification Track",
    value: `${certifications.length}`,
    detail: "Cloud and ML credentials in progress",
    accent: "#f97316",
  },
];

export const workExperiences = [
  {
    role: "Software Engineer",
    organization: "Applied Portfolio Engineering",
    period: "2025 - Present",
    location: "Birmingham, AL / Remote",
    domain: "Intelligent Systems",
    summary:
      "Building production-style systems that combine machine intelligence, reliable backend architecture, and measurable product outcomes.",
    highlights: [
      "Delivered an intelligent task scheduling platform with forecast-aware orchestration and policy-safe execution.",
      "Designed fault-tolerant distributed storage patterns with replication, failover readiness, and observability.",
      "Shipped real-time collaboration workflows with secure execution and low-latency synchronization.",
    ],
    stack: ["Python", "TypeScript", "React", "Node.js", "Docker", "Redis"],
  },
  {
    role: "Platform Reliability Engineer",
    organization: "Distributed Systems Practice",
    period: "2025 - Present",
    location: "Remote",
    domain: "Reliability & Operations",
    summary:
      "Focused on system resilience, graceful degradation, and operational clarity across multi-service engineering workflows.",
    highlights: [
      "Implemented recovery-aware storage patterns for node churn and partial failure scenarios.",
      "Created telemetry-first workflows with metrics, traces, and rollback-ready release gates.",
      "Documented architecture tradeoffs for incident preparedness and faster remediation.",
    ],
    stack: ["Java", "Kubernetes", "Prometheus", "Grafana", "MongoDB"],
  },
  {
    role: "Product-Focused Full Stack Engineer",
    organization: "Interactive Systems Portfolio",
    period: "2024 - Present",
    location: "Remote",
    domain: "User Experience Systems",
    summary:
      "Bridging deep technical implementation with interface clarity to make complex systems understandable and usable.",
    highlights: [
      "Built narrative-driven technical walkthroughs that explain architecture decisions and measurable outcomes.",
      "Converted backend system behavior into actionable UI surfaces for reliability and debugging visibility.",
      "Maintained modular delivery patterns so new project sections remain easy to evolve.",
    ],
    stack: ["Next.js", "Framer Motion", "REST APIs", "PostgreSQL"],
  },
];

export const internships = [
  {
    role: "Software Engineering Internship Track",
    organization: "Portfolio Delivery Program",
    period: "2025 - Present",
    location: "Remote",
    status: "Ongoing",
    summary:
      "Internship-style delivery cadence focused on sprint execution, measurable system impact, and engineering documentation.",
    bullets: [
      "Practiced end-to-end ownership from architecture framing to implementation and validation.",
      "Built deployment-ready project artifacts that mirror production engineering expectations.",
      "Maintained concise technical communication using architecture notes and walkthrough narratives.",
    ],
  },
  {
    role: "Cloud Engineering Internship Preparation",
    organization: "University + Self-Directed",
    period: "2026 Cycle",
    location: "Open to U.S. opportunities",
    status: "Active",
    summary:
      "Structured preparation for cloud-focused internship roles through hands-on labs and platform reliability exercises.",
    bullets: [
      "Completed practical exercises for service deployment, observability, and infrastructure troubleshooting.",
      "Expanded cloud fundamentals across AWS and Azure-aligned pathways.",
      "Documented learning outcomes with implementation notes and iteration plans.",
    ],
  },
];

export const workshops = [
  {
    title: "Systems Design Deep-Dive Workshop Series",
    host: "Graduate Engineering Track",
    period: "Ongoing",
    format: "Case-study and architecture sessions",
    outcomes: [
      "Modeled tradeoffs for throughput, consistency, and operational complexity.",
      "Practiced communication of architecture decisions for technical interviews and delivery reviews.",
    ],
  },
  {
    title: "Cloud Deployment and Reliability Labs",
    host: "Applied Learning Program",
    period: "2025 - Present",
    format: "Hands-on workshop labs",
    outcomes: [
      "Implemented containerized deployments with service health monitoring.",
      "Worked through failure simulation and rollback planning techniques.",
    ],
  },
  {
    title: "ML Workflow and Observability Workshop",
    host: "Machine Intelligence Practice",
    period: "Ongoing",
    format: "Implementation-oriented sessions",
    outcomes: [
      "Explored model validation strategy and experiment tracking patterns.",
      "Connected model behavior to production monitoring and feedback loops.",
    ],
  },
];
