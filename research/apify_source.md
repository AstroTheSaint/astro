# Apify LinkedIn Sourcing — Memefluence Targeting Harness

Documents how to pull **founder / founding-team candidates in Los Angeles** via Apify for `research/test_batch_XX.md` scoring. **Research only — no messaging.**

---

## Recommended actor

**Actor ID:** `harvestapi/linkedin-profile-search`  
**Store:** https://apify.com/harvestapi/linkedin-profile-search

**Why this actor:**
- No LinkedIn cookies or login required
- Filters by **job title**, **location**, and **keywords** in one run
- Returns structured profile fields (headline, location, current company, experience)
- High success rate and large user base (suitable for repeatable batches)
- Supports `profileScraperMode: "Full"` for enriched public profile data

**Alternative (title-focused):** `apt_marble/linkedin-decision-makers-scraper-ceos-founders-executives` — good for CEO/Founder title lists, less granular on company HQ.

---

## Authentication

Set your token as an environment variable — **never commit it:**

```bash
export APIFY_TOKEN="YOUR_APIFY_TOKEN"
```

Apify console: https://console.apify.com/account/integrations

---

## Input query shape — "founders / founding team in Los Angeles"

Use **"Los Angeles"** (not "LA" alone) — LinkedIn geo autocomplete can mis-map abbreviations.

### Batch discovery run (10–25 profiles)

```json
{
  "profileScraperMode": "Full",
  "searchQuery": "founder",
  "currentJobTitles": [
    "Founder",
    "Co-Founder",
    "CEO",
    "Chief Executive Officer",
    "Founding Partner"
  ],
  "locations": [
    "Los Angeles"
  ],
  "industries": [],
  "maxItems": 25,
  "startPage": 1
}
```

### Narrower runs by ICP (run separately, merge in scoring)

**Music / entertainment founders:**
```json
{
  "searchQuery": "music",
  "currentJobTitles": ["Founder", "Co-Founder", "CEO"],
  "locations": ["Los Angeles"],
  "maxItems": 15,
  "profileScraperMode": "Full"
}
```

**Agency / creative founders:**
```json
{
  "searchQuery": "creative agency",
  "currentJobTitles": ["Founder", "Co-Founder", "CEO"],
  "locations": ["Los Angeles"],
  "maxItems": 15,
  "profileScraperMode": "Full"
}
```

**Brand / DTC founders:**
```json
{
  "searchQuery": "brand",
  "currentJobTitles": ["Founder", "Co-Founder", "CEO"],
  "locations": ["Los Angeles"],
  "maxItems": 15,
  "profileScraperMode": "Full"
}
```

---

## Run via API (Node)

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
  profileScraperMode: 'Full',
  searchQuery: 'founder',
  currentJobTitles: ['Founder', 'Co-Founder', 'CEO'],
  locations: ['Los Angeles'],
  maxItems: 25,
};

const run = await client.actor('harvestapi/linkedin-profile-search').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
```

## Run via CLI

```bash
export APIFY_TOKEN="YOUR_APIFY_TOKEN"

apify call harvestapi/linkedin-profile-search --input '{
  "profileScraperMode": "Full",
  "searchQuery": "founder",
  "currentJobTitles": ["Founder", "Co-Founder", "CEO"],
  "locations": ["Los Angeles"],
  "maxItems": 25
}'
```

---

## Scraped output → candidate schema

Map Apify dataset items into the harness candidate object before deep research:

| Apify field (typical) | Candidate schema field | Notes |
|---|---|---|
| `fullName` / `firstName` + `lastName` | `name` | Required |
| `headline` | `headline` | Raw LinkedIn headline |
| `profileUrl` / `linkedinUrl` | `linkedin_url` | Primary profile link |
| `location` / `locationName` | `person_location` | Used for criterion 2 |
| `currentPosition[].title` | `role` | Current title |
| `currentPosition[].companyName` | `company` | Current company name |
| `currentPosition[].companyLinkedinUrl` | `company_linkedin_url` | Follow for HQ research |
| `experience[]` | `experience` | Check founding-era roles (criterion 1) |
| `about` / `summary` | `bio_snippet` | Seed for deep research only — verify independently |

### Normalized candidate schema (JSON)

```json
{
  "batch_id": "test_batch_01",
  "name": "",
  "role": "",
  "company": "",
  "linkedin_url": "",
  "person_location": "",
  "company_location_claim": "",
  "icp_tag": "brand | music | agency | founder",
  "apify_source_id": "",
  "scraped_at": ""
}
```

After normalization, the agent **must not trust Apify alone**. Each criterion requires independent verification (company site, press, Wikipedia, official LinkedIn company page, etc.).

---

## Post-scrape pipeline

```
Apify run → normalize to candidate schema → deep research per person
          → score 3 hard criteria → find "specific true thing" or NO-SEND
          → write research/test_batch_XX.md → STOP for human gradesheet
```

**Hard rules:** No email. No LinkedIn messaging. No sending. Placeholder token only in docs.
