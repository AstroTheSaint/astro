#!/usr/bin/env bash
# Install transcript skill dependencies on the VPS.
# Safe to re-run — apt is idempotent.
set -euo pipefail

echo "==> Installing yt-dlp and ffmpeg..."
sudo apt-get update -qq
sudo apt-get install -y -qq yt-dlp ffmpeg

echo "==> Verifying..."
yt-dlp --version
ffmpeg -version 2>&1 | head -1

echo "==> Done. Set env vars before running the pipeline:"
echo "    GROQ_API_KEY, OPENAI_API_KEY (optional fallback)"
echo "    TRANSCRIPT_LOCAL_WHISPER=false  # set true for free local CPU mode"
