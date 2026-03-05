# HEARTBEAT.md

## Priority Order (every heartbeat)
1. Pipeline comment monitoring (respond to comments, push updates, notify)
2. Proposal review (auto-approve research/content/signal/validation; flag others)
3. Health check (update lastSeen, check agent status, missed crons)
4. Handoff sync (check pending handoffs, mark complete if done, push)
5. Memory maintenance (every 3rd heartbeat: decay scores, archive stale items, promote active ones)

## Comment Monitoring
- Read comment data + heartbeat state for already-responded items
- Respond to unprocessed comments, push, notify via your configured channel

## Scheduled Tasks (handled by crons, NOT heartbeat)
- {{BRIEF_TIME}}: Daily Brief (cron)
- {{SCAN_TIME}}: Signal scanning (cron)
- {{TRIAGE_TIME}}: Signal triage (cron)
- {{REVIEW_TIME}}: System review (cron)
- {{BUILD_TIME}}: Nightly Build (cron)

## Nightly Build Priorities
1. Explicit requests from today
2. P1-2 backlog items
3. Opportunity scanner improvements
4. Pipeline research/scoring
5. P3+ backlog items
6. Prototypes/MVPs

## Nightly Build Phases
**Phase 1: BUILD** — ship code, commit, verify.
**Phase 2: ANALYSIS** — cron errors, token burn, signal flow, improvements. Fix quick wins, log rest to backlog. Write to memory/YYYY-MM-DD.md.

## Nightly Hygiene
- MEMORY.md: max 200 lines, active context only
- TOOLS.md: check for stale endpoints/cron schedules
- Promote stable decisions to vault
- Pipeline auto-advance (check gates, flag stale, normalize scores to /5)
- Experiment tracking (check running experiments, flag stale ones)
