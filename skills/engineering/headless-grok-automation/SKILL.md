---
name: headless-grok-automation
description: >-
  Automate Grok Build with current headless (-p/--single), JSON/streaming output,
  resumable sessions, bounded toolsets, permission rules, worktrees, and ACP. Use
  for "grok -p", CI/cron/batch reviews, unattended refactors, Grok as an engine,
  or custom ACP clients. Verify flags against the installed Grok docs and prefer
  explicit tool allowlists plus deny rules over unrestricted execution.
---

# Headless Grok Automation

Drive Grok Build as a scriptable agent without confusing three separate layers:

1. **Tool filtering** — `--tools` / `--disallowed-tools` decide what exists.
2. **Permission policy** — `--allow` / `--deny` decide which calls are approved or blocked.
3. **Approval bypass** — `--permission-mode bypassPermissions` (aliases include `--yolo`
   and `--always-approve`) removes interactive approval, but explicit deny rules and hooks
   still apply.

Use the installed docs as the version-matched source of truth:

- `~/.grok/docs/user-guide/14-headless-mode.md`
- `~/.grok/docs/user-guide/15-agent-mode.md`
- `~/.grok/docs/user-guide/22-permissions-and-safety.md`

Before copying a recipe across machines, run `grok --version` and `grok --help`.

## Choose the mode

| Need | Mode |
|---|---|
| One bounded task, CI job, cron tick | `grok -p` / `--single` |
| Follow-up in an existing conversation | `--resume <sessionId>` or `--continue` |
| Machine-readable live events | `--output-format streaming-json` |
| IDE/custom long-lived client | `grok agent stdio` (ACP) |
| Remote client connection | `grok agent serve` or `grok agent headless` |

## Reliable headless procedure

1. Set `--cwd` to the smallest trusted project root.
2. State exact allowed paths, forbidden effects, success criteria, and verification in the prompt.
3. Remove tools the task cannot need with `--tools` or `--disallowed-tools`.
4. Add `--deny` rules for destructive commands and sensitive paths.
5. Use `--max-turns` and, for edits, an isolated `--worktree` when practical.
6. Use `--output-format json`; inspect the process exit code before parsing stdout.
7. Read `sessionId` from the outer result and use `--resume` for the next call.
8. Verify files/tests/git state outside the model before accepting success.

## Output contracts

`--output-format json` returns an **outer Grok result object**. The model response is in
`.text`; metadata such as `sessionId`, `stopReason`, `usage`, and `num_turns` lives beside it.
If the prompt requests JSON, parse twice: first the outer result, then `.text`.

```bash
result="$(grok -p 'Inspect this repo. Return only {"status":"ok|blocked","summary":"..."}.' \
  --tools 'read_file,grep,list_dir' \
  --output-format json \
  --max-turns 12)"

session_id="$(jq -r '.sessionId' <<<"$result")"
jq -e '.stopReason == "EndTurn"' <<<"$result" >/dev/null
jq -e 'fromjson | .status' <<<"$(jq -r '.text' <<<"$result")" >/dev/null
```

For streaming, consume newline-delimited events by `type`. Handle at least `text`,
`thought`, `end`, and `error`, but keep the switch forward-compatible because additional
events can appear. Do not treat thought streams as a stable API or persist them by default.

## Session semantics

A fresh `grok -p` call creates a new session.

```bash
first="$(grok -p 'Review the change' --output-format json)"
sid="$(jq -r '.sessionId' <<<"$first")"
grok -p 'Now check security boundaries' --resume "$sid" --output-format json
```

`-s/--session-id` is **not a friendly session name**. It creates a new session with a
client-chosen UUID and fails for a non-UUID or an existing session. Continuing work uses
`--resume` or `--continue`; combining resume with a new ID requires `--fork-session`.

## Permission patterns

### Read-only reviewer

```bash
grok -p 'Review the repository. Do not edit.' \
  --tools 'read_file,grep,list_dir' \
  --disallowed-tools 'Agent' \
  --output-format json \
  --max-turns 20
```

### Bounded unattended editor

```bash
grok -p 'Modify only src/auth, run focused tests, then summarize.' \
  --permission-mode bypassPermissions \
  --allow 'Edit(src/auth/**)' \
  --allow 'Write(src/auth/**)' \
  --allow 'Bash(git diff*)' \
  --allow 'Bash(uv run pytest*)' \
  --deny 'Bash(rm*)' \
  --deny 'Bash(sudo*)' \
  --deny 'Read(**/.env*)' \
  --disallowed-tools 'web_search,web_fetch' \
  --max-turns 30 \
  --output-format json
```

`--allow` is not a sandbox by itself. If bypass mode is enabled, constrain the available
toolset, use deny rules, and run inside a disposable worktree/container when the blast
radius matters. Never rely only on a natural-language sentence such as “do not delete.”

## Planning and verification

- For a plan-only pass, remove edit/shell tools or use `--permission-mode plan`; do not use
  a nonexistent `--no-yolo` flag.
- `--no-plan` disables plan mode and is appropriate only when the task is already precise.
- `--check` appends Grok's self-verification loop, but independent tests and git inspection
  remain mandatory.
- `--best-of-n N` can improve selection but multiplies cost; use only with a measurable
  selection criterion.
- `--no-subagents` or `--disallowed-tools Agent` bounds delegation.
- `--disable-web-search` removes built-in web search/fetch when external access is unwanted.

## ACP

Parent options must appear before the mode subcommand:

```bash
grok agent --model grok-build stdio
# trusted isolated environment only:
grok agent --always-approve stdio
```

`grok agent stdio` speaks ACP JSON-RPC over stdin/stdout. Permission decisions normally
belong to the ACP client. The `stdio` subcommand itself does not accept headless-only flags
such as `--max-turns`, `--tools`, or `--allow`.

## Failure handling

- Exit `0`: prompt completed normally.
- Exit `1`: authentication/network/runtime error.
- Exit `130` / `143`: SIGINT / SIGTERM; file changes are not rolled back.
- On interruption, inspect git/files first, then resume with the captured `sessionId`.
- On malformed or missing JSON, fail closed; never fabricate a success object.
- Authentication for unattended hosts: `XAI_API_KEY` or `grok login --device-code`.
- Debug with `RUST_LOG=debug` and an explicit `GROK_LOG_FILE=/safe/path/grok.log`; keep
  stderr separate from JSON stdout.

## Supporting material

- `references/cheatsheet.md`
- `references/safe-permission-profiles.md`
- `references/examples/auto-refactor.sh`
- `references/examples/nightly-code-review.yml`
- `references/examples/grok-headless.py`

## Composition

- **autoresearch** controls experiment budget and honest measurement.
- **grok-tool-augmented-research** controls when fresh external evidence is justified.
- **conventional-commits** controls commit shape after independently verified edits.
