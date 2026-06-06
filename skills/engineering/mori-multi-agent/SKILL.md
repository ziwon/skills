---
name: mori-multi-agent
description: Orchestrate Mori-led multi-agent work across Hermes, Codex, Claude Code, Grok/headless, and agy for research/code/report workflows.
version: 0.1.0
author: Mori
license: MIT
metadata:
  hermes:
    tags: [multi-agent, orchestration, codex, claude-code, grok, agy, hermes, research]
---

# Mori Multi-Agent Orchestration

## When to use

Use this skill when Aaron asks Mori to coordinate multiple local agents or split a project across independent workstreams, especially for:

- DeepFX / alpha-lab research experiments;
- homelab dashboards or report apps;
- code implementation plus independent review;
- adversarial critique of trading/research assumptions;
- long-running or parallel work that benefits from isolated contexts.

Default language with Aaron: casual Korean. Keep DeepFX/private repo data local and never paste secrets or proprietary details into external services unless explicitly approved.

## Core model

Mori is the **coordinator**, not a worker swarm cheerleader.

```text
Mori / Hermes coordinator
├─ delegate_task: quick planners, reviewers, auditors
├─ spawned Hermes: long-running isolated sub-coordinators
├─ Codex CLI: code implementation, tests, small refactors
├─ Claude Code: architecture review, large-codebase reasoning, deep critique
├─ Grok/headless: adversarial assumptions, external-angle critique, ideation
└─ agy: optional batch runner / workflow executor after capability check
```

Principle: **planner → implementer → reviewer → verifier**. Do not let the same agent be the only reviewer of its own work.

## Pre-flight checklist

Before starting non-trivial multi-agent work:

1. Confirm repo/workdir and check dirty state:
   ```bash
   git rev-parse --show-toplevel
   git status --short
   ```
2. Define write scope:
   - read-only research;
   - docs/plans only;
   - experiment code only;
   - production code.
3. Define forbidden actions:
   - no live trading;
   - no secret printing;
   - no external disclosure;
   - no unrelated repo edits;
   - no network calls unless specified.
4. For `/cache/Workspace/ziwon/skills`, follow `AGENTS.md` and run:
   ```bash
   ./scripts/link-agy-skills.sh
   ```
   before editing/linking skills.
5. Decide whether the task is short enough for `delegate_task` or needs a spawned CLI agent.

## Agent selection

### Use `delegate_task` for

- read-only repo inspection;
- experiment design;
- quick code review;
- final checklist review;
- parallel summaries under ~10 minutes.

Pass complete context. Subagents have no memory of the current chat.

### Use Codex CLI for

- implementing code;
- adding tests;
- refactoring small-to-medium modules;
- running test suites and returning diffs.

Pattern:

```bash
codex exec --full-auto "<task brief>" \
  # run inside the target git repo, usually with pty=true
```

Always require:

```text
- changed files
- commands/tests run
- git diff --stat
- risks / assumptions
```

### Use Claude Code for

- architecture review;
- large-codebase tracing;
- refactor planning;
- independent design critique;
- final quality review when changes are complex.

Prefer print mode for one-shot review:

```bash
claude -p "Review this design/code. Do not edit files. Return risks, gaps, and test plan." --max-turns 5
```

### Use Grok/headless for

- adversarial critique;
- assumption attacks;
- idea generation;
- “why this experiment may fool us” review.

Do not treat Grok output as verified fact. Use Mori/Claude/repo checks to verify.

### Use spawned Hermes for

- long-running isolated missions;
- sub-coordinator roles;
- scheduled/reporting jobs;
- tasks needing Hermes tools independently from the parent session.

Use self-contained prompts. Avoid recursive cron scheduling unless explicitly requested.

### Use agy for

- batch/automation workflows only after checking:
  ```bash
  agy --help
  ```

Do not assume agy semantics without reading its help/docs.

## Standard task brief template

