---
name: open-source-to-saas
description: >-
  Analyze an open-source GitHub repository (such as CLI tools, Python scripts, or ML demos) to extract its core computational logic, wrap it inside a full-stack SaaS interface (Next.js, FastAPI, Supabase Auth/DB, Stripe/Portone payments), and scaffold cloud infrastructure configurations (Terraform). Use when I say "wrap this github repository into a SaaS", "monetize this open source tool", "convert CLI/script to web SaaS", or "run open-source-to-saas on <repo>".
---

# Open-Source to SaaS Wrapper

Transform standalone open-source codebases, CLI utilities, and core algorithms into fully commercialized SaaS applications. This skill coordinates codebase parsing, web backend wrapping, secure user subscription flows, and validated cloud hosting templates.

## When this runs

When the user requests to monetize or convert a public or local open-source project (like a script, library, CLI, or model checkpoint) into a multi-tenant web application with user accounts, tiered subscriptions, and cloud deployment pipelines.

## Procedure

1. **Analyze (Repo Architecture & Code Scan)**:
   - Identify the source GitHub repository.
   - Run the script `scripts/run_repo_download.sh` to clone the target repository to a temporary workspace, extract the file structure, and inspect primary configuration/entry-point files (e.g., `setup.py`, `package.json`, `main.py`, `Makefile`).
   - Run the `research` subagent to parse the core computation interface:
     - **Execution Interface**: How is the tool invoked (CLI arguments, API calls, library imports)?
     - **License Scan**: Identify the open-source license (MIT, Apache 2.0, GPL, AGPL) and highlight copyleft risks or compliance requirements.
     - **State & Data Flow**: Determine if it processes files (I/O), needs long-running tasks, or requires database storage.
   - Output these findings to `repo_analysis.md` using the guidelines in `prompt_templates/repo_analyzer.txt`.

2. **Map & Adapt (SaaS Adaptation)**:
   - Structure the multi-tenant SaaS integration design:
     - **Authentication**: Connect user routes to Supabase Auth (Email/Password & Social OAuth).
     - **Database Schema**: Map tenant-specific metadata, usage tracking (for quota limits), and subscription tiers to Supabase PostgreSQL.
     - **Core Wrapping strategy**:
       - For light scripts: Direct library imports or subprocess spawning.
       - For heavy workloads: Setup Celery / Redis queue worker tasks.
     - **Payment / Billing**: Map API endpoints to Stripe / Portone webhooks and customer portals for subscription checks.

3. **Scaffold & Verify**:
   - Apply `prompt_templates/saas_scaffolder.txt` to draft:
     - **Frontend**: Next.js (App Router, Tailwind CSS) with user dashboards, payment portals, and core execution pages.
     - **Backend**: FastAPI wrapper serving REST APIs, webhook handlers, and background tasks.
     - **Terraform IaC**: Terraform configurations to provision VPC, application containers (e.g., Cloud Run or AWS ECS), database, and caching layers following `tf-foundation` practices.
   - Run linter checks and syntax validation on the generated configurations to ensure error-free boilerplate code.

## Guardrails

- **License Restrictions**: Always warn the user immediately if the source code uses copyleft licenses like GPL v3 or AGPL, explaining the implications for proprietary SaaS wrappers.
- **Async Execution Guard**: If the target tool takes >2 seconds to execute, do not wrap it as a synchronous API request. Guide the backend scaffold to use asynchronous task queues (e.g., Celery, Redis Queue, or cloud tasks) and polling/websocket endpoints.
- **Resource Constraints**: Estimate CPU/Memory requirements for the wrapped tool and configure Terraform container resource limits accordingly to prevent Out-Of-Memory (OOM) or high cloud-compute cost spikes.
- **Credential Separation**: Never hardcode client IDs, DB passwords, or payment webhook secrets. Require all of them to be injected via environment variables.
