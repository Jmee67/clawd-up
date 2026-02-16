# Immune System

Automated checks that run after every agent action to prevent drift, hallucination, and quality decay.

## Components

### 1. Output Validator (`validator.js`)
Runs after every agent output to check:
- Signal files have required fields (source, date, signal text, triage score)
- Deep dives have all 5S sections filled
- Pipeline entries have valid status transitions
- No empty sections or placeholder text

### 2. Pipeline Guard (`pipeline-guard.js`)
Enforces pipeline rules:
- Cannot skip stages (SIGNAL → RESEARCHING → VALIDATED, etc.)
- Cannot enter SCORING without completed deep dive
- Cannot enter VALIDATED with score <20
- Stale entries (>14 days no update) get flagged

### 3. Drift Detector (`drift-detector.js`)
Checks for agent drift:
- Are agents still following their SOUL.md?
- Is output quality declining? (compare recent vs historical)
- Are triage scores calibrated? (too many 7+ = threshold too low)
- Are agents producing output? (no output in 48h = problem)

### 4. Cost Monitor (`cost-monitor.js`)
Tracks API usage:
- Token counts per agent per day
- Alert if any agent exceeds daily budget
- Weekly cost summary

## Usage

The immune system runs as a post-action hook. Each agent's cron job should include:
```
After completing your task, run the immune system check:
node immune-system/validator.js --agent [agent-name] --action [action-type]
```

Or integrate into the Operator's evening review for batch checking.
