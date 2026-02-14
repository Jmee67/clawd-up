#!/usr/bin/env node
'use strict';

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { getModel } = require('./scripts/model-map');

// ── Helpers ──────────────────────────────────────────────

function ask(rl, question, defaultVal) {
  const suffix = defaultVal ? ` (${defaultVal})` : '';
  return new Promise(resolve => {
    rl.question(`${question}${suffix}: `, answer => {
      resolve(answer.trim() || defaultVal || '');
    });
  });
}

function fillTemplate(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function copyAndFill(srcDir, destDir, vars, files) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const content = fs.readFileSync(src, 'utf8');
    fs.writeFileSync(dest, fillTemplate(content, vars));
  }
}

function banner() {
  console.log(`
  ╔═══════════════════════════════════╗
  ║        🦞 Clawd Up v0.1          ║
  ║   AI Business Ops in One Command  ║
  ╚═══════════════════════════════════╝
  `);
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Clawd Up v0.1 — Setup Wizard

Usage: node setup.js [--help]

Interactive setup wizard that configures your OpenClaw agent team.
Generates agent configs, cron jobs, templates, and memory scaffolding.

No external dependencies required.
    `);
    process.exit(0);
  }

  banner();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const root = path.dirname(__filename);

  try {
    // Collect info
    const name = await ask(rl, '  What\'s your name?', '');
    if (!name) { console.log('  Name is required.'); process.exit(1); }

    const timezone = await ask(rl, '  Timezone?', 'UTC');
    const channel = await ask(rl, '  Notification channel (telegram/discord)?', 'telegram');

    let chat_id = '';
    let bot_token = '';
    let webhook_url = '';

    if (channel === 'telegram') {
      bot_token = await ask(rl, '  Telegram bot token?', '');
      chat_id = await ask(rl, '  Telegram chat ID?', '');
    } else if (channel === 'discord') {
      webhook_url = await ask(rl, '  Discord webhook URL?', '');
    }

    const provider = await ask(rl, '  Model provider (anthropic/openai/google)?', 'anthropic');
    const api_key = await ask(rl, `  ${provider} API key?`, '');
    const tier = await ask(rl, '  Tier (free/starter/pro)?', 'free');

    rl.close();

    // Resolve models
    const model_scout = getModel('scout', provider);
    const model_researcher = getModel('researcher', provider);
    const model_operator = getModel('operator', provider);

    const vars = {
      name, timezone, channel, chat_id, bot_token, webhook_url,
      provider, api_key, tier,
      model_scout, model_researcher, model_operator,
    };

    // Determine output directory (OpenClaw workspace or current dir)
    const outDir = process.env.OPENCLAW_WORKSPACE || process.cwd();
    console.log(`\n  Generating configs to: ${outDir}\n`);

    // 1. Scout agent
    console.log('  ✓ Scout agent');
    copyAndFill(
      path.join(root, 'agents', 'scout'),
      path.join(outDir, 'agents', 'scout'),
      vars,
      ['SOUL.md', 'HEARTBEAT.md', 'TOOLS.md']
    );

    // 2. Templates
    console.log('  ✓ Templates');
    copyAndFill(
      path.join(root, 'templates'),
      outDir,
      vars,
      ['PIPELINE.md', 'RUBRIC.md', 'MEMORY.md', 'AGENTS.md']
    );

    // 3. Cron jobs
    console.log('  ✓ Cron jobs');
    const cronDir = path.join(root, 'crons');
    const cronOutDir = path.join(outDir, 'crons');
    fs.mkdirSync(cronOutDir, { recursive: true });
    const cronFiles = fs.readdirSync(cronDir).filter(f => f.endsWith('.json'));
    for (const file of cronFiles) {
      const raw = fs.readFileSync(path.join(cronDir, file), 'utf8');
      const filled = fillTemplate(raw, vars);
      fs.writeFileSync(path.join(cronOutDir, file), filled);
    }

    // 4. Research folders
    console.log('  ✓ Research folders');
    for (const dir of ['research/x-signals', 'research/web-signals', 'research/demand-signals', 'research/validations']) {
      fs.mkdirSync(path.join(outDir, dir), { recursive: true });
      fs.writeFileSync(path.join(outDir, dir, '.gitkeep'), '');
    }

    // 5. Memory scaffold
    console.log('  ✓ Memory scaffold');
    fs.mkdirSync(path.join(outDir, 'memory'), { recursive: true });
    fs.writeFileSync(path.join(outDir, 'memory', '.gitkeep'), '');

    // Summary
    console.log(`
  ╔═══════════════════════════════════╗
  ║         Setup Complete! 🎉        ║
  ╚═══════════════════════════════════╝

  Agent: Scout (${model_scout})
  Channel: ${channel}
  Timezone: ${timezone}
  Tier: ${tier}

  Next steps:
  1. Start OpenClaw: openclaw gateway start
  2. Your first daily brief arrives at 8am ${timezone}
  3. Check PIPELINE.md to track opportunities
  `);

  } catch (err) {
    rl.close();
    console.error('  Error:', err.message);
    process.exit(1);
  }
}

main();
