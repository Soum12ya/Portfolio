import "./globals.css";

export const metadata = {
  title: "Soumyajit Bhandary — AI Backend & Agentic AI Engineer",
  description:
    "AI engineer building production-grade agentic AI systems, RAG pipelines, and distributed backends. Multi-agent orchestration with LangGraph, LLM evals, human-in-the-loop design. IEEE-published researcher.",
  keywords: ["AI Engineer", "Agentic AI", "LangGraph", "LLM", "RAG", "Backend Engineering", "Multi-Agent Systems", "Portfolio", "Soumyajit Bhandary"],
  openGraph: {
    title: "Soumyajit Bhandary — AI Backend & Agentic AI Engineer",
    description:
      "Production-grade agentic AI systems, RAG pipelines, and distributed backends. Chat with my AI twin to learn more.",
    type: "website",
    siteName: "Soumyajit Bhandary Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soumyajit Bhandary — AI Backend & Agentic AI Engineer",
    description: "Production-grade agentic AI systems, RAG pipelines, and distributed backends.",
  },
};

export const viewport = {
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
