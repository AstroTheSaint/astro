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

You are usually inside the **OpenClaw container** (`openclaw-wtm2-openclaw-1`). Scripts live in the **agent workspace**, not `~` or `/data/scripts`.

### Install files (container has no git repo)

```bash
# One-command install from GitHub
curl -fsSL https://raw.githubusercontent.com/AstroTheSaint/astro/cursor/apify-integration-4304/scripts/install_apify_vps.sh | bash
```

Or manually:

```bash
cd /data/.openclaw/workspace
mkdir -p scripts config research/raw research/normalized
# then curl each file — see scripts/install_apify_vps.sh
```

### Set token and test

```bash
cd /data/.openclaw/workspace

export APIFY_TOKEN="your_real_token_from_apify_console"
# https://console.apify.com/account/integrations

node scripts/apify_client.mjs estimate harvestapi/linkedin-profile-search 5
node scripts/apify_scrape.mjs linkedin "founders los angeles" 5 --go
```

**Wrong path error** (`Cannot find module /data/scripts/...`) means you ran from the wrong directory. Always `cd /data/.openclaw/workspace` first.

### Persist token across restarts

Add to container environment in `/docker/openclaw-wtm2/docker-compose.yml` (on **host**, after `exit`):

```yaml
environment:
  - APIFY_TOKEN=${APIFY_TOKEN}
```

Or a VPS-only env file — never commit the token.

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
