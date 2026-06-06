---
name: n8n-mcp
description: >-
  Use when building, reviewing, debugging, validating, or safely deploying n8n workflows with the czlonkowski/n8n-mcp MCP server. Trigger on requests like "n8n workflow 만들어줘", "n8n-mcp 연결", "n8n 노드 찾아줘", "n8n 자동화 설계", "n8n credential/workflow 관리", or any task where an agent needs n8n node docs, templates, workflow JSON validation, or n8n API management. Always prefer read-only documentation/search first, work on copied workflows before production edits, and validate before deploy.
---

# n8n MCP

`czlonkowski/n8n-mcp` turns n8n's node catalog, templates, workflow validation, and optional n8n instance API into MCP tools. Treat it as two things:

- **Library brain**: search node docs, properties, operations, examples, and templates without touching an n8n instance.
- **Workflow hands**: if `N8N_API_URL` and `N8N_API_KEY` are configured, create/update/test workflows against a real n8n instance.

The safety model is simple: **docs-first, copy-first, validate-before-deploy**. Never let an AI edit a production workflow directly as the first move.

## When this runs

Use this skill when the user asks for any of these:

- Connecting `n8n-mcp` to an agent or MCP client.
- Designing or generating n8n workflows.
- Finding the right n8n node, operation, property, or credential schema.
- Validating, autofixing, importing, deploying, or testing workflow JSON.
- Managing n8n workflows through API-backed MCP tools.
- Building automation around webhooks, schedules, AI agent nodes, Slack/Telegram/Discord, Google Workspace, Notion, Airtable, databases, or HTTP APIs in n8n.

Do **not** use this as a generic n8n tutorial if no MCP/tooling is involved. Do **not** use it to directly mutate production workflows without backups and confirmation.

## Quick setup for Hermes Agent

For docs/template-only use, no n8n API credentials are required:

```bash
hermes mcp add n8n-mcp \
  --command npx \
  --env MCP_MODE=stdio LOG_LEVEL=error DISABLE_CONSOLE_OUTPUT=true \
  --args n8n-mcp
```

Verify and reload:

```bash
hermes mcp list
hermes mcp test n8n-mcp
```

Inside a running Hermes session or gateway:

```text
/reload-mcp
```

If tools still do not appear, start a new session or restart the gateway:

```text
/restart
```

## Setup with n8n API management

Aaron's default n8n instance is:

```text
https://n8n.restack.tech
```

Only add API access when the user explicitly wants the agent to manage an n8n instance:

```bash
hermes mcp add n8n-mcp \
  --command npx \
  --env MCP_MODE=stdio LOG_LEVEL=error DISABLE_CONSOLE_OUTPUT=true N8N_API_URL=https://n8n.restack.tech N8N_API_KEY=*** \
  --args n8n-mcp
```

Avoid putting real API keys directly into shell history when possible. Prefer whatever secret mechanism the current environment supports, then pass the values to the MCP server from that secret source.

For local n8n instances:

```text
N8N_API_URL=http://localhost:5678
```

For Docker-to-host access, `n8n-mcp` docs often use:

```text
N8N_API_URL=http://host.docker.internal:5678
```

If the server blocks localhost/private-network calls through an SSRF guard, check the upstream self-hosting docs for `WEBHOOK_SECURITY_MODE=moderate` or equivalent localhost allowance before debugging the workflow itself.

## Operating procedure

### 1. Classify the task by risk

- **Read-only**: node search, property docs, template discovery, JSON explanation. Safe to proceed.
- **Drafting**: generate workflow JSON or a plan. Safe if no production write happens.
- **Staging write**: create/update a copied workflow or dev instance. Proceed after explaining target and backup.
- **Production write/delete/credential change**: ask for explicit confirmation, make/export a backup first, then validate and test.

### 2. Start with docs and examples

Before assembling JSON from memory, use MCP docs/search tools to identify:

- exact node type names;
- operation/resource names;
- required properties;
- credential requirements;
- example configurations;
- known validation constraints.

