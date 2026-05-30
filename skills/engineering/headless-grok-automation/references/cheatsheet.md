# Headless Grok Automation Cheatsheet

## Most Useful Flags (as of 2026-06)

| Flag                        | Short | When to use                                              | Danger level |
|----------------------------|-------|----------------------------------------------------------|--------------|
| `-p, --single <prompt>`    | -p    | Enter headless mode (required)                           | -            |
| `--output-format json`     |       | Machine-parseable output (includes sessionId)            | Safe         |
| `--output-format streaming-json` | | Real-time streaming + thought observation          | Safe         |
| `--yolo`                   |       | Auto-approve all tool calls (use with extreme caution)   | ☠️ Nuclear   |
| `-s, --session-id <id>`    | -s    | Maintain state across calls (required for CI/multi-step) | Safe         |
| `--resume <id>`            | -r    | Resume a specific session exactly                        | Safe         |
| `-c, --continue`           |       | Continue the most recent session in current directory    | Safe         |
| `--allow "Bash(...)"`      |       | Grant least-privilege permissions (repeat as needed)     | Safe         |
| `--deny "Edit(**/secret/**)"` |   | Block specific paths or commands                         | Safe         |
| `--disallowed-tools "run_terminal_cmd"` | | Remove a tool entirely                           | Safe         |
| `--max-turns 30`           |       | Prevent infinite loops                                   | Safe         |
| `--no-plan`                |       | Force-disable plan mode (for simple tasks only)          | Medium       |
| `--no-memory`              |       | Disable cross-session memory (cost/privacy)              | Safe         |
| `--no-auto-update`         |       | Skip update checks in CI                                 | Safe         |

## Commonly Used Prompt Contracts

### 1. JSON Only (Most Important)
```
After completing the task, output **only** the following JSON on the final line.
Do not add any other text.

{
  "status": "success|partial|failed",
  "summary": "...",
  "files_changed": [...],
  "risks": [...],
  "next_action": "..."
}
```

### 2. Step-by-step + Final JSON
```
1. First create a plan.
2. Execute step by step and record the result of each step.
3. Output only the JSON format above at the very end.
```

### 3. Plan-only (For complex/ambiguous work)
```
Write a detailed execution plan for this task into plan.md only.
Do not modify any real source files. When the plan is complete, reply with exactly "PLAN_READY".
```

## Safe Invocation Patterns (Copy-Paste Ready)

**Read-only review**
```bash
grok -p "..." \
  --disallowed-tools "run_terminal_cmd,search_replace,write_file" \
  --output-format json
```

**Allow edits only under specific directories**
```bash
grok -p "Refactor only under src/" \
  --yolo \
  --allow "Edit(src/**),Write(src/**),Bash(git *)" \
  --deny "Bash(rm -rf *)" \
  -s "refactor-$(date +%F)"
```

**Allow only npm/pnpm/yarn scripts**
```bash
grok -p "..." \
  --yolo \
  --allow 'Bash(npm *),Bash(pnpm *),Bash(yarn *)' \
  --deny 'Bash(sudo *)'
```

## Cost & Time Control

- For large refactors: combine `--max-turns 40` + `-s`
- For repeated work: use `--no-memory` + explicit context passing
- Use streaming-json so you can observe thoughts and kill early if needed

## Debugging

```bash
GROK_LOG_FILE=1 GROK_LOG_FILTER=debug \
  grok -p "..." --output-format json 2> grok-debug.log
```

Log files are written to `~/.grok/logs/`
