# Safe Permission Profiles for Headless Grok

Permissions and tool availability are separate controls:

- `--tools` / `--disallowed-tools`: what the model can call.
- `--allow` / `--deny`: which calls are approved or rejected.
- `--permission-mode bypassPermissions`: no interactive approval; explicit denies and hooks
  still apply.

An allow rule alone is not a filesystem or process sandbox. For unattended edits, combine
all three controls and prefer a disposable worktree/container.

## Profile 1: Read-only auditor

```bash
grok -p 'Review the code and report findings. Do not edit.' \
  --tools 'read_file,grep,list_dir' \
  --disallowed-tools 'Agent' \
  --output-format json \
  --max-turns 20
```

## Profile 2: Read-only external research

```bash
grok -p 'Research the question and cite primary URLs.' \
  --tools 'web_search,web_fetch,read_file,grep,list_dir' \
  --disallowed-tools 'run_terminal_cmd,search_replace,write_file,Agent' \
  --output-format json \
  --max-turns 20
```

Never include private code, credentials, internal hostnames, or proprietary incidents in
external queries.

## Profile 3: Bounded editor

```bash
grok -p 'Refactor only src/auth and run the focused tests.' \
  --permission-mode bypassPermissions \
  --allow 'Edit(src/auth/**)' \
  --allow 'Write(src/auth/**)' \
  --allow 'Bash(git diff*)' \
  --allow 'Bash(uv run pytest*)' \
  --deny 'Bash(rm*)' \
  --deny 'Bash(sudo*)' \
  --deny 'Read(**/.env*)' \
  --disallowed-tools 'web_search,web_fetch,Agent' \
  --max-turns 30 \
  --output-format json
```

Afterward, independently inspect `git diff`, changed paths, and test output.

## Profile 4: Isolated worktree task

```bash
grok -p 'Implement the bounded task, verify it, and do not push.' \
  --worktree grok-task \
  --permission-mode bypassPermissions \
  --deny 'Bash(rm*)' \
  --deny 'Bash(sudo*)' \
  --deny 'Bash(git push*)' \
  --deny 'Read(**/.env*)' \
  --max-turns 40 \
  --check \
  --output-format json
```

A worktree isolates git changes, not network, credentials, or the rest of the filesystem.
Use a container/sandbox when those boundaries matter.

## Profile 5: ACP

```bash
grok agent --model grok-build stdio
```

Let the ACP client handle permission requests. Only in an isolated trusted environment:

```bash
grok agent --always-approve stdio
```

`--allow`, `--deny`, `--tools`, and `--max-turns` are not `stdio` subcommand options.

## Forbidden assumptions

- A friendly `-s "task-name"` resumes a session — false; `--session-id` creates a new UUID.
- `--allow` limits all other actions — false; it only auto-approves matching calls.
- A prompt saying “never delete” is enforcement — false; use deny rules and isolation.
- JSON output means `.text` is already parsed model JSON — false; parse the outer object first.
- Exit code zero proves requested files/tests are correct — false; verify independently.
