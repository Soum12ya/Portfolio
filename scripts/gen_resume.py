# Generates /app/public/resume.pdf from portfolio content (placeholder: Alex Carter)
from fpdf import FPDF

VIOLET = (124, 82, 236)
DARK = (28, 28, 36)
GRAY = (95, 95, 110)

pdf = FPDF(format="A4")
pdf.set_auto_page_break(auto=True, margin=14)
pdf.add_page()
pdf.set_margins(16, 14, 16)

def heading(text):
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*VIOLET)
    pdf.cell(0, 7, text.upper(), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*VIOLET)
    pdf.set_line_width(0.4)
    pdf.line(16, pdf.get_y(), 194, pdf.get_y())
    pdf.ln(2.5)

def body(text, size=9.5, color=DARK, style=""):
    pdf.set_font("Helvetica", style, size)
    pdf.set_text_color(*color)
    pdf.multi_cell(0, 4.8, text, new_x="LMARGIN", new_y="NEXT")

# Header
pdf.set_font("Helvetica", "B", 22)
pdf.set_text_color(*DARK)
pdf.cell(0, 10, "Alex Carter", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*VIOLET)
pdf.cell(0, 6, "AI Engineer & Researcher", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 8.5)
pdf.set_text_color(*GRAY)
pdf.cell(0, 5, "San Francisco, CA  |  alex.carter@example.com  |  github.com/alexcarter-ai  |  linkedin.com/in/alexcarter-ai", new_x="LMARGIN", new_y="NEXT")
pdf.ln(1)

heading("Summary")
body("AI engineer with 6+ years turning research into revenue - deployed LLM platforms serving 2M+ users, cut inference costs by 70% through model compression, and published at NeurIPS and EMNLP. Full-stack ML: data pipelines, training infrastructure, evaluation, and reliable deployment.")

heading("Experience")
jobs = [
    ("Senior AI Engineer - Nexus AI", "2022 - Present", [
        "Led the LLM platform team (5 engineers) building RAG infrastructure serving 2M+ monthly queries at 94% answer accuracy.",
        "Cut inference spend 70% ($336k/yr) by shipping distilled domain models with automated eval gating.",
        "Designed the company-wide LLM evaluation framework now used by 8 product teams."]),
    ("Machine Learning Engineer - Vantage Robotics", "2020 - 2022", [
        "Shipped real-time edge CV models achieving 99.2% defect recall; drove $1.4M annual savings for the flagship client.",
        "Built the active-learning data engine that cut labeling costs 60% while improving mAP by 11 points."]),
    ("Research Engineer - Stanford AI Lab (SAIL)", "2018 - 2020", [
        "Co-authored 2 publications on efficient deep learning (NeurIPS workshop, EMNLP).",
        "Built distributed training tooling on 64-GPU clusters, reducing experiment turnaround from days to hours."]),
]
for title, period, points in jobs:
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*DARK)
    pdf.cell(140, 5.5, title)
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.set_text_color(*GRAY)
    pdf.cell(0, 5.5, period, align="R", new_x="LMARGIN", new_y="NEXT")
    for pt in points:
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*DARK)
        pdf.set_x(20)
        pdf.multi_cell(0, 4.6, "-  " + pt, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1.5)

heading("Selected Projects")
projects = [
    ("RAGStack - Production RAG Platform", "Hybrid retrieval + reranking, streaming via vLLM, eval-gated deploys. 94% answer accuracy, 800ms p95, 2M+ queries/month."),
    ("VisionEdge - Real-time Defect Detection", "YOLOv8 + TensorRT INT8 on edge GPUs with OTA updates. 99.2% recall, 18ms/frame, $1.4M annual savings."),
    ("DistilLab - LLM Compression Research", "Distilled 70B teacher into 7B student via rejection-sampled synthetic data + LoRA. 70% cost cut, 98.1% quality retained (EMNLP 2024)."),
    ("AtlasOps - ML CI/CD Platform", "Feature store, Ray training, canary deploys, drift monitoring via GitOps. Deploy time 6 weeks to 4 hours; 40+ models in production."),
]
for name, desc in projects:
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 5, name, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*GRAY)
    pdf.multi_cell(0, 4.5, desc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

heading("Publications")
body("Task-Aware Distillation: Retaining 98% of Teacher Quality at 10% of the Cost - EMNLP 2024 (87 citations)", 9)
body("Benchmarking Retrieval Robustness in Production RAG Systems - NeurIPS Workshop on Efficient NLP, 2023 (142 citations)", 9)

heading("Skills")
body("Languages: Python, TypeScript, Go, SQL, C++, Rust", 9)
body("ML/DL: PyTorch, JAX, TensorFlow, scikit-learn, XGBoost, Lightning", 9)
body("LLM Tooling: HuggingFace, LangChain, vLLM, OpenAI API, Pinecone, pgvector, LlamaIndex", 9)
body("MLOps/Infra: Docker, Kubernetes, AWS, GCP, Terraform, MLflow, Ray, Airflow", 9)
body("Data: Spark, Kafka, dbt, PostgreSQL, Redis, BigQuery", 9)

pdf.output("/app/public/resume.pdf")
print("resume.pdf generated")
