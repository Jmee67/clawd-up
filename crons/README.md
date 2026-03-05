# Cron Jobs

Automated tasks that run on a schedule via OpenClaw's cron system.

## Jobs

| File | Default Schedule | Agent | Purpose |
|------|-----------------|-------|---------|
| `morning-brief.json` | 8am daily | Operator | Pipeline status, overnight signals, recommendations |
| `signal-scan.json` | Every 6h | Scout | Reddit/X/HN demand signal scanning |
| `triage.json` | 7pm daily | Operator | Score and promote/archive signals |
| `nightly-build.json` | 11pm daily | Operator | Ship code, fix bugs, run hygiene |
| `system-review.json` | 9pm daily | Operator | Agent health, memory maintenance |

## Customizing

### Change schedule

Edit the `schedule` field (standard cron expression) and `timezone` field in any JSON file.

```
"schedule": "0 8 * * *"     → 8:00 AM
"schedule": "0 */6 * * *"   → Every 6 hours
"schedule": "30 9 * * 1-5"  → 9:30 AM weekdays only
```

### Change timezone

Replace `{{TIMEZONE}}` with your IANA timezone (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`).

### Add delivery

To receive cron output via Telegram, add:
```json
"channel": "telegram",
"chat_id": "YOUR_CHAT_ID"
```

### Add a new cron

Create a new JSON file in this directory following the same format. Then re-register:

```bash
node scripts/register-crons.js
```

### Re-register after changes

```bash
node ~/.openclaw/clawdup/scripts/register-crons.js
```

Or if gateway isn't running yet, start it first:
```bash
openclaw gateway start
node ~/.openclaw/clawdup/scripts/register-crons.js
```
