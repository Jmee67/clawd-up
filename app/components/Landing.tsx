"use client";

import { useEffect, useRef } from "react";

/* ── Data ── */

const painPoints = [
  {
    icon: "🧠",
    problem: "Spend days configuring agent memory & decay scoring",
    solution: "Memory system pre-configured with sane defaults",
  },
  {
    icon: "🔍",
    problem: "Search returns garbage — need hybrid search + QMD tuning",
    solution: "Intelligent retrieval works out of the box",
  },
  {
    icon: "📋",
    problem: "Write boot sequences, handover protocols, compaction recovery",
    solution: "All operational protocols ship included",
  },
  {
    icon: "⚙️",
    problem: "Audit 51 skills, cut bloat, save tokens manually",
    solution: "Curated skill set — 28% leaner from day one",
  },
];

const agents = [
  {
    name: "Scout",
    role: "Opportunity Hunter",
    bullets: [
      "Scans web for leads matching your ICP",
      "Monitors competitor launches & pricing changes",
      "Surfaces relevant discussions on Reddit, HN, Twitter",
      "Delivers daily opportunity digest",
    ],
  },
  {
    name: "Researcher",
    role: "Deep Analysis",
    bullets: [
      "Deep-dives competitors and market segments",
      "Builds research briefs on demand",
      "Tracks industry trends and shifts",
      "Synthesizes findings into actionable insights",
    ],
  },
  {
    name: "Operator",
    role: "Pipeline Manager",
    bullets: [
      "Manages your sales pipeline end-to-end",
      "Sends daily briefs at 8am your timezone",
      "Auto-prioritizes tasks and follow-ups",
      "Custom workflows for your business",
    ],
  },
];

const comparisonRows = [
  { item: "Agent memory & context", manual: "Find docs, configure, test", clawdup: "Pre-configured" },
  { item: "Search quality", manual: "Set up hybrid search + QMD", clawdup: "Works instantly" },
  { item: "Boot sequence", manual: "Write AGENTS.md manually", clawdup: "Included" },
  { item: "Compaction recovery", manual: "Build handover protocol", clawdup: "Built-in" },
  { item: "Skill curation", manual: "Audit 51 → 32 skills", clawdup: "Ships curated" },
  { item: "Total setup time", manual: "3–5 days", clawdup: "5 minutes" },
];

const tiers = [
  {
    name: "Clawd Up",
    price: "$19",
    period: "one-time",
    tag: "Full agent pack",
    highlighted: true,
    features: [
      "All 3 agents (Scout, Researcher, Operator)",
      "Pre-configured memory + boot sequence",
      "Curated skills — no bloat",
      "Cron jobs, templates, pipeline system",
      "Telegram or Discord briefs",
      "Own it forever",
    ],
  },
  {
    name: "Updates",
    price: "$9",
    period: "/mo",
    tag: "Stay sharp",
    highlighted: false,
    features: [
      "Weekly config updates from our live system",
      "New agent SOULs as we improve them",
      "New skills, vetted and tested",
      "New signal sources + kill patterns",
      "Private GitHub repo access",
      "Cancel anytime",
    ],
  },
];

/* ── Scroll reveal hook ── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    el.querySelectorAll(".reveal").forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Component ── */

