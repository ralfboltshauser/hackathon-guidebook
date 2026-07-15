# Agent skills

Canonical, agent-neutral home for this repo's skills, following the open **Agent Skills** standard
(`<name>/SKILL.md` + optional `scripts/` and `references/`). This directory is the single source of
truth; each agent's fixed skills path is a committed symlink to it, so every agent sees the same skills
with no duplication:

```
.agents/skills/            ← real files (canonical)
.claude/skills   → .agents/skills   (Claude Code)
.cursor/skills   → .agents/skills   (Cursor)
.opencode/skills → .agents/skills   (OpenCode)
```

Codex and any other agent read them via [`AGENTS.md`](../../AGENTS.md); the helper scripts are plain
bash, so they run from any agent.

## Skills

| Skill | Purpose |
| --- | --- |
| [`pulse`](./pulse/SKILL.md) | Fetch & analyze the site's PostHog analytics (project 220518); add new tracking. |
| [`resolve-pr-comments`](./resolve-pr-comments/SKILL.md) | Triage & resolve PR review comments. Scripts: `pr-threads.sh`, `pr-resolve.sh`. |

## Conventions

- `SKILL.md` starts with YAML frontmatter (`name`, `description`) followed by the prompt.
- Scripts are executable (`chmod +x`), use relative paths, and are bash by default.
- Skills are self-contained — no importing from other skills.

## Adding a skill

Create `.agents/skills/<name>/SKILL.md` (+ `scripts/` if needed). It's immediately available to every
agent through the symlinks above — no per-agent copy. Add a row to the table.
