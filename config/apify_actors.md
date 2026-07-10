# Apify Actor Registry

Machine-readable source: `config/apify_actors.json`  
**Add new scrapers here without touching code.** New actor = new JSON entry + mapping block below.

Token: `APIFY_TOKEN` env var only. See `config/apify_client.md`.

---

## linkedin

| Field | Value |
|---|---|
| **Actor ID** | `harvestapi/linkedin-profile-search` |
| **Source tag** | `linkedin` |
| **Typical cost** | ~$0.01/profile + small compute overhead |
| **Default max** | 25 (hard cap 50) |

### Input example

```json
{
  "profileScraperMode": "Full",
  "searchQuery": "founder",
  "currentJobTitles": ["Founder", "Co-Founder", "CEO"],
  "locations": ["Los Angeles"],
  "maxItems": 25
}
```

Telegram: `scrape linkedin "founders los angeles" 25`  
→ `searchQuery` = `founders`, `locations` = `["Los Angeles"]` when query contains `los angeles`.

### Output fields we care about

`fullName`, `headline`, `linkedinUrl`, `location`, `currentPosition`, `experience`, `about`

### Raw → normalized mapping

| Normalized | Apify field(s) |
|---|---|
| `name` | `fullName` or `firstName` + `lastName` |
| `role` | `currentPosition[0].title` or `headline` |
| `company` | `currentPosition[0].companyName` |
| `person_location` | `location` or `locationName` |
| `links.linkedin` | `linkedinUrl` or `profileUrl` |
| `links.company_linkedin` | `currentPosition[0].companyLinkedinUrl` |
| `source` | `"linkedin"` |

---

## instagram

| Field | Value |
|---|---|
| **Actor ID** | `apify/instagram-profile-scraper` |
| **Source tag** | `instagram` |
| **Typical cost** | ~$0.005/profile |
| **Default max** | 25 (hard cap 50) |

### Input example

```json
{
  "usernames": ["nasa", "humansofny"],
  "resultsLimit": 10
}
```

Telegram: `scrape instagram "nasa humansofny" 10`  
→ splits quoted string into username list.

### Output fields we care about

`username`, `fullName`, `biography`, `followersCount`, `verified`, `externalUrl`, `url`

### Raw → normalized mapping

| Normalized | Apify field(s) |
|---|---|
| `name` | `fullName` or `username` |
| `role` | first line of `biography` (display only) |
| `company` | `externalUrl` if present |
| `person_location` | not available (leave empty) |
| `links.instagram` | `url` or constructed from `username` |
| `source` | `"instagram"` |

---

## Normalized candidate schema (all sources)

```json
{
  "name": "",
  "role": "",
  "company": "",
  "person_location": "",
  "links": {
    "linkedin": "",
    "instagram": "",
    "company_linkedin": "",
    "profile": ""
  },
  "headline": "",
  "bio_snippet": "",
  "source": "linkedin | instagram",
  "scraped_at": "ISO-8601",
  "scrape_id": "filename stem",
  "raw_ref": "research/raw/..."
}
```

---

## Adding a new actor

1. Add entry to `config/apify_actors.json`
2. Document input/output/mapping in this file
3. Add source alias to `scripts/apify_scrape.mjs` `SOURCES` map if needed
4. No other code changes required if mapping is complete
