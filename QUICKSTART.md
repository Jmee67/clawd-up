# Clawd Up — Quickstart

Everything you need in 4 commands.

## Prerequisites

- A VPS (DigitalOcean $12/mo droplet recommended — Ubuntu 22.04+)
- A Telegram bot token ([create one here](https://t.me/BotFather))
- An API key from Anthropic, OpenAI, or Google

## Install

```bash
# 1. Install OpenClaw
curl -fsSL https://get.openclaw.ai | bash

# 2. Clone Clawd Up
git clone https://github.com/Jmee67/clawd-up.git
cd clawd-up

# 3. Run the installer (interactive wizard + full setup)
bash install.sh
```

That's it. Your first daily brief arrives at 8am your timezone.

## What Happens

The installer will:
1. Ask you some questions (name, timezone, API key, Telegram bot, what you're working on)
2. Set up your AI agent team (Scout finds opportunities, Researcher validates them, Operator runs the pipeline)
3. Register cron jobs so everything runs automatically
4. Send a test message to confirm notifications work

## After Install

```bash
# Check agent status
openclaw gateway status

# View your pipeline
cat ~/.openclaw/workspace/PIPELINE.md

# Check cron jobs
openclaw cron list
```

## Troubleshooting

- **OpenClaw not found?** Make sure `~/.openclaw/bin` is in your PATH. Run `source ~/.bashrc` or restart your shell.
- **No test message?** Double-check your Telegram bot token and chat ID. You can get your chat ID by messaging [@userinfobot](https://t.me/userinfobot).
- **Node.js too old?** You need Node 18+. Install with `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs`
