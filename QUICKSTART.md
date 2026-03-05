# Quick Start — First 10 Minutes

## 1. Install

```bash
curl -fsSL https://raw.githubusercontent.com/Jmee67/clawd-up/main/install.sh | bash
```

The installer checks for Node.js and OpenClaw, runs the setup wizard, and registers your cron jobs.

## 2. Edit your profile

```bash
cp templates/USER.md.template ~/.openclaw/workspace/USER.md
```

Open `USER.md` and fill in:
- Your name (replaces `{{YOUR_NAME}}` across agent files)
- Your timezone (e.g., `Europe/London`, `America/New_York`)
- What you're building and looking for
- How you prefer to work with your agents

## 3. Set your timezone in crons

Open each file in `crons/` and replace `{{TIMEZONE}}` with your IANA timezone. Then re-register:

```bash
node scripts/register-crons.js
```

## 4. Start OpenClaw

```bash
openclaw gateway start
```

Check it's running:

```bash
openclaw gateway status
```

## 5. Wait for your first brief

Your morning brief cron fires at 8am in your timezone. To trigger it immediately:

```bash
openclaw cron run morning-brief
```

## 6. Review and customize

Once you've seen the first brief, you'll know what to tune:

- **Too noisy?** Edit Scout's SOUL.md to tighten the signal filters.
- **Wrong focus?** Update your USER.md context section.
- **Bad timing?** Change cron schedules in `crons/`.
- **Missing something?** Add a new cron (see `crons/README.md`).

## What happens automatically

| Time | What |
|------|------|
| Every 6h | Scout scans Reddit, X, HN for demand signals |
| 8am | Operator delivers morning brief |
| 7pm | Operator triages and scores today's signals |
| 9pm | Operator runs system health check |
| 11pm | Operator runs nightly build session |

All times are in your configured timezone.
