# Drafting Guardrails — Enforced Logic

The agent **must** check these rules before saving any draft and before any send action.

---

## Hard stops (never violate)

| Rule | Enforcement |
|---|---|
| No auto-send | Agent writes drafts only. Send requires human `APPROVED` in queue + manual trigger. |
| Approval required | Draft status must be `APPROVED` in `templates/approval_queue.md` before send eligibility. |
| Two-touch cap | Max 2 touches per person. Touch 3+ is blocked. Then natural pause. |
| No pitch on early touch | Touch 1 and 2: no services pitch, no deck, no "we help companies like yours." |
| No working-opportunity talk | No job asks, no "let's work together" on touch 1. That waits for a call. |
| No specific, no draft | Draft blocked if targeting batch has no verified specific true thing. |
| 1:1 only | No bulk send. One recipient per send action. |
| No tracking pixels | Plain email only. Protects domain deliverability. |

---

## Voice lint (rewrite if fail)

Before saving a draft, scan for:

- [ ] Em dashes (`—` or `--` used as dash) → rewrite
- [ ] Semicolons (`;`) → rewrite as two sentences
- [ ] Sales language ("revolutionary", "game-changing", "I'd love to pick your brain", "synergy") → rewrite
- [ ] Our numbers or metrics in touch 1 → remove
- [ ] Missing specific true thing in opening → block draft

---

## Touch state machine

```
PENDING_APPROVAL → (Johnny marks APPROVED) → APPROVED → (Johnny sends manually) → SENT_TOUCH_1
                                                                              ↓
                                                                    (optional touch 2)
                                                                              ↓
                                                                         SENT_TOUCH_2 → PAUSED (no more touches)
                                                                              ↓
                                                                    (call booked) → HANDOFF_JOHNNY_GRANOLA
```

| Status | Agent may |
|---|---|
| `PENDING_APPROVAL` | Edit draft on request. Cannot send. |
| `APPROVED` | Remind Johnny draft is ready. Cannot send. |
| `SENT_TOUCH_1` | Draft touch 2 only if Johnny requests. Cannot auto-send. |
| `SENT_TOUCH_2` | No further outreach. Pause. |
| `HANDOFF_JOHNNY_GRANOLA` | No outreach. Relationship owned by Johnny + Granola. |
| `REJECTED` | Archive. No outreach. |

---

## Success metric

**Warm calls booked** — not messages sent, not open rates, not reply counts.

---

## Sequence detection (rewrite trigger)

If a draft contains any of these patterns, it is **wrong**. Rewrite as a peer saying hello:

- Multiple CTAs in one message
- Bullet list of our services
- "Following up on my last email" on touch 1
- Calendar link without a warm prior exchange
- "Quick question" that is really a pitch
