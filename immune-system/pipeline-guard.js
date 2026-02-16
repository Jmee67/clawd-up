#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const VALID_TRANSITIONS = {
  SIGNAL: ['RESEARCHING', 'KILLED'],
  RESEARCHING: ['VALIDATED', 'KILLED'],
  VALIDATED: ['SCORED', 'KILLED'],
  SCORED: ['BUILDING', 'KILLED'],
  BUILDING: ['KILLED'],
  KILLED: [],
};

const STALE_THRESHOLD_DAYS = 14;

function parsePipeline(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const entries = [];
  const tableRegex = /\|\s*(OPP-\d+|[A-Z]+-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|/g;
  let match;
  while ((match = tableRegex.exec(content)) !== null) {
    entries.push({
      id: match[1].trim(),
      name: match[2].trim(),
      stage: match[3].trim(),
      score: match[4].trim(),
      lastUpdated: match[5].trim(),
      notes: match[6].trim(),
    });
  }
  return entries;
}

function checkTransition(fromStage, toStage) {
  const allowed = VALID_TRANSITIONS[fromStage];
  if (!allowed) return { valid: false, reason: `Unknown stage: ${fromStage}` };
  if (!allowed.includes(toStage)) {
    return { valid: false, reason: `${fromStage} → ${toStage} not allowed. Valid: ${allowed.join(', ')}` };
  }
  return { valid: true };
}

function checkStale(entries) {
  const now = Date.now();
  const stale = [];
  for (const entry of entries) {
    if (entry.stage === 'KILLED') continue;
    if (!entry.lastUpdated) continue;
    const updated = new Date(entry.lastUpdated).getTime();
    if (isNaN(updated)) continue;
    const daysSince = (now - updated) / (1000 * 60 * 60 * 24);
    if (daysSince > STALE_THRESHOLD_DAYS) {
      stale.push({ ...entry, daysSince: Math.round(daysSince) });
    }
  }
  return stale;
}

function checkGates(entries, workDir) {
  const issues = [];
  for (const entry of entries) {
    // SCORING requires completed deep dive
    if (entry.stage === 'VALIDATED' || entry.stage === 'SCORED') {
      const ddPath = path.join(workDir, 'research', 'deep-dives', `${entry.id}.md`);
      if (!fs.existsSync(ddPath)) {
        issues.push(`${entry.id}: in ${entry.stage} but no deep dive found at ${ddPath}`);
      }
    }
    // SCORED requires score
    if (entry.stage === 'SCORED' && !entry.score) {
      issues.push(`${entry.id}: in SCORED but no score recorded`);
    }
  }
  return issues;
}

function main() {
  const args = process.argv.slice(2);
  const workDir = args.find((_, i) => args[i - 1] === '--workdir') || process.cwd();
  const pipelinePath = path.join(workDir, 'PIPELINE.md');

  if (!fs.existsSync(pipelinePath)) {
    console.log('⚠️  No PIPELINE.md found');
    process.exit(0);
  }

  const entries = parsePipeline(pipelinePath);
  console.log(`Pipeline: ${entries.length} entries\n`);

  // Check stale
  const stale = checkStale(entries);
  if (stale.length > 0) {
    console.log('⚠️  Stale entries (>14 days no update):');
    for (const s of stale) {
      console.log(`  ${s.id} "${s.name}" — ${s.daysSince} days in ${s.stage}`);
    }
    console.log();
  }

  // Check gates
  const gateIssues = checkGates(entries, workDir);
  if (gateIssues.length > 0) {
    console.log('❌ Gate violations:');
    for (const issue of gateIssues) {
      console.log(`  ${issue}`);
    }
    process.exit(1);
  }

  if (stale.length === 0 && gateIssues.length === 0) {
    console.log('✅ Pipeline health: all clear');
  }
}

main();