export default function Landing({ onStart }: { onStart: () => void }) {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef} className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-[#111]">Clawd Up</span>
          <button
            onClick={onStart}
            className="bg-[#10B981] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#059669] transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="reveal text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-[#111]">
            Your AI Business<br />
            <span className="text-[#10B981]">Operations Team</span>
          </h1>
          <p className="reveal mt-6 text-lg sm:text-xl text-[#666] max-w-2xl mx-auto leading-relaxed">
            Three agents. One install command.<br className="hidden sm:block" />
            Pipeline running by morning.
          </p>
          <div className="reveal mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              className="bg-[#10B981] text-white font-semibold px-8 py-3.5 rounded-lg text-lg hover:bg-[#059669] transition-colors cursor-pointer"
            >
              Get Started
            </button>
            <a
              href="#how-it-works"
              className="border border-gray-200 text-[#111] font-medium px-8 py-3.5 rounded-lg text-lg hover:border-gray-400 transition-colors cursor-pointer text-center"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="reveal border-y border-gray-200 bg-gray-50">
        <div className="max-w-[1080px] mx-auto px-6 py-8 text-center">
          <p className="text-[#666] text-lg">
            <span className="text-[#111] font-semibold">77,000 developers</span> read about the problem.{" "}
            <span className="text-[#10B981] font-semibold">We built the solution.</span>
          </p>
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-4 text-[#111]">
            What takes days to configure,<br />
            <span className="text-[#10B981]">we ship pre-built.</span>
          </h2>
          <p className="reveal text-[#666] text-center mb-16 text-base">Stop debugging infrastructure. Start running your business.</p>
          <div className="reveal-stagger grid gap-5 sm:grid-cols-2">
            {painPoints.map((p) => (
              <div key={p.solution} className="reveal card-hover bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-2xl mb-3">{p.icon}</div>
                <p className="text-[#999] line-through text-sm mb-2">{p.problem}</p>
                <p className="text-[#10B981] font-medium">{p.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── System vs Prompts ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-4 text-[#111]">
            Prompts give you outputs.<br />
            <span className="text-[#10B981]">Systems give you a business.</span>
          </h2>
          <p className="reveal text-[#666] text-center mb-16 text-base max-w-2xl mx-auto">
            A $3M agency owner spent weeks building this architecture manually. We ship it pre-configured.
          </p>

          <div className="reveal max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-3">
              {[
                { layer: "BRAIN", desc: "SOUL.md + AGENTS.md + USER.md", detail: "Your agent knows who it is, who you are, and how to operate", width: "100%" },
                { layer: "SKILLS", desc: "14 vetted skills, auto-loaded per task", detail: "Copywriting, research, strategy, pipeline management — each with frameworks and anti-patterns", width: "88%" },
                { layer: "TOOLS", desc: "Web search, browser, APIs, MCP servers", detail: "External data flows in automatically — no copy-pasting between tools", width: "76%" },
                { layer: "CONTEXT", desc: "Brand voice, priorities, learnings vault", detail: "Corrections today become rules tomorrow. The system gets sharper every session.", width: "64%" },
                { layer: "AGENTS", desc: "Scout + Researcher + Operator", detail: "Specialists that coordinate, hand off work, and share memory", width: "52%" },
              ].map((l) => (
                <div key={l.layer} className="reveal flex justify-center">
                  <div
                    className="card-hover bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-4"
                    style={{ width: l.width }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#10B981] font-mono text-xs font-bold tracking-widest">{l.layer}</span>
                      <span className="text-[#999] text-xs">— {l.desc}</span>
                    </div>
                    <p className="text-sm text-[#666]">{l.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[#999] text-sm mt-6">
              Each layer builds on the last. Start with the brain. Everything else compounds.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-16 text-[#111]">
            Three steps to <span className="text-[#10B981]">liftoff</span>
          </h2>
          <div className="reveal-stagger grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Configure", desc: "Answer 5 questions about your business, preferences, and tools." },
              { step: "02", title: "Install", desc: "One command on your VPS. Everything deploys automatically." },
              { step: "03", title: "Operate", desc: "Your first brief arrives at 8am your timezone. Pipeline is live." },
            ].map((s, i) => (
              <div key={s.step} className={`reveal text-center md:text-left ${i < 2 ? "step-line" : ""}`}>
                <div className="text-[#10B981] font-mono text-sm mb-2">{s.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#111]">{s.title}</h3>
                <p className="text-[#666] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Your AI Team ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-16 text-[#111]">
            Your AI Team
          </h2>
          <div className="reveal-stagger grid gap-6 md:grid-cols-3">
            {agents.map((a) => (
              <div key={a.name} className="reveal card-hover bg-white rounded-xl border border-gray-200 shadow-sm p-7">
                <h3 className="text-xl font-semibold text-[#111]">{a.name}</h3>
                <p className="text-[#666] text-sm mb-4">{a.role}</p>
                <ul className="space-y-2.5">
                  {a.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[#444]">
                      <span className="text-[#10B981] mt-0.5 shrink-0">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-16 text-[#111]">
            Manual Setup <span className="text-[#999]">vs</span> <span className="text-[#10B981]">Clawd Up</span>
          </h2>
          <div className="reveal overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-5 text-[#666] font-medium"></th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Manual</th>
                  <th className="text-left py-3 px-5 text-[#10B981] font-medium">Clawd Up</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.item} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="py-3.5 px-5 font-medium text-[#111]">{row.item}</td>
                    <td className="py-3.5 px-5 text-[#666]">{row.manual}</td>
                    <td className="py-3.5 px-5 text-[#10B981] font-medium">{row.clawdup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-4 text-[#111]">
            Simple pricing
          </h2>
          <p className="reveal text-[#666] text-center mb-16 text-base">Buy once. Subscribe for weekly updates from our live system.</p>
          <div className="reveal-stagger grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`reveal card-hover bg-white rounded-xl p-7 text-left shadow-sm ${
                  t.highlighted ? "border-t-2 border-t-[#10B981] border border-gray-200" : "border border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-semibold text-[#111]">{t.name}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    t.highlighted ? "bg-emerald-50 text-[#10B981]" : "bg-gray-100 text-[#666]"
                  }`}>
                    {t.tag}
                  </span>
                </div>
                <div className="mt-2 mb-5">
                  <span className="text-3xl font-bold text-[#111]">{t.price}</span>
                  <span className="text-[#666] text-sm">{t.period}</span>
                </div>
                <ul className="space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#444]">
                      <span className="text-[#10B981] mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl font-semibold text-center mb-16 text-[#111]">
            Common questions
          </h2>
          <div className="reveal space-y-6">
            {[
              { q: "What do I need to run this?", a: "A VPS (DigitalOcean $12/mo works great), Node.js 18+, an AI API key (Anthropic, OpenAI, or Google), and a Telegram bot or Discord webhook for notifications." },
              { q: "Is this a SaaS or do I self-host?", a: "Self-hosted. You run it on your own server. Your data, your API keys, your agents. We never see your pipeline." },
              { q: "What's the difference between the one-time purchase and the subscription?", a: "The $19 one-time gets you the full system as-is. The $9/mo subscription gives you weekly updates — new agent configurations, skills, and signal sources from our live production system." },
              { q: "Can I cancel the updates subscription?", a: "Yes, anytime. You keep everything you've already received. The agents keep running — you just stop getting weekly updates." },
              { q: "How much does the AI API cost?", a: "Depends on usage. Most users spend $30-80/mo on API calls. Scout and Researcher use Sonnet (cheap). Only the Operator uses Opus for complex decisions." },
              { q: "What if I break something?", a: "The immune system catches drift and data quality issues. Agent configs are version-controlled. Worst case, re-run setup.js to reset." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-[#111] mb-2">{faq.q}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="reveal py-24 px-6 bg-gray-50">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#111]">
            Ready to stop configuring<br />and start operating?
          </h2>
          <p className="text-[#666] text-lg mb-10">Five questions. One command. Your AI team is live.</p>
          <button
            onClick={onStart}
            className="bg-[#10B981] text-white font-semibold px-10 py-4 rounded-lg text-lg hover:bg-[#059669] transition-colors cursor-pointer"
          >
            Get Started — $19 One-Time
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 py-10 px-6">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666]">
          <span>Built by solo founders, for solo founders.</span>
          <a
            href="https://github.com/Jmee67/clawd-up"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#111] transition-colors"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
