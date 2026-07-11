#!/usr/bin/env node
/**
 * Thin Apify REST client for OpenClaw agent.
 * No npm dependencies. Token from APIFY_TOKEN env only.
 */

const API_BASE = 'https://api.apify.com/v2';
const POLL_MS = 3000;
const MAX_POLL_ATTEMPTS = 400; // ~20 min

export function getToken() {
  const token = process.env.APIFY_TOKEN;
  if (!token || token === 'YOUR_APIFY_TOKEN') {
    throw new Error(
      'APIFY_TOKEN is not set. Export it in your environment. Never commit tokens.'
    );
  }
  return token;
}

/** Convert harvestapi/linkedin-profile-search → harvestapi~linkedin-profile-search */
export function toApiActorId(actorId) {
  return actorId.includes('~') ? actorId : actorId.replace('/', '~');
}

async function apifyFetch(path, options = {}) {
  const token = getToken();
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const msg = body?.error?.message || body?.message || res.statusText;
    throw new Error(`Apify API ${res.status}: ${msg}`);
  }
  return body;
}

export async function fetchActor(actorId) {
  const data = await apifyFetch(`/acts/${toApiActorId(actorId)}`);
  return data.data;
}

/**
 * Pre-run cost estimate. Uses actor pricingInfo when available.
 * Falls back to optional typicalCostPerItemUsd from registry.
 */
export async function estimateRunCost(actorId, maxItems, options = {}) {
  const actor = await fetchActor(actorId);
  const pricing = actor?.pricingInfos?.[0] || actor?.pricingInfo || null;
  const name = actor?.name || actorId;
  let method = 'unknown';
  let estimatedUsd = null;
  let note = '';

  if (pricing?.pricingModel === 'PRICE_PER_DATASET_ITEM') {
    method = 'per_dataset_item';
    const unit =
      pricing?.tieredPricing?.FREE?.pricePerUnitUsd ??
      pricing?.pricePerUnitUsd ??
      options.typicalCostPerItemUsd;
    if (unit != null) {
      estimatedUsd = Math.round(unit * maxItems * 10000) / 10000;
      note = `$${unit}/item × ${maxItems} items`;
    }
  } else if (pricing?.pricingModel === 'PAY_PER_EVENT') {
    method = 'pay_per_event';
    const unit = options.typicalCostPerItemUsd;
    if (unit != null) {
      estimatedUsd = Math.round(unit * maxItems * 10000) / 10000;
      note = `~$${unit}/profile (registry estimate) × ${maxItems}`;
    } else {
      note = 'Pay-per-event actor. Set typicalCostPerItemUsd in registry for estimate.';
    }
  } else if (pricing?.pricingModel === 'FREE') {
    method = 'free_actor';
    note = 'Actor is free but platform compute (CUs) still applies. Test run recommended.';
    estimatedUsd = options.typicalComputeUsd ?? 0.05;
  } else {
    note = 'Pricing model unknown. Use a small test run to calibrate.';
    if (options.typicalCostPerItemUsd != null) {
      estimatedUsd = Math.round(options.typicalCostPerItemUsd * maxItems * 10000) / 10000;
      note = `Registry fallback: ~$${options.typicalCostPerItemUsd}/item × ${maxItems}`;
    }
  }

  const summary = estimatedUsd != null
    ? `Estimated cost for "${name}": ~$${estimatedUsd.toFixed(2)} (${note})`
    : `Cost estimate unavailable for "${name}". ${note}`;

  return {
    actorId,
    actorName: name,
    maxItems,
    method,
    estimatedUsd,
    note,
    summary,
    pricingModel: pricing?.pricingModel ?? null,
  };
}

export async function startActorRun(actorId, input, options = {}) {
  const qs = new URLSearchParams();
  if (options.waitForFinish != null) qs.set('waitForFinish', String(options.waitForFinish));
  if (options.memoryMbytes != null) qs.set('memory', String(options.memoryMbytes));
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apifyFetch(`/acts/${toApiActorId(actorId)}/runs${query}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.data;
}

export async function getRun(runId) {
  const data = await apifyFetch(`/actor-runs/${runId}`);
  return data.data;
}

export async function waitForRun(runId) {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    const run = await getRun(runId);
    if (run.status === 'SUCCEEDED') return run;
    if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
      throw new Error(`Actor run ${runId} ended with status: ${run.status}`);
    }
    await sleep(POLL_MS);
  }
  throw new Error(`Actor run ${runId} timed out after polling`);
}

export async function runActorAndWait(actorId, input, options = {}) {
  const run = await startActorRun(actorId, input, { waitForFinish: 0, ...options });
  const finished = await waitForRun(run.id);
  const items = await getDatasetItems(finished.defaultDatasetId);
  return { run: finished, items };
}

export async function getDatasetItems(datasetId, options = {}) {
  const limit = options.limit ?? 1000;
  const all = [];
  let offset = 0;
  while (true) {
    const qs = new URLSearchParams({
      format: 'json',
      clean: '1',
      limit: String(Math.min(limit - all.length, 250)),
      offset: String(offset),
    });
    const data = await apifyFetch(`/datasets/${datasetId}/items?${qs}`);
    const batch = Array.isArray(data) ? data : [];
    all.push(...batch);
    if (batch.length < 250 || all.length >= limit) break;
    offset += batch.length;
  }
  return all;
}

import { fileURLToPath } from 'url';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// CLI smoke test (no run without token + subcommand)
async function main() {
  const [cmd, actorId, maxItemsStr] = process.argv.slice(2);
  if (cmd === 'estimate' && actorId) {
    const maxItems = parseInt(maxItemsStr || '25', 10);
    const est = await estimateRunCost(actorId, maxItems);
    console.log(JSON.stringify(est, null, 2));
    return;
  }
  if (cmd === 'actor' && actorId) {
    const actor = await fetchActor(actorId);
    console.log(JSON.stringify({ name: actor.name, username: actor.username, pricingInfos: actor.pricingInfos }, null, 2));
    return;
  }
  console.log(`Usage:
  APIFY_TOKEN=... node scripts/apify_client.mjs estimate <actorId> [maxItems]
  APIFY_TOKEN=... node scripts/apify_client.mjs actor <actorId>
`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
