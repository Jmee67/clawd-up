#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function checkAgentOutput(workDir, agentName, daysBack) {
  const issues = [];
  const now = Date.now();
  const cutoff = now - (daysBack * 24 * 60 * 60 * 1000);

  // Check for recent output files
  const outputDirs = {
    scout: ['research/x-signals', 'research/demand-signals', 'research/web-signals'],
    researcher: ['research/deep-dives', 'research/validations'],
    operator: [], // Operator output is in memory/daily notes
  };

  const dirs = outputDirs[agentName] || [];
  let recentFiles = 0;

  for (const dir of dirs) {
    const fullDir = path.join(workDir, dir);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md') && f !== '.gitkeep');
    for (const file of files) {
      const stat = fs.statSync(path.join(fullDir, file));
      if (stat.mtimeMs > cutoff) recentFiles++;
    }
  }

  if (dirs.length > 0 && recentFiles === 0) {
    issues.push(`${agentName}: no output files in last ${daysBack} days`);
  }

  return issues;
}

function checkTriageCalibration(workDir) {
  const issues = [];
  const signalDirs = ['research/x-signals', 'research/demand-signals'];
  let totalSignals = 0;
  let highScores = 0;

  for (const dir of signalDirs) {
    const fullDir = path.join(workDir, dir);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(fullDir, file), 'utf8');
      const scoreMatch = content.match(/triage[_\s]?score[:\s]*(\d+)/i);
      if (scoreMatch) {
        totalSignals++;
        if (parseInt(scoreMatch[1]) >= 7) highScores++;
      }
    }
  }

  if (totalSignals > 10 && highScores / totalSignals > 0.6) {
    issues.push(`Triage calibration: ${Math.round(highScores/totalSignals*100)}% scoring 7+ (expected <40%). Threshold may be too low.`);
  }

  return issues;
}

function main() {
  const args = process.argv.slice(2);
  const workDir = args.find((_, i) => args[i - 1] === '--workdir') || process.cwd();
  const daysBack = parseInt(args.find((_, i) => args[i - 1] === '--days') || '2');

  const allIssues = [];

  // Check each agent
  for (const agent of ['scout', 'researcher', 'operator']) {
    allIssues.push(...checkAgentOutput(workDir, agent, daysBack));
  }

  // Check triage calibration
  allIssues.push(...checkTriageCalibration(workDir));

  if (allIssues.length === 0) {
    console.log('✅ No drift detected');
  } else {
    console.log(`⚠️  ${allIssues.length} drift issue(s) detected:\n`);
    for (const issue of allIssues) {
      console.log(`  - ${issue}`);
    }
  }
}

main();
