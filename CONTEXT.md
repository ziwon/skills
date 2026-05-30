# CONTEXT.md

The ubiquitous language for **this repository** — a collection of personal agent skills.
This is the domain glossary for the skills repo as a piece of software. It is **not** my
coding style (that lives in `AGENTS.md`), and it is **not** the glossary for any
application repo (those get their own `CONTEXT.md`).

## Language

**Skill**
A single agent capability defined by a `SKILL.md` file with YAML frontmatter
(`name`, `description`). The folder containing `SKILL.md` is the skill; the folder name is
the skill's invocation name.
*Avoid*: command, macro, prompt (use "skill").

**Category**
An organizational folder under `skills/` grouping skills by function — `engineering`,
`productivity`, `misc`. Categories are for humans navigating the repo; they are not part of
a skill's invocation name.
*Avoid*: bucket, namespace.

**Template**
A starter `SKILL.md` skeleton in `templates/` used to author a new skill consistently.
*Avoid*: boilerplate, scaffold (reserve "scaffold" for the act of generating).

**ADR**
An Architecture Decision Record in `docs/adr/`, written only for decisions that are
hard to reverse, surprising without context, and the result of a real trade-off.

## Relationships

- A **Category** holds many **Skills**.
- A **Skill** is authored from a **Template** and may produce or reference **ADRs**.

## Flagged ambiguities

- "namespace" previously meant both the category folder and the plugin invocation prefix
  (`/ziwon:`) — resolved: the folder is a **Category**; the `/ziwon:` prefix comes from the
  plugin `name` in `.claude-plugin/plugin.json` and is called the *invocation prefix*.
