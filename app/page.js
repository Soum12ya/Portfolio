"use client";

// ============================================================
// PORTFOLIO — single-page app
// All content lives in /lib/portfolio-data.js (edit there).
// The AI Portfolio Assistant widget (bottom-right) streams
// grounded answers from /api/chat (server-side OpenAI call).
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Github, Linkedin, Twitter, GraduationCap, Mail, Download,
  ArrowRight, ExternalLink, FileText, Code2, BrainCircuit,
  Sparkles, Container, Database, X, Send, Bot, MapPin,
  BookOpen, Briefcase, MessageCircle, Newspaper,
} from "lucide-react";
import portfolio from "@/lib/portfolio-data";

const ICONS = { Code2, BrainCircuit, Sparkles, Container, Database };

// ---------- Scroll reveal wrapper ----------
const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ---------- Section heading ----------
const SectionHeading = ({ kicker, title }) => (
  <Reveal className="mb-10 md:mb-14">
    <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-3">
      {kicker}
    </p>
    <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight">
      {title}
    </h2>
  </Reveal>
);

// ---------- Cursor-follow glow ----------
const CursorGlow = () => {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0 hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        transition: "transform 0.15s ease-out",
      }}
    />
  );
};

// ---------- Terminal typing animation (hero) ----------
const Terminal = () => {
  const lines = portfolio.terminalLines;
  const [rendered, setRendered] = useState([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let timer;
    const tick = () => {
      if (lineIdx >= lines.length) return;
      const line = lines[lineIdx];
      if (charIdx <= line.length) {
        setCurrent(line.slice(0, charIdx));
        charIdx++;
        timer = setTimeout(tick, line.startsWith("$") ? 40 : 16);
      } else {
        setRendered((prev) => [...prev, line]);
        setCurrent("");
        lineIdx++;
        charIdx = 0;
        timer = setTimeout(tick, 350);
      }
    };
    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colorFor = (l) =>
    l.startsWith("$") ? "text-cyan-300" : l.includes("✓") ? "text-emerald-400" : "text-zinc-300";

  return (
    <div className="glass rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-amber-400/70" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">{portfolio.personal.terminalTitle}</span>
      </div>
      <div className="p-5 font-mono text-sm leading-7 min-h-[220px]">
        {rendered.map((l, i) => (
          <div key={i} className={colorFor(l)}>{l}</div>
        ))}
        {current !== "" || rendered.length < lines.length ? (
          <div className={`${colorFor(current)} caret`}>{current}</div>
        ) : (
          <div className="caret text-zinc-500" />
        )}
      </div>
    </div>
  );
};

// ---------- 3D tilt card ----------
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`);
  };
  const onLeave = () => setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transition: "transform 0.25s ease-out" }}
      className={className}
    >
      {children}
    </div>
  );
};

// ---------- Project card ----------
const ProjectCard = ({ project, large = false }) => (
  <TiltCard className="h-full">
    <div className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col group" data-testid={`project-card-${project.id}`}>
      <div className={`relative overflow-hidden ${large ? "h-56 md:h-64" : "h-44"}`}>
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="font-heading text-xl md:text-2xl font-bold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.subtitle}</p>
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-primary/80 mb-1">Problem</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{project.problem}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-cyan-400/80 mb-1">Approach</p>
          <p className="text-sm text-zinc-400 leading-relaxed">{project.approach}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(project.stack || []).map((t) => (
            <Badge key={t} variant="secondary" className="font-mono text-[10px] bg-white/5 border border-white/10 text-zinc-300 hover:bg-primary/20">
              {t}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-auto pt-2">
          {(project.metrics || []).map((m, i) => (
            <div key={i}>
              <p className="font-heading text-lg md:text-xl font-bold text-amber-400">{m.value}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-primary transition-colors">
              <Github className="w-3.5 h-3.5" /> Code
            </a>
          )}
          {project.links?.demo && (
            <a href={project.links.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-primary transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Live demo
            </a>
          )}
          {project.links?.paper && (
            <a href={project.links.paper} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-primary transition-colors">
              <FileText className="w-3.5 h-3.5" /> Paper
            </a>
          )}
        </div>
      </div>
    </div>
  </TiltCard>
);

// ============================================================
// AI PORTFOLIO ASSISTANT — chat widget
// Streams responses from /api/chat. Grounded ONLY in
// portfolio data injected server-side; key never ships to client.
// ============================================================
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    // stable session id per visitor for multi-turn context persistence
    let sid = null;
    try {
      sid = localStorage.getItem("portfolio_chat_session");
    } catch (e) {}
    if (!sid) {
      sid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      try { localStorage.setItem("portfolio_chat_session", sid); } catch (e) {}
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = useCallback(
    async (text) => {
      const content = (text || "").trim();
      if (!content || loading) return;
      const next = [...messages, { role: "user", content }];
      setMessages([...next, { role: "assistant", content: "" }]);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, messages: next }),
        });
        if (!res.ok || !res.body) throw new Error("chat failed");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...next, { role: "assistant", content: acc }]);
        }
        acc += decoder.decode();
        setMessages([...next, { role: "assistant", content: acc }]);
      } catch (e) {
        setMessages([
          ...next,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, sessionId]
  );

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 1.2 }}
              className="glass rounded-full px-4 py-1.5 text-xs text-zinc-300 font-mono"
            >
              Ask my AI twin ↓
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          data-testid="chat-launcher"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/40"
          aria-label="Open AI portfolio assistant"
        >
          {open ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-50 w-[calc(100vw-2rem)] max-w-md glass rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 flex flex-col"
            style={{ height: "min(560px, calc(100vh - 8rem))", background: "rgba(12,12,20,0.85)" }}
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">
                  {portfolio.personal.firstName}&apos;s AI Twin
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Grounded in real portfolio data · GPT-4o-mini
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="glass rounded-xl rounded-tl-sm px-4 py-3 text-sm text-zinc-300 max-w-[90%]">
                    Hi! I&apos;m {portfolio.personal.firstName}&apos;s AI assistant — ask me anything
                    about his projects, skills, research, or experience.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.chatSuggestions.map((q) => (
                      <button
                        key={q}
                        data-testid="chat-suggestion"
                        onClick={() => send(q)}
                        className="text-xs glass rounded-full px-3.5 py-2 text-zinc-300 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "bg-primary/90 text-primary-foreground rounded-xl rounded-br-sm px-4 py-2.5 text-sm max-w-[85%] whitespace-pre-wrap"
                        : "glass rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-zinc-300 max-w-[90%] whitespace-pre-wrap leading-relaxed"
                    }
                  >
                    {m.content || (loading && i === messages.length - 1 ? (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                      </span>
                    ) : "")}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <Input
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, research..."
                disabled={loading}
                className="bg-white/5 border-white/10 text-sm focus-visible:ring-primary"
              />
              <Button
                data-testid="chat-send"
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-primary/85 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ---------- Contact form (messages land in the private admin inbox) ----------
const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };
  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8 text-left space-y-4" data-testid="contact-form">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          data-testid="contact-name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className="bg-white/5 border-white/10 focus-visible:ring-primary"
        />
        <Input
          data-testid="contact-email"
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@company.com"
          className="bg-white/5 border-white/10 focus-visible:ring-primary"
        />
      </div>
      <textarea
        data-testid="contact-message"
        required
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tell me about the role or project..."
        rows={4}
        className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button
          data-testid="contact-submit"
          type="submit"
          disabled={status === "sending"}
          className="bg-primary hover:bg-primary/85 shadow-lg shadow-primary/30"
        >
          {status === "sending" ? "Sending..." : (<><Send className="w-4 h-4 mr-2" /> Send message</>)}
        </Button>
        {status === "sent" && (
          <p className="text-sm text-emerald-400" data-testid="contact-success">Message sent — I&apos;ll get back to you soon!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">Something went wrong. Please try again or email me directly.</p>
        )}
      </div>
    </form>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================
const App = () => {
  const p = portfolio.personal;
  const navLinks = [
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Projects", "#projects"],
    ["Research", "#research"],
    ["Experience", "#experience"],
    ["Writing", "#blog"],
    ["Contact", "#contact"],
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="grain-overlay" />
      <CursorGlow />

      {/* ---------- NAV ---------- */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <a href="#home" className="font-heading font-bold text-lg tracking-tight">
            <span className="text-primary font-mono">&gt;_</span> {p.logoHandle}
          </a>
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.filter(([label]) => label !== "Writing" || portfolio.blog.length > 0).map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-zinc-400 hover:text-foreground transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <Button asChild size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 hover:text-primary">
            <a href={p.resumeUrl} data-testid="nav-resume-btn">
              <Download className="w-4 h-4 mr-1.5" /> Resume
            </a>
          </Button>
        </div>
        <div className="absolute inset-0 -z-10 glass border-x-0 border-t-0" />
      </header>

      {/* ---------- HERO ---------- */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="aurora-blob aurora-1 top-[-10%] left-[5%]" />
          <div className="aurora-blob aurora-2 top-[30%] right-[0%]" />
          <div className="aurora-blob aurora-3 bottom-[-5%] left-[35%]" />
        </div>
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge variant="outline" className="mb-6 border-primary/40 text-primary font-mono text-xs px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 inline-block" />
                Open to opportunities
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
            >
              {p.name}
              <br />
              <span className="gradient-text">{p.title}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed"
            >
              {p.tagline}
              <span className="block mt-2 text-zinc-500">{p.valueProp}</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/85 shadow-lg shadow-primary/30">
                <a href="#projects" data-testid="cta-projects">
                  View Projects <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/15 hover:bg-white/5">
                <a href={p.resumeUrl} data-testid="cta-resume">
                  <Download className="w-4 h-4 mr-2" /> Download Resume
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-zinc-300 hover:bg-white/5">
                <a href="#contact" data-testid="cta-contact">Get in Touch</a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center gap-5 text-zinc-500"
            >
              <a href={p.social.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
              <a href={p.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
              {p.social.twitter && <a href={p.social.twitter} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>}
              {p.social.scholar && <a href={p.social.scholar} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><GraduationCap className="w-5 h-5" /></a>}
              <span className="text-xs font-mono flex items-center gap-1.5 ml-2"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Terminal />
          </motion.div>
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="container">
          <SectionHeading kicker="01 · About" title="Impact over buzzwords." />
          <div className="grid md:grid-cols-5 gap-6">
            <Reveal className="md:col-span-3">
              <div className="glass glass-hover rounded-2xl p-7 md:p-9 h-full">
                <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">{p.bio}</p>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-2">
              <div className="glass glass-hover rounded-2xl p-7 md:p-9 h-full border-primary/20">
                <p className="font-mono text-xs tracking-widest uppercase text-cyan-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Current focus
                </p>
                <p className="text-zinc-400 leading-relaxed">{p.currentFocus}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- SKILLS (bento) ---------- */}
      <section id="skills" className="relative py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="aurora-blob aurora-2 top-[10%] left-[-10%]" />
        </div>
        <div className="container">
          <SectionHeading kicker="02 · Stack" title="Tools I ship with." />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-5">
            {portfolio.skills.map((group, i) => {
              const Icon = ICONS[group.icon] || Code2;
              const span = i < 3 ? "md:col-span-2" : "md:col-span-3";
              return (
                <Reveal key={group.category} delay={i * 0.08} className={span}>
                  <div className="glass glass-hover rounded-2xl p-6 h-full" data-testid={`skill-card-${i}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold">{group.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((s) => (
                        <span key={s} className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 hover:border-primary/40 hover:text-primary transition-colors cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- PROJECTS (bento) ---------- */}
      <section id="projects" className="relative py-24 md:py-32">
        <div className="container">
          <SectionHeading kicker="03 · Featured Projects" title="From data to deployment." />
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Reveal className="md:col-span-4">
              <ProjectCard project={portfolio.projects[0]} large />
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-2">
              <ProjectCard project={portfolio.projects[1]} />
            </Reveal>
            {portfolio.projects.slice(2).map((proj, i) => (
              <Reveal key={proj.id} delay={i * 0.08} className="md:col-span-2">
                <ProjectCard project={proj} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH ---------- */}
      <section id="research" className="relative py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="aurora-blob aurora-1 bottom-[0%] right-[-10%]" />
        </div>
        <div className="container">
          <SectionHeading kicker="04 · Research" title="Publications." />
          <div className="space-y-5">
            {portfolio.publications.map((pub, i) => (
              <Reveal key={pub.title} delay={i * 0.1}>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noreferrer"
                  className="glass glass-hover rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 group block"
                  data-testid={`publication-${i}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <Badge variant="outline" className="border-cyan-400/40 text-cyan-300 font-mono text-[10px]">
                        {pub.venue} · {pub.year}
                      </Badge>
                      {pub.citations && <span className="font-mono text-xs text-amber-400">{pub.citations} citations</span>}
                    </div>
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">{pub.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">{pub.abstract}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors shrink-0" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EXPERIENCE ---------- */}
      <section id="experience" className="relative py-24 md:py-32">
        <div className="container">
          <SectionHeading kicker="05 · Journey" title="Education & milestones." />
          <div className="relative max-w-3xl">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-white/10 to-transparent" />
            <div className="space-y-10">
              {portfolio.experience.map((job, i) => (
                <Reveal key={job.company} delay={i * 0.1}>
                  <div className="relative pl-14" data-testid={`experience-${i}`}>
                    <div className="absolute left-0 top-0.5 w-10 h-10 rounded-full glass border-primary/30 flex items-center justify-center">
                      <Briefcase className="w-4.5 h-4.5 text-primary w-4 h-4" />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">{job.period}</p>
                    <h3 className="font-heading font-semibold text-xl">
                      {job.role} <span className="text-primary">@ {job.company}</span>
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {job.points.map((pt, j) => (
                        <li key={j} className="text-sm text-zinc-400 leading-relaxed flex gap-2.5">
                          <span className="text-primary mt-1.5 text-[8px]">◆</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BLOG (hidden when no posts) ---------- */}
      {portfolio.blog.length > 0 && (
      <section id="blog" className="relative py-24 md:py-32">
        <div className="container">
          <SectionHeading kicker="06 · Writing" title="Explaining the complex, clearly." />
          <div className="grid md:grid-cols-3 gap-5">
            {portfolio.blog.map((post, i) => (
              <Reveal key={post.title} delay={i * 0.1}>
                <a href={post.link} className="glass glass-hover rounded-2xl p-6 flex flex-col h-full group block" data-testid={`blog-${i}`}>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 font-mono text-[10px]">{post.tag}</Badge>
                    <Newspaper className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed flex-1">{post.description}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-5">{post.date} · {post.readTime} read</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="relative py-24 md:py-36">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="aurora-blob aurora-1 top-[20%] left-[25%]" />
          <div className="aurora-blob aurora-3 bottom-[0%] right-[10%]" />
        </div>
        <div className="container text-center max-w-2xl">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-4">07 · Contact</p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight">
              Let&apos;s build something <span className="gradient-text">intelligent</span>.
            </h2>
            <p className="mt-6 text-zinc-400 text-lg">
              Hiring for an AI/ML role, or want to collaborate on research? My inbox is open —
              or ask my AI twin (bottom-right) anything first.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/85 shadow-lg shadow-primary/30">
                <a href={`mailto:${p.email}`} data-testid="contact-email-btn">
                  <Mail className="w-4 h-4 mr-2" /> {p.email}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/15 hover:bg-white/5">
                <a href={p.resumeUrl}><Download className="w-4 h-4 mr-2" /> Resume</a>
              </Button>
            </div>
            <div className="mt-10">
              <ContactForm />
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-zinc-500">
              <a href={p.social.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
              <a href={p.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
              {p.social.twitter && <a href={p.social.twitter} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>}
              {p.social.scholar && <a href={p.social.scholar} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><GraduationCap className="w-5 h-5" /></a>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-white/5 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-600 font-mono">
          <p>© {new Date().getFullYear()} {p.name}. Built with Next.js + GPT-4o-mini.</p>
          <p className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" /> The chat widget is a live demo of my AI engineering — inspect away.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;
