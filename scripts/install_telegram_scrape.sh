#!/usr/bin/env bash
# Append scrape tool to OpenClaw TOOLS.md on VPS (idempotent).
set -euo pipefail

WORKSPACE="${OPENCLAW_WORKSPACE:-/data/.openclaw/workspace}"
TOOLS="${WORKSPACE}/TOOLS.md"
SNIPPET="${WORKSPACE}/workspace_addons/TOOLS_SCRAPE.md"
MARKER="## scrape — Apify sourcing"

if [[ ! -f "$SNIPPET" ]]; then
  echo "ERROR: Missing $SNIPPET — run install_apify_vps.sh first"
  exit 1
fi

if [[ -f "$TOOLS" ]] && grep -qF "$MARKER" "$TOOLS"; then
  echo "==> TOOLS.md already has scrape section. Skipping."
  exit 0
fi

mkdir -p "$(dirname "$TOOLS")"
touch "$TOOLS"
echo "" >> "$TOOLS"
echo "---" >> "$TOOLS"
cat "$SNIPPET" >> "$TOOLS"
echo "==> Appended scrape tool to $TOOLS"
