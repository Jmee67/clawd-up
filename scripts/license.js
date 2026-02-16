#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Tier Definitions ─────────────────────────────────────

const TIERS = {
  free: {
    name: 'Free',
    price: 0,
    agents: ['scout'],
    crons: ['signal-scan-morning', 'signal-scan-evening'],
    features: ['basic-signals', 'pipeline'],
    maxSignalsPerDay: 10,
    maxPipelineEntries: 5,
    immuneSystem: false,
    deepDives: false,
  },
  starter: {
    name: 'Starter',
    price: 29,
    agents: ['scout', 'researcher'],
    crons: ['signal-scan-morning', 'signal-scan-evening', 'daily-brief', 'web-research', 'demand-hunt', 'deep-dive'],
    features: ['basic-signals', 'pipeline', 'deep-dives', 'web-research', 'daily-briefs'],
    maxSignalsPerDay: 50,
    maxPipelineEntries: 25,
    immuneSystem: false,
    deepDives: true,
  },
  pro: {
    name: 'Pro',
    price: 49,
    agents: ['scout', 'researcher', 'operator'],
    crons: ['all'],
    features: ['basic-signals', 'pipeline', 'deep-dives', 'web-research', 'daily-briefs', 'immune-system', 'nightly-builds', 'triage', 'operator'],
    maxSignalsPerDay: -1, // unlimited
    maxPipelineEntries: -1,
    immuneSystem: true,
    deepDives: true,
  },
};

// ── License Validation ───────────────────────────────────

const LICENSE_CACHE_FILE = '.clawd-license.json';

function getCachePath(workDir) {
  return path.join(workDir || process.cwd(), LICENSE_CACHE_FILE);
}

function readCache(workDir) {
  const cachePath = getCachePath(workDir);
  if (!fs.existsSync(cachePath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    // Cache valid for 24 hours
    if (Date.now() - new Date(data.checkedAt).getTime() < 24 * 60 * 60 * 1000) {
      return data;
    }
  } catch (e) {}
  return null;
}

function writeCache(workDir, data) {
  const cachePath = getCachePath(workDir);
  fs.writeFileSync(cachePath, JSON.stringify({
    ...data,
    checkedAt: new Date().toISOString(),
  }, null, 2));
}

function validateWithLemonSqueezy(licenseKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ license_key: licenseKey });

    const options = {
      hostname: 'api.lemonsqueezy.com',
      port: 443,
      path: '/v1/licenses/validate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({
            valid: data.valid === true,
            tier: data.meta?.variant_name?.toLowerCase() || 'starter',
            email: data.meta?.customer_email,
            expiresAt: data.license_key?.expires_at,
            status: data.license_key?.status,
          });
        } catch (e) {
          reject(new Error(`Invalid response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function validateLicense(licenseKey, workDir) {
  // Check cache first
  const cached = readCache(workDir);
  if (cached && cached.licenseKey === licenseKey && cached.valid) {
    return { ...cached, fromCache: true };
  }

  // Validate with LemonSqueezy
  try {
    const result = await validateWithLemonSqueezy(licenseKey);
    const data = { licenseKey, ...result };
    if (result.valid) writeCache(workDir, data);
    return data;
  } catch (err) {
    // If API is unreachable but we have a valid cache (even expired), use it
    if (cached && cached.valid) {
      return { ...cached, fromCache: true, offlineGrace: true };
    }
    throw new Error(`License validation failed: ${err.message}`);
  }
}

function getTier(tierName) {
  return TIERS[tierName] || TIERS.free;
}

function checkFeature(tier, feature) {
  const tierDef = getTier(tier);
  return tierDef.features.includes(feature);
}

function checkAgent(tier, agentName) {
  const tierDef = getTier(tier);
  return tierDef.agents.includes(agentName);
}

// ── CLI ──────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'info';

  if (action === 'info') {
    console.log('Clawd Up Tiers:\n');
    for (const [key, tier] of Object.entries(TIERS)) {
      console.log(`  ${tier.name} ($${tier.price}/mo)`);
      console.log(`    Agents: ${tier.agents.join(', ')}`);
      console.log(`    Features: ${tier.features.join(', ')}`);
      console.log(`    Signals/day: ${tier.maxSignalsPerDay === -1 ? 'unlimited' : tier.maxSignalsPerDay}`);
      console.log(`    Immune system: ${tier.immuneSystem ? 'yes' : 'no'}`);
      console.log();
    }
    return;
  }

  if (action === 'validate') {
    const key = args[1] || process.env.CLAWD_LICENSE_KEY;
    if (!key) {
      console.error('Usage: license.js validate <license-key>');
      console.error('Or set CLAWD_LICENSE_KEY env var');
      process.exit(1);
    }

    try {
      const result = await validateLicense(key);
      if (result.valid) {
        console.log(`✅ License valid — ${getTier(result.tier).name} tier`);
        if (result.fromCache) console.log('  (from cache)');
        if (result.offlineGrace) console.log('  (offline grace period)');
        console.log(`  Email: ${result.email || 'N/A'}`);
        console.log(`  Expires: ${result.expiresAt || 'never'}`);
      } else {
        console.log('❌ License invalid or expired');
        process.exit(1);
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  if (action === 'check-feature') {
    const tier = args[1];
    const feature = args[2];
    if (!tier || !feature) {
      console.error('Usage: license.js check-feature <tier> <feature>');
      process.exit(1);
    }
    const allowed = checkFeature(tier, feature);
    console.log(allowed ? `✅ ${feature} available on ${tier}` : `❌ ${feature} not available on ${tier}`);
    process.exit(allowed ? 0 : 1);
  }

  if (action === 'check-agent') {
    const tier = args[1];
    const agent = args[2];
    if (!tier || !agent) {
      console.error('Usage: license.js check-agent <tier> <agent>');
      process.exit(1);
    }
    const allowed = checkAgent(tier, agent);
    console.log(allowed ? `✅ ${agent} available on ${tier}` : `❌ ${agent} not available on ${tier}`);
    process.exit(allowed ? 0 : 1);
  }

  console.log('Usage: license.js [info|validate|check-feature|check-agent]');
}

module.exports = { TIERS, getTier, checkFeature, checkAgent, validateLicense };

if (require.main === module) main();
