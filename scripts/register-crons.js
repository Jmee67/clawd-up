#!/usr/bin/env node
'use strict';

/**
 * Register Clawd Up cron jobs with the OpenClaw gateway API.
 * Reads cron definitions from ~/.openclaw/workspace/crons/*.json
 * and converts them to the gateway's expected format.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(process.env.HOME, '.openclaw', 'workspace');
const CRON_DIR = path.join(WORKSPACE, 'crons');
const GATEWAY_PORT = process.env.OPENCLAW_PORT || 3456;
const GATEWAY_TOKEN = process.env.OPENCLAW_TOKEN || '';

function gatewayRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: '127.0.0.1',
      port: GATEWAY_PORT,
      path: endpoint,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(GATEWAY_TOKEN ? { 'Authorization': `Bearer ${GATEWAY_TOKEN}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Convert Clawd Up cron format to OpenClaw gateway format.
 */
function convertCron(cronDef) {
  const agentMap = {
    'scout': 'scout',
    'researcher': 'researcher',
    'operator': 'main',
  };

  const agentId = agentMap[cronDef.agent] || cronDef.agent || 'main';

  // Parse schedule
  const schedule = {
    kind: 'cron',
    expr: cronDef.schedule,
    tz: cronDef.timezone || 'UTC',
  };

  // Build payload
  const payload = {
    kind: 'agentTurn',
    message: cronDef.prompt,
    timeoutSeconds: cronDef.timeoutSeconds || 300,
  };

  if (cronDef.model) {
    payload.model = cronDef.model;
  }

  // Build delivery
  const delivery = { mode: 'none' };
  if (cronDef.channel && cronDef.chat_id) {
    delivery.mode = 'announce';
    delivery.channel = cronDef.channel;
    delivery.to = cronDef.chat_id;
  }

  return {
    name: cronDef.name || cronDef.description || 'Clawd Up cron',
    agentId,
    schedule,
    sessionTarget: 'isolated',
    payload,
    delivery,
    enabled: true,
  };
}

async function main() {
  if (!fs.existsSync(CRON_DIR)) {
    console.log('  No crons directory found. Skipping cron registration.');
    return;
  }

  const files = fs.readdirSync(CRON_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('  No cron files found.');
    return;
  }

  // Check if gateway is reachable
  try {
    await gatewayRequest('GET', '/api/health');
  } catch {
    console.log('  Gateway not reachable on port ' + GATEWAY_PORT);
    console.log('  Start the gateway first: openclaw gateway start');
    console.log('  Then re-run: node scripts/register-crons.js');
    process.exit(1);
  }

  let registered = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(CRON_DIR, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const cronDef = JSON.parse(raw);
      const converted = convertCron(cronDef);

      const result = await gatewayRequest('POST', '/api/cron', converted);

      if (result.status >= 200 && result.status < 300) {
        console.log(`  ✓ ${cronDef.name || file}`);
        registered++;
      } else {
        console.log(`  ⚠ ${cronDef.name || file}: ${result.status} ${JSON.stringify(result.data).slice(0, 100)}`);
        failed++;
      }
    } catch (err) {
      console.log(`  ✗ ${file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`  Registered ${registered} cron(s)${failed > 0 ? `, ${failed} failed` : ''}`);
}

main().catch(err => {
  console.error('Cron registration failed:', err.message);
  process.exit(1);
});
