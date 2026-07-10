# Email Access — Zoho (Manual Send Only)

Documents how Johnny sends **approved** drafts from `memefluence.co` and `filmmakersworld.com`. The agent **does not** send email autonomously.

---

## Principle

| Who | What |
|---|---|
| **Agent** | Writes drafts, updates approval queue, lint-checks voice |
| **Johnny** | Reviews, edits, marks `APPROVED`, triggers send manually |

**Nothing sends without Johnny's explicit approval and manual action.**

---

## Accounts

| Domain | Use for | Zoho mailbox (placeholder) |
|---|---|---|
| `memefluence.co` | Music, DTC brand, pop-culture agency hooks | `YOUR_MEMEFLUENCE_EMAIL@memefluence.co` |
| `filmmakersworld.com` | Talent/IP, production, docs, arts/culture hooks | `YOUR_FILMWORLD_EMAIL@filmmakersworld.com` |

Wire credentials yourself. **Never commit real passwords or app passwords to git.**

---

## Environment variables (local / VPS only)

Set on the machine where **you** send from — not in the repo:

```bash
# Zoho SMTP (placeholders — fill in locally)
export ZOHO_SMTP_HOST="smtp.zoho.com"
export ZOHO_SMTP_PORT="587"
export ZOHO_MEMEFLUENCE_USER="YOUR_MEMEFLUENCE_EMAIL@memefluence.co"
export ZOHO_MEMEFLUENCE_PASS="YOUR_ZOHO_APP_PASSWORD"
export ZOHO_FILMWORLD_USER="YOUR_FILMWORLD_EMAIL@filmmakersworld.com"
export ZOHO_FILMWORLD_PASS="YOUR_ZOHO_APP_PASSWORD"
```

Generate app-specific passwords in Zoho: **Settings → Security → App Passwords**.

---

## Send workflow (human-triggered)

```
1. Open templates/approval_queue.md
2. Confirm draft status = APPROVED
3. Open templates/drafts/[name].md — copy final text after any edits
4. Send 1:1 from the matching Zoho account (see Sender field in draft)
5. Update approval_queue.md → SENT_TOUCH_1 (or SENT_TOUCH_2)
6. Update touch log in draft file with date + channel
```

### Optional helper script (runs only when YOU invoke it)

`config/send_approved_draft.sh` — placeholder script that refuses to run unless:

- Draft is `APPROVED` in queue
- Touch count < 2
- Recipient is single (no CC bulk lists)
- Env vars are set locally

The agent must **not** invoke this script. Johnny only.

---

## Deliverability rules

- **1:1 only.** No bulk. No BCC prospect lists.
- **Real subject lines.** No "Quick question" spam patterns. Use the subject in each draft file.
- **No tracking pixels.** No open-tracking plugins. Plain text or simple HTML.
- **Match sender to hook.** memefluence.co for music/brand/agency (memefluence angle). filmmakersworld.com for production/talent/arts angle.
- **Two-touch cap** then pause. See `config/drafting_guardrails.md`.

---

## LinkedIn / X

Email doc covers Zoho only. LinkedIn DMs and X messages follow the same approval queue. Johnny copies approved draft text and sends manually from his own accounts. Agent never auto-sends on social channels.

---

## Security checklist

- [ ] No credentials in git
- [ ] App passwords stored in env or secret manager only
- [ ] Send script not wired to agent cron or Telegram auto-actions
- [ ] Approval queue is source of truth for send eligibility
