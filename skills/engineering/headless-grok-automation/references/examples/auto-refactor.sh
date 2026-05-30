#!/usr/bin/env bash
# auto-refactor.sh
# Run once in the morning — Grok safely performs large-scale refactoring
#
# Usage:
#   ./auto-refactor.sh "Replace all console.log calls with a proper logger"
#   ./auto-refactor.sh "Migrate src/components/ to React 19"

set -euo pipefail

TASK="${1:-Perform large-scale code quality improvements. Remove unnecessary any types, eliminate duplication, and apply modern best practices.}"

SESSION="auto-refactor-$(date +%F-%H%M)"
LOGFILE="logs/auto-refactor-$(date +%F).log"
mkdir -p logs

echo "[$(date)] Starting headless refactor session: $SESSION" | tee -a "$LOGFILE"

# Safety profile: only allow edits under src/, lib/, packages/. Completely block rm and sudo.
grok -p "$TASK

Rules:
- Only modify files under src/, lib/, or packages/
- Never touch package.json, lockfiles, or .env* files
- Keep all changes in small, conventional-commit-sized units
- Output a final JSON summary at the end

" \
  --yolo \
  --allow "Edit(src/**),Edit(lib/**),Edit(packages/**)" \
  --allow "Write(src/**),Write(lib/**),Write(packages/**)" \
  --allow "Bash(git *)" \
  --deny "Bash(rm*)" \
  --deny "Bash(sudo *)" \
  --deny "Bash(curl * | sh)" \
  --max-turns 60 \
  --output-format json \
  -s "$SESSION" \
  2>&1 | tee -a "$LOGFILE"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "[$(date)] Refactor completed successfully (session: $SESSION)" | tee -a "$LOGFILE"
else
  echo "[$(date)] Refactor failed with code $EXIT_CODE. Resume with:" | tee -a "$LOGFILE"
  echo "  grok -p 'Continue the previous work and revert any dangerous changes' -s $SESSION --yolo" | tee -a "$LOGFILE"
fi

exit $EXIT_CODE
