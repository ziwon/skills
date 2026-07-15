# Headless Grok Automation Cheatsheet

Version-check first:

```bash
grok --version
grok --help
```

The installed `~/.grok/docs/user-guide/14-headless-mode.md` is the source of truth for the
installed binary.

## Current core flags

| Flag | Meaning |
|---|---|
| `-p, --single <prompt>` | Run one headless prompt |
| `--output-format json` | Outer result object with `.text`, `sessionId`, usage metadata |
| `--output-format streaming-json` | NDJSON events (`text`, `thought`, `end`, `error`, …) |
| `--resume <id>` / `--continue` | Continue an existing/recent session |
| `--session-id <uuid>` | Create a **new** session with a client-chosen UUID; not a name |
| `--tools a,b,c` | Keep only selected built-in tools |
| `--disallowed-tools a,b` | Remove tools; supports `Agent` entries |
| `--allow RULE` / `--deny RULE` | Permission rules; repeatable, deny wins |
| `--permission-mode bypassPermissions` | Unattended approval bypass (`--yolo` alias) |
| `--max-turns N` | Bound main-agent turns |
| `--check` | Append a self-verification loop |
| `--no-subagents` | Disable subagent spawning |
| `--disable-web-search` | Remove built-in web search/fetch |
| `--worktree [name]` | Use an isolated git worktree |
| `--no-memory` | Disable cross-session memory |
| `--no-auto-update` | Suppress update checks for the invocation |

## Read-only review

```bash
grok -p 'Review this repository. Do not edit.' \
  --tools 'read_file,grep,list_dir' \
  --disallowed-tools 'Agent' \
  --output-format json \
  --max-turns 20
```

## Bounded editor

```bash
grok -p 'Edit only src/auth and run focused tests.' \
  --permission-mode bypassPermissions \
  --allow 'Edit(src/auth/**)' \
  --allow 'Write(src/auth/**)' \
  --allow 'Bash(uv run pytest*)' \
  --deny 'Bash(rm*)' \
  --deny 'Bash(sudo*)' \
  --deny 'Read(**/.env*)' \
  --max-turns 30 \
  --output-format json
```

## Resume correctly

```bash
first="$(grok -p 'Review the change' --output-format json)"
sid="$(jq -r '.sessionId' <<<"$first")"
grok -p 'Continue with security review' --resume "$sid" --output-format json
```

Do not use a friendly string with `-s`; `--session-id` requires a new UUID.

## Parse model JSON correctly

When the model is instructed to emit JSON, it is encoded inside the outer `.text` string:

```bash
outer="$(grok -p 'Return only {"status":"ok"}' --output-format json)"
inner="$(jq -r '.text' <<<"$outer")"
jq -e '.status == "ok"' <<<"$inner"
```

## ACP

```bash
grok agent --model grok-build stdio
# only in an isolated trusted environment
grok agent --always-approve stdio
```

Parent flags go before `stdio`. Headless-only flags do not belong to the `stdio` subcommand.

## Debugging

```bash
GROK_LOG_FILE="$PWD/grok-debug.log" RUST_LOG=debug \
  grok -p '...' --output-format json 2>grok-stderr.log
```

Keep stderr separate from JSON stdout and never log credentials or private source content.
