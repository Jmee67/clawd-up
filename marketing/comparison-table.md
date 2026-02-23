# Manual OpenClaw Setup vs Clawd Up

| Problem | Manual Fix | Time | Clawd Up |
|---|---|---|---|
| Agent forgets after long conversations | Find memory flush config, tune decay scoring, set up decay.json | Day 1-2 | Pre-configured |
| Search returns garbage results | Configure hybrid search, set up QMD, test retrieval quality | Day 2-3 | Pre-configured |
| Agent finds info but doesn't use it | Write boot sequence in AGENTS.md (load SOUL.md, USER.md, memory) | Day 3 | Included in AGENTS.md |
| Compaction wipes context mid-session | Build handover protocol, compaction-context files, hourly summaries | Day 4 | Included |
| System prompt bloated with unused skills | Audit all skills, remove unused, test nothing breaks | Day 5 | Curated set ships by default |
| No memory verification | Build marker tests to confirm memory actually persists | Day 5 | Included |
| No operational learnings file | Create LEARNINGS.md, integrate into workflow | Day 5 | Included |

## By the numbers

| Metric | Manual (before) | Manual (after 5 days) | Clawd Up (on install) |
|---|---|---|---|
| System prompt tokens | 11,887 | 8,529 | ~8,500 |
| Active skills | 51 | 32 | ~30 (curated) |
| Token savings | — | 28% reduction | 28%+ from day one |
| Setup time | 5+ days | 5+ days | 5 minutes |
| Files pre-configured | 0 | 7+ (manual) | 7+ (automatic) |

## Files included in Clawd Up that she had to build manually

- `AGENTS.md` — Boot sequence, memory protocol, handover protocol
- `SOUL.md` — Agent identity and behavior
- `USER.md` — User context template
- `LEARNINGS.md` — Operational lessons file
- `memory/decay.json` — Relevance scoring config
- `memory/compaction-context-latest.md` — Compaction recovery
- Curated skill set — Pre-audited, no bloat
