# HEARTBEAT.md — What To Do When You Wake Up

You are triggered by scheduled heartbeats and cron jobs.

## Daily Tasks (Cron Jobs)

### Morning Brief (8am UTC)
Scan ecosystem updates and deliver brief to Test via telegram.

**Sources to check:**
1. X mentions of relevant keywords (last 24h)
2. GitHub trending repos
3. Competing framework updates
4. Community signals — notable builds, use cases, problems

**Brief format:**
```
🤖 Daily Brief - [Date]

**Key Updates:**
- [Notable developments]

**X Signals:**
- [@handle] - [What they're building/saying]

**Patterns:**
- [Any emerging themes]
```

**Delivery:** Send via telegram. Keep brief (3-5 bullets). If nothing: "No major updates today."

### Demand Signal Scan (morning + evening)

**STEP 1: X Feed Scan (30 min)**
- Browse Following timeline (chronological)
- Scan curated lists
- Look for: pain points, "I wish there was", product launches

**STEP 2: Targeted Searches (20 min)**
- X: Search demand phrases (use browser, x.com/search)
- Reddit: Search r/SideProject, r/Entrepreneur, r/SaaS (use web_search)
- **Triage filter (must meet 2+):**
  1. Explicit willingness to pay (>$1K/year potential)
  2. Pattern (3+ people mentioning same pain)
  3. Fits thesis (bootstrappable, indie scale, <2 week MVP)
  4. No obvious existing solution
- Quick competitor check before writing
- Write signals to `/research/demand-signals/YYYY-MM-DD-slug.md`

### Web Research + Validation (11am UTC)
- Use web_search to find pain points on Reddit and web
- Validate signals found in X scans
- Cross-reference with existing pipeline opportunities
- Write findings to `/research/web-signals/YYYY-MM-DD.md`

### Pipeline Validation (afternoon)
- Read existing pipeline opportunities in RESEARCHING state
- Run 2-3 validation searches per opportunity
- Write findings to `/research/validations/`
- Update opportunity status based on findings

## Heartbeat Quick Checklist

1. Check time and determine which task applies
2. Execute the relevant task
3. Write findings to appropriate folder
4. If nothing noteworthy, reply HEARTBEAT_OK

## Search Rules

- **web_search** (Brave API) for Reddit/web content
- **browser** for X/Twitter (requires login, Brave can't index X)

## Output Locations

- X signals: `/research/x-signals/YYYY-MM-DD-slug.md`
- Web signals: `/research/web-signals/YYYY-MM-DD.md`
- Demand signals: `/research/demand-signals/YYYY-MM-DD-slug.md`
- Validations: `/research/validations/`
