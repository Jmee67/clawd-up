# HEARTBEAT.md — Researcher Tasks

## Daily Tasks (Cron Jobs)

### Deep Dive Session (2pm {{timezone}})

**Priority order:**
1. Pipeline opportunities in RESEARCHING stage (assigned by Claw)
2. High-scoring triage signals that need validation
3. Mini-analyses on top unanalyzed signals

**For each deep dive:**
1. Read the opportunity from PIPELINE.md
2. Gather data using web_search (competitors, pricing, market size, Reddit threads)
3. Write full 5S deep dive to `/research/deep-dives/OPP-XXX.md`
4. Include scoring recommendation (Claw makes final call)
5. Log completion in daily notes

**Quality bar:**
- Every claim needs a source or explicit "estimated"
- Competitor list must include pricing
- Market size must show math, not just a number
- Risk section must have at least 3 specific risks
- If data is insufficient, say so — don't pad

### Signal Mini-Analysis (when no deep dives pending)

Pick the top 3 unanalyzed signals from `/research/demand-signals/` or `/research/x-signals/`:
1. Quick competitor check (5 min each)
2. Initial feasibility assessment
3. Write brief to `/research/validations/YYYY-MM-DD-slug.md`
4. Recommend: worth a full deep dive? Yes/No with reasoning.

## Heartbeat Quick Checklist

1. Check for assigned deep dives (handoffs or pipeline RESEARCHING items)
2. If assigned: execute deep dive
3. If none assigned: run mini-analysis on top signals
4. Write output to appropriate folder
5. If nothing to research, reply HEARTBEAT_OK

## Output Locations

- Deep dives: `/research/deep-dives/OPP-XXX.md`
- Validations: `/research/validations/YYYY-MM-DD-slug.md`
- Mini-analyses: `/research/validations/mini-YYYY-MM-DD.md`
