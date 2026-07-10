# Apify Client — Connection & Usage

Thin wrapper for the OpenClaw agent to call Apify actors. **Token via environment only.**

---

## Authentication

| Variable | Required | Example |
|---|---|---|
| `APIFY_TOKEN` | Yes | Set locally or on VPS — **never commit** |

```bash
# Local shell or VPS container env (not in git)
export APIFY_TOKEN="YOUR_APIFY_TOKEN"
```

Apify console: https://console.apify.com/account/integrations

The agent module reads `process.env.APIFY_TOKEN` (Node) or fails fast with a clear error. No fallback files, no `.env` committed to the repo.

---

## Base API

| Item | Value |
|---|---|
| Base URL | `https://api.apify.com/v2` |
| Auth header | `Authorization: Bearer $APIFY_TOKEN` |
| Client module | `scripts/apify_client.mjs` |

### Endpoints the client uses

| Action | Method | Path |
|---|---|---|
| Get actor metadata (pricing) | GET | `/acts/{actorId}` |
| Start actor run | POST | `/acts/{actorId}/runs` |
| Poll run status | GET | `/actor-runs/{runId}` |
| Fetch dataset items | GET | `/datasets/{datasetId}/items` |

Actor IDs use the `username~actor-name` format in API URLs (slashes become tildes).  
Example: `harvestapi/linkedin-profile-search` → `harvestapi~linkedin-profile-search`

---

## Rate & cost awareness

**Apify credits are real money.** Every actor run consumes credits.

### Before every run (required)

1. Call `estimateRunCost(actorId, maxItems)` from `scripts/apify_client.mjs`
2. Log the estimate to Telegram / stdout
3. **Wait for Johnny's explicit `go`** before calling `runActorAndWait()`

### What drives cost

| Factor | Notes |
|---|---|
| Compute units (CUs) | RAM × runtime. ~$0.13–$0.20 per CU depending on plan |
| Pay-per-result actors | Charged per dataset item returned |
| Pay-per-event actors | Charged per event type (profile scraped, page fetched, etc.) |
| Storage / proxy | Usually small vs compute on LinkedIn/Instagram runs |

### Estimation logic (client)

`estimateRunCost()` reads actor `pricingInfo` from the Apify API when available:

- **PRICE_PER_DATASET_ITEM** → `pricePerUnitUsd × maxItems` (floor estimate)
- **PAY_PER_EVENT** → uses `typical_cost_per_item_usd` from `config/apify_actors.md` registry as fallback
- **Unknown / FREE** → logs a warning and suggests a small test run first

Estimates are **lower bounds**. Actual cost appears in `usageTotalUsd` on the completed run. The client logs both estimate (pre-run) and actual (post-run).

### Batch size guardrails

| Rule | Limit |
|---|---|
| Default max items | 25 |
| Hard cap without override | 50 |
| Telegram scrape command | Agent refuses > 50 unless Johnny confirms twice |

Keep batches modest. No aggressive crawling. One actor run per Telegram command unless explicitly batched.

---

## Client module API

```javascript
import {
  getToken,
  toApiActorId,
  fetchActor,
  estimateRunCost,
  runActorAndWait,
  getDatasetItems,
  getRun,
} from './scripts/apify_client.mjs';
```

| Function | Purpose |
|---|---|
| `getToken()` | Returns `APIFY_TOKEN` or throws |
| `toApiActorId('user/actor')` | Converts to `user~actor` for API paths |
| `fetchActor(actorId)` | Actor metadata + pricing |
| `estimateRunCost(actorId, maxItems)` | Pre-run cost estimate object |
| `runActorAndWait(actorId, input, options)` | Start run, poll until done |
| `getDatasetItems(datasetId)` | All items from default dataset |
| `getRun(runId)` | Run status + `usageTotalUsd` actual cost |

### Example (manual / agent internal)

```javascript
import { estimateRunCost, runActorAndWait, getDatasetItems } from './scripts/apify_client.mjs';

const actorId = 'harvestapi/linkedin-profile-search';
const maxItems = 25;

const estimate = await estimateRunCost(actorId, maxItems);
console.log(estimate.summary);
// → STOP HERE. Wait for Johnny's "go".

const { run, items } = await runActorAndWait(actorId, {
  profileScraperMode: 'Full',
  searchQuery: 'founder',
  currentJobTitles: ['Founder', 'Co-Founder', 'CEO'],
  locations: ['Los Angeles'],
  maxItems,
});
console.log(`Actual cost: $${run.usageTotalUsd}`);
```

---

## Where this fits in the pipeline

```
Telegram: scrape linkedin "founders los angeles" 25
    → (Step 3) map to actor + input
    → estimateRunCost() → show Johnny → wait for "go"
    → runActorAndWait()
    → (Step 3) save research/raw/[date]_[source]_[query].json
    → (Step 4) normalize → research/normalized/[same].json
```

**This job ends at normalized data on disk.** No analysis, no documents, no outreach without Job 3 approval gate.

---

## Security checklist

- [ ] `APIFY_TOKEN` set in env on VPS, not in repo
- [ ] No token in `openclaw.json`, Telegram config, or committed files
- [ ] Cost estimate shown before every run
- [ ] Johnny confirms with `go` before spend
