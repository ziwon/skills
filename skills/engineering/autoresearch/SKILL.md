---
name: autoresearch
description: >-
  Run an autonomous, fixed-budget experiment loop that optimizes one metric:
  change code → run within a fixed time/step budget → keep or discard by the
  metric → log → repeat (Andrej Karpathy's autoresearch method). Use when I say
  "autoresearch", "run experiments overnight", "auto-optimize/auto-tune this",
  "sweep architecture/hyperparameters autonomously", "keep iterating until <metric>
  improves", or want an agent to self-improve an ML training script (e.g. nanochat
  val_bpb) unattended. Establish the metric, budget, edit surface, and a cost/stop
  ceiling — and confirm them with me — before spending any compute.
---

# Autoresearch

Autonomously improve a system by running many small, comparable experiments against a
single scalar objective. The agent forms a hypothesis, makes the smallest code change
that tests it, runs under a fixed budget, keeps the change only if the metric improved,
logs the outcome, and repeats — unattended, for hours.

Mental model: a tight feedback loop (AGENTS.md §3) turned into a self-driving search. The
discipline is what makes it work — a fixed budget for comparability, one change at a time,
and an honest metric the agent can't game. Distilled from Andrej Karpathy's
[autoresearch](https://github.com/karpathy/autoresearch); the original concrete setup
(nanochat, `val_bpb`, 5-minute budget) lives in `references/karpathy-setup.md`.

## When this runs

When I want an agent to optimize something by itself through repeated experiments — tuning
an ML training script, searching architectures/hyperparameters, or any "keep iterating
until the number improves" task. Not for a one-off change (just make it), and not when
there is no measurable objective.

## Set up the harness first (grill me, then confirm)

Do NOT start looping until these are pinned down and I've confirmed them — this is the
alignment step (AGENTS.md §1) and it gates real compute and cost:

1. **Objective metric** — one scalar and its direction (lower/higher is better), e.g.
   `val_bpb`, lower better. If several matter, pick the primary and name guardrail metrics
   that must not regress.
2. **Budget per experiment** — a fixed wall-clock time or step count so every run is
   comparable, e.g. 5 minutes. Never change it mid-run.
3. **Baseline** — measure the current system once under the budget. That's the number to
   beat and the first logbook entry.
4. **Edit surface** — exactly what may be modified (ideally one file, e.g. `train.py`).
   Everything else — data prep, the eval, the harness — is frozen.
5. **Repro controls** — fix seed and data so only the change under test varies. Decide how
   to treat run-to-run noise (a tolerance, or re-running a winner before trusting it).
6. **Stop + cost ceiling** — max iterations, wall-clock, or spend, and what to do at the
   end. Autonomous loops burn GPU/$$; bound it explicitly.

Before the first experiment, write down the confirmed harness as a compact preflight
checklist:

```
objective:      <metric name> (<higher|lower> is better)
command:        <exact command for one experiment>
metric parser:  <how to read the metric from stdout/log/file>
budget:         <wall-clock or step count; fixed for the whole run>
edit surface:   <allowed files/directories only>
logbook:        experiments/autoresearch/YYYYMMDD-<slug>.md
min_delta:      <minimum improvement beyond noise>
rerun policy:   <when to rerun a winner before promoting it>
stop condition: <max iterations/time/spend and failure ceiling>
```

Also run `git status --short` before editing. Identify unrelated user changes and do not
touch or revert them. All rollback operations are limited to changes made by this
autoresearch run inside the approved edit surface.

## The loop

Each iteration:

1. **Hypothesize** — state the change and why it should move the metric ("longer LR warmup
   → lower val_bpb because …"). One idea.
2. **Change** — the smallest edit within the edit surface that tests the hypothesis.
   Atomic; no bundling (AGENTS.md).
3. **Run** — execute under the fixed budget. Use `uv` for Python and a `just` target if one
   exists.
4. **Measure** — read the objective metric (and any guardrail metrics).
5. **Keep or discard** — if it beat the baseline by more than noise, promote it as the new
   baseline in the experiment log; otherwise revert. Do not create git commits unless I
   explicitly ask. Be honest about "more than noise."
6. **Log** — record the entry (format below) whether it won or lost. The log is the
   deliverable.
7. **Repeat** until the stop condition. Every ~10 experiments, zoom out (AGENTS.md §4):
   synthesize what's working, prune dead directions, re-aim.

## Logbook (append one block per experiment)

Default path: `experiments/autoresearch/YYYYMMDD-<slug>.md`, unless I choose another path.

```
## exp NNN — <short hypothesis>
change:   <the one edit>
command:  <exact command that ran>
metric:   <val>  (baseline <val>, Δ <±val>)
guards:   <pass|fail and any guardrail metrics>
decision: keep | discard   (reason; was it noise?)
next:     <what this result suggests>
```

## Output / handoff

At the stop condition, produce: the winning config and its diff vs. the original baseline,
the metric trajectory, a ranked table of what helped/hurt, and the top 2–3 next directions.
If I asked for a working note, write it in Korean per AGENTS.md; the skill doc and any code
comments stay English.

## Guardrails

- **Don't move the goalposts.** Never change the metric, eval, budget, or data mid-run — it
  invalidates every prior comparison. If one must change, that's a new run with a fresh
  baseline.
- **One change at a time.** Bundled changes make the result uninterpretable.
- **Don't game the metric.** No leaking val/test into training, no weakening the eval, no
  overfitting the validation signal. An autonomous agent *will* find these shortcuts —
  forbid them up front and keep a held-out check.
- **Respect noise.** A tiny Δ may be variance. Re-run before crowning a winner when the
  margin is small.
- **Stay in the edit surface.** Don't touch frozen files (data prep, eval, harness).
- **Protect the worktree.** Never revert unrelated user changes. Before each rollback,
  inspect the diff and only undo this run's edits inside the approved edit surface.
- **Bound the cost.** Honor the stop and cost ceiling. Running unattended, fail safe: on
  repeated errors, stop and log rather than thrash. Default failure ceiling: stop after
  three consecutive harness failures. If the run hits OOM, quota, missing data, or a broken
  metric parser, do not change the budget or metric to push through; log the failure and
  stop for human input.
- **Confirm before burning compute.** The first real run happens only after I've signed off
  on the harness.
