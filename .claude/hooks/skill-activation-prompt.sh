#!/bin/bash
# Skill activation hook - Bash version

# Read JSON input from stdin
read -r input

# Extract prompt from JSON (simple grep approach)
prompt=$(echo "$input" | grep -o '"prompt":"[^"]*"' | cut -d'"' -f4 | tr '[:upper:]' '[:lower:]')

# Check if prompt is empty
if [ -z "$prompt" ]; then
    exit 0
fi

# Define keywords for each skill
declare -A skills
skills[frontend-guidelines]="component react ui form vite tailwind shadcn frontend page modal dialog"
skills[backend-laravel-guidelines]="controller model eloquent route laravel php api endpoint middleware validation migration"
skills[code-review]="review refactor architecture"
skills[documentation]="document readme docs api"

# Track matched skills
matched=()

# Check each skill's keywords
for skill in "${!skills[@]}"; do
    keywords="${skills[$skill]}"
    for keyword in $keywords; do
        if echo "$prompt" | grep -q "$keyword"; then
            matched+=("$skill")
            break
        fi
    done
done

# If any skills matched, display suggestion
if [ ${#matched[@]} -gt 0 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 SKILL ACTIVATION CHECK"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📚 RECOMMENDED SKILLS:"
    for skill in "${matched[@]}"; do
        echo "  → $skill"
    done
    echo ""
    echo "ACTION: Use Skill tool BEFORE responding"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

exit 0
