# AGENTS.md

> Source of truth for how agents should work in my repos.
> `CLAUDE.md` and any other tool-specific file should point here, not duplicate it.

I don't vibe-code. I do real engineering with an agent in the loop. These are the
principles I expect an agent to follow, organized around the four ways agent-assisted
development usually goes wrong.

## 1. Alignment before code — grill me first

The most common failure is misalignment: the agent builds the wrong thing because it
guessed at intent instead of extracting it.

- Before any non-trivial change, **interview me one question at a time** until we share
  an understanding of the whole decision tree. For each question, give your recommended
  answer.
- If a question can be answered by reading the codebase, **read the codebase** instead
  of asking me.
- Stress-test the plan with concrete edge-case scenarios. Force precision on the
  boundaries between concepts.

## 2. Shared language — keep CONTEXT.md tight

Verbosity comes from the agent and I speaking different languages. Fix it with a
ubiquitous language per repo.

- Each application repo gets its own `CONTEXT.md` — a domain glossary, not a style doc.
- When I use a vague or overloaded term, **propose a precise canonical term** and call
  out conflicts with the existing glossary immediately.
- Update `CONTEXT.md` inline the moment a term is resolved. Don't batch.
- Only include terms meaningful to domain experts. Never couple the glossary to
  implementation details.

## 3. Feedback loops — never fly blind

If the agent can't see how the code runs, it produces crap.

- **TDD by default**: red → green → refactor. Write the failing test first, then make it
  pass, then clean up. One vertical slice at a time.
- **Diagnose, don't guess**: reproduce → minimise → hypothesise → instrument → fix →
  add a regression test. Small, deliberate steps. The rate of feedback is the speed limit.
- Lean on static types, the test runner, and (for UI) actual browser access as the
  primary signals.

## 4. Design every day — fight entropy

Agents accelerate coding, so they accelerate software entropy. Caring about design is
non-negotiable.

- Prefer **deep modules**: a lot of functionality behind a simple interface.
- Before touching code, name the modules you're about to change and explain the change in
  the context of the whole system (zoom out).
- Periodically look for deepening opportunities and refactor the ball of mud before it sets.
- Only write an ADR when a decision is (1) hard to reverse, (2) surprising without context,
  and (3) the result of a real trade-off. Otherwise skip it.

## 5. Unrestricted execution — wide authority, narrow blast radius

Unrestricted/YOLO agent execution is intentional. Approval prompts should not interrupt
normal worktree-local engineering, but authority is not permission to create an
unbounded blast radius.

- Proceed without confirmation for edits, tests, builds, dependency installs, local
  servers, worktree-local cleanup, and ordinary Git commits.
- Before a remote or infrastructure write, state the exact target, expected side effect,
  and rollback path. A separate confirmation is not required when I explicitly requested
  that external action.
- Ask once before irreversible or unusually destructive actions: deleting persistent
  data/volumes/namespaces, destructive work outside the active worktree, secret rotation
  or disclosure, force-push/history rewrite, IAM/firewall/SSH changes, or destroy
  operations.
- Never print complete environment dumps, auth files, tokens, Kubernetes Secret values,
  database DSNs with credentials, or shell traces containing secrets. Inject secrets only
  into the command that needs them and keep them out of persistent shell startup files.
- Before destructive filesystem work, resolve and show the absolute target, verify its
  mount and repository boundary, inspect dirty/untracked state, and establish a recovery
  path. Treat `/`, `$HOME`, `/data`, `/cache`, and workspace parents as protected roots.
- Keep confidential repository content out of web queries, public issues, paste services,
  telemetry, and third-party tools unless disclosure was explicitly approved.

Use the `orca-unrestricted-guardrails` skill for the detailed operating procedure and a
copyable per-repository policy template.

---

## My conventions (edit freely — this is a seed)

- **Language with me**: casual Korean (반말). Direct, technically precise. No hedging,
  no filler, no over-apologizing.
- **Task runner**: `just`. **Python envs**: `uv` (not pip/poetry/conda).
- **Deliverables**: Markdown by default. READMEs in English, working/weekly notes in Korean.
- **Notes**: Obsidian vault (Syncthing-synced) is the system of record for decisions.
- **Infra defaults**: Kubernetes-first, GitOps (ArgoCD), GCP + on-prem hybrid. Prefer
  OpenTofu/Terragrunt over raw Terraform for new IaC.
- **Commits**: small and atomic. Don't bundle unrelated changes.
- **When unsure**: ask one sharp question, propose a default, and proceed if I don't object.
- **Before doing any work**: 최신 스킬들이 반영되도록 `./scripts/link-agy-skills.sh`를 먼저 실행해라.
