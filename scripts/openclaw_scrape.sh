#!/usr/bin/env bash
# OpenClaw exec wrapper — run from workspace with APIFY_TOKEN in env.
# Usage: bash scripts/openclaw_scrape.sh linkedin "founders los angeles" 25
#        bash scripts/openclaw_scrape.sh linkedin "founders los angeles" 25 --go

set -euo pipefail
WORKSPACE="${OPENCLAW_WORKSPACE:-/data/.openclaw/workspace}"
cd "$WORKSPACE"

if [[ -z "${APIFY_TOKEN:-}" ]]; then
  echo "ERROR: APIFY_TOKEN not set in environment."
  exit 1
fi

exec node scripts/apify_scrape.mjs "$@"
