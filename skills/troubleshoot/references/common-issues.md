# Common Issues - Diagnostic Trees

Each issue has a numbered diagnostic tree. Run the commands in order. Stop when you find the problem.

---

## Cron Issues

### Issue 1: Morning brief didn't arrive

**Symptoms:** User says brief is missing, no message received, "where's my brief"

**Tree:**

1. Check if the cron job exists:
```bash
openclaw cron list | grep -i "brief\|morning"
```
**Expected:** A line showing the brief cron job with its schedule.
**If missing:** The cron job was never created or was deleted. See `recovery-procedures.md` section 3.

2. Check the last run status:
```bash
openclaw cron list
```
**Expected:** Look at the "last run" or "status" column. Should show a recent timestamp and "ok" or "completed".
**If "failed":** Proceed to step 3.
**If "already-running":** See Issue 2.
**If no recent run:** The cron didn't trigger. Check timing (Issue 4).

3. Check journal logs for errors:
```bash
journalctl -u openclaw --since "2 hours ago" | grep -i "brief\|error\|fail" | tail -20
```
**Expected:** No errors related to the brief.
**If model errors:** See Issue 18 (model auth failing).
**If timeout errors:** The model took too long. Consider switching to a faster model.

4. Check model authentication:
```bash
env | grep -i "ANTHROPIC_API_KEY\|OPENAI_API_KEY" | head -5
```
**Expected:** At least one API key is set (value will be partially hidden).
**If empty:** The API key environment variable is not set. Add it to your shell profile or OpenClaw config.

---

### Issue 2: Cron shows "already-running"

**Symptoms:** Cron job stuck, shows "already-running", won't execute new runs

**Tree:**

1. Confirm the stuck state:
```bash
openclaw cron list | grep "already-running\|running"
```
**Expected if stuck:** One or more jobs show "already-running" for an extended period.

2. Check how long it's been running:
```bash
journalctl -u openclaw --since "4 hours ago" | grep -i "already-running" | head -5
```
**Expected:** Timestamps show when the lock was first reported.

3. Fix -- restart the gateway to clear locks:
```bash
openclaw gateway restart
```
**Expected:** Gateway stops and starts cleanly. Output shows "started" or similar.

4. Verify the fix:
```bash
openclaw cron list
```
**Expected:** No jobs show "already-running". Jobs should show "idle" or "waiting".

---

### Issue 3: Cron ran but used wrong model

**Symptoms:** Cron output shows wrong model, unexpected behavior, higher costs than expected

**Tree:**

1. Check model configuration:
```bash
cat ~/.openclaw/openclaw.json | python3 -c "import sys,json; c=json.load(sys.stdin); print(json.dumps(c.get('agents',{}).get('defaults',{}).get('models',{}), indent=2))"
```
**Expected:** Shows the allowed models list. The desired model should be in this list.

2. Check the specific cron job's model override:
```bash
openclaw cron list
```
**Expected:** Look for the model column. If a job has a model override, it will show there.

3. Check API key for the desired model:
```bash
# For Anthropic:
env | grep ANTHROPIC_API_KEY | wc -l
# For OpenAI:
env | grep OPENAI_API_KEY | wc -l
# For Ollama (local):
curl -s http://localhost:11434/api/tags 2>/dev/null | head -5
```
**Expected:** At least 1 line for the provider you want. For Ollama, a JSON response listing models.
**If 0 lines:** The API key for that provider is not set. The system may fall back to a different model.

---

### Issue 4: Cron timing is off

**Symptoms:** Crons fire at wrong time, early or late by hours

**Tree:**

1. Check system timezone:
```bash
timedatectl | grep "Time zone"
```
**Expected:** Shows your expected timezone (e.g., `Europe/London`, `America/New_York`).

2. Check current system time:
```bash
date
```
**Expected:** Should match your wall clock time.

3. Check cron job schedule:
```bash
openclaw cron list
```
**Expected:** Cron schedules are in the timezone configured in OpenClaw. Compare with your system timezone.

4. If timezone mismatch, check OpenClaw config:
```bash
cat ~/.openclaw/openclaw.json | python3 -c "import sys,json; c=json.load(sys.stdin); print('Timezone:', c.get('timezone', 'NOT SET'))"
```
**Expected:** Shows a timezone. If "NOT SET", OpenClaw uses the system timezone.

---

## Agent Issues

### Issue 5: Agent not responding

**Symptoms:** Messages to agent get no reply, agent seems dead

**Tree:**

1. Check gateway status:
```bash
openclaw gateway status
```
**Expected:** Shows "running" or "active".
**If not running:** Start it:
```bash
openclaw gateway start
```

