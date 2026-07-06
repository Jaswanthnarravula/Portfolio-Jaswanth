/**
 * Content for the /activities page — the life around the engineering:
 * hackathons, open source, mentorship, talks, and off-screen pursuits.
 * Numbers and specifics are meant to be tuned as they grow.
 */

export const activitiesHeroStats = [
  {
    value: "12",
    suffix: "+",
    label: "Hackathons & build sprints",
    detail: "48-hour ideas carried to demo day",
    accent: "#7c5cf6",
  },
  {
    value: "20",
    suffix: "+",
    label: "Developers mentored",
    detail: "Code reviews, careers, interview prep",
    accent: "#ec4899",
  },
  {
    value: "6",
    suffix: "",
    label: "Communities & clubs",
    detail: "ACM chapters to campus dev circles",
    accent: "#2563eb",
  },
];

export const activityChapters = [
  {
    id: "hackathons",
    kicker: "Arena 01",
    title: "Hackathons & competitions",
    tagline: "Where speed meets judgment.",
    description:
      "Forty-eight hours is enough time to build one honest thing. I go for the architecture call, the ruthless scope cut, and the demo that tells a story — usually as the teammate holding the system together at 2 a.m.",
    points: [
      "Led team builds from whiteboard to working demo under hard deadlines",
      "Owns the architecture call early so the last night is polish, not rescue",
      "Treats the pitch as part of the product — a demo is a narrative",
    ],
    tags: ["48-hour builds", "Team lead", "Demo-day storytelling"],
    art: "/activities/hackathons.svg",
    accent: "#7c5cf6",
  },
  {
    id: "opensource",
    kicker: "Arena 02",
    title: "Open source & community",
    tagline: "Code that lives in public.",
    description:
      "Contributing in the open is a different discipline: readable diffs, patient issue threads, docs that respect a stranger's time. It's where I learned that maintainership is mostly communication.",
    points: [
      "Contributions and issue triage across tools I actually use",
      "Writes documentation and reproduction cases maintainers can act on",
      "Believes small, well-scoped PRs beat heroic rewrites",
    ],
    tags: ["Pull requests", "Issue triage", "Docs & repros"],
    art: "/activities/opensource.svg",
    accent: "#0e9488",
  },
  {
    id: "mentorship",
    kicker: "Arena 03",
    title: "Mentorship & teaching",
    tagline: "Understanding, transferred.",
    description:
      "Explaining a system is the fastest way to find out whether you understand it. I mentor peers and juniors through code reviews, whiteboard sessions, and the unglamorous middle of interview prep.",
    points: [
      "Runs whiteboard sessions on systems design and data structures",
      "Reviews code for the person, not just the diff — patterns over patches",
      "Walks mentees through interviews until offers stop being hypothetical",
    ],
    tags: ["Peer mentoring", "Interview prep", "Systems whiteboards"],
    art: "/activities/mentorship.svg",
    accent: "#ec4899",
  },
  {
    id: "talks",
    kicker: "Arena 04",
    title: "Talks, notes & deep dives",
    tagline: "Learning out loud.",
    description:
      "Reading groups, tech talks, and long-form notes on papers and postmortems. If an idea survives being presented to a skeptical room, it's probably worth building with.",
    points: [
      "Presents deep dives on distributed systems and ML infrastructure",
      "Keeps running notes on papers, incidents, and architecture patterns",
      "Turns talks into study groups — the discussion outlasts the slides",
    ],
    tags: ["Tech talks", "Paper reading", "Study groups"],
    art: "/activities/talks.svg",
    accent: "#2563eb",
  },
];

export const fieldNotes = [
  {
    title: "The 2 a.m. pivot",
    detail:
      "Mid-hackathon, the clever half of the build wasn't going to demo. We cut it in one conversation and shipped the honest half. Scope discipline won more than the extra feature ever could have.",
  },
  {
    title: "The first merged PR",
    detail:
      "A small fix, three review rounds, one maintainer's patient feedback. It reset my bar for what a respectful diff looks like — and I've reviewed that way since.",
  },
  {
    title: "A mentee's first offer",
    detail:
      "Weeks of mock interviews and rebuilt fundamentals, then the call. Nothing on my own résumé has felt quite like someone else's yes.",
  },
  {
    title: "Distributed systems, explained with pizza boxes",
    detail:
      "Replication and failure domains, acted out on a dorm table. The silliest teaching prop I've used, and the one nobody in that room has forgotten.",
  },
  {
    title: "The talk that became a study group",
    detail:
      "A one-off presentation on consensus protocols turned into a recurring reading circle. The best outcome a talk can have is refusing to end.",
  },
];

