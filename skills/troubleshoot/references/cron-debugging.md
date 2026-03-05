# Cron Debugging Guide

Step-by-step commands for diagnosing cron issues. Run each command and compare output to the "Expected" line.

---

## List All Cron Jobs

```bash
openclaw cron list
```
**Expected:** A table or list of all registered cron jobs with columns for: job ID, schedule, status, last run, model.
**If empty:** No crons are configured. You need to create them.
**If error:** Gateway may not be running. Check with `openclaw gateway status`.

---

## Check a Specific Job's Last Run

```bash
openclaw cron runs <jobId>
```
Replace `<jobId>` with the actual job ID from `openclaw cron list`.

**Expected:** Shows recent run history with timestamps, duration, and status (ok/failed).
**If no runs:** The job has never triggered. Check the schedule and timezone.
**If "failed":** Look at the error message in the output.

---

## Check Journal Logs for Cron Errors

```bash
journalctl -u openclaw --since "1 hour ago" | grep -i "cron\|error\|fail" | tail -20
```
**Expected:** No lines (clean run). If lines appear, read the error messages.

**Common errors and meanings:**
- `"already-running"` -- A previous run is still active (stuck lock). Fix: `openclaw gateway restart`
- `"model not found"` -- Model name is wrong or not in allowlist. Check openclaw.json.
- `"unauthorized"` or `"401"` -- API key is invalid or expired. Check env vars.
- `"timeout"` -- Model took too long. Consider a faster model or simpler prompt.
- `"ECONNREFUSED"` -- Can't reach the model API. Check internet or local model server.

---

## Force-Run a Cron to Test

```bash
openclaw cron run <jobId>
```
**Expected:** The job runs immediately and shows output or completion status.
**If it works here but not on schedule:** The issue is timing/timezone, not the job itself (see timezone section below).
**If it fails here too:** The issue is with the job config, model, or prompt.

---

## Check Model Allowlist

```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
c = json.load(open(f))
models = c.get('agents', {}).get('defaults', {}).get('models', {})
if models:
    print('Allowed models:')
    for m in models:
        print(f'  - {m}')
else:
    print('No model allowlist found (all models may be allowed)')
"
```
**Expected:** Lists the allowed models. Your cron's model must be in this list.

---

## Check for Stuck "already-running" Locks

```bash
journalctl -u openclaw --since "2 hours ago" | grep -i "already-running"
```
**Expected:** No output means no stuck locks.
**If output:** One or more jobs are stuck.

**Fix:**
```bash
openclaw gateway restart
```
Then verify:
```bash
openclaw cron list
```
**Expected:** All jobs show "idle" or "waiting", not "already-running".

---

## Check Cron Timezone

Cron times are in the timezone configured in OpenClaw or the system timezone.

1. Check system timezone:
```bash
timedatectl | grep "Time zone"
```

2. Check OpenClaw timezone config:
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
c = json.load(open(f))
tz = c.get('timezone', 'NOT SET (using system timezone)')
print(f'OpenClaw timezone: {tz}')
"
```

3. Check current time in both:
```bash
date
# If OpenClaw has a different timezone:
# TZ=<openclaw_timezone> date
```

**Expected:** Both times match your expectations. If OpenClaw timezone differs from system timezone, cron schedules follow the OpenClaw timezone.

---

## Full Cron Diagnostic Sequence

Run all of these in order for a complete diagnosis:

```bash
# 1. Is gateway running?
openclaw gateway status

# 2. List all jobs
openclaw cron list

# 3. Any stuck jobs?
journalctl -u openclaw --since "2 hours ago" | grep -i "already-running" | head -5

# 4. Any recent errors?
journalctl -u openclaw --since "2 hours ago" | grep -i "cron.*error\|cron.*fail" | tail -10

# 5. System timezone
timedatectl | grep "Time zone"

# 6. Current time
date

# 7. Model auth
env | grep -i "_API_KEY" | sed 's/=.*/=<set>/'
```

Report the output of all 7 commands. This gives a complete picture of cron health.
