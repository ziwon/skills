# 0001. Personal skills repo structure

- **Status**: accepted
- **Date**: 2026-05-30

## Context

This repo holds my personal agent skills. It is built on the philosophy of
`mattpocock/skills` but is purely personal (an organization-wide repo will be separate).
Three structural choices were non-obvious and worth recording.

## Decision

1. **Vendor nothing I didn't write.** Upstream skills (mattpocock, community) are installed
   separately into my agent (e.g. `npx skills add mattpocock/skills`); they do not live in
   this repo as submodules or copies. This repo contains only skills I authored.
2. **Organize by function, not by author.** Skills live under `skills/{engineering,
   productivity,misc}/`. Since everything here is mine, an author-namespace folder would be
   redundant.
3. **`AGENTS.md` is the single source of truth** for my philosophy/conventions; `CLAUDE.md`
   is a thin pointer to it. `CONTEXT.md` is the domain glossary of *this repo only*.

## Consequences

- No upstream sync script and no merge conflicts: I never edit code I didn't write, so
  upstream updates are just a reinstall on my side.
- The cost is that a fresh machine needs two installs (mine + upstream) rather than one.
  Acceptable for personal use.
- Author-namespacing is rejected here but will be reconsidered for the org repo, where
  mixing internal + personal + upstream sources in one marketplace makes provenance matter.
- Keeping philosophy in one file (`AGENTS.md`) removes the drift risk of maintaining
  parallel `CLAUDE.md` / `AGENTS.md` content.
