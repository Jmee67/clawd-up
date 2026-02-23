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

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-16 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Clawd Up
        </h1>
        <p className="text-xl text-accent font-medium">AI Business Ops in One Command</p>
        <p className="text-muted max-w-lg mx-auto">
          Deploy AI agents that scan for opportunities, research competitors, and manage your pipeline — all from a single install command.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {agents.map((a) => (
          <div key={a.name} className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl mb-3">{a.icon}</div>
            <h3 className="font-semibold text-lg">{a.name}</h3>
            <p className="text-muted text-sm mt-1">{a.desc}</p>
          </div>
        ))}
      </div>

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
