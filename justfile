# justfile — task runner for this skills repo.
# Third-party skill tasks wrap `npx skills@latest` (https://skills.sh); local repo tasks
# wrap scripts/*.sh. Run `just` with no args to see this list.

default:
    @just --list

# Register + install a third-party skill package (repo owner/name or full URL).
# Adds an entry to skills-lock.json and installs it into .agents/skills/ for every agent.
add repo:
    npx skills@latest add {{repo}} --all -y

# Restore every skill recorded in skills-lock.json (e.g. after a fresh clone).
sync:
    npx skills@latest experimental_install

# Update installed third-party skills to their latest version. Omit names to update all.
update *skills:
    npx skills@latest update {{skills}}

# List currently installed skills.
list:
    npx skills@latest list

# Remove third-party skills. Omit names for the interactive picker.
remove *skills:
    npx skills@latest remove {{skills}}

# Lint every SKILL.md in skills/ (frontmatter, naming, kebab-case).
validate:
    ./scripts/validate-skills.sh

# Expose skills/**/SKILL.md through .agents/skills/ (flat + directory symlinks).
link:
    ./scripts/link-agy-skills.sh

# Install git hooks that keep .agents/skills/ in sync on merge/checkout.
install-hooks:
    ./scripts/install-git-hooks.sh
