## Unrestricted agent execution

Unrestricted/YOLO execution is intentional. Do not request approval for normal worktree-
local edits, tests, builds, dependency installs, local servers, generated-file cleanup,
or ordinary Git commits.

### Operating modes

- **YOLO-local:** proceed autonomously inside the active worktree.
- **YOLO-infra:** when an external write was explicitly requested, state its exact target,
  mutation, persistent-data impact, and rollback path, then execute and verify it.
- **Break-glass:** ask once immediately before persistent-data deletion, destructive work
  outside the active worktree, secret disclosure/rotation, force-push/history rewrite,
  IAM/firewall/SSH changes, destroy operations, or actions relying on an unverified backup.

### Destructive operations

Before non-trivial deletion:

1. Resolve and show the absolute target.
2. Verify its mount and repository/worktree boundary.
3. Inspect dirty and untracked state.
4. Establish and verify a recovery path.
5. Treat `/`, `$HOME`, `/data`, `/cache`, workspace parents, and mount roots as protected.
6. Prefer quarantine over permanent deletion when ownership or reproducibility is unclear.

### Secrets

- Never print complete environment dumps, auth files, token values, private keys,
  Kubernetes Secret values, credential-bearing DSNs, or traces containing secrets.
- Keep secrets out of persistent shell startup files and committed `.env` files.
- Prefer command-scoped injection such as `infisical run -- <command>`.
- Report secret names, IDs, and successful use—not values.

### Confidentiality

Do not send confidential repository content, internal logs, strategy logic, account data,
or database samples to web search, public issues, paste services, telemetry, external MCP,
or third-party analysis unless disclosure was explicitly approved.

### Verification

For every external mutation, read back the resulting state from the source of truth. A
zero exit code alone is not proof that the requested outcome was achieved.
