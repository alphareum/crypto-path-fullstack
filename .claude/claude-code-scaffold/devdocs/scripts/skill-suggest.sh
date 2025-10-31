#!/usr/bin/env bash
# Suggest which skills to load based on staged files and keywords.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
RULES="$ROOT/skill-rules.json"

if [ ! -f "$RULES" ]; then
  echo "No skill-rules.json found."
  exit 0
fi

changed=$(git diff --name-only --cached || true)

skills=()

# Path-based rules
while IFS= read -r path; do
  for glob in $(jq -r '.rules[].match.path_glob? // empty' "$RULES" | sort -u); do
    if [[ "$path" == $glob ]]; then
      s=$(jq -r ".rules[] | select(.match.path_glob? == \"$glob\") | .skills[] " "$RULES")
      skills+=($s)
    fi
  done
done <<< "$changed"

# Keyword-based rules (scan file content quickly)
keywords=$(jq -r '.rules[].match.keywords[]? // empty' "$RULES" | sort -u)
if [ -n "$keywords" ]; then
  for kw in $keywords; do
    if git diff --cached -U0 | grep -iq "$kw"; then
      s=$(jq -r ".rules[] | select(.match.keywords? | index(\"$kw\")) | .skills[] " "$RULES")
      skills+=($s)
    fi
  done
fi

# Unique
unique=($(printf "%s\n" "${skills[@]}" | awk '!seen[$0]++'))

if [ ${#unique[@]} -gt 0 ]; then
  echo "🔎 Suggested skills to load in your AI session:"
  for s in "${unique[@]}"; do echo "  - $s"; done
  echo "Tip: paste the relevant /use-skill prompts."
fi
