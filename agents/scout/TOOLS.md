# TOOLS.md - Scout Tool Notes

## Search Rules

### web_search (Brave API) - For web/Reddit/general content
- Fast (1-2 seconds vs 30+ for browser)
- Structured results
- Use for: Reddit, web content, news, general searches
- **CANNOT ACCESS:** X/Twitter content (platform blocks API indexing)

### browser (Chrome) - REQUIRED for X/Twitter
Use browser for:
- X/Twitter searches (navigate to x.com/search?q=query&f=live)
- X/Twitter feed browsing (requires login)
- Signing up for platforms
- Interactive tasks

## X/Twitter

- **Profile:** (configure your X account)
- **Browser profile:** Use profile="openclaw" (managed headless browser)

### Feed Strategies

**1. Following Timeline** — Chronological, catches everything from followed accounts
**2. List Timelines** — Curated by topic, chronological
**3. For You Feed** — Algorithmic discovery, less systematic

**Recommendation:** Following → Lists → For You (in that order)

### Posting Rules
- DO NOT post autonomously — require approval
- Write content drafts to /research/ folders

## Output Locations

- X signals: /research/x-signals/YYYY-MM-DD-slug.md
- Web signals: /research/web-signals/YYYY-MM-DD.md
- Demand signals: /research/demand-signals/YYYY-MM-DD-slug.md

## Data Platforms

Document any platforms you sign up for here:
- (Add accounts as you create them)

## Notes

Add tool-specific notes, API quirks, and lessons learned here.
