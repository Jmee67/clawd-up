# Recovery Procedures

Step-by-step recovery for critical failures. Every step is a command you can copy and run.

---

## Procedure 1: Full Gateway Recovery

Use when: Gateway won't start, gateway crashed, gateway behaving erratically.

**Step 1: Stop the gateway**
```bash
openclaw gateway stop
```
Wait 5 seconds.

**Step 2: Validate the config**
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
try:
    json.load(open(f))
    print('CONFIG OK')
except json.JSONDecodeError as e:
    print(f'CONFIG ERROR at line {e.lineno}, column {e.colno}: {e.msg}')
except FileNotFoundError:
    print('CONFIG FILE NOT FOUND at', f)
"
```
If "CONFIG ERROR": fix the JSON error before proceeding. Common issues:
- Trailing comma after last item in an object or array
- Missing closing bracket `}` or `]`
- Unquoted keys or values
- Comments in JSON (JSON does not allow comments)

**Step 3: Start the gateway**
```bash
openclaw gateway start
```

**Step 4: Verify**
```bash
openclaw gateway status
```
**Expected:** Shows "running" or "active".

**Step 5: Check cron jobs resumed**
```bash
openclaw cron list
```
**Expected:** All jobs show normal status (idle/waiting), not "already-running".

---

## Procedure 2: Memory Reset

Use when: MEMORY.md is corrupt, too large, or causing confusion. Agent behavior is erratic due to bad memory state.

**Step 1: Back up current memory**
```bash
cp ~/.openclaw/workspace/MEMORY.md ~/.openclaw/workspace/MEMORY.md.bak.$(date +%Y%m%d%H%M%S)
```

**Step 2: Check current size**
```bash
wc -l ~/.openclaw/workspace/MEMORY.md
```

**Step 3: Option A -- Trim to recent entries only**
Keep the last 50 lines (most recent memory):
```bash
tail -50 ~/.openclaw/workspace/MEMORY.md > /tmp/memory_trimmed.md
mv /tmp/memory_trimmed.md ~/.openclaw/workspace/MEMORY.md
```

**Step 3: Option B -- Full reset**
Start fresh with an empty memory:
```bash
echo "# MEMORY.md" > ~/.openclaw/workspace/MEMORY.md
echo "" >> ~/.openclaw/workspace/MEMORY.md
echo "Memory was reset on $(date +%Y-%m-%d). Previous memory backed up." >> ~/.openclaw/workspace/MEMORY.md
```

**Step 4: Verify**
```bash
wc -l ~/.openclaw/workspace/MEMORY.md
cat ~/.openclaw/workspace/MEMORY.md
```
**Expected:** Under 200 lines with valid content.

**Step 5: Also reset daily notes if needed**
```bash
# Back up today's note
cp ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md.bak 2>/dev/null
# Create fresh daily note
echo "# $(date +%Y-%m-%d)" > ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md
echo "" >> ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md
echo "Memory was reset. Starting fresh." >> ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md
```

---

## Procedure 3: Cron Reset

Use when: Multiple crons are stuck, cron system is unreliable, need to start fresh.

**Step 1: List all current crons**
```bash
openclaw cron list
```
Save this output so you can recreate jobs later.

**Step 2: Restart gateway to clear stuck locks**
```bash
openclaw gateway restart
```

**Step 3: Verify locks are cleared**
```bash
openclaw cron list
```
**Expected:** No jobs show "already-running".

**Step 4: Force-run a test job to verify cron system works**
```bash
# Pick any job ID from the list
openclaw cron list | head -5
# Then run it:
# openclaw cron run <jobId>
```

**Step 5: If jobs are missing, re-register them**
Refer to your setup documentation or install script for the cron definitions. Re-add each one:
```bash
# Example (replace with your actual cron definitions):
# openclaw cron add --schedule "0 8 * * *" --agent main --task "morning brief"
```

---

## Procedure 4: Config Recovery

Use when: openclaw.json is corrupt, has syntax errors, or agents misbehave after a config change.

**Step 1: Check if config is valid**
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
try:
    json.load(open(f))
    print('CONFIG OK')
except json.JSONDecodeError as e:
    print(f'CONFIG ERROR at line {e.lineno}, column {e.colno}: {e.msg}')
"
```

