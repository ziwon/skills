#!/usr/bin/env bash
# install-git-hooks.sh — install post-merge and post-checkout hooks to automatically link skills.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GIT_HOOKS_DIR="$ROOT/.git/hooks"

if [ ! -d "$GIT_HOOKS_DIR" ]; then
  echo "Error: .git directory not found or not in a git repository root."
  exit 1
fi

# Create post-merge hook
cat << 'EOF' > "$GIT_HOOKS_DIR/post-merge"
#!/usr/bin/env bash
# Git post-merge hook to automatically sync skills
echo "Git hook: Syncing agy skills..."
./scripts/link-agy-skills.sh
EOF
chmod +x "$GIT_HOOKS_DIR/post-merge"
echo "Installed post-merge hook."

# Create post-checkout hook
cat << 'EOF' > "$GIT_HOOKS_DIR/post-checkout"
#!/usr/bin/env bash
# Git post-checkout hook to automatically sync skills
# Only run if it's a branch checkout (flag is '1')
if [ "${3:-0}" -eq 1 ]; then
  echo "Git hook: Syncing agy skills..."
  ./scripts/link-agy-skills.sh
fi
EOF
chmod +x "$GIT_HOOKS_DIR/post-checkout"
echo "Installed post-checkout hook."