2. Check agent config exists:
```bash
ls ~/.openclaw/agents/
```
**Expected:** Lists agent directories. At least one should exist.

3. Check the specific agent's config:
```bash
ls ~/.openclaw/agents/*/
```
**Expected:** Each agent directory should have configuration files.

4. Check model auth:
```bash
env | grep -i "ANTHROPIC_API_KEY\|OPENAI_API_KEY" | wc -l
```
**Expected:** At least 1. If 0, no API keys are set.

5. Check for errors in recent logs:
```bash
journalctl -u openclaw --since "10 min ago" | grep -i "error\|fail\|reject" | tail -10
```
**Expected:** No errors. If errors, read them for clues.

---

### Issue 6: Agent responding but wrong personality

**Symptoms:** Agent tone is wrong, not following SOUL.md, generic responses

**Tree:**

1. Check if SOUL.md exists in the workspace:
```bash
ls ~/.openclaw/workspace/SOUL.md 2>/dev/null && echo "EXISTS" || echo "MISSING"
```
**Expected:** "EXISTS"
**If "MISSING":** Create SOUL.md in the workspace with the desired personality.

2. Check SOUL.md is not empty:
```bash
wc -l ~/.openclaw/workspace/SOUL.md
```
**Expected:** More than 5 lines. If 0 or very few, the file is empty or barely populated.

3. Check the agent's workspace path:
```bash
cat ~/.openclaw/agents/*/config.* 2>/dev/null | head -20
```
**Expected:** Workspace path should point to a directory containing SOUL.md.

---

### Issue 7: Agent losing memory between sessions

**Symptoms:** Agent forgets things from previous conversations, no continuity

**Tree:**

1. Check MEMORY.md exists:
```bash
ls ~/.openclaw/workspace/MEMORY.md 2>/dev/null && echo "EXISTS" || echo "MISSING"
```
**Expected:** "EXISTS"

2. Check MEMORY.md has content:
```bash
wc -l ~/.openclaw/workspace/MEMORY.md
```
**Expected:** Between 1 and 200 lines. If 0, memory is not being written.

3. Check file permissions:
```bash
ls -la ~/.openclaw/workspace/MEMORY.md
```
**Expected:** File should be readable and writable by the openclaw user.

4. Check memory directory:
```bash
ls ~/.openclaw/workspace/memory/ 2>/dev/null | tail -10
```
**Expected:** Daily note files (YYYY-MM-DD.md format). If empty, daily notes are not being written.

5. Check if memory compaction is too aggressive:
```bash
cat ~/.openclaw/workspace/memory/decay.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps(d, indent=2))" 2>/dev/null || echo "No decay.json found"
```
**Expected:** Archive threshold should be around 0.15. If much higher, entries are being archived too soon.

---

### Issue 8: Agent making mistakes it was corrected on

**Symptoms:** Agent repeats errors that were already corrected in a previous session

**Tree:**

1. Check if correction is in SOUL.md:
```bash
grep -i "never" ~/.openclaw/workspace/SOUL.md | head -20
```
**Expected:** A "Never Do This" section with the specific correction listed.
**If missing:** The correction was only in chat history and was lost. Add it to SOUL.md.

2. Check AGENTS.md correction loop:
```bash
grep -i "correction" ~/.openclaw/workspace/AGENTS.md | head -10
```
**Expected:** Instructions on where to write corrections (SOUL.md, TOOLS.md, AGENTS.md, or vault).

3. Check relevant files for the correction:
```bash
grep -ri "never\|don't\|do not\|avoid" ~/.openclaw/workspace/SOUL.md ~/.openclaw/workspace/TOOLS.md ~/.openclaw/workspace/AGENTS.md 2>/dev/null | head -20
```
**Expected:** The specific correction should appear in one of these files.

---

## Pipeline Issues

### Issue 9: Signals not being triaged

**Symptoms:** New signals pile up, no triage happening, signal-triage.json stale

**Tree:**

1. Check if triage cron exists:
```bash
openclaw cron list | grep -i "triage"
```
**Expected:** A triage cron job is listed.
**If missing:** The triage cron was never set up or was deleted.

2. Check signal-triage.json exists:
```bash
ls ~/.openclaw/workspace/signal-triage.json 2>/dev/null && echo "EXISTS" || echo "MISSING"
```
**Expected:** "EXISTS"

3. Check if signal-triage.json is valid JSON:
```bash
python3 -c "import json; json.load(open('$HOME/.openclaw/workspace/signal-triage.json')); print('VALID JSON')" 2>&1
```
**Expected:** "VALID JSON"
**If error:** The file is corrupt. See `recovery-procedures.md` section 4.

