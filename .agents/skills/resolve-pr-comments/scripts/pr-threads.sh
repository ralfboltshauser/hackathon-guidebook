#!/usr/bin/env bash
# List a PR's review threads with the node IDs needed to resolve them.
# Usage: bash pr-threads.sh <PR_NUMBER> [--repo owner/repo]
# Output (tab-separated): THREAD_ID  STATUS  path:line  @author  first-120-chars-of-comment
# STATUS is OPEN or resolved. Focus on OPEN threads. Requires: gh (authenticated), jq.
set -euo pipefail

PR=""
REPO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    -h|--help) echo "usage: pr-threads.sh <PR_NUMBER> [--repo owner/repo]"; exit 0 ;;
    *) PR="$1"; shift ;;
  esac
done
[ -n "$PR" ] || { echo "usage: pr-threads.sh <PR_NUMBER> [--repo owner/repo]" >&2; exit 1; }
[ -n "$REPO" ] || REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"

gh api graphql -f owner="${REPO%/*}" -f name="${REPO#*/}" -F pr="$PR" -f query='
query($owner:String!,$name:String!,$pr:Int!){
  repository(owner:$owner,name:$name){
    pullRequest(number:$pr){
      reviewThreads(first:100){ nodes{
        id isResolved
        comments(first:1){ nodes{ author{login} path line originalLine body } }
      }}
    }
  }
}' --jq '.data.repository.pullRequest.reviewThreads.nodes[]
  | "\(.id)\t\(if .isResolved then "resolved" else "OPEN" end)\t\(.comments.nodes[0].path):\(.comments.nodes[0].line // .comments.nodes[0].originalLine)\t@\(.comments.nodes[0].author.login)\t\(.comments.nodes[0].body | gsub("\n";" ") | .[0:120])"'
