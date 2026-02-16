#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Approximate token costs per 1M tokens (USD)
const COST_PER_1M = {
  // Anthropic
  'claude-opus-4-6': { input: 15, output: 75 },
  'claude-sonnet-4-20250514': { input: 3, output: 15 },
  // OpenAI
  'gpt-4o': { input: 2.5, output: 10 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  // Google
  'gemini-2.0-pro': { input: 1.25, output: 5 },
  'gemini-2.0-flash': { input: 0.075, output: 0.3 },
};

const DAILY_BUDGET_DEFAULT = 5.00; // USD

function loadUsageLog(workDir) {
  const logPath = path.join(workDir, 'immune-system', 'usage.json');
  if (!fs.existsSync(logPath)) return [];
  return JSON.parse(fs.readFileSync(logPath, 'utf8'));
}

function logUsage(workDir, agent, model, inputTokens, outputTokens) {
  const logPath = path.join(workDir, 'immune-system', 'usage.json');
  const log = loadUsageLog(workDir);
  log.push({
    timestamp: new Date().toISOString(),
    agent,
    model,
    inputTokens,
    outputTokens,
  });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

function getDailyCost(log, date) {
  const dateStr = date || new Date().toISOString().split('T')[0];
  const todayEntries = log.filter(e => e.timestamp.startsWith(dateStr));
  let total = 0;

  for (const entry of todayEntries) {
    const rates = COST_PER_1M[entry.model];
    if (!rates) continue;
    total += (entry.inputTokens / 1_000_000) * rates.input;
    total += (entry.outputTokens / 1_000_000) * rates.output;
  }

  return { date: dateStr, entries: todayEntries.length, cost: Math.round(total * 100) / 100 };
}

function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'summary';
  const workDir = args.find((_, i) => args[i - 1] === '--workdir') || process.cwd();
  const budget = parseFloat(args.find((_, i) => args[i - 1] === '--budget') || DAILY_BUDGET_DEFAULT);

  if (action === 'log') {
    const agent = args.find((_, i) => args[i - 1] === '--agent');
    const model = args.find((_, i) => args[i - 1] === '--model');
    const input = parseInt(args.find((_, i) => args[i - 1] === '--input') || '0');
    const output = parseInt(args.find((_, i) => args[i - 1] === '--output') || '0');
    if (!agent || !model) {
      console.error('Usage: cost-monitor.js log --agent <name> --model <model> --input <tokens> --output <tokens>');
      process.exit(1);
    }
    logUsage(workDir, agent, model, input, output);
    console.log(`Logged: ${agent} ${model} ${input}in/${output}out`);
    return;
  }

  if (action === 'summary') {
    const log = loadUsageLog(workDir);
    if (log.length === 0) {
      console.log('No usage data yet. Run with "log" action to record usage.');
      return;
    }

    const today = getDailyCost(log);
    console.log(`📊 Cost Summary — ${today.date}`);
    console.log(`  Entries: ${today.entries}`);
    console.log(`  Cost: $${today.cost.toFixed(2)} / $${budget.toFixed(2)} budget`);

    if (today.cost > budget) {
      console.log(`  ⚠️  OVER BUDGET by $${(today.cost - budget).toFixed(2)}`);
    } else {
      console.log(`  ✅ Within budget ($${(budget - today.cost).toFixed(2)} remaining)`);
    }

    // Per-agent breakdown
    const byAgent = {};
    const todayEntries = log.filter(e => e.timestamp.startsWith(today.date));
    for (const entry of todayEntries) {
      if (!byAgent[entry.agent]) byAgent[entry.agent] = { input: 0, output: 0 };
      byAgent[entry.agent].input += entry.inputTokens;
      byAgent[entry.agent].output += entry.outputTokens;
    }
    if (Object.keys(byAgent).length > 0) {
      console.log('\n  Per-agent:');
      for (const [agent, tokens] of Object.entries(byAgent)) {
        console.log(`    ${agent}: ${tokens.input} in / ${tokens.output} out`);
      }
    }
  }
}

main();
