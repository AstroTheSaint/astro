#!/usr/bin/env node
/**
 * Apify scrape command — mirrors Telegram: scrape linkedin "founders los angeles" 25
 *
 * Usage:
 *   node scripts/apify_scrape.mjs linkedin "founders los angeles" 25          # estimate only
 *   node scripts/apify_scrape.mjs linkedin "founders los angeles" 25 --go    # run after confirm
 *   node scripts/apify_scrape.mjs instagram "nasa humansofny" 5 --go
 *
 * Env: APIFY_TOKEN (required for --go)
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { estimateRunCost, runActorAndWait } from './apify_client.mjs';
import { loadRegistry, normalizeBatch } from './apify_normalize.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RAW_DIR = join(ROOT, 'research/raw');
const NORM_DIR = join(ROOT, 'research/normalized');
const HARD_CAP = 50;

const SOURCES = {
  linkedin: 'linkedin',
  li: 'linkedin',
  instagram: 'instagram',
  ig: 'instagram',
};

export function parseScrapeCommand(argv) {
  // scrape linkedin "founders los angeles" 25
  // or: linkedin "founders los angeles" 25 (when argv already stripped)
  const args = [...argv];
  if (args[0] === 'scrape') args.shift();

  const sourceRaw = (args[0] || '').toLowerCase();
  const sourceKey = SOURCES[sourceRaw];
  if (!sourceKey) {
    throw new Error(`Unknown source "${sourceRaw}". Use: linkedin | instagram`);
  }

  let query = args[1] || '';
  let maxItems = parseInt(args[2] || '25', 10);
  let go = false;
  let dryRun = false;

  for (let i = 3; i < args.length; i++) {
    if (args[i] === '--go') go = true;
    if (args[i] === '--dry-run') dryRun = true;
  }

  if (query.startsWith('"') && query.endsWith('"')) {
    query = query.slice(1, -1);
  }

  if (Number.isNaN(maxItems) || maxItems < 1) maxItems = 25;
  if (maxItems > HARD_CAP) {
    throw new Error(`maxItems ${maxItems} exceeds hard cap ${HARD_CAP}. Split into smaller batches.`);
  }

  return { sourceKey, query, maxItems, go, dryRun };
}

export function buildActorInput(sourceKey, query, maxItems) {
  const registry = loadRegistry();
  const actor = registry[sourceKey];
  if (!actor) throw new Error(`No registry entry for ${sourceKey}`);

  if (sourceKey === 'linkedin') {
    const q = query.toLowerCase();
    const location = q.includes('los angeles') || q.includes('la ')
      ? 'Los Angeles'
      : 'Los Angeles';
    const searchQuery = query
      .replace(/\blos angeles\b/gi, '')
      .replace(/\bla\b/gi, '')
      .trim() || 'founder';

    return {
      profileScraperMode: 'Full',
      searchQuery,
      currentJobTitles: ['Founder', 'Co-Founder', 'CEO', 'Chief Executive Officer'],
      locations: [location],
      maxItems,
      startPage: 1,
    };
  }

  if (sourceKey === 'instagram') {
    const usernames = query
      .split(/[\s,]+/)
      .map((u) => u.replace(/^@/, '').trim())
      .filter(Boolean)
      .slice(0, maxItems);
    return {
      usernames,
      resultsLimit: usernames.length || maxItems,
    };
  }

  throw new Error(`buildActorInput not implemented for ${sourceKey}`);
}

export function makeFileStem(sourceKey, query, date = new Date()) {
  const d = date.toISOString().slice(0, 10);
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
  return `${d}_${sourceKey}_${slug || 'query'}`;
}

export function formatTelegramEstimate(estimate, sourceKey, query, maxItems) {
  return [
    `Apify scrape preview`,
    `Source: ${sourceKey}`,
    `Query: ${query}`,
    `Max items: ${maxItems}`,
    `Actor: ${estimate.actorId}`,
    estimate.summary,
    ``,
    `Reply "go" to run. Anything else cancels.`,
  ].join('\n');
}

async function confirmGo() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('Type "go" to run this scrape (or anything else to cancel): ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'go');
    });
  });
}

export async function runScrape({ sourceKey, query, maxItems, go = false, dryRun = false }) {
  const registry = loadRegistry();
  const actor = registry[sourceKey];
  const input = buildActorInput(sourceKey, query, maxItems);

  const estimate = await estimateRunCost(actor.id, maxItems, {
    typicalCostPerItemUsd: actor.typical_cost_per_item_usd,
    typicalComputeUsd: actor.typical_compute_usd,
  });

  const preview = formatTelegramEstimate(estimate, sourceKey, query, maxItems);
  console.log(preview);
  console.log('');

  if (dryRun) {
    console.log('[dry-run] Stopping before spend.');
    return { status: 'dry_run', estimate, input };
  }

  let approved = go;
  if (!approved) {
    approved = await confirmGo();
  }
  if (!approved) {
    console.log('Cancelled. No Apify credits spent.');
    return { status: 'cancelled', estimate };
  }

  console.log('Running Apify actor...');
  const { run, items } = await runActorAndWait(actor.id, input);
  const actual = run.usageTotalUsd != null ? `$${run.usageTotalUsd}` : 'see Apify console';
  console.log(`Run ${run.id} finished. Items: ${items.length}. Actual cost: ${actual}`);

  const stem = makeFileStem(sourceKey, query);
  mkdirSync(RAW_DIR, { recursive: true });
  mkdirSync(NORM_DIR, { recursive: true });

  const rawPath = join(RAW_DIR, `${stem}.json`);
  const normPath = join(NORM_DIR, `${stem}.json`);

  const rawDoc = {
    meta: {
      source: sourceKey,
      query,
      maxItems,
      actorId: actor.id,
      runId: run.id,
      datasetId: run.defaultDatasetId,
      estimatedUsd: estimate.estimatedUsd,
      actualUsd: run.usageTotalUsd,
      scraped_at: new Date().toISOString(),
      item_count: items.length,
    },
    items,
  };
  writeFileSync(rawPath, JSON.stringify(rawDoc, null, 2));

  const normalized = normalizeBatch(items, sourceKey, {
    scrape_id: stem,
    raw_ref: `research/raw/${stem}.json`,
    apify_run_id: run.id,
    scraped_at: rawDoc.meta.scraped_at,
  });
  writeFileSync(normPath, JSON.stringify({ meta: rawDoc.meta, candidates: normalized }, null, 2));

  console.log(`Raw:        research/raw/${stem}.json`);
  console.log(`Normalized: research/normalized/${stem}.json`);

  return {
    status: 'ok',
    estimate,
    run,
    rawPath,
    normPath,
    itemCount: items.length,
    normalizedCount: normalized.length,
  };
}

async function main() {
  try {
    const parsed = parseScrapeCommand(process.argv.slice(2));
    await runScrape(parsed);
  } catch (err) {
    console.error(err.message);
    console.log(`
Usage:
  node scripts/apify_scrape.mjs linkedin "founders los angeles" 25
  node scripts/apify_scrape.mjs linkedin "founders los angeles" 5 --go
  node scripts/apify_scrape.mjs instagram "nasa humansofny" 2 --go

Telegram equivalent:
  scrape linkedin "founders los angeles" 25
  (agent shows estimate, you reply "go")
`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
