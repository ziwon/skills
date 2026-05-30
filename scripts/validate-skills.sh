#!/usr/bin/env bash
# validate-skills.sh — lint every SKILL.md in this repo.
# Checks: required frontmatter (name, description), name matches folder, kebab-case name.
# Exit non-zero if any skill is invalid. Safe to run in CI or a pre-commit hook.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT/skills"

fail=0
count=0

# Find all SKILL.md files (templates/ deliberately excluded).
while IFS= read -r -d '' skill; do
  count=$((count + 1))
  dir="$(dirname "$skill")"
  folder="$(basename "$dir")"

  # Extract frontmatter block (between the first two '---' lines).
  fm="$(awk 'NR==1 && $0=="---"{f=1;next} f && $0=="---"{exit} f' "$skill")"

  name="$(printf '%s\n' "$fm" | sed -n 's/^name:[[:space:]]*//p' | head -1 | tr -d '"'"'"' ')"
  desc_block="$(printf '%s\n' "$fm" | awk '
    /^description:[[:space:]]*/ {
      in_desc=1
      sub(/^description:[[:space:]]*/, "")
      if ($0 != "" && $0 != ">-" && $0 != "|" && $0 != ">") found=1
      next
    }
    in_desc && /^[[:space:]]+/ {
      line=$0
      sub(/^[[:space:]]+/, "", line)
      if (line != "") found=1
      next
    }
    in_desc { in_desc=0 }
    END { if (found) print "yes" }
  ')"

  if [[ -z "$name" ]]; then
    echo "FAIL  $skill : missing 'name' in frontmatter"
    fail=1
  elif [[ "$name" != "$folder" ]]; then
    echo "FAIL  $skill : name '$name' != folder '$folder'"
    fail=1
  elif ! [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "FAIL  $skill : name '$name' is not kebab-case"
    fail=1
  fi

  if [[ -z "$desc_block" ]]; then
    echo "FAIL  $skill : missing or empty 'description' in frontmatter"
    fail=1
  fi

  if [[ "$fail" -eq 0 || "$name" == "$folder" ]]; then
    [[ "$fail" -eq 0 ]] && echo "ok    $name"
  fi
done < <(find "$SKILLS_DIR" -type f -name 'SKILL.md' -print0)

echo "---"
if [[ "$count" -eq 0 ]]; then
  echo "No skills found under $SKILLS_DIR (nothing to validate yet)."
  exit 0
fi

if [[ "$fail" -ne 0 ]]; then
  echo "Validation FAILED."
  exit 1
fi

echo "All $count skill(s) valid."
