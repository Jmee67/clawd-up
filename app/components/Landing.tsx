"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Data ── */

const agents = [
  {
    name: "Scout",
    role: "Finds opportunities",
    desc: "Scans Reddit, HN, X, and the web for bleeding-neck problems in your niche. Delivers a daily digest of leads worth pursuing.",
    color: "#6366f1",
  },
  {
    name: "Researcher",
    role: "Validates markets",
    desc: "Deep-dives competitors, sizes markets, scores opportunities against your rubric. Kills bad ideas before you waste time.",
    color: "#818cf8",
  },
  {
    name: "Operator",
    role: "Runs your pipeline",
    desc: "Manages your opportunity pipeline end-to-end. Morning briefs, nightly builds, comment monitoring. Works while you sleep.",
    color: "#10b981",
  },
];

const comparisonRows = [
  { item: "Agent memory & boot sequence", manual: "3-5 days configuring", us: "Pre-built" },
  { item: "Skill curation", manual: "Audit 51 skills manually", us: "28% leaner from day one" },
  { item: "Search & retrieval", manual: "Set up hybrid search + QMD", us: "Works instantly" },
  { item: "Compaction recovery", manual: "Build handover protocol", us: "Built-in" },
  { item: "Multi-agent coordination", manual: "Write from scratch", us: "Handoffs + shared memory" },
  { item: "Total setup time", manual: "3-5 days", us: "5 minutes" },
];

const faqs = [
  {
    q: "What do I need to run this?",
    a: "A VPS (we recommend Hetzner CAX21, $7.50/mo), Node.js 18+, and an AI API key (Anthropic recommended). We walk you through everything.",
  },
  {
    q: "Why self-hosted? Why not a cloud service?",
    a: "Your data. Your API keys. Your agents. We never see your pipeline, your leads, or your business strategy. You own everything.",
  },
  {
    q: "What's the $9/mo subscription for?",
    a: "Weekly updates from our production system — new agent configs, skills, signal sources, and kill patterns. Cancel anytime. You keep everything.",
  },
  {
    q: "How much does the AI API cost to run?",
    a: "Most users spend $30-80/mo on API calls. Scout and Researcher use Sonnet (cheap). Only the Operator uses Opus for complex decisions.",
  },
  {
    q: "What if I break something?",
    a: "The immune system catches drift. Configs are version-controlled. Worst case, re-run setup to reset to known-good state.",
  },
];

/* ── Terminal animation ── */

const terminalLines = [
  { text: "$ curl -sSL https://clawd-up.sh | bash", delay: 0, type: "input" as const },
  { text: "Installing Clawd Up v0.3.2...", delay: 800, type: "output" as const },
  { text: "Configuring Scout agent...", delay: 1400, type: "output" as const },
  { text: "Configuring Researcher agent...", delay: 1800, type: "output" as const },
  { text: "Configuring Operator agent...", delay: 2200, type: "output" as const },
  { text: "Starting cron scheduler (23 jobs)...", delay: 2800, type: "output" as const },
  { text: "Your first brief arrives at 8:00 AM.", delay: 3400, type: "success" as const },
  { text: "Pipeline is live.", delay: 3800, type: "success" as const },
];

