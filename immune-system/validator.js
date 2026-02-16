#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ── Validation Rules ─────────────────────────────────────

const SIGNAL_REQUIRED_FIELDS = ['source', 'date', 'signal', 'triage_score'];
const DEEP_DIVE_SECTIONS = ['Signal', 'Size', 'Shape', 'Speed', 'Stress Test'];
const VALID_STAGES = ['SIGNAL', 'RESEARCHING', 'VALIDATED', 'SCORED', 'BUILDING', 'KILLED'];
const STAGE_ORDER = { SIGNAL: 0, RESEARCHING: 1, VALIDATED: 2, SCORED: 3, BUILDING: 4, KILLED: -1 };

function validateSignalFile(filePath) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');

  for (const field of SIGNAL_REQUIRED_FIELDS) {
    const patterns = [
      new RegExp(`^\\*\\*${field}`, 'im'),
      new RegExp(`^${field}:`, 'im'),
      new RegExp(`^## ${field}`, 'im'),
    ];
    if (!patterns.some(p => p.test(content))) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (content.includes('TODO') || content.includes('TBD') || content.includes('[placeholder]')) {
    errors.push('Contains placeholder text');
  }

  return { file: filePath, valid: errors.length === 0, errors };
}

function validateDeepDive(filePath) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');

  for (const section of DEEP_DIVE_SECTIONS) {
    if (!content.includes(`## ${section}`) && !content.includes(`# ${section}`)) {
      errors.push(`Missing 5S section: ${section}`);
    }
  }

  // Check for empty sections (heading followed immediately by another heading)
  const lines = content.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].startsWith('## ') && lines[i + 1].startsWith('## ')) {
      errors.push(`Empty section: ${lines[i].replace('## ', '')}`);
    }
  }

  if (!content.includes('Scoring Recommendation') && !content.includes('Score')) {
    errors.push('Missing scoring recommendation');
  }

  return { file: filePath, valid: errors.length === 0, errors };
}

function validatePipelineTransition(fromStage, toStage) {
  const errors = [];

  if (!VALID_STAGES.includes(fromStage) || !VALID_STAGES.includes(toStage)) {
    errors.push(`Invalid stage: ${fromStage} → ${toStage}`);
    return { valid: false, errors };
  }

  // KILLED is always valid
  if (toStage === 'KILLED') return { valid: true, errors: [] };

  const fromOrder = STAGE_ORDER[fromStage];
  const toOrder = STAGE_ORDER[toStage];

  if (toOrder !== fromOrder + 1) {
    errors.push(`Invalid transition: ${fromStage} → ${toStage} (must advance one stage at a time)`);
  }

  return { valid: errors.length === 0, errors };
}

// ── CLI ──────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const action = args.find((_, i) => args[i - 1] === '--action') || 'all';
  const target = args.find((_, i) => args[i - 1] === '--target');
  const workDir = args.find((_, i) => args[i - 1] === '--workdir') || process.cwd();

  const results = [];

  if (action === 'signal' || action === 'all') {
    const signalDirs = ['research/x-signals', 'research/demand-signals', 'research/web-signals'];
    for (const dir of signalDirs) {
      const fullDir = path.join(workDir, dir);
      if (!fs.existsSync(fullDir)) continue;
      const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md') && f !== '.gitkeep');
      for (const file of files) {
        results.push(validateSignalFile(path.join(fullDir, file)));
      }
    }
  }

  if (action === 'deep-dive' || action === 'all') {
    const ddDir = path.join(workDir, 'research', 'deep-dives');
    if (fs.existsSync(ddDir)) {
      const files = fs.readdirSync(ddDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        results.push(validateDeepDive(path.join(ddDir, file)));
      }
    }
  }

  // Output
  const failures = results.filter(r => !r.valid);
  if (failures.length === 0) {
    console.log(`✅ All ${results.length} files passed validation`);
  } else {
    console.log(`❌ ${failures.length}/${results.length} files failed validation:\n`);
    for (const f of failures) {
      console.log(`  ${f.file}`);
      for (const e of f.errors) {
        console.log(`    - ${e}`);
      }
    }
    process.exit(1);
  }
}

main();
