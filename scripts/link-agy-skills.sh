#!/usr/bin/env bash
# link-agy-skills.sh — link all SKILL.md files to .agents/skills/ for agy cli.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT/skills"
AGENTS_SKILLS_DIR="$ROOT/.agents/skills"

# Create the .agents/skills directory if it doesn't exist
mkdir -p "$AGENTS_SKILLS_DIR"

# Clean up existing symlinks in .agents/skills/ to avoid dead links
find "$AGENTS_SKILLS_DIR" -type l -delete

echo "Linking skills to $AGENTS_SKILLS_DIR..."

count=0
while IFS= read -r -d '' skill_file; do
  # Get skill name from the directory containing SKILL.md
  skill_dir="$(dirname "$skill_file")"
  skill_name="$(basename "$skill_dir")"
  
  # Calculate relative path from .agents/skills to the SKILL.md
  rel_path_from_root="${skill_file#$ROOT/}"
  target_path="../../$rel_path_from_root"
  link_path="$AGENTS_SKILLS_DIR/$skill_name.md"

  ln -sf "$target_path" "$link_path"
  echo "  $skill_name.md -> $rel_path_from_root"
  count=$((count + 1))
done < <(find "$SKILLS_DIR" -type f -name 'SKILL.md' -print0)

echo "Successfully linked $count skill(s) for agy cli."
