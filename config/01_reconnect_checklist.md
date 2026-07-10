# OpenClaw Reconnect Checklist — `openclaw-wtm2`

Use this after the VPS has been idle since May. **Heartbeat only** — no outreach, email, or LinkedIn.

---

## 0. Am I on the HOST or inside the CONTAINER?

Run this first — many checks only work on the **host**.

```bash
hostname
```

| What you see | Where you are | What works |
|---|---|---|
| Short hex ID (e.g. `3e950b689140`) | **Inside** `openclaw-wtm2-openclaw-1` | Agent files, processes, `/data/.openclaw/` (if mounted) |
| VPS name (e.g. `srv123.hostinger.com`) | **Host** | `docker ps`, `/docker/openclaw-wtm2/`, start/stop containers |

**Inside the container?** Run `exit` to return to the host shell.

**Signs you're still in the container:**
- `docker: command not found`
- `ls: cannot access '/docker/openclaw-wtm2/'`
- `fatal: not a git repository`

The git repo (`AstroTheSaint/astro`) lives on **GitHub / your laptop**, not on the VPS or in this container.

---

## 1. Is the container up? (run on **HOST**)

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
docker ps --filter "name=openclaw"
docker ps -a --filter "name=openclaw-wtm2"
```

- [ ] A container named like `openclaw-wtm2-openclaw-1` shows **Up**
- [ ] Status is not `Exited` / `Restarting` loop

**If stopped:**

```bash
cd /docker/openclaw-wtm2/
docker compose ps
docker compose up -d
docker compose logs --tail=50
```

---

## 2. Is the model reachable? (inside container or via logs)

On **host**:

```bash
docker logs openclaw-wtm2-openclaw-1 --tail=100 2>&1 | tail -50
```

Inside **container** (after `docker exec -it openclaw-wtm2-openclaw-1 bash` or SSH session):

```bash
ls -la /data/.openclaw/
# Look for model config — provider was MiniMax M2.5
grep -r "minimax\|model" /data/.openclaw/ 2>/dev/null | head -20
```

- [ ] No repeated API/auth errors in recent logs
- [ ] Model provider config still present under `/data/.openclaw/`

---

## 3. Is Telegram responding?

- [ ] Bot token/config still present in `/data/.openclaw/` (do **not** paste tokens here)
- [ ] Send **`ping`** to your Telegram bot from your phone
- [ ] Bot replies within ~30 seconds

**If no reply on host:**

```bash
cd /docker/openclaw-wtm2/
docker compose logs --tail=100 | grep -i telegram
docker compose restart
```

---

## 4. When did it last run?

On **host**:

```bash
docker inspect openclaw-wtm2-openclaw-1 --format 'Started: {{.State.StartedAt}}'
docker logs openclaw-wtm2-openclaw-1 --tail=200 2>&1 | grep -iE "error|started|ready|telegram|model" | tail -30
ls -lt /data/.openclaw/ 2>/dev/null | head -15
```

- [ ] Container start time noted: _______________
- [ ] Recent log activity (not silent since May): yes / no

---

## 5. What's in `/data/.openclaw/` now?

On **host** (preferred):

```bash
ls -la /data/.openclaw/
find /data/.openclaw/ -maxdepth 2 -type f 2>/dev/null | head -30
```

Inside **container** (if `/data` is mounted):

```bash
ls -la /data/.openclaw/
```

Look for:
- [ ] Agent config / workspace files
- [ ] Operating docs under `/data/.openclaw/workspace/`:
  - `MEMEFLUENCE.md` — primary operating brain (confirmed on VPS)
  - `AGENTS.md`, `OPERATING_MANUAL.md`, `HEARTBEAT.md`
- [ ] Telegram + model settings (redact before sharing)

> **Note:** `docs/MEMEFLUENCE_AGENT.md` in the GitHub repo may not exist. The live operating doc on this VPS is `/data/.openclaw/workspace/MEMEFLUENCE.md`.

---

## 6. Operating doc check (Telegram — Step 3)

After container is up and Telegram works:

1. Send: **`ping`**
2. Send: **`What is your operating document? Can you read MEMEFLUENCE.md?`**

- [ ] Agent responds to `ping`
- [ ] Agent confirms it can read `MEMEFLUENCE.md` (or names the path it actually uses)

---

## 7. Security

- [ ] No API keys, tokens, or private keys committed to git
- [ ] Placeholders only in `config/01_healthcheck.sh`
- [ ] Secrets stay in `/data/.openclaw/` on the VPS or Cursor Environment secrets

---

## Quick reference

| Task | Where |
|---|---|
| `docker ps`, `docker compose` | VPS **host** |
| `git fetch` / healthcheck script | Your **laptop** |
| `/docker/openclaw-wtm2/` | VPS **host** |
| `/data/.openclaw/` | VPS **host** or **container** (if volume mounted) |
| Telegram `ping` test | Your **phone** |

---

## Job 1 done when

- [x] Container running
- [x] Agent replies on Telegram
- [x] Agent confirms operating doc (`MEMEFLUENCE.md` + workspace stack)
- [x] No secrets in repo

**Completed Jul 10, 2026** — MiniMax credits restored; agent confirmed operating docs on Telegram.

---

## In-container verification (when host `docker` is unavailable)

If your terminal only drops you into `openclaw-wtm2-openclaw-1` (hostname = container ID), use these instead:

```bash
# Processes (expect: node server.mjs, openclaw, openclaw-gateway)
ps aux | grep -iE "openclaw|node" | grep -v grep

# Operating docs
ls -la /data/.openclaw/workspace/MEMEFLUENCE.md

# Model (redact keys before sharing)
grep -i "model\|minimax\|provider" /data/.openclaw/openclaw.json | grep -v -i "key\|token\|secret"

# Recent activity
ls -la /data/.openclaw/update-check.json
```

**Confirmed on VPS (Jul 10, 2026):**
- `openclaw-gateway` running since Apr 23
- Model: `minimax/MiniMax-M2.5`
- Operating doc: `/data/.openclaw/workspace/MEMEFLUENCE.md`
- `update-check.json` touched today
- Telegram channel: **responding** (Jul 10 ping test)
- Model API: **billing error** — MiniMax key out of credits (fix before Job 2)
