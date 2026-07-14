---
name: milestone-delivery
description: Execute a repository milestone from GOAL.md through parallel implementation, staged review, CI, PR merge, and GitHub milestone closure. Use when Aaron asks to start, deliver, or complete the next milestone.
version: 1.1.0
author: Mori
license: MIT
metadata:
  hermes:
    tags: [milestone, github, worktree, pull-request, ci, review, delivery]
    related_skills: [github-operations, subagent-driven-development, conventional-commits]
---

# Milestone Delivery

## Trigger

Use when a repository has `PLANNING.md` and `milestones/<id>/GOAL.md`, and Aaron asks to start, implement, review, merge, or complete a milestone.

The output is not a plan or draft. The output is a verified milestone merged into the intended base branch, unless a real blocker is reported with exact state.

## Lifecycle

### 1. Pre-flight gate

1. Read `PLANNING.md`, the active `GOAL.md`, repository instructions, and relevant architecture/security docs.
2. Verify:
   - repository root and clean status;
   - `origin`, default/base branch, and current HEAD;
   - `gh auth status` and repository-local Git author;
   - target GitHub Milestone and current PR/issue state.
3. Sync the base branch with `git pull --ff-only`.
4. Create `milestone/<id-name>` from current base.
5. Define forbidden effects explicitly: credentials, production mutations, public visibility, deployments, or external disclosure unless the milestone requires and authorizes them.
6. Create a session todo list with one item in progress.

### 2. Convert GOAL.md into executable workstreams

Extract every acceptance criterion, deliverable, non-goal, dependency, verification gate, and PR boundary.

Partition work by disjoint file ownership, typically:

- contracts/domain;
- adapter/implementation;
- fixtures/tests;
- docs/tooling.

Do not parallelize workers that write the same central files. If overlap is unavoidable, one worker owns the files and others return read-only proposals.

### 3. Isolated implementation

For each independent lane:

1. Create `agent/<milestone>-<lane>` from the same verified base and attach an isolated worktree.
2. Give the worker a complete brief:
   - absolute worktree path and base SHA;
   - exact allowed and forbidden paths;
   - full acceptance criteria;
   - TDD requirement;
   - verification commands;
   - Conventional Commit subject;
   - no push, merge, deployment, credential reads, or unrelated edits;
   - required commit SHA and evidence in the final report.
3. Verify each worker’s changed-file scope, commit, and test output yourself.

For small or tightly coupled milestones, sequential TDD on the integration branch is allowed, but review separation remains mandatory.

### 4. Per-lane review funnel

Review immutable commit SHAs. Any fix invalidates the previous review.

1. Spec-compliance review: requirements, paths, omissions, contradictions, scope creep.
2. Fix all spec gaps and rerun spec review.
3. Quality/security review: correctness, malformed inputs, leakage, mutation, concurrency, failure modes, test gaps.
4. Fix blocking findings, add regression tests, and review the new SHA again.
5. Only approved commits may be cherry-picked onto the milestone branch.

Never trust a worker’s side-effect claim without reading back files, commits, URLs, or runtime state.

#### Probe-first review discipline

A passing suite is not proof of compositional or concurrency safety. For credible findings:

1. Reproduce the issue with a minimal sanitized probe; report booleans or stable classes, never hostile/private values.
2. Add a regression that fails before the fix.
3. Keep the reviewed SHA immutable. If review is still running, create a separate fix worktree from that SHA rather than moving its branch.
4. Run focused warnings-as-errors plus the full gate on the fix SHA.
5. Review the new exact SHA; a fix invalidates approval of its parent.

For subprocess, fan-out, time/byte budget, adapter-output binding, and redaction work, consult `references/adversarial-observer-review-patterns.md`.

#### Background and context-budget checkpoint

Long milestone delivery can outlive a single tool budget. Before starting a background worker, record its session ID, worktree, branch, base SHA, allowed files, and expected commit. Before any interim final response:

- inspect every completed process and verify its artifact;
- do not call an active worker “complete”;
- preserve the exact next action and unverified process state;
- never merge or close the milestone while a required worker/review/live gate remains active.

If execution is interrupted, report the milestone as in progress with verified and unverified work clearly separated. Resume from the background artifact instead of restarting or presenting planned output as delivered output.

### 5. Integration gate

After cherry-picking approved lanes:

1. Resolve integration issues with focused commits.
2. Run the repository’s full local gates, normally:
   - frozen dependency install;
   - formatting and lint;
   - strict typecheck;
   - full tests and coverage;
   - package/build validation;
   - fixture plus real consumer-path smoke tests;
   - Markdown local-link scan;
   - tracked-file secret scan;
   - `git diff --check`;
   - clean worktree check.
3. Exercise adversarial boundaries relevant to the milestone: malformed values, rendered errors, cycles/depth, stale hashes, cross-cluster references, denied capabilities, timeouts, partial backend failures, and redaction.
4. Add cross-lane composition probes after cherry-pick. At minimum, test empty-success representation, identifiers that are only locally unique, adapter output bound to the original scope/window, cancellation propagation, and one backend failing while another succeeds. These defects often cannot appear in isolated lane tests.
5. Dispatch a final reviewer against the complete `origin/<base>...HEAD` diff.
6. Fix credible blockers, add regression tests, rerun full gates, and review the fix commit.
7. Stop speculative review loops once acceptance criteria and credible security boundaries are satisfied.

### 6. PR and live CI gate

1. Push only a clean, verified milestone branch.
2. Create a non-draft PR with `--body-file`; include scope, non-goals, trust boundaries, verification evidence, and follow-up milestone.
3. Attach the matching GitHub Milestone and read the PR back.
4. Wait for live checks with `gh run watch` or `gh pr checks --watch`.
5. On failure, fetch `gh run view <id> --log-failed`, fix the first root cause, push, and wait for the replacement run.
6. Verify current HEAD OID, mergeability, and successful checks before merge.

Do not assume an action’s floating major tag exists. Verify refs and pin an exact release tag when required.

### 7. Merge and closure

1. Record Mori’s integration review disposition in the PR.
2. Merge only after local gates, independent review, and GitHub CI pass.
3. Prefer squash for a clean milestone-level main history unless commit preservation is required.
4. Attribution gate: GitHub squash may use the authenticated account, not local Git author. If final author matters, switch `gh` identity first or create the squash commit locally. Do not rewrite shared main merely to repair attribution without explicit approval.
5. Delete the remote milestone branch, sync local base, verify the merged commit and PR state.
6. Close the GitHub Milestone only after merge verification.
7. Clean temporary worktrees/branches only after verifying no unique commits remain.
8. Report durable URLs, CI result, merged SHA, tests/coverage, residual risks, and the next milestone.

## Abort and recovery rules

- Dirty/unrelated base: stop and preserve user changes.
- Worker edits outside allowlist: reject or split the commit.
- Review targets stale SHA: rerun review.
- Local pass but CI fail: trust neither; inspect the CI root cause.
- Missing credentials or unavailable live backend: use fixtures only if GOAL.md permits; otherwise report the unmet live gate and do not merge.
- Failed merge or partial external action: read back remote state before retrying.

## Definition of done

A milestone is complete only when:

- every GOAL.md acceptance criterion is evidenced;
- explicit non-goals remain absent;
- all blocking findings are closed;
- local verification and current GitHub CI pass;
- milestone PR is merged into the intended base;
- remote/base state and merged SHA are verified;
- GitHub Milestone is closed;
- the next milestone boundary is stated.
