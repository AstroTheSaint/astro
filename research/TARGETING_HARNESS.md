# Targeting Test Harness — Protocol

**Job 2 only.** Research and scoring. No drafting. No sending.

## Read first

1. `docs/MEMEFLUENCE_AGENT.md` — ICP, hard criteria, "no specific, no send"
2. `research/apify_source.md` — how to pull candidates from Apify

## Workflow

```
1. Apify scrape (25 candidates) → normalize to candidate schema
2. Select 10 for batch (diverse ICP mix)
3. Deep research each person (independent sources, not just LinkedIn)
4. Score C1, C2, C3 individually with reasoning
5. Find one specific true thing OR mark NO-SEND
6. Write research/test_batch_XX.md
7. Write research/test_batch_XX_gradesheet.md
8. STOP — wait for human grades
```

## Output files per batch

| File | Purpose |
|---|---|
| `research/test_batch_XX.md` | Scored candidates with sources |
| `research/test_batch_XX_gradesheet.md` | Human grading + pass bar |

## Graduation

Agent earns Job 3 (drafting) only when gradesheet shows:
- ≥ 9/10 correct
- Zero false positives on founder status (C1)
- Zero false positives on LA business presence (C3)

## Forbidden in Job 2

- Email compose/send
- LinkedIn connection requests or DMs
- Any outreach copy generation
- Fabricated "specific true things"
- Claims without source links
- Committed API tokens or credentials
