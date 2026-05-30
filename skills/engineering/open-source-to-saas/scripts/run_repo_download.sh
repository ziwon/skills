#!/bin/bash
set -e

# Validate inputs
if [ -z "$1" ]; then
  echo "Usage: $0 <github_repository_url> [output_file]"
  echo "Example: $0 'https://github.com/example/cli-tool' repo_analysis.md"
  exit 1
fi

REPO_URL="$1"
OUTPUT="${2:-repo_analysis.md}"
REPO_NAME=$(basename "$REPO_URL" .git)
TEMP_DIR=".temp_repos/$REPO_NAME"

echo "=========================================================="
echo " Starting Repository Downloader & Scanner"
echo " Target Repository: $REPO_URL"
echo " Temp Directory:    $TEMP_DIR"
echo "=========================================================="

# Create clean temp workspace
mkdir -p .temp_repos
if [ -d "$TEMP_DIR" ]; then
  echo "⚠️ Temp directory $TEMP_DIR already exists. Cleaning up first..."
  rm -rf "$TEMP_DIR"
fi

# Clone repository
echo "Cloning repository..."
git clone --depth 1 "$REPO_URL" "$TEMP_DIR"

# Collect directory structure
echo "Analyzing project directory tree..."
TREE_STRUCTURE=$(find "$TEMP_DIR" -maxdepth 3 -not -path '*/.*' | sed "s|$TEMP_DIR||g" | sort)

# Scan for common dependency manifest files
echo "Scanning for primary configuration files..."
MANIFESTS=""
[ -f "$TEMP_DIR/package.json" ] && MANIFESTS="$MANIFESTS- package.json (Node.js)\n"
[ -f "$TEMP_DIR/requirements.txt" ] && MANIFESTS="$MANIFESTS- requirements.txt (Python)\n"
[ -f "$TEMP_DIR/setup.py" ] && MANIFESTS="$MANIFESTS- setup.py (Python packaging)\n"
[ -f "$TEMP_DIR/Cargo.toml" ] && MANIFESTS="$MANIFESTS- Cargo.toml (Rust)\n"
[ -f "$TEMP_DIR/go.mod" ] && MANIFESTS="$MANIFESTS- go.mod (Go)\n"
[ -f "$TEMP_DIR/Makefile" ] && MANIFESTS="$MANIFESTS- Makefile (Build commands)\n"
[ -f "$TEMP_DIR/Dockerfile" ] && MANIFESTS="$MANIFESTS- Dockerfile (Containerization)\n"

# Scan for LICENSE file
LICENSE_TYPE="Not found"
for f in LICENSE license LICENSE.txt LICENSE.md; do
  if [ -f "$TEMP_DIR/$f" ]; then
    LICENSE_TYPE=$(head -n 5 "$TEMP_DIR/$f" | tr '\n' ' ')
    break
  fi
done

# Initialize scaffold report
cat << EOF > "$OUTPUT"
# Repository Analysis: $REPO_NAME

## 1. Repository Summary & Entry Points
- **Source URL:** $REPO_URL
- **Detected Package Manifests:**
$(echo -e "$MANIFESTS")
- **Project Directory Structure (Max 3 levels):**
\`\`\`text
$TREE_STRUCTURE
\`\`\`

## 2. License Compliance Check
- **Detected License Info (Header snippet):**
  > $LICENSE_TYPE
- **Risk Assessment:** [Pending Subagent licensing check]

## 3. Invocation & Execution Interface
- **Command CLI Template:** [Pending Subagent analysis of entry points]
- **Input Parameters:** [Pending Subagent analysis]
- **I/O Formats:** [Pending Subagent analysis]

## 4. Compute & Resource Profile
- **Complexity Estimation:** [E.g., High-compute CPU, fast CLI process, memory-bound]
- **Task Mode:** [Synchronous (<= 2s) vs. Asynchronous background queue]

## 5. SaaS Wrapper Strategy Proposal
- **Wrapper Mechanism:** [Subprocess invocation vs. Library package loading]
- **REST Endpoint Map:**
  - POST /api/v1/execute: JSON parameter schemas.
EOF

echo "✓ Scaffolded repository analysis report created at $OUTPUT."
echo "💡 Next Step:"
echo "   Analyze the files in '$TEMP_DIR' using a research subagent to fill out the missing sections in '$OUTPUT'."
echo "=========================================================="
