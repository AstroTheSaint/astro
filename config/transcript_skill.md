# Transcript Skill — Pipeline, Dependencies & Cost Logic

Cost-optimized video transcription for Instagram, X/Twitter, and YouTube links sent over Telegram. Most transcripts are **free** (YouTube captions) or **under $0.01** (short reels via Groq Whisper).

---

## Dependencies

| Tool | Purpose | Install |
|------|---------|---------|
| **yt-dlp** | Download metadata, captions, and audio from IG/X/YouTube | `sudo apt-get install -y yt-dlp` or `pip install -U yt-dlp` |
| **ffmpeg** | Audio format conversion (only if Whisper backend needs it) | `sudo apt-get install -y ffmpeg` |
| **Python 3.10+** | Pipeline scripts | Pre-installed on most VPS images |

### Environment variables (placeholders — never commit real keys)

```bash
# Primary Whisper backend (Groq — whisper-large-v3-turbo)
GROQ_API_KEY=your_groq_api_key_here

# Fallback Whisper backend (OpenAI — $0.006/min)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: enable local faster-whisper on CPU ($0, slower)
TRANSCRIPT_LOCAL_WHISPER=false   # default OFF
```

### Verify installation

```bash
yt-dlp --version    # should print version (e.g. 2024.04.09+)
ffmpeg -version     # should print ffmpeg version
```

If yt-dlp breaks on a platform (common after IG/X API changes), first fix:

```bash
yt-dlp -U    # self-update — resolves most breakages
```

---

## Cost routing (order matters)

The pipeline tries the cheapest/fastest path first. **Never skip straight to Whisper on YouTube.**

```
┌─────────────────────────────────────────────────────────────┐
│  Link arrives (Instagram / X / YouTube)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  YouTube URL?           │
              └────────────┬────────────┘
                    yes    │    no
              ┌────────────▼────────────┐     ┌──────────────────────────┐
              │  yt-dlp: pull native    │     │  Instagram or X link     │
              │  subtitles / auto-captions│     │  → audio + Whisper path  │
              └────────────┬────────────┘     └────────────┬─────────────┘
                    found  │  not found                      │
              ┌────────────▼────────────┐     ┌──────────────▼─────────────┐
              │  Clean captions         │     │  yt-dlp: extract audio     │
              │  Cost: $0               │     │  only (smallest, e.g. m4a) │
              │  Time: seconds          │     └──────────────┬─────────────┘
              └─────────────────────────┘                    │
                                              ┌────────────────▼────────────────┐
                                              │  Transcribe audio:              │
                                              │  1. Groq whisper-large-v3-turbo │
                                              │  2. OpenAI Whisper API (fallback)│
                                              │  3. Local faster-whisper (opt.) │
                                              └─────────────────────────────────┘
```

### Route 1 — YouTube native captions (preferred)

- **When:** YouTube link with existing subtitles or auto-captions.
- **How:** `yt-dlp --write-subs --write-auto-subs --sub-lang en --skip-download`
- **Output:** VTT/SRT → cleaned paragraphs + timestamped version.
- **Cost:** **$0**
- **Speed:** Near-instant (no audio download, no API call).

### Route 2 — Audio + Whisper (Instagram, X, or captionless YouTube)

- **When:** Instagram/X link, or YouTube with no captions.
- **How:**
  1. `yt-dlp -x --audio-format m4a --audio-quality 0` (smallest audio only)
  2. Transcribe via backend chain below
  3. **Delete audio file immediately** after success — VPS disk is not a video archive

#### Whisper backend chain

| Priority | Backend | Model | Cost estimate | Notes |
|----------|---------|-------|---------------|-------|
| **Primary** | Groq API | `whisper-large-v3-turbo` | ~$0.04/hr audio ≈ **$0.0007/min** | Fast, very cheap. Requires `GROQ_API_KEY`. |
| **Fallback** | OpenAI API | `whisper-1` | **$0.006/min** | Used only if Groq errors. Requires `OPENAI_API_KEY`. |
| **Optional local** | faster-whisper (CPU) | `small` | **$0** | Config toggle `TRANSCRIPT_LOCAL_WHISPER=true`. Slower; fine for short reels. Default **OFF**. |

