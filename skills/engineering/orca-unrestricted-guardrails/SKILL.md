---
name: orca-unrestricted-guardrails
description: >-
  Keep unrestricted/YOLO Orca and coding-agent execution fast while constraining
  destructive filesystem actions, secret exposure, external writes, and confidential
  data disclosure. Use whenever an agent runs with bypassed approvals or sandboxing,
  before rm/cleanup commands, infrastructure or remote writes, secret-bearing commands,
  force-push/history rewrites, or work in confidential repositories.
version: 0.1.0
author: Mori
license: MIT
metadata:
  hermes:
    tags: [orca, yolo, unrestricted, guardrails, secrets, destructive-operations, safety]
---

# Orca Unrestricted Guardrails

Unrestricted execution is intentional. Preserve autonomy for normal engineering and
intervene only where the blast radius crosses a trust boundary or recovery becomes
uncertain.

This is a procedural seatbelt, not a security boundary. An unrestricted process can
bypass these rules, so combine them with worktree isolation, least-exposed credentials,
Git history, backups, and infrastructure policy.

## When this runs

Apply this procedure when:

- Orca, Codex, Claude Code, Hermes, or another agent runs in YOLO/bypass mode;
- a task may delete or overwrite files;
- commands can mutate Git remotes, Kubernetes, cloud, SaaS, databases, or registries;
- credentials or confidential repositories are in scope;
- the requested action is difficult to reverse.

Do not turn routine worktree-local edits into an approval ceremony.

## Classify the action

### YOLO-local — proceed autonomously

Proceed without confirmation for:

- reading and editing inside the active worktree;
- tests, lint, builds, dependency installation, and local development servers;
- generated-file cleanup contained inside the worktree;
- Docker image builds that do not push or delete persistent volumes;
- local branches and ordinary commits;
- Orca worktree, terminal, and child-agent operations.

Verify results and report the actual commands/tests run.

### YOLO-infra — declare scope, then execute when requested

When the user explicitly requests an external write, do not add another approval prompt.
Before execution, state briefly:

```text
Target: <repo/cluster/namespace/service/account>
Mutation: <what changes>
Persistent data deletion: <none or exact target>
Rollback: <command/revision/backup>
```

Examples:

- `git push`, PR/issue updates, or registry pushes;
- `kubectl apply`, rollout, or a bounded resource deletion;
- OpenTofu/Terraform apply;
- n8n, GitHub, Linear, or other SaaS mutations;
- deployment and release actions.

If the target or rollback is unclear, resolve it before execution instead of guessing.

### Break-glass — ask once

Obtain explicit confirmation immediately before:

- deleting databases, buckets, PVCs, volumes, namespaces, or persistent datasets;
- destructive filesystem work outside the active worktree;
- deleting a protected root or workspace parent;
- rotating, replacing, exporting, or revealing secrets;
- force-pushing, rebasing shared history, or deleting protected branches;
- IAM, firewall, SSH trust, or account-recovery changes;
- `terraform destroy`, `tofu destroy`, or equivalent destroy operations;
- actions whose rollback depends on an unverified backup.

Bundle related actions into one precise confirmation rather than asking per command.

## Destructive filesystem preflight

Before a destructive command that is not trivial worktree-local cleanup:

1. Establish the active boundary:

   ```bash
   repo_root=$(git rev-parse --show-toplevel)
   pwd -P
   git status --short
   ```

2. Resolve every target before deletion:

   ```bash
   realpath -- <target>
   findmnt -T <target>
   ```

3. Refuse an empty, unresolved, glob-expanded, or unexpectedly broad target.
4. Treat these as protected roots:

   ```text
   /
   $HOME
   /data
   /cache
   any workspace parent
   any mount root
   ```

5. Inspect dirty and untracked data. Git does not protect untracked files, databases,
   volumes, generated datasets, or `.env` files.
6. Establish recovery before deletion:
   - Git restore/reset for tracked source;
   - a verified snapshot or backup for persistent data;
   - move to a quarantine directory for uncertain files;
   - a controller/rebuild path for reproducible resources.
7. After deletion, verify the resolved target and filesystem usage rather than assuming
   the command affected the intended path.

Do not rely on interactive aliases such as `rm -i`; agents and build tools often invoke
non-interactive shells or absolute binaries.

## Secret handling

### Never expose by default

Do not print or transmit:

- complete `env`, `printenv`, `set`, or exported-shell dumps;
- auth files, cookies, private keys, tokens, or password-manager output;
- Kubernetes Secret manifests or decoded values;
- database connection strings containing credentials;
- shell traces (`set -x`) around secret-bearing commands;
- secret values in logs, prompts, issues, PRs, or chat responses.

Report secret names, source locations, IDs, and successful use—not values.

### Prefer transient injection

Keep secrets out of `.zshrc`, `.bashrc`, committed `.env`, and long-lived agent defaults.
Use the narrowest available mechanism, such as:

```bash
infisical run -- <command>
```

or a command-scoped credential file/environment. Remove temporary material after use and
verify it is not tracked by Git.

Use read-only or narrowly scoped credentials for routine agents when practical. Elevate
for the specific operation rather than permanently broadening the base environment.

## Confidential repository handling

For confidential repositories:

- keep source, strategy logic, account data, DB samples, and internal architecture local;
- never include repository content in web searches or public issue queries;
- do not send it to external MCP servers, paste sites, telemetry, or third-party analysis;
- use external research only as inbound context unless disclosure is explicitly approved;
- sanitize paths, hostnames, identifiers, and logs before sharing externally;
- separate observed local evidence from public-source claims.

## External side-effect discipline

Before a write outside the local worktree:

1. Confirm the current identity, remote, cluster context, namespace, account, or endpoint.
2. Read current state before mutation.
3. Prefer a dry run or diff when the platform provides one.
4. Apply the smallest bounded change.
5. Read back the result from the source of truth.
6. Verify service health, CI, rollout, or API state.
7. Report a durable URL/ID/path/revision when available.

A successful command exit is not sufficient verification.

## Recovery defaults

- Use one task per worktree and avoid direct feature work in the canonical checkout.
- Keep commits small and atomic.
- Before risky source changes, create a recoverable Git point or Orca checkpoint when the
  active Orca version supports it.
- For persistent systems, verify the backup or snapshot before destructive work.
- Do not describe a rollback as available unless the referenced revision, backup, or
  rebuild path was actually checked.

## Per-repository policy

Copy and tailor `templates/AGENTS.unrestricted.md` into a repository's `AGENTS.md` when
that repo needs the policy locally. Add stricter confidentiality or production clauses
for sensitive repositories such as trading systems, infrastructure, and secret stores.

## Done criteria

The task is complete only when:

- normal local work proceeded without unnecessary approval prompts;
- action scope stayed inside the declared boundary;
- no secret value or confidential payload was exposed;
- destructive actions had a checked recovery path;
- external mutations were read back and verified;
- remaining irreversible risk is stated plainly.
