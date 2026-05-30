---
name: app-cloner-researcher
description: >-
  Analyze successful overseas apps (e.g., Agent job matching platforms) to extract BM/UI/UX elements, adapt them for the local market, and scaffold localized MVPs (mobile frontend, backend APIs, Terraform infra). Use when I mention "clone/localize overseas apps", "research agent job matching platforms", or "run app-cloner-researcher on <app/target>".
---

# App Cloner & Market Researcher

Analyze successful overseas services (especially targeting agent matching or specialized niche markets) to design and scaffold localized MVPs. This skill connects market research, UX adaptation, and multi-tier code/infrastructure scaffolding.

## When this runs

When the user asks to analyze overseas killer applications (such as Agent job matching platforms or specialized niche community apps), translate their value proposition and user interface patterns into local-market equivalents, and generate boilerplate code and infrastructure configurations.

## Procedure

1. **Research (Market Scan & BM Analysis)**:
   - Identify target overseas applications (e.g., specialized Agent job matching filters or agent recruitment boards).
   - Execute the market scan script `scripts/run_market_scan.sh` to initialize search terms and set up the `research_report.md` framework.
   - Run search queries using the `research` subagent to extract:
     - **Core BM (Business Model)**: Monetization strategy, value proposition.
     - **UX/UI Elements**: Specialized layout widgets, agent dashboards, unified-depth menus, or visual indicators tailored for target users.
     - **Matching Flow**: Step-by-step process of user-to-agent matching, notifications, and verification.
   - Render the findings in `research_report.md` using `prompt_templates/research_scout.txt` as a guidelines reference.

2. **Adapt (Local Localization & Mapping)**:
   - Match overseas patterns to local equivalents:
     - Global standard auth/notification -> Local SSO & notification channels.
     - Global address lookups -> Localized postcode API systems.
     - Global payment gateways -> Localized payment/PG integrations.
   - Document this conversion mapping in a translation table inside the report.

3. **Scaffold & Verify**:
   - Apply `prompt_templates/code_generator.txt` to draft:
     - **Mobile Frontend Boilerplate**: Flutter or React Native with responsive styling, custom themes, and optimized navigation flows.
     - **Backend API**: A lightweight FastAPI or Express app providing user auth, profile management, and basic matching routes.
     - **Terraform Infrastructure**: Terraform blueprints conforming to `tf-foundation` guidelines.
   - Run syntax checks and static analysis tools on the generated code and infrastructure files to ensure correctness.

## Guardrails

- **Consent & Compliance**: Never scrape websites that block automated bots via `robots.txt` or require CAPTCHA bypass.
- **Secure Credentials**: Never commit hardcoded API keys. All service keys must be read from environment variables or mock configs.
- **Design for Target Group**: UI code templates generated for specific user personas must strictly enforce target accessibility and usability standards (appropriate touch targets, optimal cognitive load, responsive typography).
- **Validation**: Ensure that generated Terraform configurations do not violate standard deployment rules (e.g., ensure variables are declared, state storage is configured securely).