n8n node names and schemas change over time. The MCP catalog is the source of truth for node details.

### 3. Build the workflow in small slices

For non-trivial workflows, design by vertical slice:

1. Trigger node.
2. One data source or input normalizer.
3. One transformation/branch.
4. One output/action.
5. Error handling and observability.

After each slice, validate the partial workflow JSON. Do not generate a huge workflow and only validate at the end.

### 4. Validate before deploy

Use available n8n-mcp validation/autofix tools before any real activation:

- validate node-level configuration;
- validate full workflow connections;
- check required credentials are placeholders or bound correctly;
- run autofix only on copied/dev workflows unless the user approves production changes;
- test webhook/schedule/manual triggers in a safe environment.

### 5. Preserve production workflows

Before modifying an existing workflow:

1. Fetch/export the current workflow.
2. Save the backup artifact path or workflow version ID.
3. Clone/copy it when possible.
4. Apply changes to the copy/dev workflow first.
5. Validate and test.
6. Only then update production with explicit user approval.

## Common tool patterns

Actual tool names may vary as `n8n-mcp` evolves. Look for these capabilities:

- Search nodes by task or keyword.
- Get node details, properties, operations, and examples.
- Validate a node's minimal or full configuration.
- Search templates by nodes, task, metadata, service, or audience.
- Fetch a template in `nodes_only`, `structure`, or `full` mode.
- Create/list/get/update/delete n8n workflows when API credentials are configured.
- Validate or autofix an existing n8n workflow by ID.
- Test/trigger a workflow and inspect executions.
- List credential schemas or manage credentials when explicitly requested.

## Workflow design checklist

When creating a workflow, capture these before writing JSON:

- Trigger: webhook, schedule, manual, chat, form, app event, or polling.
- Inputs: schema, example payload, auth, pagination, rate limits.
- Transformations: mapping, filtering, splitting, merging, deduplication.
- Outputs: destination system, idempotency key, retry behavior.
- Credentials: which services need credentials, and whether placeholders are acceptable.
- Failure behavior: error workflow, Slack/Telegram alert, dead-letter storage, retry/backoff.
- Observability: execution names, tags, log nodes, audit trail.
- Environment: dev/staging/prod target, activation state, webhook URL.

## Safety guardrails

- Never edit production workflows directly with AI. Copy first.
- Never invent credential IDs. Ask for them or discover them through approved read-only credential listing.
- Never paste API keys or secrets into workflow JSON unless the user explicitly chooses that pattern. Prefer n8n credentials.
- Never activate a workflow until validation passes and the user approves the target.
- Never delete workflows or credentials without explicit confirmation and a backup.
- Treat webhook URLs, execution payloads, and credentials as sensitive.
- If the MCP server only has docs mode, do not claim that a workflow was deployed or tested against n8n.

## Local troubleshooting

If MCP startup fails:

1. Confirm Node/npm/npx exists:
   ```bash
   node --version
   npm --version
   npx --version
   ```
2. Test the package directly:
   ```bash
   MCP_MODE=stdio LOG_LEVEL=error DISABLE_CONSOLE_OUTPUT=true npx n8n-mcp
   ```
3. If JSON-RPC parsing errors appear, ensure `MCP_MODE=stdio` and quiet logging env vars are set.
4. If n8n API tools fail, verify `N8N_API_URL`, `N8N_API_KEY`, network access, and n8n API permissions.
5. If local n8n is blocked, check upstream docs for localhost/SSRF settings.

## Verification checklist

- [ ] MCP server is registered and `hermes mcp test n8n-mcp` passes, or the user understands this is only an authored skill.
- [ ] For docs-only tasks, no `N8N_API_URL`/`N8N_API_KEY` is required.
- [ ] For API tasks, target instance and environment are named explicitly.
- [ ] Existing workflows are exported/backed up before modification.
- [ ] Generated workflow JSON is validated before import/update.
- [ ] Production activation/update/delete actions have explicit user confirmation.
- [ ] Final response distinguishes drafted, validated, deployed, and tested states.
