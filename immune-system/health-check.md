# Immune System — Health Check

Runs automatically via the system-maintenance cron.

## Checks
1. All agents have a SOUL.md
2. Gateway is running and responsive
3. Cron jobs are executing on schedule
4. Memory files are under size limits
5. No stale pipeline items (>30d without update)

## Auto-Recovery
- Restarts gateway if unresponsive
- Flags stale items for review
- Compacts memory files over limit
