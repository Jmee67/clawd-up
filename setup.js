#!/usr/bin/env node
'use strict';

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { getModel } = require('./scripts/model-map');
const { TIERS, getTier, validateLicense } = require('./scripts/license');

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
    if (!fs.existsSync(src)) continue;
    const dest = path.join(destDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const content = fs.readFileSync(src, 'utf8');
    fs.writeFileSync(dest, fillTemplate(content, vars));
  }
}

function banner() {
  console.log(`
  ╔═══════════════════════════════════╗
  ║        🦞 Clawd Up v0.3          ║
  ║   AI Business Ops in One Command  ║
  ╚═══════════════════════════════════╝
  `);
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Clawd Up v0.3 — Setup Wizard

Usage: node setup.js [--help]

Interactive setup wizard that configures your OpenClaw agent team.
Generates agent configs, cron jobs, templates, and memory scaffolding.

Plans:
  Clawd Up ($19 one-time) — Full agent team. Scout, Researcher, Operator.
  + Updates ($9/mo)       — Weekly config updates from our live system.

No external dependencies required.
    `);
    process.exit(0);
  }

  banner();

  const root = __dirname;
  const fromConfig = process.argv.includes('--from-config');

  let name, timezone, channel, chat_id, bot_token, webhook_url;
  let work_style, annoyances, work_context, priorities;
  let provider, api_key, tier, license_key, licenseValid;

  try {

  if (fromConfig && process.env.CLAWD_CONFIG) {
    // Pre-filled from web onboarding
    const cfg = JSON.parse(process.env.CLAWD_CONFIG);
    name = cfg.name;
    timezone = cfg.timezone || 'UTC';
    channel = cfg.channel || 'telegram';
    chat_id = cfg.chat_id || '';
    bot_token = cfg.bot_token || '';
    webhook_url = cfg.webhook_url || '';
    work_style = cfg.work_style || 'direct';
    annoyances = cfg.annoyances || '';
    work_context = cfg.work_context || '';
    priorities = cfg.priorities || '';
    provider = cfg.provider || 'anthropic';
    api_key = cfg.api_key || '';
    tier = cfg.tier || 'free';
    license_key = cfg.license_key || '';
    licenseValid = false;

    console.log(`  Using config from web onboarding for ${name}`);
  } else {
    // Interactive wizard
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    name = await ask(rl, '  What\'s your name?', '');
    if (!name) { console.log('  Name is required.'); process.exit(1); }

    timezone = await ask(rl, '  Timezone?', 'UTC');
    channel = await ask(rl, '  Notification channel (telegram/discord)?', 'telegram');

    chat_id = '';
    bot_token = '';
    webhook_url = '';

    if (channel === 'telegram') {
      bot_token = await ask(rl, '  Telegram bot token?', '');
      chat_id = await ask(rl, '  Telegram chat ID?', '');
    } else if (channel === 'discord') {
      webhook_url = await ask(rl, '  Discord webhook URL?', '');
    }

    console.log('\n  Quick personality setup (press Enter to skip any):');
    work_style = await ask(rl, '  How should your agent communicate? (direct/casual/formal)', 'direct');
    annoyances = await ask(rl, '  What annoys you about AI assistants?', '');
    work_context = await ask(rl, '  What do you do? (one line)', '');
    priorities = await ask(rl, '  Current priorities? (one line)', '');

    provider = await ask(rl, '  Model provider (anthropic/openai/google)?', 'anthropic');
    api_key = await ask(rl, `  ${provider} API key?`, '');

    console.log('\n  Tiers:');
    console.log('    free    — Scout only ($0/mo)');
    console.log('    starter — Scout + Researcher ($29/mo)');
    console.log('    pro     — Full team + immune system ($49/mo)');
    tier = await ask(rl, '\n  Tier?', 'free');

    license_key = '';
    licenseValid = false;
    if (tier !== 'free') {
      license_key = await ask(rl, '  License key (from lemonsqueezy.com)?', '');
      if (license_key) {
        console.log('\n  Validating license...');
        try {
          const result = await validateLicense(license_key);
          if (result.valid) {
            console.log(`  ✅ License valid — ${result.tier} tier`);
            licenseValid = true;
          } else {
            console.log('  ❌ License invalid. Falling back to free tier.');
          }
        } catch (err) {
          console.log(`  ⚠️  Could not validate (${err.message}). Proceeding with selected tier.`);
          licenseValid = true;
        }
      } else {
        console.log('  ⚠️  No license key. Features will be limited to free tier.');
      }
    }

    rl.close();
  }

    const effectiveTier = (tier === 'free' || (!license_key && tier !== 'free')) ? 'free' : tier;
    const tierDef = getTier(effectiveTier);

    // Resolve models
    const model_scout = getModel('scout', provider);
    const model_researcher = getModel('researcher', provider);
    const model_operator = getModel('operator', provider);

    const vars = {
      name, timezone, channel, chat_id, bot_token, webhook_url,
      provider, api_key, tier: effectiveTier, license_key,
      model_scout, model_researcher, model_operator,
      work_style: work_style || 'direct',
      annoyances: annoyances || '',
      work_context: work_context || '',
      priorities: priorities || '',
    };

    // Determine output directory
    const outDir = process.env.OPENCLAW_WORKSPACE || process.cwd();
    console.log(`\n  Generating configs to: ${outDir}\n`);

    // 1. Scout agent (all tiers)
    console.log('  ✓ Scout agent');
    copyAndFill(
      path.join(root, 'agents', 'scout'),
      path.join(outDir, 'agents', 'scout'),
      vars,
      ['SOUL.md', 'HEARTBEAT.md', 'TOOLS.md']
    );

    // 2. Researcher agent (starter + pro)
    if (tierDef.agents.includes('researcher')) {
      console.log('  ✓ Researcher agent');
      copyAndFill(
        path.join(root, 'agents', 'researcher'),
        path.join(outDir, 'agents', 'researcher'),
        vars,
        ['SOUL.md', 'HEARTBEAT.md', 'TOOLS.md']
      );
    }

    // 3. Operator agent (pro only)
    if (tierDef.agents.includes('operator')) {
      console.log('  ✓ Operator agent');
      copyAndFill(
        path.join(root, 'agents', 'operator'),
        path.join(outDir, 'agents', 'operator'),
        vars,
        ['SOUL.md', 'HEARTBEAT.md', 'TOOLS.md']
      );
    }

    // 4. Templates
    console.log('  ✓ Templates');
    copyAndFill(
      path.join(root, 'templates'),
      outDir,
      vars,
      ['PIPELINE.md', 'RUBRIC.md', 'MEMORY.md', 'AGENTS.md']
    );

    // 5. Cron jobs (filtered by tier)
    console.log('  ✓ Cron jobs');
    const cronDir = path.join(root, 'crons');
    const cronOutDir = path.join(outDir, 'crons');
    fs.mkdirSync(cronOutDir, { recursive: true });
    const cronFiles = fs.readdirSync(cronDir).filter(f => f.endsWith('.json'));
    let cronCount = 0;
    for (const file of cronFiles) {
      const raw = fs.readFileSync(path.join(cronDir, file), 'utf8');
      const cronDef = JSON.parse(raw);

      // Check if cron is available for this tier
      if (cronDef.tier && cronDef.tier !== 'free') {
        const cronTierOrder = { free: 0, starter: 1, pro: 2 };
        if ((cronTierOrder[effectiveTier] || 0) < (cronTierOrder[cronDef.tier] || 0)) {
          continue; // Skip crons above user's tier
        }
      }

      // Check if the agent for this cron is available
      if (cronDef.agent && !tierDef.agents.includes(cronDef.agent)) {
        continue;
      }

      const filled = fillTemplate(raw, vars);
      fs.writeFileSync(path.join(cronOutDir, file), filled);
      cronCount++;
    }
    console.log(`    (${cronCount} crons for ${tierDef.name} tier)`);

    // 6. Immune system (pro only)
    if (tierDef.immuneSystem) {
      console.log('  ✓ Immune system');
      const immuneSrc = path.join(root, 'immune-system');
      const immuneDest = path.join(outDir, 'immune-system');
      fs.mkdirSync(immuneDest, { recursive: true });
      const immuneFiles = fs.readdirSync(immuneSrc).filter(f => f.endsWith('.js') || f.endsWith('.md'));
      for (const file of immuneFiles) {
        fs.copyFileSync(path.join(immuneSrc, file), path.join(immuneDest, file));
      }
    }

    // 7. Research folders
    console.log('  ✓ Research folders');
    const researchDirs = ['research/x-signals', 'research/web-signals', 'research/demand-signals', 'research/validations'];
    if (tierDef.deepDives) {
      researchDirs.push('research/deep-dives', 'research/triage');
    }
    for (const dir of researchDirs) {
      fs.mkdirSync(path.join(outDir, dir), { recursive: true });
      fs.writeFileSync(path.join(outDir, dir, '.gitkeep'), '');
    }

    // 8. Memory scaffold
    console.log('  ✓ Memory scaffold');
    fs.mkdirSync(path.join(outDir, 'memory'), { recursive: true });
    fs.writeFileSync(path.join(outDir, 'memory', '.gitkeep'), '');

    // 9. License file
    if (license_key) {
      fs.writeFileSync(path.join(outDir, '.clawd-license.json'), JSON.stringify({
        licenseKey: license_key,
        tier: effectiveTier,
        valid: licenseValid,
        checkedAt: new Date().toISOString(),
      }, null, 2));
    }

    // Summary
    const agents = tierDef.agents.map(a => {
      const models = { scout: model_scout, researcher: model_researcher, operator: model_operator };
      return `${a.charAt(0).toUpperCase() + a.slice(1)} (${models[a]})`;
    });

    console.log(`
  ╔═══════════════════════════════════╗
  ║         Setup Complete! 🎉        ║
  ╚═══════════════════════════════════╝

  Tier: ${tierDef.name} ($${tierDef.price}/mo)
  Agents: ${agents.join(', ')}
  Crons: ${cronCount} scheduled jobs
  Channel: ${channel}
  Timezone: ${timezone}
  Immune System: ${tierDef.immuneSystem ? 'enabled' : 'not included'}

  Next steps:
  1. Start OpenClaw: openclaw gateway start
  2. Your first daily brief arrives at 8am ${timezone}
  3. Check PIPELINE.md to track opportunities
  ${effectiveTier === 'free' ? '\n  Upgrade to Starter ($29/mo) for deep dives and web research.\n  Upgrade to Pro ($49/mo) for the full agent team.' : ''}
  `);

  } catch (err) {
    rl.close();
    console.error('  Error:', err.message);
    process.exit(1);
  }
}

main();
