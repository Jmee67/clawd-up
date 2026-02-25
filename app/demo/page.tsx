"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Sample data ── */

const sampleBrief = `🌅 Morning Brief — Wednesday Feb 26

📡 SCOUT SIGNALS (3 new overnight)

1. "Everyone hates Calendly alternatives" — r/SaaS
   847 upvotes · 94 comments · 2.8% bookmark rate
   → Scheduling frustration. 12 unique complaints in 48h.

2. "I'd pay $50/mo for client reporting that doesn't suck"
   @indie_dev on X · 2.1K likes · 891 bookmarks
   → Direct WTP signal. Solo consultants & agencies.

3. "Built a niche job board in a weekend, hit $2K MRR"
   Indie Hackers · 156 comments
   → Validation of niche directory model. Simple stack.

📋 PIPELINE STATUS
• OPP-007 Invoice Tool [RESEARCHING] — Researcher deep-diving
• OPP-008 Client Reports [NEW] — promoted from signal #2
• OPP-003 Directory Builder [SCORING] — 16/25 AMBER

🎯 TODAY'S PRIORITIES
• Review OPP-003 score — build or kill decision needed
• Scout: afternoon scan (Reddit + X)
• Nightly build: OPP-007 landing page queued

No stale items. Pipeline healthy.`;

const sampleTriage = `📊 Signal Triage — 12 signals processed

PROMOTE → Pipeline (3):
✅ "Invoice tools for freelancers are terrible"
   r/freelance · 1,247 upvotes · WTP confirmed ($29-49/mo)
   → Created OPP-007. Researcher assigned.

✅ "I spend 3h/week on client reporting"
   X thread · 891 bookmarks (3.1% rate)
   → Created OPP-008. Direct demand + price signal.

✅ "No good recipe app since Allrecipes died"
   r/cooking · 2.3K upvotes · 4 related threads this week
   → Created OPP-009. Consumer play, high volume.

WATCH (4):
👀 "AI meeting notes tool" — real demand, very crowded
👀 "Browser extension for cold outreach" — platform risk
👀 "Notion template marketplace" — small TAM
👀 "Gym tracker for powerlifters" — niche, needs sizing

SKIP (5):
⏭️ Generic "AI wrapper" posts — no moat signal
⏭️ Crypto/web3 requests — outside thesis
⏭️ Enterprise workflow signals — wrong scale
⏭️ "Clone of X but better" — no differentiation
⏭️ Hardware product ideas — not software`;

const sampleDeepDive = `📋 5S Deep Dive: OPP-007 — Freelancer Invoice Tool

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNAL  ████░  4/5
1,247 upvotes on r/freelance. 3 related threads in 7 days.
Direct WTP quotes: "$29/mo easy" and "I'd switch from
FreshBooks tomorrow." 67% of commenters cite UX frustration
with existing tools, not missing features.

SIZE  ███░░  3/5
TAM: $2.1B (global invoicing software)
SAM: $180M (freelancer/solo segment)
SOM: $1.8M (1% of SAM, achievable in 18 months)
Growing 12% YoY as freelancer economy expands.

SHAPE  ████░  4/5
$29/mo SaaS. 85% gross margins. Low churn category
(switching invoicing tools is painful). Expansion via
add-ons: expense tracking, tax prep, client portal.
Path to $10K MRR with 345 customers.

SPEED  ████░  4/5
Core stack: Next.js + Stripe + PDF generation.
AI angle: auto-categorize expenses, draft invoice
line items from project notes. 2-week MVP. Solo-buildable.
No regulatory barriers under $50K processing.

STRESS TEST  ███░░  3/5
FreshBooks ($100M+ ARR) and Wave (free tier) exist but
UX is dated. No AI-native competitor in market. Risk:
Stripe could build this natively. Mitigation: move fast,
own the "AI-first freelancer" positioning.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL: 18/25 — AMBER

Recommendation: Build a landing page. Post to r/freelance
with "I'm building the invoice tool you asked for."
If 50 signups in 48h → proceed to MVP.
If not → KILL and reallocate to OPP-008.`;

const sampleNightly = `🌙 Nightly Build — Feb 25, 11:00 PM

━━ BUILT ━━━━━━━━━━━━━━━━━━━━━━━━━

1. OPP-007 Landing Page
   • Next.js app with waitlist form
   • Stripe-ready pricing section
   • Mobile responsive, <1s load time
   • Deployed to Vercel (not public yet)

2. Pipeline Improvements
   • Drag-and-drop between stages
   • Kill confirmation (type ID to confirm)
   • Undo on status changes (4s window)

3. Scout Enhancement
   • Fixed Reddit rate limiting (was missing 40% of signals)
   • Added bookmark rate calculation for X signals
   • New source: Indie Hackers "what are you working on" threads

━━ COMMITS ━━━━━━━━━━━━━━━━━━━━━━━

• abc1234 — OPP-007 landing page + waitlist API
• def5678 — Pipeline drag-drop + kill confirmation
• 9ab0123 — Scout rate limit fix + bookmark calc

━━ PIPELINE ━━━━━━━━━━━━━━━━━━━━━━

OPP-003 Directory Builder → KILLED (16/25, competitor found)
OPP-007 Invoice Tool → TESTING (landing page live)
OPP-008 Client Reports → RESEARCHING (deep dive in progress)
OPP-009 Recipe App → NEW (queued for triage tomorrow)

━━ VERIFICATION ━━━━━━━━━━━━━━━━━━

✅ All files confirmed (ls + wc)
✅ All commits confirmed (git log)
✅ TypeScript clean (tsc --noEmit)
✅ 3 pushes total (under 5 limit)`;

