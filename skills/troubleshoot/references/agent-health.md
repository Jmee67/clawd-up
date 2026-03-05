# Agent Health Check

Run these checks in order. Report each result. This is your full system health check.

---

## Check 1: Gateway Status

```bash
openclaw gateway status
```
**Expected:** Output contains "running" or "active".
**If not running:**
```bash
openclaw gateway start
```
Then re-check. If it still won't start, see `common-issues.md` Issue 15.

---

## Check 2: Agent Configuration

```bash
ls ~/.openclaw/agents/ 2>/dev/null || echo "NO AGENTS DIRECTORY"
```
**Expected:** One or more agent directories listed (e.g., `main`, `scout`, `researcher`).
**If "NO AGENTS DIRECTORY":** Agents have not been configured. Run the install/setup process.

---

## Check 3: Workspace Files

```bash
echo "--- Core Files ---"
for f in SOUL.md AGENTS.md MEMORY.md TOOLS.md USER.md IDENTITY.md; do
  if [ -f "$HOME/.openclaw/workspace/$f" ]; then
    lines=$(wc -l < "$HOME/.openclaw/workspace/$f")
    echo "  $f: $lines lines"
  else
    echo "  $f: MISSING"
  fi
done
```
**Expected:** All core files exist with content. MEMORY.md should be under 200 lines.
**If any MISSING:** Create the missing file. At minimum, SOUL.md and AGENTS.md are needed.

---

## Check 4: Model Authentication

```bash
echo "--- API Keys ---"
echo "Anthropic: $(env | grep ANTHROPIC_API_KEY | wc -l) key(s) set"
echo "OpenAI: $(env | grep OPENAI_API_KEY | wc -l) key(s) set"
echo "Other: $(env | grep -i '_API_KEY\|_API_TOKEN' | grep -v ANTHROPIC | grep -v OPENAI | wc -l) other key(s)"
```
**Expected:** At least 1 key for your primary provider.
**If 0 keys:** No API keys are configured. Set them in your environment or OpenClaw config.

For local models (Ollama):
```bash
curl -s http://localhost:11434/api/tags 2>/dev/null | python3 -c "
import sys,json
try:
    models = json.load(sys.stdin).get('models', [])
    print(f'Ollama: {len(models)} model(s) available')
    for m in models:
        print(f'  - {m[\"name\"]}')
except:
    print('Ollama: not running or not installed')
" 2>/dev/null || echo "Ollama: not running or not installed"
```

---

## Check 5: Memory Health

```bash
echo "--- Memory ---"
if [ -f "$HOME/.openclaw/workspace/MEMORY.md" ]; then
  lines=$(wc -l < "$HOME/.openclaw/workspace/MEMORY.md")
  echo "MEMORY.md: $lines lines"
  if [ "$lines" -gt 200 ]; then
    echo "WARNING: MEMORY.md exceeds 200 line limit. Needs compaction."
  else
    echo "MEMORY.md: OK"
  fi
else
  echo "MEMORY.md: MISSING"
fi
```

```bash
echo "--- Daily Notes ---"
notes=$(ls ~/.openclaw/workspace/memory/*.md 2>/dev/null | wc -l)
echo "Daily notes found: $notes"
if [ "$notes" -gt 0 ]; then
  echo "Most recent:"
  ls -t ~/.openclaw/workspace/memory/*.md 2>/dev/null | head -3
else
  echo "WARNING: No daily notes found"
fi
```

```bash
echo "--- Vault ---"
if [ -d "$HOME/.openclaw/workspace/memory/vault" ]; then
  vault_files=$(ls ~/.openclaw/workspace/memory/vault/ 2>/dev/null | wc -l)
  echo "Vault files: $vault_files"
else
  echo "Vault directory: MISSING"
fi
```

---

## Check 6: Cron Jobs

```bash
echo "--- Cron Jobs ---"
openclaw cron list 2>/dev/null || echo "Could not list cron jobs (gateway may not be running)"
```
**Expected:** Lists all registered cron jobs with their status.

---

## Check 7: Disk Space

```bash
echo "--- Disk Space ---"
df -h /home 2>/dev/null || df -h /
```
**Expected:** At least 1GB free. If under 500MB, clean up old logs and temp files.

---

## Check 8: OpenClaw Config Validity

```bash
echo "--- Config Validation ---"
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
try:
    json.load(open(f))
    print('openclaw.json: VALID')
except json.JSONDecodeError as e:
    print(f'openclaw.json: INVALID - {e.msg} at line {e.lineno}')
except FileNotFoundError:
    print('openclaw.json: NOT FOUND')
"
```
**Expected:** "VALID". If "INVALID", fix the JSON error before anything else.

---

## Check 9: Recent Errors

```bash
echo "--- Recent Errors (last hour) ---"
journalctl -u openclaw --since "1 hour ago" 2>/dev/null | grep -i "error\|fail\|exception\|crash" | tail -10 || echo "Could not read journal logs"
```
**Expected:** No errors. If errors appear, they point to the active problem.

---

## Check 10: Node.js Version

```bash
echo "--- Runtime ---"
echo "Node.js: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "npm: $(npm --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "OpenClaw: $(openclaw --version 2>/dev/null || echo 'NOT FOUND')"
```
**Expected:** Node.js v18+, npm present, OpenClaw version shown.

---

## Health Summary Template

After running all checks, summarize like this:

```
HEALTH CHECK SUMMARY
====================
Gateway:     OK / DOWN / ERROR
Agents:      X configured
Workspace:   X/6 core files present
Auth:        X API key(s) set
Memory:      X lines (OK / NEEDS COMPACTION)
Daily Notes: X found (OK / MISSING)
Vault:       X files (OK / MISSING)
Cron Jobs:   X registered (X running, X failed)
Disk:        X GB free (OK / LOW)
Config:      VALID / INVALID
Errors:      X in last hour
Node.js:     vX.X.X (OK / TOO OLD / MISSING)
```

If any item is not OK, refer to the matching issue in `common-issues.md` for the diagnostic tree.
