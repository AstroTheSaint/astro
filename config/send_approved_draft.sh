#!/usr/bin/env bash
# Send ONE approved draft via Zoho SMTP — MANUAL USE BY JOHNNY ONLY.
# The agent must NOT invoke this script.
# Placeholders only. Set env vars locally before running.

set -euo pipefail

DRAFT_SLUG="${1:-}"
QUEUE_FILE="templates/approval_queue.md"

if [[ -z "$DRAFT_SLUG" ]]; then
  echo "Usage: ./config/send_approved_draft.sh <draft-slug>"
  echo "Example: ./config/send_approved_draft.sh jonathan-strauss"
  exit 1
fi

DRAFT_FILE="templates/drafts/${DRAFT_SLUG}.md"

if [[ ! -f "$DRAFT_FILE" ]]; then
  echo "ERROR: Draft not found: $DRAFT_FILE"
  exit 1
fi

if ! grep -q "| ${DRAFT_SLUG} |.*APPROVED" "$QUEUE_FILE" 2>/dev/null \
   && ! grep -qi "APPROVED" "$QUEUE_FILE"; then
  echo "ERROR: Draft must be marked APPROVED in $QUEUE_FILE before send."
  exit 1
fi

# Placeholder gate — Johnny wires real send (mutt, Zoho web, or SMTP client)
echo "==> Send gate check passed for: $DRAFT_SLUG"
echo "    Draft file: $DRAFT_FILE"
echo ""
echo "This script does NOT auto-send. Copy the approved draft and send manually"
echo "from your Zoho account per config/email_access.md"
echo ""
echo "Required env (set locally, never commit):"
echo "  ZOHO_MEMEFLUENCE_USER / ZOHO_MEMEFLUENCE_PASS"
echo "  ZOHO_FILMWORLD_USER / ZOHO_FILMWORLD_PASS"
echo ""
echo "After sending, update approval_queue.md and the touch log in the draft file."
