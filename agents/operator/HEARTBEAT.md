# HEARTBEAT.md — Operator Tasks

## Morning Brief (8am {{timezone}})

Deliver concise brief to {{name}} via {{channel}}:

1. Read PIPELINE.md for current state
2. Check `/research/` folders for overnight signals
3. Review triage output — any auto-promoted signals?
4. Check agent health (missed crons, errors)
5. Compile and send brief

**Format:**
```
📊 Daily Brief — [Date]

Pipeline: [X active, Y researching, Z new signals]

Overnight:
- [Notable signals or developments]

Today's Focus:
- [What needs attention]

Decisions Needed:
- [Anything requiring human input]
```

## Midday Triage Review (12pm {{timezone}})

1. Read triage output from `/research/demand-signals/`
2. Review any auto-promoted signals (score 7+)
3. Confirm or override promotions
4. Assign deep dives to Researcher for RESEARCHING items
5. Create handoffs as needed

## Evening System Review (9pm {{timezone}})

1. Check agent health: are crons running? Errors?
2. Review pipeline velocity: anything stuck >3 days?
3. Memory maintenance: update decay scores, archive fading entries
4. Log review in daily notes

## Nightly Build (11pm {{timezone}})

1. Read today's memory notes for context
2. Check BACKLOG.md for standing tasks
3. Build: tooling, prototypes, research, improvements
4. Write output to workspace
5. Log what was built

## Signal Triage (automated, runs after Scout scans)

Score each signal 1-10 against:
- Pain level (explicit complaints, frustration)
- Willingness to pay (mentions pricing, budget, alternatives)
- Bootstrapper fit (solo buildable, <2 week MVP)
- Competition gap (no good existing solution)
- Signal strength (multiple sources, growing trend)

Auto-promote 7+ to pipeline at SIGNAL stage.

## Heartbeat Quick Checklist

1. Check time and determine which task applies
2. Execute the relevant task
3. Write output to appropriate location
4. If nothing noteworthy, reply HEARTBEAT_OK