export const pursuitCards = [
  {
    icon: "camera",
    title: "Photography",
    detail:
      "Chasing light and composition. Framing a street scene and framing an interface are the same discipline at different shutter speeds.",
    chips: ["Street", "Golden hour", "Composition"],
  },
  {
    icon: "dumbbell",
    title: "Court & gym",
    detail:
      "Pickup basketball and steady training. The reps nobody watches are the reason the visible ones work — same as engineering.",
    chips: ["Pickup runs", "Strength", "Consistency"],
  },
  {
    icon: "compass",
    title: "Travel & exploration",
    detail:
      "New cities, new food, deliberately getting lost. Unfamiliar systems — transit maps included — are the best empathy training for building usable ones.",
    chips: ["Road trips", "Street food", "New cities"],
  },
  {
    icon: "chef",
    title: "Cooking experiments",
    detail:
      "Recipes are just algorithms with taste tests. Iterating on a biryani teaches patience that debugging never quite does.",
    chips: ["South Indian", "Iteration", "Taste-driven dev"],
  },
];

export const rhythmWords = [
  "Build",
  "Compete",
  "Mentor",
  "Speak",
  "Ship",
  "Explore",
];

export const seasonTimeline = [
  {
    period: "2021",
    title: "First hackathon, first all-nighter",
    detail:
      "Walked in with a laptop and too much ambition, walked out with a half-working demo and the scoping instinct I still use.",
    tag: "Hackathons",
  },
  {
    period: "2022",
    title: "From participant to organizer",
    detail:
      "Helped run campus build nights and coding circles — learned that logistics and encouragement are engineering multipliers.",
    tag: "Community",
  },
  {
    period: "2023",
    title: "The open source year",
    detail:
      "First merged pull requests, first patient maintainer feedback. Issue triage became a weekly habit instead of an event.",
    tag: "Open source",
  },
  {
    period: "2024",
    title: "New country, new communities",
    detail:
      "Moved to Birmingham for the MS at UAB and rebuilt the circle from zero — ACM meetups, study partners, pickup runs.",
    tag: "UAB",
  },
  {
    period: "2025",
    title: "Mentorship on a schedule",
    detail:
      "Weekly whiteboard sessions and interview prep with peers and juniors. Watching other people's offers land became the highlight.",
    tag: "Mentorship",
  },
  {
    period: "2026",
    title: "The current season",
    detail:
      "A consensus-protocols study group, deeper WebGL experiments, and the next demo day already on the calendar.",
    tag: "Now",
  },
];

export const playbookCards = [
  {
    title: "Ship the honest half",
    detail:
      "When time runs short, cut the clever feature and polish the true one. A working story beats an ambitious fragment.",
  },
  {
    title: "Small diffs, big respect",
    detail:
      "In open source and at work alike: a reviewable change is a form of courtesy, and courtesy gets merged.",
  },
  {
    title: "Teach it to keep it",
    detail:
      "If I can't whiteboard a system for a mentee, I don't understand it yet. Teaching is my retention strategy.",
  },
  {
    title: "The demo is the product",
    detail:
      "Nobody experiences your architecture — they experience three minutes on stage. Build the narrative with the system.",
  },
  {
    title: "Rest is a feature",
    detail:
      "The gym, the court, and the kitchen aren't breaks from the craft. They're why the craft still has energy behind it.",
  },
  {
    title: "Curiosity compounds",
    detail:
      "One paper a week, one experiment a month. None of it looks urgent; all of it shows up in the next design review.",
  },
];

export const voicesQuotes = [
  {
    quote:
      "At hour forty he cut our favorite feature without blinking, and it's the only reason we had a demo at all.",
    name: "Teammate",
    role: "48-hour hackathon build",
  },
  {
    quote:
      "His code reviews taught me more than the course did — he reviews the way you wish documentation was written.",
    name: "Mentee",
    role: "now a software engineer",
  },
  {
    quote:
      "The talk ended and nobody left the room. That's how the reading group started, and he's kept it running since.",
    name: "Study-group regular",
    role: "distributed systems circle",
  },
  {
    quote:
      "He explains replication with pizza boxes and it somehow sticks better than any diagram I've seen.",
    name: "Classmate",
    role: "MS CS cohort, UAB",
  },
];

export const nowBoard = [
  {
    icon: "code",
    label: "Building",
    items: [
      "WebGL and shader experiments for this portfolio",
      "A tiny Raft implementation for the study group",
    ],
  },
  {
    icon: "book",
    label: "Reading",
    items: [
      "Designing Data-Intensive Applications — the annotated re-read",
      "Papers on consensus protocols and cluster schedulers",
    ],
  },
  {
    icon: "activity",
    label: "Training",
    items: [
      "Strength sessions three mornings a week",
      "Sunday pickup basketball, weather permitting",
    ],
  },
];
