// ─────────────────────────────────────────────────────────────
//  ALL YOUR PORTFOLIO CONTENT LIVES HERE.
//  Change text in this one file and the whole site updates.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Antrika Kashyap",
  firstName: "Antrika",
  initials: "AK",
  roles: [
    "Backend Engineer",
    "AI / GenAI Builder",
    "Full-Stack Developer",
    "Competitive Programmer",
  ],
  tagline:
    "I build backends that stay correct under real load — and AI systems that know when not to trust themselves.",
  location: "India · Open to relocate",
  email: "antrikakashyap2@gmail.com",
  resume: "/Antrika_Kashyap_Resume.pdf",
  // Put your photo in /public (e.g. /public/me.jpg) and set photo: "/me.jpg".
  // Leave it as null to show the animated initials avatar instead.
  photo: null as string | null,
  socials: {
    github: "https://github.com/antrika02",
    linkedin: "https://www.linkedin.com/in/antrika-kashyap-070502250/",
    leetcode: "https://leetcode.com/u/antrikakashyap2/",
    codechef: "https://www.codechef.com/users/antrika02",
    codeforces: "https://codeforces.com/profile/antrika02",
    x: "https://x.com/Antrika9",
  },
  handles: {
    leetcode: "antrikakashyap2",
    codechef: "antrika02",
    codeforces: "antrika02",
  },
  about: [
    "I'm a Computer Science graduate from VIT Bhopal (2026) who loves the part of engineering most people skip: making things correct, tested, and built to last.",
    "On the backend side I've built a Spring Boot service where 100 simultaneous orders against 100 units of stock oversold exactly zero, and a FastAPI finance backend with 128 tests at 91% coverage.",
    "On the AI side I'm fascinated by one question — when should you NOT call a language model? My projects use confidence scores so AI output gets checked before it reaches anyone.",
  ],
  quickFacts: [
    { label: "Problems solved", value: "1,400+" },
    { label: "CGPA", value: "8.4 / 10" },
    { label: "Deploy time cut", value: "45 → 5 min" },
    { label: "Test coverage", value: "91%" },
  ],
};

export type SkillGroup = { title: string; icon: string; items: string[] };

export const skills: SkillGroup[] = [
  { title: "Languages", icon: "code", items: ["Java", "Python", "C++", "SQL", "JavaScript", "TypeScript"] },
  {
    title: "Backend",
    icon: "server",
    items: ["Spring Boot", "Spring Security", "Spring Data JPA", "FastAPI", "Flask", "Node.js", "REST API Design", "JWT / OAuth2", "Webhooks", "Pydantic"],
  },
  {
    title: "AI & GenAI",
    icon: "brain",
    items: ["RAG", "LangChain", "LangGraph", "AI Agents / Tool-Calling", "Prompt Engineering", "Confidence Calibration", "Claude / Gemini / OpenAI APIs", "Hugging Face", "Langfuse"],
  },
  {
    title: "Machine Learning",
    icon: "sparkles",
    items: ["Scikit-learn", "PyTorch", "TensorFlow", "NLP", "TF-IDF", "EasyOCR", "OpenAI Whisper", "Model Evaluation"],
  },
  {
    title: "Databases",
    icon: "database",
    items: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Qdrant", "ChromaDB", "FAISS", "pgvector", "Flyway", "Alembic"],
  },
  { title: "Frontend", icon: "layout", items: ["React", "TypeScript", "HTML / CSS", "Streamlit"] },
  {
    title: "DevOps & Cloud",
    icon: "cloud",
    items: ["Docker", "Docker Compose", "GitHub Actions (CI/CD)", "AWS EC2", "GCP (basic)", "Render", "Vercel", "Linux", "Git"],
  },
  { title: "Testing", icon: "check", items: ["JUnit 5", "Testcontainers", "JaCoCo", "pytest", "Code Review", "Agile / Scrum"] },
];

export const experience = [
  {
    role: "Software Development Intern",
    company: "Bluestock Fintech",
    period: "May 2025 – Jul 2025",
    place: "Remote",
    points: [
      "Built and shipped backend services for a live fintech analytics platform used by 2,000+ daily active users, working in agile sprints with product and QA teams.",
      "Profiled a recurring production slowdown and redesigned the database indexing and query strategy — query latency down 38%, peak throughput up 30%.",
      "Refactored 10+ REST API endpoints for consistent contracts, predictable error handling and fault tolerance.",
      "Resolved 15+ production incidents independently, from root cause to verified fix.",
      "Automated the CI/CD release pipeline with GitHub Actions and Docker, cutting deployment time from 45 minutes to 5.",
    ],
    tags: ["Python", "PostgreSQL", "REST APIs", "GitHub Actions", "Docker"],
  },
];

export type Project = {
  title: string;
  category: "AI" | "Backend" | "Full-Stack";
  blurb: string;
  highlights: string[];
  stack: string[];
  github: string;
  live?: string;
  badge?: string;
  metric?: { value: string; label: string };
};

