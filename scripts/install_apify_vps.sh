#!/usr/bin/env bash
# Install Apify integration into OpenClaw workspace on VPS.
# Run INSIDE the openclaw container:
#   curl -fsSL https://raw.githubusercontent.com/AstroTheSaint/astro/cursor/apify-integration-4304/scripts/install_apify_vps.sh | bash
#
# Or from a local clone:
#   bash scripts/install_apify_vps.sh

set -euo pipefail

BRANCH="${APIFY_INSTALL_BRANCH:-cursor/apify-integration-4304}"
REPO="${APIFY_INSTALL_REPO:-AstroTheSaint/astro}"
RAW="https://raw.githubusercontent.com/${REPO}/${BRANCH}"
WORKSPACE="${OPENCLAW_WORKSPACE:-/data/.openclaw/workspace}"

echo "==> Installing Apify integration to: ${WORKSPACE}"
mkdir -p "${WORKSPACE}/scripts" "${WORKSPACE}/config" "${WORKSPACE}/research/raw" "${WORKSPACE}/research/normalized"

FILES=(
  "scripts/apify_client.mjs"
  "scripts/apify_scrape.mjs"
  "scripts/apify_normalize.mjs"
  "config/apify_actors.json"
  "config/apify_client.md"
  "config/apify_actors.md"
  "config/apify_telegram.md"
)

for f in "${FILES[@]}"; do
  dest="${WORKSPACE}/${f}"
  mkdir -p "$(dirname "$dest")"
  echo "    fetching ${f}"
  curl -fsSL "${RAW}/${f}" -o "$dest"
done

chmod +x "${WORKSPACE}/scripts/apify_scrape.mjs" 2>/dev/null || true

echo ""
echo "==> Installed. Next steps:"
echo ""
echo "  cd ${WORKSPACE}"
echo "  export APIFY_TOKEN=\"your_real_token_from_apify_console\""
echo "  node scripts/apify_client.mjs estimate harvestapi/linkedin-profile-search 5"
echo "  node scripts/apify_scrape.mjs linkedin \"founders los angeles\" 5 --go"
echo ""
echo "Never commit APIFY_TOKEN. Add to container env for persistence."
