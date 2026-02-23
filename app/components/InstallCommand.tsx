"use client";

import { useState, useMemo } from "react";
import type { FormData } from "../page";

export default function InstallCommand({ form, onBack }: { form: FormData; onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  const configJson = useMemo(() => {
    const config: Record<string, string> = {
      name: form.name,
      role: form.role,
      priorities: form.priorities,
      timezone: form.timezone,
      comm_style: form.commStyle,
      annoyances: form.annoyances,
      channel: form.channel,
      provider: form.provider,
      api_key: form.apiKey,
      tier: form.tier,
    };
    if (form.channel === "telegram") {
      config.telegram_token = form.telegramToken;
      config.telegram_chat_id = form.telegramChatId;
    } else {
      config.discord_webhook = form.discordWebhook;
    }
    return config;
  }, [form]);

  const b64 = useMemo(() => {
    if (typeof window === "undefined") return "";
    return btoa(JSON.stringify(configJson));
  }, [configJson]);

  const command = `curl -fsSL https://raw.githubusercontent.com/Jmee67/clawd-up/main/install.sh | bash -s -- --config "${b64}"`;

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">You&apos;re All Set! 🚀</h1>
        <p className="text-muted">Run this command to install Clawd Up with your config:</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted font-mono">Install command</span>
          <button onClick={copy} className="text-xs text-accent hover:underline cursor-pointer">
            {copied ? "Copied ✓" : "Copy to clipboard"}
          </button>
        </div>
        <pre className="text-sm text-accent font-mono whitespace-pre-wrap break-all leading-relaxed">
          {command}
        </pre>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h3 className="font-semibold">Or install manually:</h3>
        <pre className="text-sm font-mono text-muted whitespace-pre-wrap break-all">
{`git clone https://github.com/Jmee67/clawd-up.git
cd clawd-up
./install.sh`}
        </pre>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-lg">What happens next</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="text-accent text-lg">🕗</span>
            <div>
              <p className="font-medium">Your agents start scanning at 8am {form.timezone}</p>
              <p className="text-muted">Scout begins hunting for opportunities immediately</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-accent text-lg">📨</span>
            <div>
              <p className="font-medium">First daily brief arrives in your {form.channel === "telegram" ? "Telegram" : "Discord"}</p>
              <p className="text-muted">Curated opportunities, research, and action items</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-accent text-lg">📋</span>
            <div>
              <p className="font-medium">Check PIPELINE.md to track opportunities</p>
              <p className="text-muted">Your living document of leads, research, and next steps</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onBack} className="text-muted hover:text-foreground transition-colors cursor-pointer">
        ← Back to form
      </button>
    </div>
  );
}
