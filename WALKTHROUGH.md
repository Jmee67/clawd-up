# Clawd Up — Walkthrough

A complete tour of what Clawd Up does, day by day. Read this to understand the system before installing.

---

## Day 0: Install (5 minutes)

You run one command. The setup wizard asks:

1. **Your name** — agents address you personally
2. **What you do** — "indie hacker building SaaS" shapes what Scout looks for
3. **Timezone** — all cron jobs schedule to your local time
4. **Communication style** — direct, casual, or formal
5. **Notification channel** — Telegram or Discord
6. **AI provider** — Anthropic (recommended), OpenAI, or Google

The installer deploys three agents, registers 23 cron jobs, and sends a test message. You're done.

---

## Day 1: Your First Morning Brief (8am)

You wake up to a Telegram message from your Operator:

```
🌅 Morning Brief — Wednesday Feb 26

📡 SCOUT SIGNALS (3 new)
• "Everyone hates Calendly alternatives" — r/SaaS, 847 upvotes
  → Scheduling tool frustration. 12 complaints in 48h.
• "I'd pay $50/mo for X that actually works" — @indie_dev, 2.1K likes
  → Demand signal for [specific tool]. Bookmark rate 3.1%.
• "Built this in a weekend, $2K MRR" — Indie Hackers
  → Validation of [niche]. Solo founder, simple stack.

📋 PIPELINE
• OPP-001 [RESEARCHING] — Researcher deep-diving competitors
• No stale items. No action needed.

📅 TODAY
• Scout scanning: Reddit, X, Hacker News
• Researcher: finishing OPP-001 competitive analysis
• Nightly build: queued for 11pm
```

You read it in 30 seconds. If something looks interesting, you reply. If not, you go build.

---

## Day 2-3: Scout Finds Signals

Scout runs every few hours, scanning:
- **Reddit** — r/SaaS, r/SideProject, r/Entrepreneur, r/startups + niche subs
- **X/Twitter** — indie hacker accounts, trending threads, bookmark rates
- **Hacker News** — Show HN posts, Ask HN threads, comment sentiment

Each signal gets triaged:
- **PROMOTE** → enters your pipeline as a real opportunity
- **WATCH** → interesting but needs more data
- **SKIP** → noise, not worth pursuing

You don't configure this. Scout learns your thesis from your SOUL file and your kill history.

---

## Day 4-5: Researcher Validates

When an opportunity enters the pipeline, Researcher writes a **5S Deep Dive**:

1. **Signal** — Is the demand real? How many people, how much pain?
2. **Size** — TAM/SAM/SOM. Is this a $1K/mo or $100K/mo opportunity?
3. **Shape** — Business model. Subscription? One-time? Marketplace?
4. **Speed** — Can you build an MVP in 2 weeks? What's the tech stack?
5. **Stress Test** — What kills this? Competitors, platform risk, market timing?

Each section is scored 1-5. Total score determines the verdict:
- **20-25 GREEN** → Strong opportunity. Consider building.
- **15-19 AMBER** → Has potential but risks. Needs more validation.
- **Below 15 RED** → Kill it. Don't waste time.

---

## Day 7: Your First Kill

This is the most valuable moment. Researcher scores OPP-002 at 11/25:
- Market too small (SAM $400K)
- Three funded competitors
- 6-month build time minimum

The opportunity gets **KILLED**. Documented with reasons. This saves you 3-6 months of building something that wouldn't work.

Over time, kill patterns emerge. "We always kill opportunities with <$2M SAM." Your system gets smarter.

---

## Week 2: The Pipeline Fills

By now you have:
- 15-20 signals triaged
- 3-5 opportunities in pipeline
- 1-2 deep dives completed
- 1-2 kills with documented reasoning

Your Operator's nightly builds start doing real work:
- Scoring pipeline opportunities
- Updating competitive intelligence
- Building prototypes for validated ideas
- Pushing code to GitHub

---

## Ongoing: The Flywheel

```
Scout finds signals
    ↓
Researcher validates
    ↓
You decide: build or kill
    ↓
Kill patterns sharpen Scout's aim
    ↓
Better signals next week
```

Every correction you make (to any agent) becomes a permanent rule. After a month, the system knows:
- What industries you care about
- What price points work for you
- What technical complexity you can handle
- What competition levels are acceptable

---

## What You Actually Do

**Daily (2 minutes):**
- Read morning brief
- Reply if something needs attention

**Weekly (15 minutes):**
- Review pipeline
- Make build/kill decisions on scored opportunities
- Adjust priorities if your focus shifts

**Monthly (30 minutes):**
- Review kill patterns
- Update your thesis if it's evolved
- Check agent performance

Everything else is automated. The agents work while you build.

---

## Sample Outputs

### Signal Triage
```
📊 Signal Triage — 8 signals processed

PROMOTE (2):
• "Invoice tools for freelancers are all terrible" (r/freelance, 1.2K upvotes)
  → Created OPP-003. Researcher assigned.
• "I spend 3h/week on client reporting" (X, 891 bookmarks)
  → Created OPP-004. Clear WTP signal.

WATCH (3):
• "AI meeting notes" — crowded space, watching for differentiation angle
• "Niche job board" — signal real but TAM unclear
• "Browser extension for X" — platform risk too high, watching

SKIP (3):
• Generic "AI wrapper" ideas — no moat
• Crypto/web3 signals — outside thesis
• Enterprise signals — wrong scale for solo founder
```

### Deep Dive Summary
```
📋 5S Deep Dive: OPP-003 — Freelancer Invoice Tool

Signal:    ████░ 4/5  (1.2K upvotes, 3 related threads, $50-100 WTP confirmed)
Size:      ███░░ 3/5  (TAM $2.1B, SAM $180M, SOM $1.8M achievable)
Shape:     ████░ 4/5  ($29/mo SaaS, 85% margins, low churn category)
Speed:     ████░ 4/5  (Stripe + PDF gen, 2-week MVP, solo-buildable)
Stress:    ███░░ 3/5  (FreshBooks/Wave exist but UX dated, no AI-native)

TOTAL: 18/25 — AMBER (strong signal but competitive pressure)

Recommendation: Build a landing page. If 50 signups in 48h from
r/freelance, proceed to MVP. If not, kill.
```

### Nightly Build Log
```
🌙 Nightly Build — Feb 25

Built:
• OPP-003 landing page (Next.js, deployed to Vercel)
• Updated competitive analysis for OPP-001
• Fixed Scout Reddit rate limiting bug

Commits:
• abc1234 — OPP-003 landing page + copy
• def5678 — Scout rate limit fix

Pipeline:
• OPP-001: SCORING (18/25 AMBER)
• OPP-003: TESTING (landing page live)
• OPP-005: KILLED (platform risk)
```

---

## Requirements

| What | Minimum | Recommended |
|------|---------|-------------|
| VPS | 1 CPU, 2GB RAM | 2 CPU, 4GB RAM |
| OS | Ubuntu 22.04 | Ubuntu 24.04 |
| Node.js | 18+ | 22+ |
| Cost (hosting) | $6/mo (Hetzner) | $12/mo (DigitalOcean) |
| Cost (AI API) | $30/mo | $50-80/mo |

**Total cost: $36-92/mo** — less than one SaaS subscription, runs your entire ops layer.

---

## Ready?

```bash
curl -fsSL https://raw.githubusercontent.com/Jmee67/clawd-up/main/install.sh | bash
```

Or visit [clawd-up.vercel.app](https://clawd-up.vercel.app) to configure online first.
