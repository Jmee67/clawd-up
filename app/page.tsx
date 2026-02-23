"use client";

import { useState } from "react";
import Landing from "./components/Landing";
import Onboarding from "./components/Onboarding";
import InstallCommand from "./components/InstallCommand";

export interface FormData {
  name: string;
  role: string;
  priorities: string;
  timezone: string;
  commStyle: "direct" | "casual" | "formal";
  annoyances: string;
  channel: "telegram" | "discord";
  telegramToken: string;
  telegramChatId: string;
  discordWebhook: string;
  provider: "anthropic" | "openai" | "google";
  apiKey: string;
  tier: "starter" | "pro";
}

const defaultForm: FormData = {
  name: "",
  role: "",
  priorities: "",
  timezone: "UTC",
  commStyle: "direct",
  annoyances: "",
  channel: "telegram",
  telegramToken: "",
  telegramChatId: "",
  discordWebhook: "",
  provider: "anthropic",
  apiKey: "",
  tier: "starter",
};

export default function Home() {
  const [page, setPage] = useState<"landing" | "onboarding" | "install">("landing");
  const [form, setForm] = useState<FormData>(defaultForm);

  if (page === "landing") {
    return <Landing onStart={() => setPage("onboarding")} />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {page === "onboarding" && (
          <Onboarding
            form={form}
            setForm={setForm}
            onComplete={() => setPage("install")}
            onBack={() => setPage("landing")}
          />
        )}
        {page === "install" && <InstallCommand form={form} onBack={() => setPage("onboarding")} />}
      </div>
    </main>
  );
}
