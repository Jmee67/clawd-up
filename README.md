# 🦞 Clawd Up

AI business ops team in one command. Powered by [OpenClaw](https://github.com/openclaw/openclaw).

## What You Get

- **Scout Agent** — scans X/Twitter and Reddit for business opportunities, demand signals, and market trends
- **Automated Cron Jobs** — daily briefs, signal scans, web research on your schedule
- **Pipeline System** — track opportunities from signal → validation → build decision
- **Scoring Rubric** — 5-dimension framework to evaluate opportunities objectively

## Quick Start

```bash
git clone https://github.com/clawdup/clawdup
cd clawdup
node setup.js
```

The wizard asks for your name, timezone, notification channel, and model provider, then generates all configs into your OpenClaw workspace.

## Requirements

- [OpenClaw](https://github.com/openclaw/openclaw) installed
- Node.js 18+
- API key for your chosen model provider (Anthropic, OpenAI, or Google)
- Telegram bot or Discord webhook for notifications

## Supported Models

| Agent | Anthropic | OpenAI | Google |
|-------|-----------|--------|--------|
| Scout | Claude Sonnet | GPT-4o-mini | Gemini Flash |
| Researcher | Claude Sonnet | GPT-4o | Gemini Pro |
| Operator | Claude Opus | GPT-4o | Gemini Pro |

## Structure

```
clawdup/
├── setup.js              # Interactive setup wizard
├── agents/scout/         # Scout agent configs
├── crons/                # Cron job templates
├── templates/            # Pipeline, rubric, memory templates
└── scripts/model-map.js  # Model provider mapping
```

## License

MIT
