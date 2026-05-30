# ziwon/skills

My personal agent skills for real engineering — not vibe coding.

Small, composable, model-agnostic skills I use to keep an agent aligned, fed with
feedback, and honest about design. Built on the philosophy of
[`mattpocock/skills`](https://github.com/mattpocock/skills), kept purely personal.

The principles these skills enforce live in **[AGENTS.md](./AGENTS.md)**.

## Install

### Install my skills

```sh
npx skills@latest add ziwon/skills --agent codex claude-code --global --all
```

Omit `--global` to install into the current project instead.

### Restore optional upstream skills

This repo does not vendor third-party skills. Optional upstream skills are recorded in
`skills-lock.json`; restore them in a cloned checkout:

```sh
git clone https://github.com/ziwon/skills.git ~/Workspace/ziwon/skills
cd ~/Workspace/ziwon/skills
npx skills@latest experimental_install
```

Skills become available in your agent with a `/ziwon:` prefix (e.g. `/ziwon:my-skill`),
from the plugin name in `.claude-plugin/plugin.json`.

## Repository layout

```
skills/
├── engineering/      # code-work skills
├── productivity/     # general workflow skills
└── misc/             # rarely-used utilities
docs/adr/             # architecture decision records (form: docs/adr/0000-template.md)
templates/            # SKILL.md.template — starting point for new skills
scripts/              # validate-skills.sh and friends
AGENTS.md             # ★ source of truth: my engineering philosophy + conventions
CLAUDE.md             # → pointer to AGENTS.md
CONTEXT.md            # ubiquitous language for THIS repo (not my style, not app domains)
```

## Adding a skill

```sh
cp templates/SKILL.md.template skills/<category>/<skill-name>/SKILL.md
# edit it: kebab-case folder name == frontmatter `name`
bash scripts/validate-skills.sh
```

The `description` frontmatter is the trigger mechanism — be explicit about *when* the
skill should fire. Keep `SKILL.md` under ~500 lines; push detail into a `references/`
folder beside it and point to it.

## License

[MIT](./LICENSE)
