# Apify — Telegram Command Wiring

How the OpenClaw agent handles scrape requests over Telegram.

---

## Commands

```
scrape linkedin "founders los angeles" 25
scrape instagram "nasa humansofny" 10
```

Aliases: `li`, `ig`

---

## Agent flow

```
1. User sends scrape command on Telegram
2. Agent parses → scripts/apify_scrape.mjs (estimate only first)
3. Agent replies with cost preview (formatTelegramEstimate output)
4. Agent STOPS and waits
5. User replies: go
6. Agent runs: node scripts/apify_scrape.mjs <args> --go
7. Agent reports file paths:
   - research/raw/[date]_[source]_[query].json
   - research/normalized/[same].json
8. STOP — no analysis, no outreach
```

---

## VPS setup (one time)

On the OpenClaw container or host where the agent runs:

```bash
# 1. Pull latest repo into agent workspace (or sync files)
cd /path/to/agent/workspace

# 2. Set Apify token in environment (NOT in git)
export APIFY_TOKEN="your_token_from_apify_console"

# 3. Persist token for container restarts (example)
# Add to docker-compose.yml environment section or /data/.openclaw/.env (gitignored on VPS)
```

Apify token: https://console.apify.com/account/integrations

---

## Test without Telegram

```bash
export APIFY_TOKEN="your_token"

# Estimate only (no spend)
node scripts/apify_scrape.mjs linkedin "founders los angeles" 5

# Small live test (5 profiles — confirm when prompted, or pass --go)
node scripts/apify_scrape.mjs linkedin "founders los angeles" 5 --go
```

Check output:

```bash
ls -la research/raw/
ls -la research/normalized/
```

---

## OpenClaw tool hook (add to TOOLS.md on VPS)

```markdown
### scrape
Run Apify sourcing. Usage: `scrape <linkedin|instagram> "<query>" <maxItems>`
- First call: estimate only, show cost, wait for user "go"
- Second call (after "go"): append `--go` and run
- Never run without cost preview and explicit "go"
```

Shell the agent can invoke:

```bash
cd /data/.openclaw/workspace && node scripts/apify_scrape.mjs linkedin "founders los angeles" 25
```

---

## Hard rules

- `APIFY_TOKEN` env only
- Cost estimate before every run
- User must reply `go`
- Max 50 items per run
- Job ends at normalized JSON on disk
- No outreach without Job 3 approval gate
