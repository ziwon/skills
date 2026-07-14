# Adversarial review patterns from an observer milestone

Use this reference when a milestone introduces subprocess runners, bounded adapters, multi-cluster fan-out, or redaction boundaries.

## Why ordinary unit tests were insufficient

A read-only Kubernetes observer passed formatting, strict typing, and more than 100 tests while still containing compositional and concurrency defects. Exact-SHA reviews plus executable probes found them.

## High-value probes

### Zero-result success

A backend can successfully return no records. Ensure the response represents that cluster as successful instead of forcing either a record or a failure.

### Cross-cluster identity composition

IDs that are unique within one cluster can collide after fan-out. Define uniqueness as `(cluster_id, record_id)` when record IDs are cluster-local, and test two clusters returning the same local ID.

### Adapter evidence binding

Do not trust typed adapter output merely because it validates as a model. At the gateway, reconstruct and verify:

- cluster ID;
- query kind;
- namespace/resource scope;
- requested time window;
- adapter identity grammar.

Map forged evidence to a stable generic failure.

### Time and byte budgets

Backend flags and post-processing must enforce the same semantics:

- metrics samples outside the requested window are dropped;
- logs use `max(window.start, window.end - since_seconds)` as the effective cutoff;
- log lines are post-filtered through the requested end;
- request `max_bytes + 1`, retain `max_bytes`, and use the extra byte only to prove truncation.

### Subprocess-tree timeout

A parent can spawn a descendant that inherits stdout/stderr and then exits. Killing only the parent leaves pipes open and breaks wall-clock timeout guarantees.

On POSIX:

1. launch fixed argv with `start_new_session=True`;
2. save the process group ID immediately;
3. on timeout, cancellation, or output overflow, signal the group even if the leader already exited;
4. TERM, bounded wait, then KILL;
5. await or cancel all reader/wait tasks and retrieve every exception;
6. verify no running descendants, `ResourceWarning`, unraisable exception, or closed-loop transport warning remains.

Never expose shell access or use private asyncio `_transport` APIs.

### Output-limit race

A pipe reader and its limit-sentinel task may finish in the same `asyncio.wait()` batch. Make task removal idempotent, retrieve exceptions from every completed/cancelled task, and stress many concurrent capped-output commands. Every call must yield the stable generic adapter error—never `KeyError` or “Task exception was never retrieved.”

### Redaction probes

Test actual serialized output, not just helper return values:

- raw backend failure messages;
- credentials embedded in sentences and non-HTTP DSNs;
- malformed URL ports;
- non-finite numbers;
- validation errors containing hostile inputs.

The report boundary should suppress raw payloads and private runtime identifiers rather than claiming universal private-name detection.

## Review loop

1. Review an immutable SHA.
2. Reproduce each credible finding with a minimal boolean/sanitized probe.
3. Add a regression that fails before the fix.
4. Fix in a separate worktree or new commit without moving the reviewed artifact.
5. Run focused warnings-as-errors, full checks, then review the new SHA.
6. Stop only when the latest exact SHA has no actionable findings.

Do not equate a large passing suite with proof that cancellation, process trees, composition, or serialization boundaries are correct.
