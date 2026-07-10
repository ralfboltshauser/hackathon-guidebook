---
name: resolve-pr-comments
description: "Triage and resolve bot/human review comments (CodeRabbit, Copilot, Gemini, reviewers) on a GitHub PR — validate each against the code, apply minimal fixes, dismiss false positives, and mark threads resolved. Use when: reviewing/resolving PR comments, working through 'PR N comments', handling bot comments, or processing review feedback. NOT for: creating PRs or writing new reviews. Triggers: resolve pr comments, review pr comments, work through pr comments, handle bot comments, fix pr review, triage pr feedback."
metadata:
  author: hackathon-guidebook
  adapted_from: "ai-dev-atelier resolve-pr-comments (MIT, © Lukas Strickler)"
  version: "1.0"
---

# Resolve PR Comments

Turn a pile of PR review comments into applied fixes + resolved threads, without guessing. Validate
every comment against the actual code, fix what's real, dismiss what's wrong (with a reason), defer
only what you genuinely can't resolve after research.

Adapted for standard Claude Code (uses `gh` + the `Agent` tool) from the ai-dev-atelier skill of the
same name.

## Prerequisites

- `gh` authenticated with `repo` scope (`gh auth status`), and `jq`.
- You're on the PR's branch, or you pass `--repo owner/repo` to the scripts.

## Workflow

### 1. Fetch the comments

```bash
# Unresolved review threads + the node IDs you'll need to resolve them:
bash .claude/skills/resolve-pr-comments/scripts/pr-threads.sh <PR_NUMBER>
```

For the full bodies (and top-level + review-summary comments), also:

```bash
gh pr view <PR_NUMBER> --json comments --jq '.comments[] | "── \(.author.login):\n\(.body)"'
gh api repos/{owner}/{repo}/pulls/<PR_NUMBER>/comments \
  --jq '.[] | "── \(.user.login) @ \(.path):\(.line // .original_line)\n\(.body)"'
```

> **Large PR (dozens of comments)?** Don't dump it all into context. Spawn one `general-purpose`
> subagent per file (or per cluster) via the `Agent` tool: give it the file, the comments on it, and
> the classification rubric below; have it return a compact list of `{comment, classification, fix}`.
> Fire them in parallel (one message, multiple `Agent` calls). Serialize agents that touch the same file.

### 2. Classify each comment

Read the code the comment points at (± surrounding function, not just the line), then label it:

| Classification | Meaning | Thread action |
| --- | --- | --- |
| `VALID_FIX` | Real issue → apply a minimal fix | reply + **resolve** |
| `FALSE_POSITIVE` | Bot is wrong | reply with evidence + **resolve** |
| `ALREADY_FIXED` | Fixed elsewhere in the branch | reply + **resolve** |
| `STYLE_CHOICE` | Preference, not a defect | reply + **resolve** |
| `VALID_DEFER` | Real but risky/large | reply, **leave open**, escalate |
| `UNCLEAR` | Can't determine yet | research first, then re-classify |

**Security comments:** research the vulnerability class, confirm it applies here, apply the fix if
confident; only escalate if still unclear after research. Never dismiss a security comment unread.

### 3. Apply minimal fixes

- Smallest change that resolves the comment; don't refactor beyond it.
- After fixing, run the repo's gate: `pnpm check` (lint + typecheck + event-lint + build) — or the
  narrowest relevant subset. Never resolve a thread whose fix breaks the gate.

### 4. Reply + resolve each thread

```bash
# THREAD_ID comes from pr-threads.sh (step 1). Reply states what changed / why dismissed.
bash .claude/skills/resolve-pr-comments/scripts/pr-resolve.sh <THREAD_ID> \
  "Fixed in <short-sha>: <one line on the change>."
```

Reply with the commit SHA for fixes, or the evidence for a dismissal. Then push your commit.

### 5. Verify

```bash
bash .claude/skills/resolve-pr-comments/scripts/pr-threads.sh <PR_NUMBER>
```

Success = every actionable thread shows `resolved` (deferred ones stay OPEN, with an escalation note).

## Guardrails

- **Research before you defer.** Use `grep`, read callers, check how the pattern is handled elsewhere.
  Escalate to a human only for: breaking API changes, unresolved security concerns after research,
  multiple valid interpretations, or a fix that repeatedly fails.
- **One thread, one decision.** Don't batch-resolve without reading each.
- **Don't invent work.** Resolve exactly what the comment raises.

## Escalation format

When you must escalate, report: the original comment, what you investigated and found, the specific
uncertainty, the options you see, and your recommendation.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/pr-threads.sh <PR> [--repo o/r]` | List review threads with node IDs + status |
| `scripts/pr-resolve.sh <THREAD_ID> "<reply>"` | Reply to a thread and mark it resolved |
