# Safe Permission Profiles for Headless Grok

Copy and paste the patterns from this file. Never use bare `--yolo`.

## Profile 1: Read-Only Auditor (Safest)

For code review, security audits, and documentation generation.

```bash
grok -p "..." \
  --disallowed-tools "run_terminal_cmd,search_replace,write_file" \
  --output-format json
```

## Profile 2: Bounded Editor (Strongly Recommended)

Only allow modifications under specific paths + git commands.

```bash
grok -p "Refactor under src/auth/" \
  --yolo \
  --allow "Edit(src/auth/**),Write(src/auth/**)" \
  --allow "Bash(git *)" \
  --deny "Bash(rm*)" \
  --deny "Bash(sudo *)" \
  -s "auth-refactor-$(date +%F)"
```

## Profile 3: Build & Test Runner

Allow running tests and fixing failures, but forbid deletion.

```bash
grok -p "Run the tests and fix any failures" \
  --yolo \
  --allow 'Bash(npm test),Bash(pnpm test),Bash(yarn test)' \
  --allow "Edit(**/*.test.*),Write(**/*.test.*)" \
  --deny "Bash(rm -rf *)" \
  --max-turns 25
```

## Profile 4: Full Project (Only on trusted personal machines)

For morning bulk refactoring on a personal machine's trusted repo.

```bash
grok -p "..." \
  --yolo \
  --allow "Bash" \
  --deny "Bash(rm -rf /)" \
  --deny "Bash(sudo *)" \
  -s "morning-batch-$(date +%F)"
```

## Profile 5: ACP + Yolo (For long-running custom bots)

When using `grok agent stdio`.

```bash
grok agent stdio \
  --yolo \
  --allow "Edit(src/**)" \
  --deny "Bash(curl * | bash)" \
  --max-turns 100
```

## Forbidden Patterns (Never do this)

```bash
# Absolutely forbidden
grok -p "..." --yolo

# Absolutely forbidden in CI
grok -p "..." --yolo --no-auto-update

# Granting deletion rights is also dangerous
grok -p "..." --yolo --allow "Bash"
```

## Recommended Combination Rules

1. Whenever you use `--yolo`, always explicitly add at least two `--allow` / `--deny` rules.
2. When allowing `run_terminal_cmd`, always restrict it to concrete commands using `Bash(npm *)` style patterns.
3. Always deny deletion commands with `--deny "Bash(rm*")`.
4. In CI, consider also using `--disallowed-tools "Agent"` to prevent the agent from spawning subagents.
