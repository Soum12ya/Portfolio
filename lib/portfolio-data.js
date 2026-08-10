// ============================================================
// PORTFOLIO CONTENT CONFIG — Soumyajit Bhandary
// Edit this single file to update ALL site content.
// The AI Portfolio Assistant is grounded in this data too.
// ============================================================

export const portfolio = {
  personal: {
    name: "Soumyajit Bhandary",
    firstName: "Soumyajit",
    logoHandle: "soumyajit.b",
    terminalTitle: "soumyajit@agent-rig ~ zsh",
    title: "AI Backend & Agentic AI Engineer",
    tagline: "I build production-grade agentic AI systems, RAG pipelines, and distributed backends that survive real load.",
    valueProp: "Multi-agent orchestration, human-in-the-loop design, and LLM evals — shipped as working systems, not slide decks.",
    bio: "Information Technology graduate (KIIT, GPA 8.01) with hands-on experience in backend engineering, distributed systems, Generative AI, Agentic AI and LLMs. I've built multi-agent pipelines that cut multi-day AP reconciliation to sub-2-second resolution, LangGraph systems load-tested at 0% failure across 1,285 requests, and booking backends with zero duplicate transactions under 200 concurrent users. Published ML research at IEEE.",
    currentFocus: "Currently exploring agentic AI at production depth — harness engineering, loop engineering, LLM evals and observability (Langfuse/LangSmith), and durable human-in-the-loop workflows that survive process restarts. Seeking GenAI/LLM Application or AI-Backend Engineering roles.",
    location: "Bhubaneswar, India",
    email: "soumyajitbhandary9@gmail.com",
    resumeUrl: "/resume.pdf",
    social: {
      github: "https://github.com/Soum12ya",
      linkedin: "https://www.linkedin.com/in/soumyajit-bhandary-20b348254/",
    },
  },

  terminalLines: [
    "$ whoami",
    "soumyajit.bhandary — AI Backend & Agentic AI Engineer",
    "$ python run_pipeline.py --agents router,planner,policy_gate",
    "Orchestrating 3 agents... checkpoint saved ✓",
    "p95 latency: 1.95s | 0% failure @ 1,285 reqs ✓",
    "$ echo $MISSION",
    "Ship agentic AI that survives production.",
  ],

  skills: [
    {
      category: "Generative AI & LLMs",
      icon: "Sparkles",
      items: ["LLM Agents & Multi-Agent Orchestration", "LangGraph", "OpenAI API", "Prompt Engineering", "RAG / Vector Search", "LLM Evals & Observability", "Human-in-the-Loop Design"],
    },
    {
      category: "Languages",
      icon: "Code2",
      items: ["Python", "SQL", "Java"],
    },
    {
      category: "Backend & Systems",
      icon: "BrainCircuit",
      items: ["FastAPI", "Flask", "Async / Queue-backed Workflows", "Idempotent Transaction Design", "Caching & Cache Invalidation", "Concurrency Control", "REST API Design"],
    },
    {
      category: "Data & Tools",
      icon: "Container",
      items: ["Redis", "Elasticsearch", "RabbitMQ", "Celery", "Docker", "LangSmith", "Langfuse", "Tavily Search", "BeautifulSoup"],
    },
    {
      category: "Databases (Relational & Vector)",
      icon: "Database",
      items: ["PostgreSQL", "MySQL", "pgvector", "FAISS", "Chroma DB"],
    },
  ],

  projects: [
    {
      id: "reconcileiq",
      featured: true,
      name: "ReconcileIQ",
      subtitle: "Agentic AI for Automated AP Invoice Reconciliation",
      problem: "AP teams run a manual 3-way-match, vendor-chase, and re-key workflow on every discrepant invoice — a multi-day process for cases that are mostly resolvable instantly.",
      approach: "Multi-agent pipeline: a router classifies each case, a planner resolves trivial ones instantly and reasons through ambiguous ones with real PO/contract data, a policy gate keeps every external action auditable, an async vendor-communication agent handles back-and-forth without blocking, and a mandatory human approval step controls every dollar posted. Built with durable queue-backed workflows (Redis + PostgreSQL), idempotency keys, and Langfuse-based evals with golden-dataset scoring.",
      stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Redis", "OpenAI API", "Langfuse", "Docker"],
      metrics: [
        { value: "<2s", label: "resolution vs multi-day manual process" },
        { value: "1.95s", label: "p95 across the LLM-bound path" },
        { value: "0", label: "data loss under process failure & restart" },
      ],
      links: { github: "https://github.com/Soum12ya" },
      image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHw0fHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc4NjM0OTE1Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "autonexus",
      name: "AutoNexus AI",
      subtitle: "Multi-Agent Automotive Fleet Analytics Engine",
      problem: "Fleet analytics questions ('risk report on brake pads') need multiple specialist analyses — but free-form LLM output can't be trusted for safety-critical findings.",
      approach: "LangGraph StateGraph orchestrates Risk, Performance, and Cost agents in parallel with conditional fan-out/fan-in and Pydantic-enforced structured outputs. A deterministic validator enforces citations and confidence floors; critical findings pause the workflow via a real interrupt()/Command(resume) cycle persisted in Postgres — surviving full restarts. SQL-sandboxed data access, checkpoint time-travel audit trail, and a React instrument-panel console.",
      stack: ["LangGraph", "FastAPI", "PostgreSQL", "React", "Pydantic", "Locust"],
      metrics: [
        { value: "0%", label: "failure rate at 1,285 load-test requests" },
        { value: "1.7s", label: "p95 latency (5.4s p99)" },
        { value: "30", label: "automated tests (pytest)" },
      ],
      links: { github: "https://github.com/Soum12ya" },
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxkYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3ODYzNDkxNTZ8MA&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "railbook",
      name: "RailBook",
      subtitle: "Production-Grade Train Booking Platform",
      problem: "Most student projects stop at CRUD. Real booking systems fail under load: double-booked seats, stale caches, blocked HTTP responses, duplicate bookings on retry.",
      approach: "IRCTC-style platform implementing the patterns that matter: SELECT FOR UPDATE pessimistic locking for seat races, surgical Redis cache invalidation keyed by route+date+class, Celery + RabbitMQ async email dispatch, idempotency keys against network retries, Elasticsearch full-text search over intermediate stops, JWT revocation via Redis blacklisting, and waitlist promotion cascades — stateless API layer built for horizontal scaling.",
      stack: ["FastAPI", "PostgreSQL", "Redis", "Elasticsearch", "RabbitMQ", "Celery", "Next.js"],
      metrics: [
        { value: "0", label: "duplicate PNRs at 200 concurrent bookings" },
        { value: "50ms", label: "booking response (emails async)" },
        { value: "6+", label: "production patterns implemented" },
      ],
      links: { github: "https://github.com/Soum12ya" },
      image: "https://images.unsplash.com/photo-1516900557549-41557d405adf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHx0cmFpbiUyMG5pZ2h0fGVufDB8fHx8MTc4NjM1MTU3OXww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "industrial-safety",
      name: "Industrial Safety AI",
      subtitle: "Real-time Accident Prevention & Risk Analytics Platform",
      problem: "Traditional industrial safety is reactive: CCTV is only reviewed after incidents, machine telemetry lives in silos, and human monitors miss PPE violations and geofence breaches.",
      approach: "Hybrid edge-to-core architecture fusing computer-vision edge intelligence with multi-variable telemetry anomaly detection to compute continuous asset and zone risk profiles. Covers four domains: human safety (PPE verification, fall detection, unauthorized-zone entry), equipment health (motor/pump telemetry), process safety (pressure/temperature/leak prediction), and environmental safety (fire/smoke vision + gas PPM).",
      stack: ["Python", "Computer Vision", "Edge Inference", "Anomaly Detection", "Real-time Streaming"],
      metrics: [
        { value: "4", label: "safety domains monitored concurrently" },
        { value: "Real-time", label: "video + telemetry fusion" },
        { value: "Proactive", label: "risk scoring vs reactive alarms" },
      ],
      links: { github: "https://github.com/Soum12ya" },
      image: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxpbmR1c3RyaWFsJTIwZmFjdG9yeXxlbnwwfHx8fDE3ODYzNTE1Nzl8MA&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "search-engine",
      name: "Local Search & Ranking Engine",
      subtitle: "Custom IR Engine — TF-IDF, Inverted Index & Trie from Scratch",
      problem: "Retrieving and ranking relevant information efficiently is a core CS problem that CRUD apps never touch — this project solves it from first principles.",
      approach: "Custom-built search engine in Python with a hand-rolled Inverted Index and Trie (prefix tree) for autocomplete, TF-IDF relevance scoring, and a scalable pipeline with separated Indexing, Searching, and Ranking modules — served through a Flask + AJAX full-stack interface.",
      stack: ["Python", "Flask", "AJAX", "TF-IDF", "Inverted Index", "Trie"],
      metrics: [
        { value: "3", label: "decoupled modules: index, search, rank" },
        { value: "O(L)", label: "prefix lookups via custom Trie" },
        { value: "TF-IDF", label: "relevance scoring from scratch" },
      ],
      links: { github: "https://github.com/Soum12ya" },
      image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc4NjM0OTE1Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "youtube-chatbot",
      name: "YouTube RAG Chatbot",
      subtitle: "Chat with Any YouTube Video — Gemini + RAG + Streamlit",
      problem: "Long videos lock knowledge behind hours of watch time — there was no natural way to ask a video a question and get a grounded answer.",
      approach: "Conversational AI that extracts and processes YouTube transcripts, embeds them with HuggingFace Transformers, and answers questions via Retrieval-Augmented Generation with Google Gemini — retrieval grounding keeps answers precise instead of hallucinated. Clean Streamlit UI for a live chat experience.",
      stack: ["Google Gemini", "RAG", "HuggingFace", "Python", "Streamlit"],
      metrics: [
        { value: "RAG", label: "retrieval-grounded, not free-form" },
        { value: "Any video", label: "transcript-based understanding" },
        { value: "Live", label: "conversational Streamlit UI" },
      ],
      links: { github: "https://github.com/Soum12ya" },
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHw0fHx2aWRlbyUyMHN0cmVhbWluZ3xlbnwwfHx8fDE3ODYzNTE1ODB8MA&ixlib=rb-4.1.0&q=85",
    },
  ],

  publications: [
    {
      title: "Enhancing Early Autism Spectrum Disorder Detection Using Machine Learning: A Data-Driven Approach for Toddlers and Adults",
      venue: "IEEE",
      year: 2025,
      abstract: "A data-driven machine learning approach for early detection of Autism Spectrum Disorder across toddler and adult populations, improving screening accessibility and early-intervention outcomes.",
      link: "https://ieeexplore.ieee.org/document/11189469",
      citations: null,
    },
  ],

  experience: [
    {
      role: "Independent AI Engineering & Research",
      company: "Self-directed",
      period: "2023 — Present",
      points: [
        "Designed and shipped 6 end-to-end systems spanning agentic AI, RAG, distributed backends, and computer vision — each load-tested, evaluated, and documented like production software.",
        "Built LLM evaluation and observability workflows (Langfuse tracing, golden-dataset scoring) to detect and fix prompt regressions systematically.",
        "Published peer-reviewed ML research at IEEE on early Autism Spectrum Disorder detection.",
      ],
    },
    {
      role: "B.Tech, Information Technology",
      company: "Kalinga Institute of Industrial Technology (KIIT)",
      period: "2022 — 2026",
      points: [
        "GPA 8.01 — coursework in Operating Systems, Data Structures, OOP, Analysis of Algorithms, AI, Machine Learning, Networking, and Databases.",
        "Applied coursework directly into working systems: from custom search-engine data structures to distributed booking backends.",
      ],
    },
  ],

  blog: [],

  chatSuggestions: [
    "What has he built with agentic AI?",
    "Tell me about ReconcileIQ",
    "Does he have production backend experience?",
    "Summarize his research",
  ],
};

export default portfolio;
