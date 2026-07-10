#!/usr/bin/env bash
# OpenClaw VPS heartbeat check — SSH in, confirm container is up, print status + uptime.
# Fill in the placeholders below before running. Do NOT commit real credentials.

set -euo pipefail

# --- PLACEHOLDERS: fill these in locally (never commit real values) ---
VPS_HOST="YOUR_VPS_HOST"          # e.g. 123.456.789.0 or vps123.hostinger.com
VPS_USER="YOUR_SSH_USER"          # e.g. root or ubuntu
SSH_KEY_PATH="YOUR_SSH_KEY_PATH"  # e.g. ~/.ssh/id_ed25519_hostinger
OPENCLAW_DIR="/docker/openclaw-wtm2"
CONTAINER_NAME="openclaw-wtm2-openclaw-1" # full name from: docker ps
CONTAINER_NAME_PATTERN="openclaw"          # fallback filter if name differs
# -----------------------------------------------------------------------

if [[ "$VPS_HOST" == "YOUR_VPS_HOST" ]] \
   || [[ "$VPS_USER" == "YOUR_SSH_USER" ]] \
   || [[ "$SSH_KEY_PATH" == "YOUR_SSH_KEY_PATH" ]]; then
  echo "ERROR: Edit the PLACEHOLDERS at the top of this script before running."
  exit 1
fi

if [[ ! -f "$SSH_KEY_PATH" ]]; then
  echo "ERROR: SSH key not found at: $SSH_KEY_PATH"
  exit 1
fi

SSH_OPTS=(
  -i "$SSH_KEY_PATH"
  -o BatchMode=yes
  -o ConnectTimeout=15
  -o StrictHostKeyChecking=accept-new
)

echo "==> Connecting to ${VPS_USER}@${VPS_HOST} ..."
if ! ssh "${SSH_OPTS[@]}" "${VPS_USER}@${VPS_HOST}" "echo 'SSH OK — connected as' \$(whoami) '@' \$(hostname)"; then
  echo "ERROR: SSH connection failed."
  exit 1
fi

echo ""
echo "==> Checking Docker and OpenClaw container ..."
ssh "${SSH_OPTS[@]}" "${VPS_USER}@${VPS_HOST}" bash -s <<REMOTE
set -euo pipefail

echo "--- docker ps (all running containers) ---"
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

echo ""
echo "--- openclaw container (${CONTAINER_NAME}) ---"
MATCH=""
if docker ps --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
  MATCH="${CONTAINER_NAME}"
else
  MATCH=\$(docker ps --filter "name=${CONTAINER_NAME_PATTERN}" --format '{{.Names}}' | head -n1 || true)
fi
if [[ -z "\$MATCH" ]]; then
  echo "WARNING: No running container matched '${CONTAINER_NAME_PATTERN}'."
  echo "         Check stopped containers:"
  docker ps -a --filter "name=${CONTAINER_NAME_PATTERN}" --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' || true
  exit 2
fi

echo "Container: \$MATCH"
docker inspect --format 'Status:  {{.State.Status}}
Started: {{.State.StartedAt}}
Uptime:  {{.State.Status}} since {{.State.StartedAt}}' "\$MATCH"

echo ""
echo "--- compose project dir (${OPENCLAW_DIR}) ---"
if [[ -d "${OPENCLAW_DIR}" ]]; then
  ls -la "${OPENCLAW_DIR}"
else
  echo "WARNING: ${OPENCLAW_DIR} not found on VPS."
fi

echo ""
echo "--- openclaw data dir (/data/.openclaw/) ---"
if [[ -d /data/.openclaw ]]; then
  ls -la /data/.openclaw/
else
  echo "WARNING: /data/.openclaw/ not found."
fi
REMOTE

echo ""
echo "==> Healthcheck complete."
