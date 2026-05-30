---
name: weekly-note
description: >-
  Compile a Korean weekly working note from what we did this week. Use when I say
  "주간노트", "weekly note", "이번주 정리", or ask to summarize the week's work for my
  Obsidian vault. Output Korean prose, technically precise, no filler.
---

# Weekly Note

Turn the week's work into a concise Korean note for my Obsidian vault.

## Procedure

1. Gather what happened this week — from the current conversation, recent commits, and
   any notes I point you at. Ask me only for gaps you genuinely can't infer.
2. Group by theme (infra / product / learning / ops), not by day.
3. For each item: what changed, why, and the current state. One or two sentences each.
4. End with a short "다음 주" section: open threads and the next concrete step for each.

## Output format

- Korean (반말 헤더는 쓰지 말고 명사형/평서형으로), Markdown.
- A top `# YYYY-Www 주간노트` heading.
- Theme sections as `## `, items as bullets.
- Keep it skimmable: no marketing tone, no restating the obvious.

## Guardrails

- Don't invent work that didn't happen. If a section is empty, omit it.
- Don't include secrets, tokens, or internal hostnames in the note.
