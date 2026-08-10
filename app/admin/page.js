"use client";

// ============================================================
// PRIVATE ADMIN DASHBOARD  (/admin)
// - Passcode-gated (ADMIN_PASSCODE in .env, default admin123)
// - Chat Analytics: what recruiters ask the AI twin
// - Inbox: contact form messages
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Lock, BarChart3, Inbox, MessageSquare, Users, HelpCircle,
  Mail, RefreshCw, ArrowLeft, Bot,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="glass rounded-2xl p-6">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${tint}`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="font-heading text-3xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

const AdminPage = () => {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (adminKey) => {
    setLoading(true);
    try {
      const headers = { "x-admin-key": adminKey };
      const [aRes, mRes] = await Promise.all([
        fetch("/api/admin/analytics", { headers }),
        fetch("/api/admin/messages", { headers }),
      ]);
      if (aRes.ok) setAnalytics(await aRes.json());
      if (mRes.ok) {
        const data = await mRes.json();
        setInbox(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved = null;
    try { saved = sessionStorage.getItem("admin_key"); } catch (e) {}
    if (saved) {
      setKey(saved);
      setAuthed(true);
      loadData(saved);
    }
  }, [loadData]);

  const login = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        setAuthError("Invalid passcode");
        return;
      }
      try { sessionStorage.setItem("admin_key", passcode); } catch (err) {}
      setKey(passcode);
      setAuthed(true);
      loadData(passcode);
    } catch (err) {
      setAuthError("Something went wrong");
    }
  };

  // ---------- Login gate ----------
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="grain-overlay" />
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="aurora-blob aurora-1 top-[10%] left-[20%]" />
          <div className="aurora-blob aurora-2 bottom-[10%] right-[15%]" />
        </div>
        <form onSubmit={login} className="glass rounded-2xl p-8 w-full max-w-sm text-center" data-testid="admin-login">
          <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6">Enter your passcode to view analytics & inbox</p>
          <Input
            data-testid="admin-passcode-input"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="bg-white/5 border-white/10 text-center focus-visible:ring-primary"
          />
          {authError && <p className="text-sm text-red-400 mt-3" data-testid="admin-auth-error">{authError}</p>}
          <Button data-testid="admin-login-btn" type="submit" className="w-full mt-4 bg-primary hover:bg-primary/85">
            Unlock
          </Button>
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mt-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to portfolio
          </a>
        </form>
      </div>
    );
  }

  // ---------- Dashboard ----------
  return (
    <div className="min-h-screen pb-20">
      <div className="grain-overlay" />
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="aurora-blob aurora-1 top-[-10%] right-[0%]" />
      </div>

      <header className="border-b border-white/5">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold">Portfolio Command Center</h1>
              <p className="text-xs text-muted-foreground">Private analytics & inbox</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="border-white/15 hover:bg-white/5" onClick={() => loadData(key)} disabled={loading} data-testid="admin-refresh">
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button asChild size="sm" variant="ghost" className="text-zinc-400 hover:bg-white/5">
              <a href="/"><ArrowLeft className="w-4 h-4 mr-1.5" /> Site</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container pt-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Chat sessions" value={analytics?.totalSessions ?? "—"} tint="bg-primary/15 text-primary border border-primary/30" />
          <StatCard icon={HelpCircle} label="Questions asked" value={analytics?.totalQuestions ?? "—"} tint="bg-cyan-400/10 text-cyan-400 border border-cyan-400/30" />
          <StatCard icon={MessageSquare} label="Total chat messages" value={analytics?.totalMessages ?? "—"} tint="bg-amber-400/10 text-amber-400 border border-amber-400/30" />
          <StatCard icon={Inbox} label="Inbox messages" value={inbox.length} tint="bg-emerald-400/10 text-emerald-400 border border-emerald-400/30" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            data-testid="tab-analytics"
            size="sm"
            variant={tab === "analytics" ? "default" : "outline"}
            className={tab === "analytics" ? "bg-primary hover:bg-primary/85" : "border-white/15 hover:bg-white/5"}
            onClick={() => setTab("analytics")}
          >
            <Bot className="w-4 h-4 mr-1.5" /> AI Twin Questions
          </Button>
          <Button
            data-testid="tab-inbox"
            size="sm"
            variant={tab === "inbox" ? "default" : "outline"}
            className={tab === "inbox" ? "bg-primary hover:bg-primary/85" : "border-white/15 hover:bg-white/5"}
            onClick={() => setTab("inbox")}
          >
            <Inbox className="w-4 h-4 mr-1.5" /> Contact Inbox ({inbox.length})
          </Button>
        </div>

        {tab === "analytics" && (
          <div className="glass rounded-2xl overflow-hidden" data-testid="analytics-panel">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-heading font-semibold">What visitors ask the AI twin</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Most recent first · last {analytics?.recentQuestions?.length ?? 0} questions</p>
            </div>
            <div className="divide-y divide-white/5 max-h-[540px] overflow-y-auto">
              {(analytics?.recentQuestions || []).length === 0 && (
                <p className="p-6 text-sm text-muted-foreground">No questions yet — share your portfolio and watch this fill up.</p>
              )}
              {(analytics?.recentQuestions || []).map((q, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4 hover:bg-white/[0.02]">
                  <HelpCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200">{q.question}</p>
                    <p className="font-mono text-[11px] text-muted-foreground mt-1">
                      session {String(q.sessionId).slice(0, 8)} · {q.ts ? new Date(q.ts).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "inbox" && (
          <div className="space-y-4" data-testid="inbox-panel">
            {inbox.length === 0 && (
              <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
                No messages yet. When someone uses the contact form, it lands here.
              </div>
            )}
            {inbox.map((m) => (
              <div key={m.id} className="glass rounded-2xl p-6" data-testid="inbox-message">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm">{m.name}</p>
                      <a href={`mailto:${m.email}`} className="text-xs text-cyan-400 hover:underline">{m.email}</a>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/15 text-muted-foreground font-mono text-[10px]">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
