# 🦞 Clawd Up

AI business ops team in one command. Powered by [OpenClaw](https://github.com/openclaw/openclaw).

## What You Get

| | Free | Starter ($29/mo) | Pro ($49/mo) |
|---|---|---|---|
| **Scout** — signal scanning | ✅ | ✅ | ✅ |
| **Researcher** — deep dives | — | ✅ | ✅ |
| **Operator** — pipeline management | — | — | ✅ |
| Signal scans | 2x daily | 2x daily + web | Unlimited |
| Pipeline entries | 5 | 25 | Unlimited |
| Deep dives | — | ✅ | ✅ |
| Daily briefs | — | ✅ | ✅ |
| Immune system | — | — | ✅ |
| Nightly builds | — | — | ✅ |
| Signal triage | — | — | ✅ |

## Quick Start

```bash
git clone https://github.com/clawdup/clawdup
cd clawdup
node setup.js
```

The wizard asks for your name, timezone, model provider, and tier. Paid tiers require a license key from [lemonsqueezy.com](https://lemonsqueezy.com).

## Requirements

- [OpenClaw](https://github.com/openclaw/openclaw) installed
- Node.js 18+
- API key for your chosen model provider (Anthropic, OpenAI, or Google)
- Telegram bot or Discord webhook for notifications

## Agents

### Scout (Free+)
Scans X/Twitter and Reddit for business opportunities, demand signals, and market trends. Runs morning and evening signal scans.

### Researcher (Starter+)
Goes deep on pipeline opportunities. Writes 5S deep dives (Signal, Size, Shape, Speed, Stress Test) with competitive analysis, market sizing, and risk assessment.

### Operator (Pro)
Runs the operation. Morning briefs, signal triage, pipeline management, nightly builds, agent coordination. The COO you didn't hire.

## Immune System (Pro)

Automated quality checks that prevent agent drift:
- **Validator** — checks signal files and deep dives for required fields and completeness
- **Pipeline Guard** — enforces stage transitions and gates (no skipping, deep dive required for scoring)
- **Drift Detector** — flags agents with no output, calibration issues
- **Cost Monitor** — tracks API token usage per agent, alerts on budget overruns

## Supported Models

| Agent | Anthropic | OpenAI | Google |
|-------|-----------|--------|--------|
| Scout | Claude Sonnet | GPT-4o-mini | Gemini Flash |
| Researcher | Claude Sonnet | GPT-4o | Gemini Pro |
| Operator | Claude Opus | GPT-4o | Gemini Pro |

## Structure

```
clawdup/
├── setup.js                  # Interactive setup wizard
├── agents/
│   ├── scout/                # Signal scanning configs
│   ├── researcher/           # Deep dive configs
│   └── operator/             # Pipeline management configs
├── crons/                    # Cron job templates
├── immune-system/            # Quality & drift checks
├── scripts/
│   ├── model-map.js          # Model provider mapping
│   └── license.js            # Tier & license validation
├── templates/                # Pipeline, rubric, memory templates
└── skills/                   # Shared skill definitions
```

## License Validation

Paid tiers validate against LemonSqueezy API:
- 24-hour cache so you're not hitting the API every session
- Offline grace period if API is unreachable
- Falls back to free tier if license is invalid

```bash
# Check tier info
node scripts/license.js info

# Validate a key
node scripts/license.js validate <your-key>

# Check feature access
node scripts/license.js check-feature starter deep-dives
```

## License

MIT