```text
Task:
  <one-sentence objective>

Workdir:
  <absolute path>

Scope:
  <read-only | docs only | experiment code | production code>

Allowed:
  - read files
  - edit only <paths>
  - run <tests/commands>

Forbidden:
  - live trading or production side effects
  - secret printing
  - external disclosure
  - unrelated file edits
  - network calls unless explicitly allowed

Context:
  <relevant findings, schema, file paths, hypotheses>

Output required:
  - summary
  - files changed
  - commands/tests run
  - git diff --stat
  - risks/assumptions
  - recommended next step
```

## Reviewer checklist

A reviewer must answer:

- Scope respected?
- Any unrelated diff?
- Tests or validation run?
- Secrets avoided?
- Data leakage checked?
- Timestamp/split integrity checked?
- Dry-run enforced where trading/research code touches execution concepts?
- User approval needed before next step?

## DeepFX-specific safety

For DeepFX and trading research:

- Treat all code, account data, strategy details, and DB snapshots as private.
- Default to **research-only / dry-run-only**.
- Never connect an experiment directly to live execution without a separate explicit approval step.
- Split signal research from execution logic.
- Always include costs/slippage or clearly label results as pre-cost.
- Use time-aware / walk-forward splits; avoid same timestamp or same group leakage.
- Report results as evidence, not financial predictions.

## Reusable workflow: Kronos conflict experiment

Use when testing same symbol/time or nearby-window conflicting Kronos signals.

1. Planner subagent reads alpha-lab AFML/Kronos docs and proposes policy arms.
2. Recommended policy arms:
   - `discard_conflict`: remove groups with both directions;
   - `strongest_abs_pred`: keep max `abs(predicted_bps)`;
   - `net_pred`: only if predictions are calibrated/additive;
   - `conflict_as_feature`: keep strongest plus conflict metadata.
3. Implementer adds a dry-run experiment module under alpha-lab research paths, with tests.
4. Reviewer checks leakage, group split, and metric validity.
5. Coordinator runs focused tests and summarizes results.

Important AFML principle: primary side must be well-defined before meta-labeling. If long/short conflict at the same `(symbol, t0)`, raw rows should not be treated as two independent executable trades.

## Reusable workflow: Kronos/BRK report app

1. Start read-only.
2. Normalize `kronos_shadow_signal` rows from `decision_event`.
3. Reconstruct `strategy-010101` ENTER/EXIT pairs.
4. Compute:
   - conflict count;
   - BUY/SELL directional edge;
   - aligned/opposed live trade PnL;
   - BRK capture/missed/opposed/false-positive;
   - daily/weekly markdown report.
5. MVP stack: Python ETL + DuckDB or Postgres + Streamlit/FastAPI dashboard.
6. Deploy homelab-only behind Tailscale/basic auth; no public exposure by default.

## Reusable workflow: BRK signal capture research

1. Define BRK event precisely before sourcing data.
2. Separate actual live BRK trades from candidate/market BRK events.
3. Use Grok/headless for idea generation and assumption attack.
4. Use Claude for data provenance/statistical validity review.
5. Use Codex for dry-run ingestion/evaluation scripts.
6. Avoid MNPI, ToS-violating scraping, and execution coupling.

## Reusable workflow: Kronos SELL-only / contrarian experiment

1. Treat current observation as a hypothesis, not a conclusion.
2. Split by symbol, session, regime, and threshold bucket.
3. Compare:
   - raw Kronos direction;
   - SELL-only;
   - LONG-disabled;
   - contrarian-to-Kronos;
   - live 010101 aligned/opposed.
4. Include transaction costs/slippage or label pre-cost clearly.
5. Do not wire to live trading; produce research report only.

## Done criteria

A multi-agent run is done only when Mori verifies:

- worker outputs are internally consistent;
- files changed are within scope;
- tests/queries/validation match the task;
- sensitive data was not exposed;
- final recommendation separates evidence from speculation;
- next action is either executed or clearly marked as requiring Aaron's approval.