#### Cost examples (logged in every transcript's frontmatter)

| Content | Duration | Route | Est. cost |
|---------|----------|-------|-----------|
| YouTube talk with captions | 45 min | Native captions | **$0.00** |
| Instagram reel | 60 sec | Groq Whisper | **~$0.0007** |
| X video clip | 3 min | Groq Whisper | **~$0.002** |
| IG reel (Groq down) | 60 sec | OpenAI fallback | **~$0.006** |

Formula for Groq: `(duration_seconds / 3600) × $0.04`  
Formula for OpenAI: `(duration_seconds / 60) × $0.006`

---

## Output format

Every transcript saves to:

```
research/transcripts/[date]_[platform]_[slug].md
```

Example: `research/transcripts/2026-07-11_youtube_sam-altman-ai-future.md`

### Frontmatter

```yaml
---
source_url: https://...
platform: youtube | instagram | x
creator: "@handle or channel name"
title: "Video title or caption text"
duration: "12:34"
date_fetched: 2026-07-11
transcription_method: youtube_captions | groq_whisper | openai_whisper | local_whisper
transcription_cost_usd: 0.0000
tags:
---
```

### Body structure

1. **Clean transcript** — paragraphs, no timestamps (readable)
2. **Timestamped version** — collapsed `<details>` block below for reference

The `tags:` line is left empty for manual annotation so the library becomes searchable over time.

---

## Telegram command flow

| Trigger | Behavior |
|---------|----------|
| Paste a link (no command) | Agent detects IG/X/YouTube URL → asks **"Transcribe this?"** with Yes button |
| `transcript [link]` | Skip confirmation, transcribe immediately |
| Multiple links in one message | Process all, return one combined `.md` file |
| `transcripts list [keyword]` | Grep `research/transcripts/` and return matches |

### Completion message includes

- Full transcript (or first chunk + attached `.md` if long)
- Duration, source URL, platform
- Transcription cost from metadata

---

## Failure handling (honest, not clever)

| Situation | Response |
|-----------|----------|
| Private account, age-gated, login-required | Clear message: **cannot fetch public content**. No logins, cookies, or credential workarounds. Ever. |
| No speech (music only) | Report "no speech detected"; return caption/title text if available |
| yt-dlp platform breakage | Name the platform; suggest `yt-dlp -U` as first fix |
| Groq API error | Auto-fallback to OpenAI Whisper; log which backend was used |
| All backends fail | Return error with platform name and last error message |

**Rules:**
- Public content only. No auth workarounds.
- API keys via env vars only.
- Audio files are temporary — delete after transcription succeeds.
- Keep only the transcript in the library.

---

## File layout (OpenClaw skill)

```
skills/transcript/
├── SKILL.md                    # Agent instructions (OpenClaw skill entry)
├── scripts/
│   ├── transcribe.py           # Main pipeline (routing + transcription)
│   ├── clean_captions.py       # VTT/SRT → readable paragraphs
│   ├── save_transcript.py      # Library writer with frontmatter
│   └── search_transcripts.py   # Keyword grep for transcripts list
config/
└── transcript_skill.md           # This file — pipeline reference for future-me
research/
└── transcripts/                # Saved transcript library
```

---

## Verification checklist

- [ ] YouTube link with captions → free transcript in seconds
- [ ] Instagram reel → Groq Whisper transcript, cost logged (< $0.01)
- [ ] X video → end-to-end Whisper transcript
- [ ] Transcripts land in library with full frontmatter
- [ ] `transcripts list [keyword]` finds past transcripts
- [ ] Private-account link → graceful failure, clear message
