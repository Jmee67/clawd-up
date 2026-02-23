"use client";

import { useState } from "react";
import type { FormData } from "../page";

const TIMEZONES = [
  "UTC","America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
  "Europe/London","Europe/Berlin","Europe/Paris","Asia/Tokyo","Asia/Shanghai",
  "Asia/Kolkata","Australia/Sydney","Pacific/Auckland",
];

const STEPS = ["About You", "Preferences", "Notifications", "Model Provider", "Tier"];

interface Props {
  form: FormData;
  setForm: (f: FormData) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function Onboarding({ form, setForm, onComplete, onBack }: Props) {
  const [step, setStep] = useState(0);

  const update = (partial: Partial<FormData>) => setForm({ ...form, ...partial });

  const canNext = (): boolean => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 2) {
      if (form.channel === "telegram") return form.telegramToken.trim().length > 0 && form.telegramChatId.trim().length > 0;
      return form.discordWebhook.trim().length > 0;
    }
    if (step === 3) return form.apiKey.trim().length > 0;
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent";
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-border"}`} />
            <p className={`text-xs mt-1 ${i === step ? "text-accent" : "text-muted"}`}>{s}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-8 border border-border min-h-[320px]">
        {/* Step 1: About You */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold">About You</h2>
            <div>
              <label className={labelClass}>Name *</label>
              <input className={inputClass} value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label className={labelClass}>What do you do?</label>
              <input className={inputClass} value={form.role} onChange={(e) => update({ role: e.target.value })} placeholder="e.g. Indie hacker building SaaS tools" />
            </div>
            <div>
              <label className={labelClass}>Current priorities</label>
              <input className={inputClass} value={form.priorities} onChange={(e) => update({ priorities: e.target.value })} placeholder="e.g. Finding first 10 customers" />
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold">Preferences</h2>
            <div>
              <label className={labelClass}>Timezone</label>
              <select className={inputClass} value={form.timezone} onChange={(e) => update({ timezone: e.target.value })}>
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Communication style</label>
              <div className="flex gap-3">
                {(["direct", "casual", "formal"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => update({ commStyle: s })}
                    className={`flex-1 py-2 rounded-lg border cursor-pointer transition-colors ${form.commStyle === s ? "border-accent text-accent bg-accent/10" : "border-border text-muted hover:border-muted"}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>What annoys you about AI assistants? <span className="text-muted">(optional)</span></label>
              <input className={inputClass} value={form.annoyances} onChange={(e) => update({ annoyances: e.target.value })} placeholder="e.g. Too verbose, too cautious..." />
            </div>
          </div>
        )}

        {/* Step 3: Notifications */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <div>
              <label className={labelClass}>Channel</label>
              <div className="flex gap-3">
                {(["telegram", "discord"] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => update({ channel: ch })}
                    className={`flex-1 py-2 rounded-lg border cursor-pointer transition-colors ${form.channel === ch ? "border-accent text-accent bg-accent/10" : "border-border text-muted hover:border-muted"}`}
                  >
                    {ch.charAt(0).toUpperCase() + ch.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {form.channel === "telegram" ? (
              <>
                <div>
                  <label className={labelClass}>Bot Token *</label>
                  <input className={inputClass} value={form.telegramToken} onChange={(e) => update({ telegramToken: e.target.value })} placeholder="123456:ABC-DEF..." />
                  <p className="text-xs text-muted mt-1">
                    Get one from <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@BotFather</a>
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Chat ID *</label>
                  <input className={inputClass} value={form.telegramChatId} onChange={(e) => update({ telegramChatId: e.target.value })} placeholder="e.g. -1001234567890" />
                </div>
              </>
            ) : (
              <div>
                <label className={labelClass}>Discord Webhook URL *</label>
                <input className={inputClass} value={form.discordWebhook} onChange={(e) => update({ discordWebhook: e.target.value })} placeholder="https://discord.com/api/webhooks/..." />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Model Provider */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold">Model Provider</h2>
            <div>
              <label className={labelClass}>Provider</label>
              <div className="flex gap-3">
                {(["anthropic", "openai", "google"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => update({ provider: p })}
                    className={`flex-1 py-2 rounded-lg border cursor-pointer transition-colors ${form.provider === p ? "border-accent text-accent bg-accent/10" : "border-border text-muted hover:border-muted"}`}
                  >
                    {p === "openai" ? "OpenAI" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>API Key *</label>
              <input type="password" className={inputClass} value={form.apiKey} onChange={(e) => update({ apiKey: e.target.value })} placeholder="sk-..." />
            </div>
          </div>
        )}

        {/* Step 5: Tier */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { id: "starter" as const, name: "Clawd Up", price: "$19", period: "one-time", features: ["All 3 agents (Scout, Researcher, Operator)", "Pre-configured memory + boot sequence", "Curated skills, crons, templates", "Own it forever"] },
                { id: "pro" as const, name: "Clawd Up + Updates", price: "$19 + $9", period: "/mo", features: ["Everything in Clawd Up", "Weekly config updates from our live system", "New agent SOULs + skills as we ship them", "Private GitHub repo access"] },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => update({ tier: t.id })}
                  className={`text-left p-5 rounded-xl border cursor-pointer transition-colors ${form.tier === t.id ? "border-accent bg-accent/10" : "border-border hover:border-muted"}`}
                >
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xl font-bold text-accent">{t.price}<span className="text-xs text-muted"> {t.period}</span></p>
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {t.features.map((f) => <li key={f}>✓ {f}</li>)}
                  </ul>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted text-center">You can also try free — just skip this step and run the install command.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={back} className="text-muted hover:text-foreground transition-colors cursor-pointer">
          ← Back
        </button>
        <button
          onClick={next}
          disabled={!canNext()}
          className="bg-accent text-black font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {step === STEPS.length - 1 ? "Generate Install Command" : "Next"}
        </button>
      </div>
    </div>
  );
}
