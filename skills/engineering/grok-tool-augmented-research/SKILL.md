---
name: grok-tool-augmented-research
description: >-
  Use Grok Build's current web_search/web_fetch tools as a bounded external-evidence
  layer inside coding, debugging, dependency evaluation, and autoresearch loops. Use
  for "Grok으로 검색해", fresh release/API/CVE evidence, recent community signal,
  or search-grounded hypotheses. Treat dedicated X corpus search as optional and only
  claim it when an installed MCP/tool explicitly provides it; never leak private repo data.
---

# Grok Tool-Augmented Research

Use fresh external evidence only when it can change the next engineering decision. Search
belongs inside `observe → hypothesize → verify → act`, not in a disconnected research dump.

Version-matched Grok docs are under `~/.grok/docs/`. In current Grok Build, the documented
built-in research tools are `web_search` and `web_fetch`; `--disable-web-search` removes
both. A dedicated X/Twitter corpus search is **not guaranteed by those tool names**. Use one
only when `grok inspect` shows a configured MCP/plugin tool that explicitly offers it.

## Decision gate

Search when the answer is volatile or external:

- current provider/API behavior, releases, deprecations, or compatibility;
- recent CVEs and maintainer advisories;
- unresolved errors tied to a specific current version;
- dependency activity, adoption friction, or a claim that materially affects a hypothesis.

Do not search for stable language rules, facts already proven by the checked-out source, or
questions that can be answered by running a local test.

## Procedure

1. **Name the decision.** Write the exact choice the evidence will influence.
2. **Sanitize the query.** Remove private code, customer data, secrets, internal hostnames,
   unpublished product names, incident details, and unique stack traces.
3. **Choose sources.** Prefer official docs/release notes/advisories and upstream issues.
   Use community posts only as secondary evidence of real-user friction.
4. **Bound the run.** Use a small query budget, read-only tools, no subagents unless needed,
   and a max-turn limit.
5. **Record evidence.** Keep query, retrieval date, URL/post ID, relevant version/date, and
   the exact claim supported. A search snippet alone is not final evidence; fetch the source.
6. **Resolve contradictions.** Compare publication dates, versions, primary-source status,
   and whether claims describe the same environment.
7. **Close the loop.** State `decision → evidence → confidence → next local verification`.
8. **Verify locally.** External evidence informs the hypothesis; tests, source inspection,
   and runtime behavior decide whether it applies here.

## Bounded headless recipe

```bash
grok -p '
  Research the current documented behavior relevant to this decision.
  Prefer primary sources, cite every material claim, state contradictions,
  and end with decision, confidence, and the next local verification.
' \
  --tools 'web_search,web_fetch,read_file,grep,list_dir' \
  --disallowed-tools 'run_terminal_cmd,search_replace,write_file,Agent' \
  --max-turns 20 \
  --output-format json
```

This recipe permits external disclosure of the **prompt text**. Keep the prompt generic and
public-safe. For confidential repositories, describe only the abstract technology question.

## X/social signal

X can be useful for current DX pain, outages, adoption friction, and statements by official
maintainers. But distinguish these cases:

- `web_search` happens to return an `x.com` URL — ordinary web evidence;
- an installed MCP/plugin exposes a dedicated X search tool — corpus-specific evidence;
- no such tool exists — do not claim an X search was performed.

For social evidence, preserve the post URL/ID, author, timestamp, and whether it is firsthand.
Do not treat likes, reposts, or a single viral post as technical validation.

## Evidence note template

```text
Decision: <what changes if the claim is true>
Query: <sanitized exact query>
Retrieved: <UTC date>
Primary sources:
- <URL> — <supported claim, version/date>
Secondary signals:
- <URL/post ID> — <what users report; not authoritative>
Contradictions/limits: <missing, stale, conflicting, inaccessible>
Conclusion: <decision and confidence>
Local verification: <test/source/runtime probe>
```

## Autoresearch composition

- **autoresearch** owns the fixed experiment budget, baseline, one-change discipline, and
  metric honesty.
- This skill may spend a bounded evidence call during hypothesis formation.
- Search findings never count as an experiment result. Log the query/URLs, then measure the
  candidate change against the unchanged evaluation procedure.

## Guardrails

- Never send confidential source, credentials, private incidents, or proprietary strategy
  logic to web/X search.
- Never cite an AI summary as the primary source when the underlying document is available.
- Never silently use the current year as a proxy for recency; apply an explicit date window.
- If evidence is weak, contradictory, paywalled, or inaccessible, say so and lower confidence.
- Keep URLs in notes/docs when they materially justify a code or architecture decision; avoid
  noisy permanent comments for disposable search context.
