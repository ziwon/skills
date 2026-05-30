---
name: headless-grok-automation
description: >-
  Grok Build를 스크립트·CI·cron·봇처럼 자동으로 돌리는 headless mode(-p) 완전 정복 스킬.
  Use when you say "headless로 돌려", "grok -p 로 자동화", "CI에서 grok", "밤에 grok으로 리뷰해", "대량 리팩토링 스크립트", "ACP로 내 봇 만들자", "yolo grok", "headless automation", "grok을 엔진으로", or want to turn Grok into a programmable automation engine instead of an interactive assistant. Always combine with proper session management, strict output contracts, and least-privilege permissions.
---

# Headless Grok Automation

Grok Build's `-p` / `--single` mode is used as a **safe, repeatable, and composable** automation engine. This skill is not about chatting interactively in the TUI — it teaches how to drive Grok as the engine behind scripts, CI jobs, nightly batches, and custom automation bots.

**Read the official documentation first.**  
This skill provides opinionated engineering practices layered on top of the official docs.

- Required reading: `~/.grok/docs/user-guide/14-headless-mode.md`
- When building custom bots: `~/.grok/docs/user-guide/15-agent-mode.md`

## When this runs

- "headless로 돌려", "grok -p 로 자동화", "CI에서 grok 돌려"
- Calling Grok from CI/CD, pre-commit hooks, cron jobs, or GitHub Actions
- Running `./auto-refactor.sh` once in the morning for bulk changes
- Nightly batch jobs for code quality and security reviews
- Building your own persistent automation bots with ACP (custom IDE agents, Slack bots, etc.)
- Running fully unattended `autoresearch` loops

This covers both one-shot tasks that exit when done and multi-step workflows that maintain state with `-s`.

## Core Patterns for Reliable Headless

Unlike the TUI, headless mode has no conversational continuity and no human in the loop, so the patterns are different.

### 1. Plan First, Then Execute (for complex work)

For simple tasks (formatting, small migrations) you can execute directly. For anything with architectural impact, force the agent to plan first.

```bash
grok -p "Create a refactoring plan for this module. Write it only to plan.md and do not touch any source code." \
  --no-yolo   # Never use yolo during the planning phase
```

For complex tasks, use `--no-plan` with care. Because plan mode's interactive approval flow does not translate perfectly to headless, it is often more reliable to explicitly instruct the agent via prompt to "write a plan first, then wait for confirmation before editing".

### 2. Enforce an Output Contract (Most Important)

Always make the agent emit results in a machine-parseable format.

Recommended template:

```
Perform the following task.

1. Think step by step and execute.
2. Record the reasoning for every decision.
3. Output **only** the following JSON at the very end:

```json
{
  "status": "success" | "partial" | "failed",
  "summary": "One-line summary",
  "changes": ["file1", "file2"],
  "risks": ["..."],
  "next_steps": ["..."]
}
```

Do not output any text outside this final JSON block.
```

### 3. Session Strategy

- One-off tasks → use the default (fresh session each time)
- Multi-step workflows → always use `-s "task-2026-06-03-refactor-auth"`
- Resuming previous work → `--resume <sessionId>` or `-c`

Get into the habit of extracting `sessionId` from JSON output and persisting it.

### 4. Parsing Streaming JSON

When you need large outputs or real-time visibility into progress, use `--output-format streaming-json` and parse events line-by-line (`type: "text"`, `type: "thought"`, `type: "end"`).

## Invocation Recipes

### Least-privilege one-liner

```bash
grok -p "Commit the staged changes using Conventional Commits" \
  --yolo \
  --allow "Bash(git *)" \
  --deny "Bash(rm*)" \
  --output-format json
```

### Python Wrapper (full streaming-json support)

See the complete implementation in `references/examples/grok-headless.py`.

### GitHub Actions example

See `references/examples/nightly-code-review.yml`.

## Safety & Guardrails (The most important section in this skill)

**`--yolo` is a nuclear option.** Using bare `--yolo` in any automated workflow is asking for a disaster eventually.

### Recommended Least-Privilege Patterns

1. **Read-only reviewer**
   ```bash
   --disallowed-tools "run_terminal_cmd,search_replace,write_file" \
   --allow "Read(**),Grep(**)"
   ```

2. **Edit only specific paths** (strongly recommended)
   ```bash
   --allow "Edit(src/**),Write(src/**),Bash(git *)" \
   --deny "Bash(rm -rf *)"
   ```

3. **Shell restricted to package managers only**
   ```bash
   --allow 'Bash(npm *),Bash(pnpm *),Bash(yarn *)' \
   --deny 'Bash(sudo *)'
   ```

4. **Complete isolation** (safest for CI)
   `--tools "read_file,grep,list_dir"` + run inside a dedicated worktree

Detailed ready-to-use profiles are collected in `references/safe-permission-profiles.md`. Copy and adapt them.

### Exit Codes & Signal Handling

- Success: `0`
- Error: `1`
- SIGINT (Ctrl+C): `130`
- SIGTERM: `143`

In CI, you should distinguish `130`/`143` from normal errors so you can tell "user cancelled" or "infrastructure killed the job" apart from actual failures.

### Recovery Strategy on Failure

```bash
SESSION="nightly-refactor-$(date +%F)"
grok -p "..." -s "$SESSION" --output-format json || \
  grok -p "Continue the previous work and clean up any dangerous changes" -s "$SESSION" --yolo
```

## Real-World Automation Examples

All practical examples live under `references/examples/` as ready-to-use files:

- `auto-refactor.sh` — morning bulk refactoring script
- `nightly-code-review.yml` — GitHub Actions nightly quality review
- `grok-headless.py` — Python wrapper that feels like an OpenAI-compatible client

## Building Custom Automation Bots with ACP

Headless (`-p`) runs once and exits.  
If you need a **long-lived agent process**, use ACP instead.

```bash
grok agent stdio --yolo   # JSON-RPC over stdin/stdout
```

- Many editors already have ACP clients (Zed, Neovim, Emacs, etc.).
- When writing your own client, use the official SDKs (`acp-go-sdk`, Kotlin `acp`, etc.).
- See `~/.grok/docs/user-guide/15-agent-mode.md` and `ACP_EXTENSION_METHODS.md` for the full extension method catalog.

This skill focuses on "when to choose ACP vs headless" and the practical trade-offs.

## Composition with Other Skills

- **autoresearch** + headless → fully unattended overnight experiment loops
- **grok-tool-augmented-research** + headless → search-augmented automated library updates and security patches
- **conventional-commits** → automatically commit changes produced by headless runs

## Troubleshooting

| Symptom                    | Likely Cause                        | Fix |
|----------------------------|-------------------------------------|-----|
| Exits too early            | Default `--max-turns` exceeded      | Increase with `--max-turns 50` or higher |
| No files were modified     | Plan mode is active                 | Add "execute immediately" to the prompt or pass `--no-plan` |
| Stuck waiting for approval | No `--yolo` and no TTY              | Use `--yolo` together with minimal `--allow` rules |
| Too many sessions piling up| Not using `-s` for multi-step work  | Adopt an explicit session ID naming strategy |
| Cost exploding             | Repeating large context without streaming | Use `-s` + `--no-memory` + periodic compaction |

For deep debugging: `GROK_LOG_FILE=1 GROK_LOG_FILTER=debug grok -p "..."`
