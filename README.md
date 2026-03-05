# Clawd Up

A multi-agent system for solo founders. Three AI agents (Scout, Researcher, Operator) work together to find opportunities, validate them, and manage your pipeline — on autopilot. Built on [OpenClaw](https://openclaw.ai).

## What You Get

- **Scout agent** — Scans Reddit, X, and HN for demand signals. Filters for real pain with wallets attached, not just interesting trends.
- **Researcher agent** — Runs 5S deep dives (Signal, Size, Shape, Speed, Stress Test) on promising opportunities. Finds reasons NOT to build.
- **Operator agent** — Your central coordinator. Morning briefs, signal triage, pipeline management, nightly builds.
- **Cron system** — 5 pre-configured automated jobs: morning brief, signal scanning, triage, system review, nightly build.
- **Pipeline** — Track opportunities from raw signal → validation → build decision. Scoring rubric included.
- **Memory system** — Working memory, daily notes, and a permanent vault. Your agents get smarter over time through the correction loop.

## Requirements

- Node.js 18+
- [OpenClaw](https://openclaw.ai) installed
- An Anthropic API key (set in OpenClaw config)

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/Jmee67/clawd-up/main/install.sh | bash
```

Or clone and run manually:

```bash
git clone https://github.com/Jmee67/clawd-up.git ~/.openclaw/clawdup
cd ~/.openclaw/clawdup
bash install.sh
```

## Customization

### Edit your profile

Copy `templates/USER.md.template` to your workspace as `USER.md`. Replace `{{YOUR_NAME}}` and `{{YOUR_TIMEZONE}}` with your details. Add your context and working style.

### Customize agent personalities

Each agent has a `SOUL.md` in `agents/`. Edit these to change how your agents think, what they prioritize, and what they refuse to do. The "Never Do This" lists are the most valuable part — add your own corrections as you work with them.

### Change cron schedules

Edit the JSON files in `crons/`. Each has a `schedule` (cron expression) and `timezone` field. See `crons/README.md` for details.

### Add new crons

Create a new JSON file in `crons/` following the existing format, then run:

```bash
node scripts/register-crons.js
```

## File Structure

```
clawd-up/
├── install.sh              # Installer (OpenClaw check, setup wizard, cron registration)
├── setup.js                # Interactive setup wizard
├── agents/
│   ├── scout/SOUL.md       # Scout personality and instructions
│   ├── researcher/SOUL.md  # Researcher personality and instructions
│   └── operator/SOUL.md    # Operator personality and instructions
├── templates/
│   ├── AGENTS.md           # Workspace rules (correction loop, memory, safety)
│   ├── HEARTBEAT.md        # Heartbeat priority order and nightly build guide
│   ├── PIPELINE.md         # Pipeline stages and tracking template
│   ├── RUBRIC.md           # Opportunity scoring rubric (5 dimensions, /25)
│   ├── USER.md.template    # Your profile (fill in and rename)
│   └── MEMORY.md.template  # Working memory scaffold
├── crons/                  # Automated job configs (see crons/README.md)
├── memory/vault/           # Permanent knowledge store
└── scripts/
    ├── register-crons.js   # Register crons with OpenClaw gateway
    └── license.js          # License validation
```

## Support

Questions or issues: [GitHub Issues](https://github.com/Jmee67/clawd-up/issues)