4. Check last triage timestamp:
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/workspace/signal-triage.json')
d = json.load(open(f))
if isinstance(d, list):
    entries = d
elif isinstance(d, dict):
    entries = d.get('triaged', d.get('signals', []))
else:
    entries = []
if entries:
    last = entries[-1]
    print('Last entry:', json.dumps(last, indent=2)[:200])
else:
    print('No entries found')
" 2>&1
```
**Expected:** A recent entry. If old, triage is not running.

---

### Issue 10: Pipeline scores showing wrong format

**Symptoms:** Radar charts broken, scores look wrong, key mismatches

**Tree:**

1. Check pipeline.json score format:
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/workspace/pipeline.json')
d = json.load(open(f))
items = d if isinstance(d, list) else d.get('opportunities', [])
for item in items[:3]:
    scores = item.get('scores', item.get('score', {}))
    print(item.get('name', 'unnamed'), ':', list(scores.keys()) if isinstance(scores, dict) else scores)
" 2>&1
```
**Expected keys:** `pain`, `wtp`, `competition`, `reach`, `build` -- each with a value from 0 to 5.
**If different keys:** Scores need to be normalized. Update the scoring to use the correct keys.

2. Check for values outside 0-5 range:
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/workspace/pipeline.json')
d = json.load(open(f))
items = d if isinstance(d, list) else d.get('opportunities', [])
for item in items:
    scores = item.get('scores', item.get('score', {}))
    if isinstance(scores, dict):
        for k, v in scores.items():
            if isinstance(v, (int, float)) and (v < 0 or v > 5):
                print(f'OUT OF RANGE: {item.get(\"name\", \"unnamed\")} -> {k}={v}')
" 2>&1
```
**Expected:** No output (all values in range).

---

### Issue 11: Opportunities stuck in wrong status

**Symptoms:** Pipeline items show wrong status, can't advance, stale statuses

**Tree:**

1. List all statuses in pipeline:
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/workspace/pipeline.json')
d = json.load(open(f))
items = d if isinstance(d, list) else d.get('opportunities', [])
from collections import Counter
statuses = Counter(item.get('status', 'NONE') for item in items)
for s, c in statuses.most_common():
    print(f'{s}: {c}')
" 2>&1
```
**Expected:** Statuses like `new`, `evaluating`, `deep-dive`, `building`, `killed`, `live`.

2. Find the stuck item:
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/workspace/pipeline.json')
d = json.load(open(f))
items = d if isinstance(d, list) else d.get('opportunities', [])
for item in items:
    print(f'{item.get(\"name\", \"unnamed\"):30s} status={item.get(\"status\", \"NONE\")}')
