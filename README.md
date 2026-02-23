# Clawd Up

AI business ops team that finds, evaluates, and prioritizes startup opportunities while you build. Powered by [OpenClaw](https://github.com/openclaw/openclaw).

## What It Does

Clawd Up runs three specialized AI agents that work together as your ops layer:

- **Scout** scans X/Twitter and Reddit for demand signals — real pain points where people are spending money on inferior solutions. Not trend-watching. Demand detection.
- **Researcher** writes rigorous 5S deep dives (Signal, Size, Shape, Speed, Stress Test) on opportunities. Designed to find reasons NOT to build, so the ones that survive are worth your time.
- **Operator** runs the pipeline. Morning briefs, signal triage, nightly builds, agent coordination. Kills stale opportunities, enforces stage gates, keeps everything moving.

Each agent has a research-backed expert identity — not a generic "you are a helpful assistant" prompt, but a detailed professional background that produces measurably better output (based on [ExpertPrompting research](https://arxiv.org/abs/2305.14688)).

## Pricing

### Clawd Up — $19 one-time
Buy once, own it forever. You get the full agent team:
- All 3 agents (Scout, Researcher, Operator)
- Pre-configured memory, boot sequence, handover protocol
- Curated skills — 28% leaner than default OpenClaw
- All cron jobs, templates, and pipeline system
- Immune system, nightly builds, signal triage
- Telegram or Discord notifications

### Weekly Updates — +$9/mo (optional)
Stay current with our live system:
- Weekly config updates pushed to a private GitHub repo
- New agent SOULs as we improve them
- New skills, vetted and tested on our own system
- New signal sources and kill patterns
- Cancel anytime

## Quick Start

**Requirements:**
- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- Node.js 18+
- API key for Anthropic, OpenAI, or Google
- Telegram bot token or Discord webhook for notifications

**Install:**
```bash
git clone https://github.com/Jmee67/clawd-up.git
cd clawd-up
node setup.js
```

The setup wizard asks for:
1. Your name and timezone
2. Model provider and API key
3. Notification channel (Telegram/Discord)
4. Your plan (Clawd Up / Clawd Up + Updates)

Setup copies agent configs, cron schedules, and templates into your OpenClaw workspace. Agents start on the next heartbeat.

## How It Works

```
X/Twitter ──→ Scout ──→ Demand Signals ──→ Pipeline
Reddit   ──↗                                  │
                                               ▼
                              Researcher ──→ 5S Deep Dive
                                               │
                                               ▼
                              Operator ──→ Score/Kill/Build
                                               │
                                               ▼
                                         Daily Brief → You
```

**Signal → Research → Decision → Build.** Each stage has gates. No opportunity advances without evidence. Stale items get killed automatically.

## Agent Architecture

Each agent ships with:
- **SOUL.md** — Deep expert identity (not generic role labels). Scout thinks like a demand signal analyst. Researcher thinks like a due diligence lead. Operator thinks like a COO.
- **HEARTBEAT.md** — Scheduled tasks and monitoring duties
- **TOOLS.md** — Agent-specific tool configuration

The Operator uses a delegation protocol for sub-agent spawning:
- Context is passed inline (no large file reads)
- Model is matched to task complexity (Sonnet for research, Opus for code)
- Every sub-agent returns a structured completion signal
- Stalled agents get steered before killed (preserves partial work)

## Immune System (Pro)

Quality checks that run automatically:
- **Validator** — signal files and deep dives have required fields
- **Pipeline Guard** — stage transitions follow gates (deep dive required before scoring)
- **Drift Detector** — flags agents with no output or calibration issues
- **Cost Monitor** — tracks token usage per agent, alerts on budget overruns

## Supported Models

| Agent | Anthropic | OpenAI | Google |
|-------|-----------|--------|--------|
| Scout | Claude Sonnet | GPT-4o-mini | Gemini Flash |
| Researcher | Claude Sonnet | GPT-4o | Gemini Pro |
| Operator | Claude Opus | GPT-4o | Gemini Pro |

## Project Structure

```
clawd-up/
├── setup.js              # Interactive setup wizard
├── agents/
│   ├── scout/            # Signal scanning agent
│   ├── researcher/       # Deep dive analysis agent
│   └── operator/         # Pipeline management agent
├── crons/                # Cron job templates (signal scans, briefs, triage)
├── immune-system/        # Quality & drift detection checks
├── scripts/
│   ├── model-map.js      # Multi-provider model mapping
│   └── license.js        # Tier & license validation
├── templates/            # Pipeline, rubric, memory templates
└── skills/               # Shared skill definitions
```

## License

MIT