export const projects: Project[] = [
  {
    title: "SentinelRoute",
    category: "AI",
    badge: "HackerRank Orchestrate Hackathon",
    blurb:
      "An explainable, multimodal notification router for WhatsApp — text, images (OCR) and voice notes (Whisper) are classified into Notify, Digest or Mute.",
    highlights: [
      "TF-IDF + Scikit-learn intent classifier with a tuned decision threshold",
      "Deterministic, auditable decision layer — the LLM is only a gated reviewer for low-confidence cases",
      "Trust scoring and security gates for scams and unsafe messages",
    ],
    stack: ["Python", "Scikit-learn", "EasyOCR", "Whisper", "LLM"],
    github: "https://github.com/antrika02/hackerrank-orchestrate-ai-router",
    metric: { value: "3", label: "input modalities" },
  },
  {
    title: "AI Documentation Assistant",
    category: "AI",
    blurb:
      "A conversational RAG assistant that turns any documentation site into a source-cited Q&A system.",
    highlights: [
      "Firecrawl → chunking → FastEmbed → Qdrant → Gemini 2.5 Flash pipeline",
      "Two-agent design (retriever + answer generator) with per-answer confidence scores",
      "Sliding-window memory for multi-turn follow-ups; Dockerised and deployed on Render",
    ],
    stack: ["FastAPI", "React + TS", "Qdrant", "FastEmbed", "Firecrawl", "Gemini"],
    github: "https://github.com/antrika02/AI-Documentation-Assistant",
    metric: { value: "100%", label: "answers source-cited" },
  },
  {
    title: "FinPilot AI",
    category: "AI",
    blurb:
      "A personal-finance backend with a LangGraph agent that answers natural-language money questions by calling backend tools and explaining its reasoning.",
    highlights: [
      "30+ FastAPI endpoints with JWT auth and ownership checks on every record, deployed on AWS EC2",
      "128 automated tests at 91% coverage, run in CI on every push",
      "Langfuse tracing for tool calls, token usage and latency",
    ],
    stack: ["FastAPI", "PostgreSQL", "LangGraph", "Gemini", "AWS EC2", "Alembic"],
    github: "https://github.com/antrika02",
    metric: { value: "91%", label: "test coverage" },
  },
  {
    title: "Smart Order Processing Platform",
    category: "Backend",
    blurb:
      "A concurrency-safe e-commerce order backend in Java 21 + Spring Boot that simply cannot oversell stock.",
    highlights: [
      "Row-level locking + idempotency keys: 100 simultaneous orders vs 100 units → 0 oversold",
      "Fixed an N+1 query with fetch joins: ~45 queries → 2, 180ms → 45ms",
      "JWT + role-based access, Flyway migrations, Redis caching, 30 tests at 85% coverage",
    ],
    stack: ["Java 21", "Spring Boot", "MySQL", "Redis", "Docker", "JUnit 5"],
    github: "https://github.com/antrika02/Backend_Service_Platform",
    metric: { value: "0", label: "oversold under load" },
  },
  {
    title: "AI Guest Messaging Automation",
    category: "Full-Stack",
    badge: "Deployed",
    blurb:
      "Classifies guest messages from Airbnb, Booking.com and WhatsApp and drafts an AI reply with a confidence score.",
    highlights: [
      "Confidence routing: 90%+ auto-sent, 60–89% to a human reviewer, below 60% escalated",
      "Every decision logged to PostgreSQL for a full audit trail",
      "Backend on Render, React frontend on Vercel",
    ],
    stack: ["FastAPI", "React", "PostgreSQL", "Claude API", "Render", "Vercel"],
    github: "https://github.com/antrika02",
    metric: { value: "3", label: "confidence tiers" },
  },
  {
    title: "AI Resume Screening Assistant",
    category: "AI",
    blurb:
      "Ranks candidates against a job description using NLP, TF-IDF, semantic similarity and explainable scoring.",
    highlights: [
      "Extracts skills and finds missing requirements for each candidate",
      "Combines lexical and semantic similarity into one explainable score",
      "Streamlit UI for recruiters to upload a JD and many resumes",
    ],
    stack: ["Python", "spaCy", "Scikit-learn", "Streamlit"],
    github: "https://github.com/antrika02/AI_Resume_Screening_System",
  },
  {
    title: "CartFull",
    category: "Full-Stack",
    blurb:
      "A distributed, service-oriented e-commerce platform where frontend, services and database deploy independently.",
    highlights: [
      "Stateless JWT authentication across services",
      "Containerised with Docker for reproducible deployments",
      "React frontend on a Node.js + MongoDB service layer",
    ],
    stack: ["Node.js", "React", "MongoDB", "Docker", "JWT"],
    github: "https://github.com/antrika02/Cart_Full",
  },
];

export const education = [
  {
    school: "Vellore Institute of Technology, Bhopal",
    degree: "B.Tech, Computer Science & Engineering",
    period: "2022 – 2026",
    detail: "CGPA 8.4 / 10",
  },
];

export const achievements = [
  { title: "LeetCode Top 10%", detail: "Contest rating 1758 · best global rank 2,710 in Weekly Contest 511" },
  { title: "CodeChef 4★", detail: "Max rating 1808 · 84% on the CodeChef Java Skill Assessment" },
  { title: "Top 10 · GfG Institute Leaderboard", detail: "GeeksforGeeks, VIT Bhopal" },
  { title: "HackerRank Orchestrate AI Hackathon", detail: "Built and submitted SentinelRoute end to end" },
  { title: "Core Member, English Literary Association", detail: "Organised and volunteered at campus events, VIT Bhopal" },
];

export const certifications = [
  "Web Development (HTML, CSS, JavaScript) — Coursera",
  "Python Fundamentals — VITyarthi",
  "Virtual Internship — Forage",
];

// Fallback numbers shown if the live APIs can't be reached.
export const fallbackStats = {
  leetcode: { solved: 1481, easy: 392, medium: 940, hard: 149, rating: 1758, top: 10.33, contests: 12, activeDays: 353, maxStreak: 153 },
  codechef: { rating: 1808, stars: 4, maxRating: 1808, globalRank: 3935 },
  codeforces: { rating: 1277, maxRating: 1300, rank: "pupil" },
};
