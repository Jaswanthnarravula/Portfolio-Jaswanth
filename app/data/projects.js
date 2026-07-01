export const projects = [
  {
    slug: "intelligent-task-scheduling-system",
    number: "01",
    title: "Intelligent Task Scheduling System",
    shortTitle: "AI Task Scheduler",
    subtitle: "Machine learning driven orchestration for dynamic resource optimization.",
    summary:
      "A forecasting aware scheduling platform that allocates compute and labor resources using demand predictions and adaptive prioritization.",
    hoverQuestion:
      "Would you like to explore how the scheduler delivered a measurable 40 percent efficiency gain?",
    heroGradient:
      "linear-gradient(135deg, rgba(0,113,227,1) 0%, rgba(94,92,230,0.94) 100%)",
    image: "/projects/task-scheduler.svg",
    imageAlt: "Task scheduling analytics dashboard with optimization timeline",
    intro:
      "The Intelligent Task Scheduling System was built to resolve bottlenecks in mixed workload environments where static scheduling decisions produced queue collapse, idle resources, and inaccurate completion forecasts.",
    overview: [
      "I designed the platform around a continuous planning loop: signal collection, demand forecasting, candidate plan generation, and policy aware dispatch.",
      "The scheduling core combines predictive modeling and deterministic guardrails so it remains reliable during uncertainty spikes.",
      "The user interface exposes confidence intervals, queue pressure indicators, and override controls for operators who need explainable control.",
    ],
    challenges: [
      "Prediction quality drifted whenever workload patterns changed between weekday and weekend traffic windows.",
      "Naive model refresh strategies caused brief planning stalls and unacceptable latency for real time queue assignment.",
      "Different teams required hard business rules that could not be violated even if the predictive engine suggested otherwise.",
    ],
    resolution: [
      "Implemented online feature freshness checks and scheduled retraining windows with automatic rollback support.",
      "Introduced asynchronous pre computation of candidate plans so inference and dispatch never blocked each other.",
      "Added a policy engine layer that validates all model outputs against domain constraints before execution.",
    ],
    metrics: [
      { label: "Efficiency Improvement", value: "40%" },
      { label: "Planning Latency", value: "150 ms" },
      { label: "Forecast Horizon", value: "72 hrs" },
      { label: "SLA Compliance", value: "99.3%" },
    ],
    techStack: [
      "Python",
      "TensorFlow",
      "React",
      "PostgreSQL",
      "Docker",
      "Redis",
      "FastAPI",
    ],
    snapshots: [
      {
        src: "/snapshots/task-scheduler/snapshot-01.svg",
        title: "Demand Projection Board",
        caption: "Forecast confidence and load shaping overlays for operations planning.",
      },
      {
        src: "/snapshots/task-scheduler/snapshot-02.jpg",
        title: "Queue Pressure Timeline",
        caption: "Real time queue saturation indicators with automated intervention markers.",
      },
      {
        src: "/snapshots/task-scheduler/snapshot-03.jpg",
        title: "Policy Override Console",
        caption: "Operator controls to adjust constraints while preserving safety boundaries.",
      },
    ],
    walkthrough: [
      {
        id: "discovery",
        step: "Discovery",
        question: "What was the first signal that the old scheduler could not scale?",
        narrative:
          "Task completion variance rose sharply during peak windows while average resource utilization remained below expected thresholds. This mismatch proved the assignment strategy was blind to demand transitions.",
        decisions: [
          "Instrumented queue behavior at minute level granularity.",
          "Compared planned vs actual resource occupancy by workload class.",
          "Created anomaly labels for starvation and thrashing scenarios.",
        ],
        outcome:
          "Established a measurable baseline showing policy conflict and poor foresight as primary failure modes.",
      },
      {
        id: "modeling",
        step: "Modeling",
        question: "How did you combine ML prediction with deterministic scheduling rules?",
        narrative:
          "A hybrid planner was introduced. The model forecasts workload intensity and duration while a deterministic constraint engine enforces fairness, SLA ceilings, and hard business limits.",
        decisions: [
          "Built feature pipelines for temporal, categorical, and historical sequence features.",
          "Used staged candidate generation so the planner can compare cost and risk profiles.",
          "Applied policy validation before final dispatch.",
        ],
        outcome:
          "The system gained predictive agility without sacrificing predictable governance.",
      },
      {
        id: "delivery",
        step: "Delivery",
        question: "What made the production rollout safe?",
        narrative:
          "Shadow mode and progressive rollout gates were mandatory. Plans were simulated, scored, and compared with incumbent decisions before real traffic exposure.",
        decisions: [
          "Enabled feature flags per workload domain.",
          "Added confidence threshold based fallback to deterministic baseline.",
          "Published rollback dashboards for incident response.",
        ],
        outcome:
          "Rollout completed with no service disruption and immediate efficiency gains.",
      },
    ],
  },
  {
    slug: "distributed-file-storage-system",
    number: "02",
    title: "Distributed File Storage System",
    shortTitle: "Distributed Storage",
    subtitle: "Fault tolerant storage with consistent hashing and autonomous replication.",
    summary:
      "A resilient storage backbone that balances shard distribution, recovers rapidly from node failure, and preserves data integrity across clusters.",
    hoverQuestion:
      "Would you like to explore the replication strategy that kept data available under node failure?",
    heroGradient:
      "linear-gradient(135deg, rgba(52,199,89,1) 0%, rgba(0,122,255,0.92) 100%)",
    image: "/projects/distributed-storage.svg",
    imageAlt: "Distributed storage architecture with replication links",
    intro:
      "This system was developed to support durable file operations in unstable cluster conditions where node churn, uneven shard load, and delayed reconciliation caused reliability issues.",
    overview: [
      "The storage ring uses consistent hashing with virtual nodes to smooth load distribution under scaling events.",
      "Replication orchestration continuously evaluates health and reassigns ownership for shards that lose quorum confidence.",
      "Service interfaces expose deterministic read and write semantics with explicit consistency guarantees per operation mode.",
    ],
    challenges: [
      "Replica drift under concurrent writes during partial network partitions.",
      "Slow rebalance jobs that affected hot shard latency.",
      "Operational blind spots when recovery workers lagged behind failure events.",
    ],
    resolution: [
      "Introduced write intent journaling and conflict reconciliation policy by version vector.",
      "Implemented weighted rebalance scheduling that prioritizes high pressure partitions.",
      "Added real time health telemetry with per shard recovery traceability.",
    ],
    metrics: [
      { label: "Data Availability", value: "99.95%" },
      { label: "Recovery Time Objective", value: "< 45 sec" },
      { label: "Replica Consistency", value: "99.8%" },
      { label: "Shard Rebalance Speed", value: "2.4x" },
    ],
    techStack: [
      "Java",
      "gRPC",
      "Redis",
      "MongoDB",
      "Kubernetes",
      "Prometheus",
      "Grafana",
    ],
    snapshots: [
      {
        src: "/snapshots/distributed-storage/snapshot-01.svg",
        title: "Hash Ring Topology",
        caption: "Shard ownership map with virtual node balancing and failure overlays.",
      },
      {
        src: "/snapshots/distributed-storage/snapshot-02.jpg",
        title: "Replica Health Monitor",
        caption: "Per partition replication status with lag and recovery confidence scores.",
      },
      {
        src: "/snapshots/distributed-storage/snapshot-03.jpg",
        title: "Failure Simulation Console",
        caption: "Chaos test panel validating failover and data reconstruction timelines.",
      },
    ],
    walkthrough: [
      {
        id: "ring-design",
        step: "Ring Design",
        question: "Why did consistent hashing need virtual nodes in your implementation?",
        narrative:
          "Physical node weight differences caused uneven shard concentration. Virtual nodes normalized distribution and reduced movement during scale events.",
        decisions: [
          "Mapped shard tokens to weighted virtual placements.",
          "Defined movement budgets to avoid aggressive churn.",
          "Tracked rebalance debt per node to coordinate recovery.",
        ],
        outcome:
          "Distribution variance dropped significantly and hotspot frequency reduced.",
      },
      {
        id: "replication",
        step: "Replication",
        question: "How did you preserve write correctness under partial outages?",
        narrative:
          "Write intents were logged before acknowledgment. During partition recovery, intents were replayed with version vectors and conflict policies.",
        decisions: [
          "Separated quorum acknowledgment from full replica synchronization.",
          "Encoded reconciliation policy by operation class.",
          "Added anti entropy sweeps for stale replica detection.",
        ],
        outcome:
          "Consistency stayed high even during rolling failure tests.",
      },
      {
        id: "operations",
        step: "Operations",
        question: "What gave operators confidence during incidents?",
        narrative:
          "Actionable observability mattered more than raw metrics volume. We introduced state timelines for every partition and clear remediation hints.",
        decisions: [
          "Built incident dashboards keyed by partition severity.",
          "Connected alerts to runbook snippets and ownership tags.",
          "Measured mean detection and mitigation durations.",
        ],
        outcome:
          "Operational response time improved and on call escalations declined.",
      },
    ],
  },
  {
    slug: "real-time-collaborative-code-editor",
    number: "03",
    title: "Real-Time Collaborative Code Editor",
    shortTitle: "Collaborative Editor",
    subtitle: "Low latency shared coding sessions with synchronized execution context.",
    summary:
      "A collaborative development environment that supports concurrent editing, live presence, and secure terminal sessions in the browser.",
    hoverQuestion:
      "Would you like to explore how editing conflicts were resolved without breaking typing flow?",
    heroGradient:
      "linear-gradient(135deg, rgba(255,149,0,1) 0%, rgba(255,45,85,0.88) 100%)",
    image: "/projects/realtime-editor.svg",
    imageAlt: "Collaborative code editor with live cursors and integrated terminal",
    intro:
      "The editor was designed for teams that needed instant collaboration while preserving responsiveness, editor stability, and a secure sandboxed execution environment.",
    overview: [
      "Operational synchronization handles concurrent edits and preserves cursor intent under heavy collaborative activity.",
      "Session services maintain awareness states, role permissions, and connection recovery behavior.",
      "Terminal workloads run in isolated environments with policy constrained command execution.",
    ],
    challenges: [
      "Cursor jump artifacts during simultaneous multiline edits.",
      "State divergence when users rejoined after intermittent connectivity.",
      "Balancing terminal responsiveness with strict sandbox safety controls.",
    ],
    resolution: [
      "Implemented transform aware cursor preservation and conflict-safe operation ordering.",
      "Added session replay checkpoints for deterministic rejoin hydration.",
      "Built ephemeral execution containers with scoped permissions and timeouts.",
    ],
    metrics: [
      { label: "Collab Sync Latency", value: "70 ms" },
      { label: "Session Rejoin Time", value: "< 2 sec" },
      { label: "Terminal Isolation", value: "100%" },
      { label: "Concurrent Users Tested", value: "120+" },
    ],
    techStack: [
      "React",
      "Node.js",
      "WebSockets",
      "Monaco Editor",
      "AWS",
      "Redis",
      "Docker",
    ],
    snapshots: [
      {
        src: "/snapshots/realtime-editor/snapshot-01.svg",
        title: "Live Editing Surface",
        caption: "Multiple cursors and presence tracking in synchronized code sessions.",
      },
      {
        src: "/snapshots/realtime-editor/snapshot-02.jpg",
        title: "Session Activity Panel",
        caption: "Join events, edits, and permission updates visible in real time.",
      },
      {
        src: "/snapshots/realtime-editor/snapshot-03.jpg",
        title: "Secure Terminal Workspace",
        caption: "Isolated command execution with audit logs and safety constraints.",
      },
    ],
    walkthrough: [
      {
        id: "sync-engine",
        step: "Sync Engine",
        question: "How did the editor preserve intent during conflicting edits?",
        narrative:
          "The synchronization layer applies operation transforms while preserving semantic cursor context, so users keep orientation even during overlapping edits.",
        decisions: [
          "Maintained ordered operation streams with timestamp and author metadata.",
          "Applied conflict transforms before cursor remapping.",
          "Used periodic snapshots to bound replay cost.",
        ],
        outcome:
          "Conflict handling became transparent to users and typing flow remained smooth.",
      },
      {
        id: "presence",
        step: "Presence",
        question: "What made collaboration feel live instead of delayed?",
        narrative:
          "We optimized event transport paths and minimized payload overhead by splitting presence updates from document operations.",
        decisions: [
          "Implemented compact presence packets with heartbeat coordination.",
          "Debounced low value signals while preserving high priority actions.",
          "Added visual presence anchors for cursor and viewport awareness.",
        ],
        outcome:
          "Participants experienced immediate feedback and stronger team coordination.",
      },
      {
        id: "execution",
        step: "Execution",
        question: "How did you secure terminal access without harming usability?",
        narrative:
          "Execution requests are routed to short lived containers with scoped filesystem access, command policy checks, and strict lifecycle controls.",
        decisions: [
          "Bound sessions to isolated ephemeral runtime containers.",
          "Added command allow list and timeout enforcement.",
          "Published execution traces for auditing and troubleshooting.",
        ],
        outcome:
          "The platform delivered safe interactive execution with predictable performance.",
      },
    ],
  },
  {
    slug: "campus-indoor-navigation-system",
    number: "04",
    title: "Campus Indoor Navigation System",
    shortTitle: "Indoor Navigation",
    subtitle: "Graph based routing and beacon assisted localization for campus interiors.",
    summary:
      "A mobile first indoor navigation platform that provides floor accurate guidance, accessibility aware routes, and reliable position estimation.",
    hoverQuestion:
      "Would you like to explore how graph routing and beacon signals were combined for indoor guidance?",
    heroGradient:
      "linear-gradient(135deg, rgba(0,199,190,1) 0%, rgba(94,92,230,0.86) 100%)",
    image: "/projects/indoor-navigation.svg",
    imageAlt: "Indoor campus map with routing overlays and destination markers",
    intro:
      "The platform addresses navigation friction inside multi floor academic buildings where GPS is unreliable and routes must account for accessibility and dynamic environment constraints.",
    overview: [
      "Navigation graphs encode corridors, stairs, elevators, and restricted zones as weighted route edges.",
      "Localization combines beacon signal fingerprints with map constraints to improve route confidence.",
      "Route planning supports accessibility presets to honor mobility requirements and elevator preference.",
    ],
    challenges: [
      "Signal ambiguity around dense intersections and elevator banks.",
      "Route instability when temporary closures changed available paths.",
      "Need for usable offline behavior in weak connectivity zones.",
    ],
    resolution: [
      "Added confidence smoothing and junction correction logic using movement context.",
      "Built dynamic edge weighting so closures and congestion impact route selection in real time.",
      "Implemented cached route bundles with synchronization when connectivity resumes.",
    ],
    metrics: [
      { label: "Route Accuracy", value: "96%" },
      { label: "Localization Error", value: "< 2.5 m" },
      { label: "Accessibility Coverage", value: "100%" },
      { label: "Offline Route Success", value: "92%" },
    ],
    techStack: [
      "Python",
      "Flask",
      "React Native",
      "Firebase",
      "GraphQL",
      "NetworkX",
      "Mapbox",
    ],
    snapshots: [
      {
        src: "/snapshots/indoor-navigation/snapshot-01.svg",
        title: "Building Graph Map",
        caption: "Node edge campus model with floor transitions and constraints.",
      },
      {
        src: "/snapshots/indoor-navigation/snapshot-02.jpg",
        title: "Accessibility Route Mode",
        caption: "Alternative path selection prioritizing ramps and elevators.",
      },
      {
        src: "/snapshots/indoor-navigation/snapshot-03.jpg",
        title: "Live Position Confidence",
        caption: "Beacon signal confidence visualization with path correction cues.",
      },
    ],
    walkthrough: [
      {
        id: "mapping",
        step: "Mapping",
        question: "How was the indoor graph model designed for real world complexity?",
        narrative:
          "The map model uses layered graphs per floor plus transition edges for stairs and elevators, allowing route constraints to be computed accurately.",
        decisions: [
          "Encoded route cost factors for congestion, accessibility, and distance.",
          "Normalized building data into reusable topology segments.",
          "Defined update protocol for temporary closures and event based restrictions.",
        ],
        outcome:
          "Routing remained stable across different buildings and constraint combinations.",
      },
      {
        id: "localization",
        step: "Localization",
        question: "How did the system reduce beacon noise in dense spaces?",
        narrative:
          "Signal fingerprints were smoothed with movement context and graph plausibility checks so impossible jumps were rejected.",
        decisions: [
          "Applied weighted averaging across beacon confidence windows.",
          "Used route continuity checks before accepting location jumps.",
          "Added corrective snapping near known corridor anchors.",
        ],
        outcome:
          "Position estimation improved, especially around high interference areas.",
      },
      {
        id: "experience",
        step: "Experience",
        question: "What made the app practical for day to day campus use?",
        narrative:
          "The interface emphasized clear turn guidance, destination context, and rapid route recomputation when users deviated from the suggested path.",
        decisions: [
          "Designed concise turn cards with floor transition signals.",
          "Added route preview and confidence indicators before navigation start.",
          "Implemented offline fallback snapshots for continuity.",
        ],
        outcome:
          "User trust increased due to consistent guidance and clear feedback.",
      },
    ],
  },
];

export const projectsBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);

export const featuredProjectSlugs = projects.map((project) => project.slug);
