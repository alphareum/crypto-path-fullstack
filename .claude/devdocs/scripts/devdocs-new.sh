#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 2 ]; then
  echo "Usage: $0 <slug> <Title...>"
  exit 1
fi
slug="$1"; shift
title="$*"
today=$(date +%F)
dir=".claude/devdocs"
tpl=".claude/dev/templates"

for f in plan context tasks; do
  out="$dir/${slug}-${f}.md"
  if [ -f "$out" ]; then
    echo "Exists: $out"
    continue
  fi
  case "$f" in
    plan)
      sed -e "s/<slug>/$slug/g" \
          -e "s/<title>/$title/g" \
          -e "s/<YYYY-MM-DD>/$today/g" \
          "$tpl/PLAN.md" > "$out"
      ;;
    context)
      sed -e "s/<slug>/$slug/g" \
          "$tpl/CONTEXT.md" > "$out"
      ;;
    tasks)
      sed -e "s/<slug>/$slug/g" \
          "$tpl/TASKS.md" > "$out"
      ;;
  esac
  echo "Created $out"
done

echo "Next:"
echo "  1) Fill acceptance criteria in .claude/devdocs/${slug}-plan.md"
echo "  2) Start coding; keep .claude/devdocs/${slug}-tasks.md updated"