**Step 2: If invalid, check for backup**
```bash
ls -t ~/.openclaw/openclaw.json.bak* 2>/dev/null | head -5
```

**Step 3: Restore from backup**
```bash
# Back up the broken config first
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.broken.$(date +%Y%m%d%H%M%S)

# Restore the most recent valid backup
# Replace <backup_file> with the actual filename from step 2
# cp ~/.openclaw/<backup_file> ~/.openclaw/openclaw.json
```

**Step 4: Validate the restored config**
```bash
python3 -c "import json; json.load(open('$HOME/.openclaw/openclaw.json')); print('CONFIG OK')"
```

**Step 5: If no backup exists, find and fix the error manually**
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
try:
    json.load(open(f))
except json.JSONDecodeError as e:
    print(f'Error at line {e.lineno}, column {e.colno}: {e.msg}')
    # Show context around the error
    with open(f) as fh:
        lines = fh.readlines()
        start = max(0, e.lineno - 3)
        end = min(len(lines), e.lineno + 2)
        for i in range(start, end):
            marker = '>>>' if i + 1 == e.lineno else '   '
            print(f'{marker} {i+1}: {lines[i].rstrip()}')
"
```
Fix the error in the indicated line, then re-validate.

**Step 6: Restart gateway**
```bash
openclaw gateway restart
```

**Step 7: Verify**
```bash
openclaw gateway status
```

---

## Procedure 5: Emergency Model Switch

Use when: Your primary model provider is down (API outage, key revoked) and you need agents to keep working.

**Step 1: Identify the current model**
```bash
python3 -c "
import json, os
f = os.path.expanduser('~/.openclaw/openclaw.json')
c = json.load(open(f))
print('Default model:', c.get('agents', {}).get('defaults', {}).get('model', 'NOT SET'))
models = c.get('agents', {}).get('defaults', {}).get('models', {})
if models:
    print('Allowed models:', list(models.keys()))
"
```

**Step 2: Check which alternative providers have keys set**
```bash
echo "Anthropic: $(env | grep ANTHROPIC_API_KEY | wc -l) key(s)"
echo "OpenAI: $(env | grep OPENAI_API_KEY | wc -l) key(s)"
echo "Ollama local: $(curl -s http://localhost:11434/api/tags 2>/dev/null | python3 -c 'import sys,json; print(len(json.load(sys.stdin).get("models",[])), "model(s)")' 2>/dev/null || echo 'not available')"
```

**Step 3: Back up current config**
```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.$(date +%Y%m%d%H%M%S)
```

**Step 4: Update the config to use the alternative model**

Edit `~/.openclaw/openclaw.json` and change the default model. Example alternatives:
- Anthropic: `anthropic/claude-sonnet-4-5` or `anthropic/claude-opus-4-6`
- OpenAI: `openai/gpt-4o` or `openai/gpt-4o-mini`
- Local Ollama: `ollama/qwen2.5:latest` or `ollama/llama3:latest`

Use the `edit` tool or a text editor to change the `"model"` field under `agents.defaults`.

**Step 5: Validate the config after editing**
```bash
python3 -c "import json; json.load(open('$HOME/.openclaw/openclaw.json')); print('CONFIG OK')"
```

**Step 6: Restart gateway to pick up new model**
```bash
openclaw gateway restart
```

**Step 7: Test with a simple message**
Send a test message to an agent to confirm it responds with the new model.

**Step 8: When the original provider is back**
Restore from the backup:
```bash
# Find the backup
ls -t ~/.openclaw/openclaw.json.bak* | head -1
# Restore it (replace filename)
# cp ~/.openclaw/openclaw.json.bak.<timestamp> ~/.openclaw/openclaw.json
# Restart
openclaw gateway restart
```

---

## General Recovery Tips

- **Always back up before changing config.** One command: `cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.$(date +%Y%m%d%H%M%S)`
- **Always validate JSON after editing.** One command: `python3 -c "import json; json.load(open('$HOME/.openclaw/openclaw.json')); print('OK')"`
- **Always restart gateway after config changes.** One command: `openclaw gateway restart`
- **Check journal logs when something fails.** One command: `journalctl -u openclaw --since "30 min ago" | tail -30`
- **When in doubt, restart the gateway.** It clears stuck locks and reloads config.
