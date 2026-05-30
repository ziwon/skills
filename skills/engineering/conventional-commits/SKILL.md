---
name: conventional-commits
description: >-
  Write git commit messages using Conventional Commits. Use whenever I ask to
  commit, draft a commit message, split commits, amend a commit, prepare a PR
  commit stack, or say "커밋", "commit", "commit message", "커밋메세지",
  "커밋 메시지", "conventional commit". Never invent a free-form commit subject
  when a Conventional Commit type/scope can be chosen.
---

# Conventional Commits

Use Conventional Commits for every commit message unless I explicitly request a different
format.

## Format

```text
<type>(<scope>): <description>

<body>
```

Scope is optional. Body is optional. Keep the subject imperative, lowercase after the
colon, and under ~72 characters when practical.

## Types

Prefer these types:

- `feat`: user-visible feature or new capability
- `fix`: bug fix or correctness repair
- `docs`: documentation-only change
- `test`: tests only
- `refactor`: behavior-preserving code change
- `perf`: performance improvement
- `build`: build system, dependencies, packaging
- `ci`: CI configuration or workflow
- `chore`: repo maintenance with no user-facing behavior
- `style`: formatting-only change

Use `!` for breaking changes:

```text
feat(api)!: remove legacy token format
```

## Procedure

1. Inspect the staged diff before writing the message. If nothing is staged, inspect the
   intended diff and say what needs staging.
2. Pick the narrowest type. Use `docs` for skill prose/docs changes; use `feat` when adding
   a new reusable skill; use `chore` for lockfiles, ignores, and repository housekeeping.
3. Add a scope when it clarifies the affected area, e.g. `skills`, `autoresearch`,
   `youtube-summary`, `gitignore`.
4. If the commit bundles unrelated changes, recommend splitting before committing.
5. When making the commit yourself, use a non-interactive command:

   ```sh
   git commit -m "<type>(<scope>): <description>"
   ```

   Add `-m "<body>"` only when the why/risk is not obvious from the subject.

## Guardrails

- Do not use vague subjects like `update files`, `misc changes`, `fix stuff`, or `wip`.
- Do not include generated noise in the commit.
- Do not commit unrelated user changes unless I explicitly include them.
- If unsure between two types, recommend the default and explain in one short sentence.
