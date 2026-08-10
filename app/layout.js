import "./globals.css";

export const metadata = {
  title: "Alex Carter — AI Engineer & Researcher",
  description:
    "AI engineer building production-grade LLM systems. 6+ years shipping ML from research to 10M+ requests/day — RAG platforms, model compression, MLOps.",
  keywords: ["AI Engineer", "Machine Learning", "LLM", "RAG", "MLOps", "Deep Learning", "Portfolio"],
  openGraph: {
    title: "Alex Carter — AI Engineer & Researcher",
    description:
      "Production-grade LLM systems, model compression research, and end-to-end MLOps. Chat with my AI twin to learn more.",
    type: "website",
    siteName: "Alex Carter Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Carter — AI Engineer & Researcher",
    description: "Production-grade LLM systems and efficient deep learning research.",
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