function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal max-w-xl mx-auto">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="text-text-muted text-xs ml-2">terminal</span>
      </div>
      <div className="p-4 text-sm leading-relaxed" style={{ minHeight: 220 }}>
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "input"
                ? "text-text-primary font-semibold"
                : line.type === "success"
                ? "text-green"
                : "text-text-muted"
            }`}
          >
            {line.text}
            {i === visibleLines - 1 && <span className="cursor-blink text-accent ml-0.5">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ Accordion ── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left card p-5 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary text-[15px]">{q}</h3>
        <span className="text-text-muted text-lg ml-4 shrink-0">{open ? "−" : "+"}</span>
      </div>
      {open && (
        <p className="text-sm text-text-secondary leading-relaxed mt-3">{a}</p>
      )}
    </button>
  );
}

/* ── Scroll reveal hook ── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    el.querySelectorAll(".reveal").forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Nav with scroll detection ── */

function Nav({ onStart }: { onStart: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-text-primary">
          Clawd Up
        </span>
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
            Demo
          </Link>
          <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
            FAQ
          </a>
          <button
            onClick={onStart}
            className={`btn-primary text-sm px-5 py-2 cursor-pointer transition-all duration-300 ${
              scrolled ? "opacity-100" : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
            }`}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── Main Component ── */

export default function Landing({ onStart }: { onStart: () => void }) {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef} className="min-h-screen">
      <Nav onStart={onStart} />

      {/* ── Hero ── */}
      <section className="hero-gradient min-h-screen flex items-center justify-center px-6 pt-16 relative">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="reveal inline-block mb-6">
            <span className="text-xs font-medium text-accent-light tracking-wide uppercase px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
              Self-hosted AI agents for solo founders
            </span>
          </div>
          <h1 className="reveal text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
            Your AI agent.<br />
            Your server.<br />
            <span className="gradient-text">Your rules.</span>
          </h1>
          <p className="reveal mt-6 text-lg sm:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
            Three agents that find opportunities, validate markets, and run your pipeline. One install command. Running by morning.
          </p>
          <div className="reveal mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              className="btn-primary px-8 py-3.5 text-lg cursor-pointer"
            >
              Get Clawd Up — $15
            </button>
            <Link
              href="/demo"
              className="btn-secondary px-8 py-3.5 text-lg cursor-pointer text-center"
            >
              See a live demo
            </Link>
          </div>
          <div className="reveal mt-16">
            <Terminal />
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="reveal border-y border-border">
        <div className="max-w-[1080px] mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-text-muted">
          <span><strong className="text-text-primary">3</strong> agents</span>
          <span className="hidden sm:inline text-border">|</span>
          <span><strong className="text-text-primary">14</strong> vetted skills</span>
          <span className="hidden sm:inline text-border">|</span>
          <span><strong className="text-text-primary">23</strong> pre-configured crons</span>
          <span className="hidden sm:inline text-border">|</span>
          <span><strong className="text-text-primary">5 min</strong> setup</span>
          <span className="hidden sm:inline text-border">|</span>
          <span><strong className="text-text-primary">$0</strong> hosting markup</span>
        </div>
      </section>

      {/* ── Your AI Team ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-4">
            Three agents. One system.
          </h2>
          <p className="reveal text-text-secondary text-center mb-16 max-w-xl mx-auto">
            Each agent has a role, a soul, and shared memory. They coordinate, hand off work, and get sharper every day.
          </p>
          <div className="reveal-stagger grid gap-6 md:grid-cols-3">
            {agents.map((a) => (
              <div key={a.name} className="reveal card p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                  <h3 className="text-lg font-semibold text-text-primary">{a.name}</h3>
                </div>
                <p className="text-sm font-medium text-accent-light mb-2">{a.role}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-16">
            From zero to <span className="gradient-text">pipeline</span> in 5 minutes
          </h2>
          <div className="reveal-stagger grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Configure",
                desc: "Answer 5 questions about your business, niche, and preferred tools. Takes 2 minutes.",
              },
              {
                step: "02",
                title: "Install",
                desc: "One command on your VPS. Agents deploy, crons start, memory initializes. Takes 3 minutes.",
              },
              {
                step: "03",
                title: "Operate",
                desc: "Your first brief arrives at 8am. Scout is already scanning. Pipeline is live.",
              },
            ].map((s) => (
              <div key={s.step} className="reveal text-center md:text-left">
                <span className="text-accent font-mono text-sm font-bold">{s.step}</span>
                <h3 className="text-xl font-semibold mt-2 mb-3 text-text-primary">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── System Architecture ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-4">
            Not prompts. A system.
          </h2>
          <p className="reveal text-text-secondary text-center mb-16 max-w-xl mx-auto">
            Five layers that compound. Every correction becomes a rule. Every session makes the system smarter.
          </p>

          <div className="reveal max-w-2xl mx-auto space-y-3">
            {[
              { layer: "BRAIN", desc: "SOUL.md + AGENTS.md + USER.md", detail: "Your agent knows who it is, who you are, and how to operate" },
              { layer: "SKILLS", desc: "14 vetted, auto-loaded per task", detail: "Research, copywriting, strategy, pipeline — each with frameworks" },
              { layer: "TOOLS", desc: "Web, browser, APIs, MCP servers", detail: "External data flows in automatically" },
              { layer: "CONTEXT", desc: "Brand voice, priorities, vault", detail: "Corrections today become rules tomorrow" },
              { layer: "AGENTS", desc: "Scout + Researcher + Operator", detail: "Specialists that coordinate and share memory" },
            ].map((l, i) => (
              <div key={l.layer} className="reveal card px-6 py-4" style={{ marginLeft: `${i * 24}px`, marginRight: `${(4 - i) * 24}px` }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-accent font-mono text-xs font-bold tracking-widest">{l.layer}</span>
                  <span className="text-text-muted text-xs">— {l.desc}</span>
                </div>
                <p className="text-sm text-text-secondary">{l.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── Comparison ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-16">
            Manual setup <span className="text-text-muted">vs</span> <span className="gradient-text">Clawd Up</span>
          </h2>
          <div className="reveal overflow-x-auto card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3.5 px-5 text-text-muted font-medium"></th>
                  <th className="text-left py-3.5 px-5 text-text-muted font-medium">Manual</th>
                  <th className="text-left py-3.5 px-5 text-accent font-medium">Clawd Up</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.item} className={i < comparisonRows.length - 1 ? "border-b border-border" : ""}>
                    <td className="py-3.5 px-5 font-medium text-text-primary">{row.item}</td>
                    <td className="py-3.5 px-5 text-text-muted">{row.manual}</td>
                    <td className="py-3.5 px-5 text-green font-medium">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-4">
            Simple pricing
          </h2>
          <p className="reveal text-text-secondary text-center mb-16">
            Buy once. Subscribe for weekly updates from our live system.
          </p>
          <div className="reveal-stagger grid gap-6 md:grid-cols-2">
            {/* One-time */}
            <div className="reveal card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-text-primary">Clawd Up</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent-light">
                  Full agent pack
                </span>
              </div>
              <div className="mt-3 mb-6">
                <span className="text-4xl font-bold text-text-primary">$15</span>
                <span className="text-text-muted text-sm ml-1">one-time</span>
              </div>
              <ul className="space-y-3">
                {[
                  "All 3 agents (Scout, Researcher, Operator)",
                  "Pre-configured memory + boot sequence",
                  "Curated skills — no bloat",
                  "Cron jobs, templates, pipeline system",
                  "Telegram or Discord briefs",
                  "Own it forever",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="text-green mt-0.5 shrink-0">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Subscription */}
            <div className="reveal card p-7">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-text-primary">Updates</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg-tertiary text-text-muted">
                  Stay sharp
                </span>
              </div>
              <div className="mt-3 mb-6">
                <span className="text-4xl font-bold text-text-primary">$9</span>
                <span className="text-text-muted text-sm ml-1">/mo</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Weekly config updates from our live system",
                  "New agent SOULs as we improve them",
                  "New skills, vetted and tested",
                  "New signal sources + kill patterns",
                  "Private GitHub repo access",
                  "Cancel anytime — keep everything",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="text-green mt-0.5 shrink-0">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="reveal text-center mt-10">
            <button
              onClick={onStart}
              className="btn-primary px-10 py-4 text-lg cursor-pointer"
            >
              Get Clawd Up — $15 One-Time
            </button>
            <p className="text-text-muted text-xs mt-3">
              Not happy? Full refund within 30 days. No questions.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── Roadmap ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-4">
            What your <span className="gradient-text">$9/mo</span> unlocks
          </h2>
          <p className="reveal text-text-secondary text-center mb-16 max-w-xl mx-auto">
            Your subscription isn't maintenance. It's a feed from our live production system — every improvement we make, you get.
          </p>
          <div className="reveal-stagger grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Now",
                items: [
                  "Weekly config drops — improved SOULs, new kill patterns",
                  "Model update patches when Claude/GPT changes break prompts",
                  "New signal sources as we discover them",
                ],
              },
              {
                label: "Q2 2026",
                items: [
                  "Dashboard UI — visual pipeline, signal feed, brief history",
                  "Niche playbooks — pre-built configs for SaaS, e-commerce, agency",
                  "Slack & Discord briefs — not just Telegram",
                ],
              },
              {
                label: "Q3 2026",
                items: [
                  "Custom agent builder — define your own specialists",
                  "Community kill patterns — crowdsourced from all users",
                  "Local AI fallback — Ollama for cheaper scanning",
                ],
              },
              {
                label: "Q4 2026",
                items: [
                  "Multi-agent marketplace — plug in community-built agents",
                  "Revenue tracking integration — connect Stripe/LemonSqueezy",
                  "Auto-validation — agents test landing pages and run ads",
                ],
              },
            ].map((phase) => (
              <div key={phase.label} className="reveal card p-6">
                <span className="text-xs font-bold text-accent-light tracking-wider uppercase">{phase.label}</span>
                <ul className="mt-3 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <span className="text-green mt-0.5 shrink-0">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-16">
            Questions
          </h2>
          <div className="reveal space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="reveal py-24 px-6 hero-gradient relative">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop configuring.<br />
            <span className="gradient-text">Start operating.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10">
            Five questions. One command. Your AI team is live.
          </p>
          <button
            onClick={onStart}
            className="btn-primary px-10 py-4 text-lg cursor-pointer"
          >
            Get Started — $15 One-Time
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <span>Built by solo founders, for solo founders.</span>
          <div className="flex gap-6">
            <a href="https://github.com/Jmee67/clawd-up" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
              GitHub
            </a>
            <a href="https://x.com/Microbuilderco" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
              @Microbuilderco
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
