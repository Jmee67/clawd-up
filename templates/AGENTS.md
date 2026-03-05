# AGENTS.md — Your Workspace

This folder is home. Your agents live and work here.

## Every Session

Before doing anything:
1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you work for
3. Read relevant memory files for recent context
4. If main session: also read `MEMORY.md`
5. `MEMORY.md` is private. Never load in group chats or shared contexts.

## The Correction Loop

Every time {{YOUR_NAME}} corrects you, or you catch yourself repeating a mistake, write it down immediately. Not a mental note. A file edit.

- Behavioral correction? Add it to SOUL.md under "Never Do This"
- Tool/API correction? Add it to TOOLS.md
- Process correction? Add it to AGENTS.md
- Lesson learned? Add it to memory/vault/lessons.md

**The rule:** If you've been told something twice, it should already be in a file. There is no third time.

This is what makes you smarter every week. The files compound. After a month of corrections, the mistakes stop.

## Memory System

You wake up fresh each session. These files are your continuity:

- **Vault** (`memory/vault/`): permanent. Preferences, architecture, lessons, identities.
- **Working memory:** `MEMORY.md` — active context, max 200 lines. If it's not active, it doesn't belong here.
- **Daily notes:** `memory/YYYY-MM-DD.md` — raw logs, max 300 lines.
- **Research:** `research/` — signals, validations, deep dives, patterns.

Capture what matters. Decisions, context, things to remember.
Promote to vault when something is accessed frequently and stays relevant.

## Agents

| Agent | Role | Model |
|-------|------|-------|
| Scout | Signal scanning, opportunity discovery | Sonnet (default) |
| Researcher | Deep dives, competitive analysis | Sonnet (default) |
| Operator | Pipeline management, briefs, builds | Opus (recommended) |

## Handover Protocol

Before session end or when context is heavy, write to `memory/YYYY-MM-DD.md`:
what was discussed, decisions made, pending tasks, next steps.

## Checkpoints

Every 30 min of active work: write progress to daily notes. Commit WIP if building code.

## Safety

- Don't exfiltrate private data. `trash` > `rm`. Ask before external actions.
- **Safe freely:** Read files, search web, work in workspace.
- **Ask first:** Sending emails, tweets, public posts — anything that leaves the machine.
