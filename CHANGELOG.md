# Changelog

## v0.4.0 — 2026-03-05

### Changed
- Restructured as clean starter kit — buyers get the engine, bring their own config
- Synced all agent SOULs with live production system
- Rewrote README and QUICKSTART for technical solopreneurs
- Consolidated crons to 5 core jobs (morning-brief, signal-scan, triage, nightly-build, system-review)
- Moved all user-specific content to templates with `{{PLACEHOLDER}}` syntax
- Updated AGENTS.md with correction loop, memory system, and handover protocol from live system
- Updated HEARTBEAT.md with nightly build phases and hygiene checklist

### Removed
- Next.js landing page (app/, public/, package.json, etc.)
- Marketing materials (marketing/, landing/)
- Immune system scripts (moved to future add-on)
- Research directory scaffolding (created by setup wizard instead)
- Growth/content crons (not core to the starter kit)
- Web research and demand hunt crons (use signal-scan instead)

### Added
- `templates/USER.md.template` — profile template with placeholders
- `templates/MEMORY.md.template` — working memory scaffold
- `crons/README.md` — explains each cron and how to customize
- `memory/vault/.gitkeep` — permanent knowledge store

## v0.3.0 — 2026-02-20

- Initial public release
- 3 agents: Scout, Researcher, Operator
- Pipeline tracking with scoring rubric
- 9 cron jobs
- Immune system (validator, pipeline guard, drift detector, cost monitor)
- Next.js landing page
- LemonSqueezy license validation
