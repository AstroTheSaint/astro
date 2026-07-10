# Test Batch 01 — Gradesheet

**Grader:** Johnny Rapp  
**Batch:** `research/test_batch_01.md`  
**Date graded:** July 10, 2026

---

## Pass bar (agent graduates to Job 3 only if ALL are true)

1. **≥ 9 of 10 correct** — Your verdict on each candidate's PASS/FAIL matches the agent's scoring (per-criterion or overall, your call — mark in "Agent correct?" column).
2. **Zero false positives on C1 (founder status)** — Agent must not PASS someone who is not founder/founding team.
3. **Zero false positives on C3 (LA business presence)** — Agent must not PASS a company that lacks verifiable LA presence.

If the agent fails either false-positive rule, **stop** — rework targeting before Job 3, even if the 9/10 count is met.

---

## How to grade

| Column | What to fill in |
|---|---|
| **Your verdict** | `PASS` or `FAIL` (overall — all 3 criteria must pass for PASS) |
| **Agent correct?** | `Y` / `N` — Does the agent's pick match your judgment? |
| **False positive?** | `Y` only if agent said PASS but should be FAIL |
| **False negative?** | `Y` only if agent said FAIL but should be PASS |
| **Notes** | What the agent got wrong (founder? LA person? LA business? bad specific?) |

---

## Results

| # | Name | Company | Agent pick | Your verdict | Agent correct? | False positive? | False negative? | Notes |
|---|---|---|---|:---:|:---:|:---:|:---:|---|
| 1 | Jonathan Strauss | Create Music Group | YES | PASS | Y | N | N | |
| 2 | Grace Hong | Parasol Music | YES | PASS | Y | N | N | |
| 3 | Nick Crompton | SIX3SIX | YES | PASS | Y | N | N | |
| 4 | Karam Gill | MGX Creative | YES | PASS | Y | N | N | |
| 5 | Stacy Jones | Hollywood Branded | YES | PASS | Y | N | N | |
| 6 | Allison Conrad | Arey | YES | PASS | Y | N | N | |
| 7 | Adrienne Andisheh | Sounding Point | YES | PASS | Y | N | N | |
| 8 | Kacy Boone | Clockwise | NO | FAIL | Y | N | N | Correct reject — not founder, SF HQ |
| 9 | Joshua Nzewi | Eze | NO | FAIL | Y | N | N | Correct reject — SF HQ |
| 10 | Lincoln Nguyen | Karuna Labs | NO | FAIL | Y | N | N | Correct reject — HQ Ione, not LA |

---

## Score tally (fill after grading)

| Metric | Value |
|---|---|
| Correct / 10 | **10 / 10** |
| False positives on C1 (founder) | **0** |
| False positives on C3 (LA business) | **0** |
| False negatives (agent rejected a good pick) | **0** |

---

## Pass / fail

- [x] **PASS** — ≥ 9/10 correct, zero false positives on C1 and C3 → agent may proceed to Job 3
- [ ] **FAIL** — Rework targeting harness and run a new batch

**Grader:** Johnny Rapp — **July 10, 2026** — "I pass them all."

---

## Reference — agent's expected false-positive traps

These three are intentionally in the batch to test discrimination:

| # | Why agent should reject |
|---|---|
| 8 Kacy Boone | VP Marketing (not founder); Clockwise HQ = San Francisco |
| 9 Joshua Nzewi | Founder in LA, but Eze HQ = San Francisco |
| 10 Lincoln Nguyen | Founder in LA metro, but Karuna Labs HQ = Ione, CA (not LA) |

If the agent picked any of 8–10 as **YES**, that is likely a false positive on C1 and/or C3.

---

## Still zero send capability?

Confirm before Job 3:

- [ ] No email drafting tools enabled
- [ ] No LinkedIn messaging tools enabled
- [ ] No outbound send scripts in repo
