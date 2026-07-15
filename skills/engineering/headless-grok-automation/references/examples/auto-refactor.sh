#!/usr/bin/env bash
# auto-refactor.sh — bounded Grok refactor example for a trusted disposable worktree.

set -euo pipefail

TASK="${1:-Refactor the requested area without changing public behavior.}"
LOG_DIR="${LOG_DIR:-logs}"
mkdir -p "$LOG_DIR"
RESULT_FILE="$LOG_DIR/auto-refactor-$(date +%F-%H%M%S).json"

prompt=$(cat <<EOF
$TASK

Boundaries:
- Modify only files under src/, lib/, or packages/.
- Do not change package manifests, lockfiles, .env files, credentials, or CI.
- Do not push, publish, deploy, or delete files.
- Run focused tests using existing project commands.
- End with a concise summary of changed files, verification, and residual risks.
EOF
)

set +e
grok -p "$prompt" \
  --permission-mode bypassPermissions \
  --allow 'Edit(src/**)' \
  --allow 'Edit(lib/**)' \
  --allow 'Edit(packages/**)' \
  --allow 'Write(src/**)' \
  --allow 'Write(lib/**)' \
  --allow 'Write(packages/**)' \
  --allow 'Bash(git diff*)' \
  --allow 'Bash(git status*)' \
  --deny 'Bash(rm*)' \
  --deny 'Bash(sudo*)' \
  --deny 'Bash(git push*)' \
  --deny 'Read(**/.env*)' \
  --disallowed-tools 'web_search,web_fetch,Agent' \
  --max-turns 60 \
  --check \
  --output-format json \
  --no-auto-update >"$RESULT_FILE"
exit_code=$?
set -e

if [[ $exit_code -ne 0 ]]; then
  printf 'Grok failed with exit code %s; inspect %s and git status.\n' \
    "$exit_code" "$RESULT_FILE" >&2
  exit "$exit_code"
fi

session_id="$(jq -er '.sessionId' "$RESULT_FILE")"
jq -er '.text' "$RESULT_FILE"
printf 'Session: %s\nResult: %s\n' "$session_id" "$RESULT_FILE" >&2
printf 'Resume after inspecting the worktree: grok -p %q --resume %q --output-format json\n' \
  'Continue from the verified current state.' "$session_id" >&2
