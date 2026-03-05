#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const workspace = process.env.OPENCLAW_WORKSPACE || path.join(process.env.HOME, '.openclaw', 'workspace');

const checks = [];

// Check SOUL.md exists
const soulPath = path.join(workspace, 'SOUL.md');
if (fs.existsSync(soulPath)) {
  checks.push({ name: 'SOUL.md', status: 'ok' });
} else {
  checks.push({ name: 'SOUL.md', status: 'missing', fix: 'Re-run setup: node ~/.openclaw/clawdup/setup.js' });
}

// Check memory dir
const memDir = path.join(workspace, 'memory');
if (fs.existsSync(memDir)) {
  const files = fs.readdirSync(memDir);
  checks.push({ name: 'Memory', status: 'ok', count: files.length });
} else {
  checks.push({ name: 'Memory', status: 'missing', fix: 'mkdir -p ~/.openclaw/workspace/memory' });
}

// Check MEMORY.md size
const memPath = path.join(workspace, 'MEMORY.md');
if (fs.existsSync(memPath)) {
  const lines = fs.readFileSync(memPath, 'utf8').split('\n').length;
  if (lines > 200) {
    checks.push({ name: 'MEMORY.md', status: 'over-limit', lines, max: 200 });
  } else {
    checks.push({ name: 'MEMORY.md', status: 'ok', lines });
  }
}

// Output
const failed = checks.filter(c => c.status !== 'ok');
if (failed.length === 0) {
  console.log('Health check: all OK');
} else {
  console.log(`Health check: ${failed.length} issue(s)`);
  for (const f of failed) {
    console.log(`  - ${f.name}: ${f.status}${f.fix ? ' → ' + f.fix : ''}`);
  }
}

process.exit(failed.length > 0 ? 1 : 0);
