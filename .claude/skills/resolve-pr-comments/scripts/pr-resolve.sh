#!/usr/bin/env bash
# Reply to a PR review thread and mark it resolved (use after you've applied the fix, or to dismiss a
# false positive with a reason). Get THREAD_ID from pr-threads.sh.
# Usage: bash pr-resolve.sh <THREAD_ID> "<reply markdown>"
# Requires: gh (authenticated with repo scope).
set -euo pipefail

TID="${1:-}"
BODY="${2:-}"
[ -n "$TID" ] && [ -n "$BODY" ] || {
  echo 'usage: pr-resolve.sh <THREAD_ID> "<reply markdown>"' >&2
  exit 1
}

gh api graphql -f t="$TID" -f b="$BODY" -f query='
mutation($t:ID!,$b:String!){
  addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$t, body:$b}){ comment{ id } }
}' --jq '.data.addPullRequestReviewThreadReply.comment.id' >/dev/null

gh api graphql -f t="$TID" -f query='
mutation($t:ID!){ resolveReviewThread(input:{threadId:$t}){ thread{ isResolved } } }
' --jq '.data.resolveReviewThread.thread.isResolved' | sed 's/^/resolved: /'