" 2>&1
```
**Expected:** Shows all items with their statuses. Identify the stuck one.

3. To fix manually, edit pipeline.json and update the status field. Always validate after:
```bash
python3 -c "import json, os; json.load(open(os.path.expanduser('~/.openclaw/workspace/pipeline.json'))); print('VALID')"
```

---

## Memory Issues

### Issue 12: MEMORY.md too large (>200 lines)

**Symptoms:** MEMORY.md over 200 lines, agent context getting bloated, slow responses

**Tree:**

1. Check MEMORY.md size:
```bash
wc -l ~/.openclaw/workspace/MEMORY.md
```
**Expected:** Under 200 lines.
**If over 200:** Needs compaction.

2. Check if memory maintenance cron exists:
```bash
openclaw cron list | grep -i "memory\|compact\|summariz"
```
**Expected:** A memory maintenance cron job.
**If missing:** Set up a memory compaction cron or run manual compaction.

3. Manual compaction -- back up first:
```bash
cp ~/.openclaw/workspace/MEMORY.md ~/.openclaw/workspace/MEMORY.md.bak.$(date +%Y%m%d)
```

4. Then truncate to keep only the most recent entries (keep last 100 lines):
```bash
tail -100 ~/.openclaw/workspace/MEMORY.md > /tmp/memory_trimmed.md
cp /tmp/memory_trimmed.md ~/.openclaw/workspace/MEMORY.md
```

5. Verify:
```bash
wc -l ~/.openclaw/workspace/MEMORY.md
```
**Expected:** Under 200 lines.

---

### Issue 13: Daily notes not being written

**Symptoms:** No files in memory/ directory, gaps in daily notes

**Tree:**

1. Check memory directory exists:
```bash
ls -la ~/.openclaw/workspace/memory/ 2>/dev/null | head -5
```
**Expected:** Directory exists with .md files.
**If directory missing:**
```bash
mkdir -p ~/.openclaw/workspace/memory
```

2. Check permissions:
```bash
ls -la ~/.openclaw/workspace/memory/ | head -3
```
**Expected:** Directory is writable by the openclaw user.

3. Check recent daily notes:
```bash
ls -t ~/.openclaw/workspace/memory/*.md 2>/dev/null | head -5
```
**Expected:** Recent dates (today, yesterday).
**If old or missing:** The handover protocol in AGENTS.md may not be followed.

4. Check AGENTS.md handover protocol:
```bash
grep -i "handover\|daily\|session end" ~/.openclaw/workspace/AGENTS.md | head -10
```
**Expected:** Instructions to write daily notes before session end.

---

### Issue 14: Vault entries disappearing

**Symptoms:** Important permanent info gone from vault, lessons lost

**Tree:**

1. Check vault directory:
```bash
ls ~/.openclaw/workspace/memory/vault/ 2>/dev/null
```
**Expected:** Files like `lessons.md`, `preferences.md`, etc.
**If empty or missing:** Vault was never populated or was deleted.

2. Check decay.json configuration:
```bash
cat ~/.openclaw/workspace/memory/decay.json 2>/dev/null | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "No decay.json"
```
**Expected:** Archive threshold around 0.15. If higher, entries decay too fast.

3. Check if vault files are excluded from decay:
```bash
# Vault should be permanent -- not subject to decay
# If decay is affecting vault, the decay process has a bug
grep -ri "vault" ~/.openclaw/workspace/memory/decay.json 2>/dev/null || echo "No vault reference in decay config"
```

---

## Infrastructure Issues

### Issue 15: Gateway won't start

**Symptoms:** `openclaw gateway start` fails, gateway not running

**Tree:**

1. Check current status:
```bash
openclaw gateway status
```
**Expected:** Shows status (may show "stopped" or error).

2. Validate openclaw.json (most common cause -- JSON syntax errors):
```bash
python3 -c "
import json, os
try:
    json.load(open(os.path.expanduser('~/.openclaw/openclaw.json')))
    print('CONFIG VALID')
except json.JSONDecodeError as e:
    print(f'CONFIG ERROR at line {e.lineno}, column {e.colno}: {e.msg}')
" 2>&1
```
**Expected:** "CONFIG VALID"
**If error:** Fix the JSON error. Common issues: trailing commas, missing quotes, unclosed brackets.

3. Find the JSON error:
```bash
python3 -c "
import json, os
try:
    json.load(open(os.path.expanduser('~/.openclaw/openclaw.json')))
except json.JSONDecodeError as e:
    print(f'JSON ERROR at line {e.lineno}, column {e.colno}: {e.msg}')
"
```
**Expected:** Shows exact location of the error.

4. Check Node.js version:
```bash
node --version
```
**Expected:** v18 or higher. If lower, upgrade Node.js.

5. Check disk space:
```bash
df -h /home
```
**Expected:** At least 1GB free. If full, clear old logs or temp files.

6. Try starting again after fixes:
```bash
openclaw gateway start
```

7. Verify:
```bash
openclaw gateway status
```
**Expected:** "running" or "active".

---

### Issue 16: High token usage / cost

**Symptoms:** Unexpected API costs, high token consumption

**Tree:**

1. Check which model each cron uses:
```bash
openclaw cron list
```
**Expected:** Most jobs should use Sonnet (cheaper). Only code-writing and judgment-heavy tasks should use Opus.

2. Check model defaults:
```bash
cat ~/.openclaw/openclaw.json | python3 -c "import sys,json; c=json.load(sys.stdin); print('Default model:', c.get('agents',{}).get('defaults',{}).get('model', 'NOT SET'))"
```
**Expected:** Should be a Sonnet model for cost efficiency.

3. Count cron jobs by frequency:
```bash
openclaw cron list | wc -l
```
**Expected:** Review if there are too many frequent jobs. Every-2h and every-3h jobs add up.

---

### Issue 17: Telegram/Discord notifications not arriving

**Symptoms:** Messages not delivered, bot silent, notifications missing

**Tree:**

1. Check channel configuration:
```bash
cat ~/.openclaw/openclaw.json | python3 -c "
import sys,json
c = json.load(sys.stdin)
channels = c.get('channels', {})
for name, cfg in channels.items():
    print(f'{name}: type={cfg.get(\"type\",\"?\")} configured={bool(cfg.get(\"token\") or cfg.get(\"botToken\"))}')
" 2>&1
```
**Expected:** Channel shows as configured with a token.

2. Check bot token validity (Telegram):
```bash
cat ~/.openclaw/openclaw.json | python3 -c "
import sys,json
c = json.load(sys.stdin)
channels = c.get('channels', {})
for name, cfg in channels.items():
    token = cfg.get('token', cfg.get('botToken', ''))
    if token:
        print(f'{name}: token starts with {token[:10]}...')
" 2>&1
```
**Expected:** Token is present and non-empty.

3. Test Telegram bot (if applicable):
```bash
# Replace BOT_TOKEN with actual token
# curl -s "https://api.telegram.org/bot<BOT_TOKEN>/getMe" | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin), indent=2))"
echo "Run the above command manually with your bot token to test"
```

4. Check gateway logs for delivery errors:
```bash
journalctl -u openclaw --since "1 hour ago" | grep -i "telegram\|discord\|deliver\|send\|notification" | tail -10
```

---

### Issue 18: Model auth failing

**Symptoms:** API errors, "unauthorized", "invalid API key", model requests failing

**Tree:**

1. Check which API keys are set:
```bash
echo "Anthropic: $(env | grep ANTHROPIC_API_KEY | wc -l) keys"
echo "OpenAI: $(env | grep OPENAI_API_KEY | wc -l) keys"
echo "Other: $(env | grep -i '_API_KEY\|_API_TOKEN' | grep -v ANTHROPIC | grep -v OPENAI | wc -l) keys"
```
**Expected:** At least 1 key for your primary provider.

2. Check if the key works (Anthropic):
```bash
curl -s -o /dev/null -w "%{http_code}" https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}'
```
**Expected:** `200` means key works. `401` means invalid key. `429` means rate limited. `500+` means provider outage.

3. Check provider status pages:
```bash
echo "Anthropic: https://status.anthropic.com"
echo "OpenAI: https://status.openai.com"
echo "Check these pages if auth works but requests still fail"
```

4. For local Ollama:
```bash
curl -s http://localhost:11434/api/tags 2>/dev/null | python3 -c "import sys,json; models=json.load(sys.stdin).get('models',[]); [print(m['name']) for m in models]" 2>/dev/null || echo "Ollama not running or not installed"
```
**Expected:** Lists available local models.

---

## Installation Issues

### Issue 19: Install script fails

**Symptoms:** Clawd Up install script errors out, can't complete setup

**Tree:**

1. Check Node.js version:
```bash
node --version 2>/dev/null || echo "Node.js NOT INSTALLED"
```
**Expected:** v18.0.0 or higher. If lower or missing, install/upgrade Node.js.

2. Check if OpenClaw is installed:
```bash
which openclaw 2>/dev/null || echo "OpenClaw NOT FOUND in PATH"
openclaw --version 2>/dev/null || echo "OpenClaw not working"
```
**Expected:** Path to openclaw binary and version number.

3. Check npm/npx availability:
```bash
npm --version 2>/dev/null || echo "npm NOT INSTALLED"
npx --version 2>/dev/null || echo "npx NOT INSTALLED"
```
**Expected:** Version numbers for both.

4. Check disk space:
```bash
df -h /home
```
**Expected:** At least 2GB free for installation.

5. Check write permissions:
```bash
touch ~/.openclaw/test_write 2>/dev/null && rm ~/.openclaw/test_write && echo "WRITABLE" || echo "NOT WRITABLE"
```
**Expected:** "WRITABLE"

---

### Issue 20: Post-install agents not starting

**Symptoms:** Install completed but agents don't respond, config seems ignored

**Tree:**

1. Check if gateway needs restart:
```bash
openclaw gateway status
```
**Expected:** If running, it may need restart to pick up new config.

2. Restart gateway:
```bash
openclaw gateway restart
```
**Expected:** Gateway restarts successfully.

3. Check agent configs were created:
```bash
ls ~/.openclaw/agents/ 2>/dev/null
```
**Expected:** Agent directories exist.

4. Check openclaw.json was updated:
```bash
python3 -c "import json; c=json.load(open('$HOME/.openclaw/openclaw.json')); print('Agents:', list(c.get('agents',{}).keys()))" 2>&1
```
**Expected:** Lists configured agents.

5. Check for config merge issues:
```bash
python3 -c "import json; json.load(open('$HOME/.openclaw/openclaw.json')); print('CONFIG VALID')" 2>&1
```
**Expected:** "CONFIG VALID". If not, the install may have created invalid JSON.

6. If config is invalid, restore backup:
```bash
ls ~/.openclaw/openclaw.json.bak* 2>/dev/null | head -5
```
**Expected:** Backup files exist. Restore the most recent one and retry.
