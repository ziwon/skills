#!/usr/bin/env bash
# link-agy-skills.sh — expose repository skills through .agents/skills/.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT/skills"
AGENTS_SKILLS_DIR="$ROOT/.agents/skills"

# Create the .agents/skills directory if it doesn't exist
mkdir -p "$AGENTS_SKILLS_DIR"

# Clean up generated file and directory symlinks to avoid dead links.
find "$AGENTS_SKILLS_DIR" -type l -delete

echo "Linking skills to $AGENTS_SKILLS_DIR..."

count=0
while IFS= read -r -d '' skill_file; do
  # Get skill name from the directory containing SKILL.md
  skill_dir="$(dirname "$skill_file")"
  skill_name="$(basename "$skill_dir")"
  
  # Keep the legacy flat .md link used by agy and add a directory link for
  # current Grok/Agent Skills discovery (<name>/SKILL.md + supporting files).
  rel_path_from_root="${skill_file#"$ROOT"/}"
  rel_dir_from_root="${skill_dir#"$ROOT"/}"
  file_target="../../$rel_path_from_root"
  dir_target="../../$rel_dir_from_root"
  flat_link="$AGENTS_SKILLS_DIR/$skill_name.md"
  dir_link="$AGENTS_SKILLS_DIR/$skill_name"

  ln -sf "$file_target" "$flat_link"
  ln -sfn "$dir_target" "$dir_link"
  echo "  $skill_name.md -> $rel_path_from_root"
  echo "  $skill_name/ -> $rel_dir_from_root/"
  count=$((count + 1))
done < <(find "$SKILLS_DIR" -type f -name 'SKILL.md' -print0)

echo "Successfully linked $count skill(s) for agy cli."
