# Telegram prompt — paste this to your OpenClaw agent

Copy everything below the line and send it as one message on Telegram.

---

You have a new tool: **scrape** (Apify sourcing). Read `/data/.openclaw/workspace/workspace_addons/TOOLS_SCRAPE.md` and follow it exactly.

**Install check:** These must exist on the VPS workspace:
- `scripts/openclaw_scrape.sh`
- `scripts/apify_scrape.mjs`
- `APIFY_TOKEN` in your environment

**When I send:**
`scrape linkedin "founders los angeles" 25`

**You do:**
1. Run estimate only (no `--go`):
   `cd /data/.openclaw/workspace && bash scripts/openclaw_scrape.sh linkedin "founders los angeles" 25`
2. Paste the full cost preview back to me on Telegram
3. **Stop and wait.** Do not run the scrape yet

**When I reply:** `go`

**You do:**
1. Run:
   `cd /data/.openclaw/workspace && bash scripts/openclaw_scrape.sh linkedin "founders los angeles" 25 --go`
2. Report: item count, actual cost, and both file paths under `research/raw/` and `research/normalized/`
3. Stop. No analysis, no outreach, no drafts

**Hard rules:**
- Never run `--go` without my explicit `go`
- Never log or repeat `APIFY_TOKEN`
- Max 50 items per scrape
- Instagram: `scrape instagram "user1 user2" 10`

Confirm you understand and that `APIFY_TOKEN` is set in your environment.
