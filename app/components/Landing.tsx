"use client";

const agents = [
  { name: "Scout", desc: "Scans for opportunities across the web", icon: "🔍" },
  { name: "Researcher", desc: "Deep-dives competitors and markets", icon: "🔬" },
  { name: "Operator", desc: "Manages your pipeline and daily briefs", icon: "⚡" },
];

const tiers = [
  { name: "Free", price: "$0", desc: "Scout only", features: ["Daily opportunity scan", "Basic pipeline tracking", "Telegram/Discord briefs"] },
  { name: "Starter", price: "$29", desc: "Scout + Researcher", features: ["Everything in Free", "Competitor research", "Market analysis", "Priority signals"] },
  { name: "Pro", price: "$49", desc: "Full team", features: ["Everything in Starter", "Operator agent", "Auto-pipeline management", "Custom workflows"] },
];

const painPoints = [
  {
    title: "Memory That Actually Works",
    problem: "Agent forgets everything after long conversations",
    solution: "Memory flush pre-configured with sane decay scoring defaults",
  },
  {
    title: "Smart Boot Sequence",
    problem: "Agent finds info but doesn't use it",
    solution: "Boot sequence loads identity, user context, and recent memory every session",
  },
  {
    title: "Token-Efficient by Default",
    problem: "System prompt bloated at 11,887 tokens with 51 skills",
    solution: "Curated skills ship at ~8,500 tokens — 28% leaner from day one",
  },
  {
    title: "Handover Protocol Built In",
    problem: "Compaction wipes context mid-session",
    solution: "Handover protocol + compaction recovery + hourly summaries included",
  },
  {
    title: "Curated Skills, Not 51 Random Ones",
    problem: "Default installs load every available skill",
    solution: "Pre-audited skill set matched to your workflow — no bloat",
  },
];

const comparisonRows = [
  { problem: "Agent forgets after long conversations", manual: "Find & configure memory flush + decay scoring", clawdup: "Pre-configured" },
  { problem: "Search returns garbage results", manual: "Set up hybrid search with QMD", clawdup: "Pre-configured" },
  { problem: "Agent finds info but ignores it", manual: "Write boot sequence in AGENTS.md", clawdup: "Included" },
  { problem: "Compaction kills context", manual: "Build handover protocol + hourly summaries", clawdup: "Included" },
  { problem: "System prompt bloated (51 skills)", manual: "Audit skills, cut to 32, save 3,358 tokens", clawdup: "Ships curated" },
];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-16 text-center">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Clawd Up
        </h1>
        <p className="text-xl text-accent font-medium">5 Days of Debugging → 5 Minutes of Setup</p>
        <p className="text-muted max-w-lg mx-auto">
          A developer spent 5 days fixing her OpenClaw agent&apos;s memory, boot sequence, and prompt bloat.
          Clawd Up ships with all of it pre-configured. One install command.
        </p>
      </div>

      {/* Social proof bar */}
      <div className="flex justify-center gap-8 text-sm">
        <div className="bg-card rounded-lg px-4 py-2 border border-border">
          <span className="text-accent font-bold text-lg">77K</span>
          <span className="text-muted ml-1">views on that debugging article</span>
        </div>
        <div className="bg-card rounded-lg px-4 py-2 border border-border">
          <span className="text-accent font-bold text-lg">1.4K</span>
          <span className="text-muted ml-1">bookmarks — because everyone hits these walls</span>
        </div>
      </div>

      {/* Pain point feature blocks */}
      <div className="space-y-4 text-left max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center">What She Had to Fix Manually</h2>
        {painPoints.map((p) => (
          <div key={p.title} className="bg-card rounded-xl p-5 border border-border">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-muted text-sm mt-1">
              <span className="text-red-400">The problem:</span> {p.problem}
            </p>
            <p className="text-sm mt-1">
              <span className="text-accent">Clawd Up:</span> {p.solution}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="max-w-3xl mx-auto text-left">
        <h2 className="text-2xl font-bold text-center mb-4">Manual Setup vs Clawd Up</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted font-medium">Problem</th>
                <th className="text-left py-2 pr-4 text-muted font-medium">Manual Fix</th>
                <th className="text-left py-2 text-muted font-medium">Clawd Up</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.problem} className="border-b border-border/50">
                  <td className="py-2 pr-4">{row.problem}</td>
                  <td className="py-2 pr-4 text-muted">{row.manual}</td>
                  <td className="py-2 text-accent font-medium">{row.clawdup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-muted text-sm mt-3">
          11,887 → 8,529 tokens. 51 → 32 skills. 5 days → 5 minutes.
        </p>
      </div>

      {/* Agents */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your AI Team</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {agents.map((a) => (
            <div key={a.name} className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">{a.icon}</div>
              <h3 className="font-semibold text-lg">{a.name}</h3>
              <p className="text-muted text-sm mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid gap-4 sm:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className="bg-card rounded-xl p-6 border border-border text-left">
            <h3 className="font-semibold text-lg">{t.name}</h3>
            <p className="text-2xl font-bold text-accent mt-1">{t.price}<span className="text-sm text-muted font-normal">/mo</span></p>
            <p className="text-muted text-sm mt-1">{t.desc}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="bg-accent text-black font-semibold px-8 py-3 rounded-lg text-lg hover:opacity-90 transition-opacity cursor-pointer"
      >
        Get Started
      </button>
    </div>
  );
}
