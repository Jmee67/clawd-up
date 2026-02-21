# Changelog

## v0.3 (2026-02-20)

### Added
- Research-backed expert identities for all agents (based on ExpertPrompting, arxiv 2305.14688)
- Landing page (`landing/index.html`) with hero, pricing, and install flow
- Subagent delegation protocol with standardized completion signals
- Personalization interview during setup (work style, context, priorities)
- Onboarding prompt template (`templates/ONBOARDING-PROMPT.md`)

### Changed
- Agent SOULs rewritten from generic labels to detailed expert backgrounds
- Model map uses stable provider aliases instead of dated model strings
- Setup wizard version bumped to v0.3
- `__dirname` fix in setup.js (was using undefined `__filename` variable)

### Fixed
- setup.js crash on line 71 (`__filename` → `__dirname`)
- Model strings now use stable aliases (`anthropic/claude-sonnet-4-5`) to avoid expiration

## v0.2.1 (2026-02-17)

### Added
- Correction loop pattern in AGENTS.md template
- "Never Do This" section in agent SOULs
- Figure-it-out pattern for agent autonomy

## v0.2 (2026-02-16)

### Added
- Researcher agent with 5S deep dive methodology
- Operator agent with pipeline management
- Immune system (Pro tier) for agent drift detection
- Tier separation (Free/Starter/Pro) with license validation
- LemonSqueezy license integration with offline grace period

## v0.1 (2026-02-14)

### Added
- Initial release
- Scout agent with demand signal scanning
- Setup wizard (`setup.js`)
- Cron templates for signal scanning
- Pipeline and rubric templates