const tabs = [
  { id: "brief", label: "Morning Brief", icon: "🌅", agent: "Operator" },
  { id: "triage", label: "Signal Triage", icon: "📊", agent: "Scout" },
  { id: "deepdive", label: "Deep Dive", icon: "📋", agent: "Researcher" },
  { id: "nightly", label: "Nightly Build", icon: "🌙", agent: "Operator" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const content: Record<TabId, string> = {
  brief: sampleBrief,
  triage: sampleTriage,
  deepdive: sampleDeepDive,
  nightly: sampleNightly,
};

const descriptions: Record<TabId, string> = {
  brief: "Every morning at 8am, your Operator delivers a brief with overnight signals, pipeline status, and today's priorities. Read it in 30 seconds.",
  triage: "Scout processes raw signals and makes promote/watch/skip decisions based on your thesis. You only see what matters.",
  deepdive: "Researcher writes rigorous 5-section analyses designed to find reasons NOT to build. Opportunities that survive are worth your time.",
  nightly: "At 11pm, the Operator builds — landing pages, pipeline improvements, prototype features. You wake up to shipped code.",
};

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("brief");

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e5e5e5]">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1b] px-6 h-14 flex items-center justify-between max-w-[1080px] mx-auto">
        <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
          Clawd Up
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#888] bg-[#1a1a1b] px-3 py-1 rounded-full">Demo Mode</span>
          <Link href="/" className="text-sm text-[#a78bfa] hover:underline">
            ← Back to site
          </Link>
        </div>
      </nav>

      <main className="max-w-[1080px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            See what your agents <span className="text-[#a78bfa]">actually produce</span>
          </h1>
          <p className="text-[#888] text-lg max-w-xl mx-auto">
            These are real output formats from a running Clawd Up system. Click each tab to explore.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30"
                  : "bg-[#111] text-[#888] border border-[#1a1a1b] hover:border-[#333]"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-sm text-[#888]">
            <span className="text-[#a78bfa] font-medium">
              {tabs.find((t) => t.id === activeTab)?.agent}
            </span>{" "}
            — {descriptions[activeTab]}
          </p>
        </div>

        {/* Terminal output */}
        <div className="bg-[#0d0d0e] border border-[#1a1a1b] rounded-xl overflow-hidden max-w-3xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1b] bg-[#111]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="text-[#555] text-xs ml-2 font-mono">
              telegram — {tabs.find((t) => t.id === activeTab)?.label}
            </span>
          </div>
          <pre className="p-6 text-sm font-mono leading-relaxed whitespace-pre-wrap text-[#ccc] overflow-x-auto max-h-[600px] overflow-y-auto">
            {content[activeTab]}
          </pre>
        </div>

        {/* Timeline */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">A typical day with Clawd Up</h2>
          <div className="space-y-0">
            {[
              { time: "8:00 AM", event: "Morning Brief arrives", agent: "Operator", active: activeTab === "brief" },
              { time: "9:00 AM", event: "You read brief, reply to one signal", agent: "You", active: false },
              { time: "10:00 AM", event: "Scout scans Reddit + X + HN", agent: "Scout", active: false },
              { time: "12:00 PM", event: "Signal triage — promote/watch/skip", agent: "Scout", active: activeTab === "triage" },
              { time: "2:00 PM", event: "Deep dive on promoted opportunity", agent: "Researcher", active: activeTab === "deepdive" },
              { time: "7:00 PM", event: "Second signal triage pass", agent: "Scout", active: false },
              { time: "11:00 PM", event: "Nightly build — code ships", agent: "Operator", active: activeTab === "nightly" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${item.active ? "bg-[#a78bfa]" : item.agent === "You" ? "bg-[#10b981]" : "bg-[#333]"}`} />
                  {i < 6 && <div className="w-px h-8 bg-[#1a1a1b]" />}
                </div>
                <div className="pb-4">
                  <span className="text-xs text-[#555] font-mono">{item.time}</span>
                  <p className={`text-sm ${item.active ? "text-[#a78bfa] font-medium" : "text-[#ccc]"}`}>
                    {item.event}
                  </p>
                  <span className="text-xs text-[#555]">{item.agent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pb-8">
          <p className="text-[#888] mb-6">Ready to run this on your own server?</p>
          <Link
            href="/"
            className="inline-block bg-[#a78bfa] text-black font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Get Clawd Up — $19
          </Link>
          <p className="text-[#555] text-xs mt-3">One-time purchase. Self-hosted. Your data stays yours.</p>
        </div>
      </main>
    </div>
  );
}
