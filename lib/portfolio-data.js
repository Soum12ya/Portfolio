// ============================================================
// PORTFOLIO CONTENT CONFIG
// Edit this single file to update ALL site content.
// The AI Portfolio Assistant is grounded in this data too.
// ============================================================

export const portfolio = {
  personal: {
    name: "Alex Carter",
    firstName: "Alex",
    title: "AI Engineer & Researcher",
    tagline: "I build production-grade LLM systems and publish research on efficient deep learning.",
    valueProp: "Shipping ML from research notebook to 10M+ requests/day in production.",
    bio: "AI engineer with 6+ years turning research into revenue — I've deployed LLM platforms serving 2M+ users, cut inference costs by 70% through model compression, and published at NeurIPS and EMNLP. I care about the full stack: data pipelines, training infrastructure, evaluation, and reliable deployment.",
    currentFocus: "Currently exploring agentic LLM systems, RAG evaluation frameworks, and sub-billion-parameter models that punch above their weight on domain tasks.",
    location: "San Francisco, CA",
    email: "alex.carter@example.com",
    resumeUrl: "/resume.pdf",
    social: {
      github: "https://github.com/alexcarter-ai",
      linkedin: "https://linkedin.com/in/alexcarter-ai",
      twitter: "https://x.com/alexcarter_ai",
      scholar: "https://scholar.google.com/citations?user=alexcarter",
    },
  },

  terminalLines: [
    "$ whoami",
    "alex.carter — AI Engineer & Researcher",
    "$ python inference.py --model llm-prod-v3",
    "Loading weights... done (1.2s)",
    "Serving at 42ms p95 latency ✓",
    "$ echo $MISSION",
    "Ship ML that actually works in production.",
  ],

  skills: [
    {
      category: "Languages",
      icon: "Code2",
      items: ["Python", "TypeScript", "Go", "SQL", "C++", "Rust"],
    },
    {
      category: "ML / DL Frameworks",
      icon: "BrainCircuit",
      items: ["PyTorch", "JAX", "TensorFlow", "scikit-learn", "XGBoost", "Lightning"],
    },
    {
      category: "LLM Tooling",
      icon: "Sparkles",
      items: ["HuggingFace", "LangChain", "vLLM", "OpenAI API", "Pinecone", "pgvector", "LlamaIndex"],
    },
    {
      category: "MLOps & Infra",
      icon: "Container",
      items: ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "MLflow", "Ray", "Airflow"],
    },
    {
      category: "Data Tools",
      icon: "Database",
      items: ["Spark", "Kafka", "dbt", "PostgreSQL", "Redis", "BigQuery"],
    },
  ],

  projects: [
    {
      id: "ragstack",
      featured: true,
      name: "RAGStack",
      subtitle: "Production RAG Platform for Enterprise Search",
      problem: "Enterprise teams were drowning in internal docs — employees spent ~5 hrs/week searching wikis, Slack, and PDFs for answers that already existed.",
      approach: "Built an end-to-end RAG platform: hybrid retrieval (BM25 + dense embeddings with reranking), chunk-level citations, streaming responses via vLLM, and an eval harness with 500+ golden Q&A pairs gating every deploy.",
      stack: ["Python", "vLLM", "pgvector", "FastAPI", "Next.js", "Kubernetes"],
      metrics: [
        { value: "94%", label: "answer accuracy on eval set" },
        { value: "800ms", label: "p95 end-to-end latency" },
        { value: "2M+", label: "queries served / month" },
      ],
      links: { github: "https://github.com/alexcarter-ai/ragstack", demo: "https://ragstack-demo.example.com" },
      image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHw0fHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc4NjM0OTE1Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "visionedge",
      name: "VisionEdge",
      subtitle: "Real-time Defect Detection on the Factory Floor",
      problem: "A manufacturing client relied on manual visual inspection — 3% defect escape rate and a growing recall risk.",
      approach: "Trained a YOLOv8-based detector with active-learning data loops, quantized to INT8 with TensorRT, and deployed on edge GPUs with an OTA model-update pipeline.",
      stack: ["PyTorch", "YOLOv8", "TensorRT", "ONNX", "NVIDIA Jetson", "Grafana"],
      metrics: [
        { value: "99.2%", label: "defect recall" },
        { value: "18ms", label: "inference / frame on edge" },
        { value: "$1.4M", label: "annual savings" },
      ],
      links: { github: "https://github.com/alexcarter-ai/visionedge" },
      image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc4NjM0OTE1Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "distillab",
      name: "DistilLab",
      subtitle: "LLM Compression Research → 70% Cheaper Inference",
      problem: "Serving a 70B model for a narrow domain task was burning $40k/month in GPU costs for capability we didn't need.",
      approach: "Distilled task-specific behavior into a 7B student via synthetic data generation + LoRA fine-tuning, with a rejection-sampling filter to keep only high-quality teacher outputs. Published the methodology at EMNLP.",
      stack: ["PyTorch", "HuggingFace", "LoRA/PEFT", "DeepSpeed", "Weights & Biases"],
      metrics: [
        { value: "70%", label: "inference cost reduction" },
        { value: "98.1%", label: "of teacher quality retained" },
        { value: "10x", label: "throughput increase" },
      ],
      links: { github: "https://github.com/alexcarter-ai/distillab", paper: "https://arxiv.org/abs/2401.00000" },
      image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc4NjM0OTE1Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "mlops-pipeline",
      name: "AtlasOps",
      subtitle: "ML CI/CD Platform — Idea to Production in Hours",
      problem: "Data scientists at my org took 6+ weeks to get a model from notebook to production; deployments were manual and unreproducible.",
      approach: "Designed an internal ML platform: feature store, containerized training on Ray, automated eval gates, canary deployments, and drift monitoring — all wired through GitOps.",
      stack: ["Kubernetes", "Ray", "MLflow", "Terraform", "ArgoCD", "Prometheus"],
      metrics: [
        { value: "6 wks → 4 hrs", label: "deploy time" },
        { value: "40+", label: "models in production" },
        { value: "99.95%", label: "serving uptime" },
      ],
      links: { github: "https://github.com/alexcarter-ai/atlasops" },
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjb2RlJTIwc2NyZWVufGVufDB8fHx8MTc4NjM0OTE1Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "insightboard",
      name: "InsightBoard",
      subtitle: "Streaming Analytics with ML-powered Anomaly Detection",
      problem: "Ops teams found incidents hours after customers did — dashboards were batch-updated and alert rules were static.",
      approach: "Built a Kafka → Flink streaming pipeline with an online anomaly detector (seasonal decomposition + isolation forests) and a real-time React dashboard.",
      stack: ["Kafka", "Flink", "Python", "React", "ClickHouse", "Docker"],
      metrics: [
        { value: "9 min", label: "mean time to detect (was 3 hrs)" },
        { value: "1.2M", label: "events / sec processed" },
      ],
      links: { github: "https://github.com/alexcarter-ai/insightboard", demo: "https://insightboard.example.com" },
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxkYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3ODYzNDkxNTZ8MA&ixlib=rb-4.1.0&q=85",
    },
  ],

  publications: [
    {
      title: "Task-Aware Distillation: Retaining 98% of Teacher Quality at 10% of the Cost",
      venue: "EMNLP",
      year: 2024,
      abstract: "We propose a rejection-sampled synthetic data pipeline for distilling narrow-domain capability from 70B teachers into 7B students, retaining 98.1% task quality.",
      link: "https://arxiv.org/abs/2401.00000",
      citations: 87,
    },
    {
      title: "Benchmarking Retrieval Robustness in Production RAG Systems",
      venue: "NeurIPS Workshop on Efficient NLP",
      year: 2023,
      abstract: "A study of failure modes in hybrid retrieval pipelines under distribution shift, with a public benchmark of 12k adversarial queries.",
      link: "https://arxiv.org/abs/2310.00000",
      citations: 142,
    },
  ],

  experience: [
    {
      role: "Senior AI Engineer",
      company: "Nexus AI",
      period: "2022 — Present",
      points: [
        "Led the LLM platform team (5 engineers) building RAG infrastructure serving 2M+ monthly queries at 94% answer accuracy.",
        "Cut inference spend 70% ($336k/yr) by shipping distilled domain models with automated eval gating.",
        "Designed the company-wide LLM evaluation framework now used by 8 product teams.",
      ],
    },
    {
      role: "Machine Learning Engineer",
      company: "Vantage Robotics",
      period: "2020 — 2022",
      points: [
        "Shipped real-time edge CV models achieving 99.2% defect recall; drove $1.4M annual savings for the flagship client.",
        "Built the active-learning data engine that cut labeling costs 60% while improving mAP by 11 points.",
      ],
    },
    {
      role: "Research Engineer",
      company: "Stanford AI Lab (SAIL)",
      period: "2018 — 2020",
      points: [
        "Co-authored 2 publications on efficient deep learning (NeurIPS workshop, EMNLP).",
        "Built distributed training tooling on 64-GPU clusters, reducing experiment turnaround from days to hours.",
      ],
    },
  ],

  blog: [
    {
      title: "Why Your RAG Pipeline Fails Silently (and How to Catch It)",
      description: "A practical guide to evaluation harnesses, golden datasets, and retrieval regression testing for production RAG.",
      date: "May 2025",
      readTime: "9 min",
      link: "#",
      tag: "LLM Engineering",
    },
    {
      title: "Distillation Is All You Need (for Narrow Domains)",
      description: "When a 7B model beats a 70B model on cost-adjusted quality — and how to get there with synthetic data.",
      date: "Feb 2025",
      readTime: "12 min",
      link: "#",
      tag: "Research",
    },
    {
      title: "The MLOps Stack I'd Build in 2025 (From Scratch)",
      description: "Feature stores, eval gates, canary deploys — an opinionated tour of shipping ML reliably without a 20-person platform team.",
      date: "Nov 2024",
      readTime: "14 min",
      link: "#",
      tag: "MLOps",
    },
  ],

  chatSuggestions: [
    "What's his strongest project?",
    "What experience does he have with LLMs?",
    "Summarize his research",
    "Does he have production ML experience?",
  ],
};

export default portfolio;
