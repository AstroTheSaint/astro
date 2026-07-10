## scrape — Apify sourcing (LinkedIn / Instagram)

**Prefix:** `scrape`  
**Workspace:** `/data/.openclaw/workspace`  
**Script:** `bash scripts/openclaw_scrape.sh`

### Commands

```
scrape linkedin "founders los angeles" 25
scrape instagram "nasa humansofny" 10
```

Aliases: `li` → linkedin, `ig` → instagram

### Two-step flow (required)

**Step A — estimate only (no spend)**

```bash
cd /data/.openclaw/workspace && bash scripts/openclaw_scrape.sh linkedin "QUERY" N
```

Show Johnny the full cost preview output. **STOP. Wait for reply.**

**Step B — run only after Johnny says `go`**

```bash
cd /data/.openclaw/workspace && bash scripts/openclaw_scrape.sh linkedin "QUERY" N --go
```

Report:

- Run ID and item count
- Actual cost (`usageTotalUsd`)
- Paths: `research/raw/[date]_[source]_[query].json` and `research/normalized/[same].json`

### Rules

- `APIFY_TOKEN` must be in environment (never read from files, never log token)
- Max 50 items per run
- Never run `--go` without explicit `go` from Johnny
- Job ends at normalized JSON on disk
- No targeting analysis, no drafts, no outreach on this command
- If estimate fails, report error and stop

### Docs

- `config/apify_telegram.md`
- `config/apify_actors.md`
- `docs/MEMEFLUENCE_AGENT.md`
