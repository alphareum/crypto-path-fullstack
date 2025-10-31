# Stack-Agnostic Dev Scaffolding (Plan–Context–Tasks + Skills + Hooks)

This kit avoids assumptions about your repo. Configure behavior via `stack.config.json`.
Chats are temporary; `devdocs/` is the source of truth.

## Core
- `devdocs/templates/*`: plan/context/tasks markdown templates
- `devdocs/scripts/devdocs-new.sh`: create triad files for a feature slug
- `skills/*.md`: small "how we work" cards; load them manually in your IDE agent
- `hooks/pre-commit`: suggests skills to load based on your config
- `process/`: optional process managers (PM2, Procfile, docker-compose)

## Configure first
Edit `stack.config.json` to reflect your paths, package manager, and commands.
Then generate `skill-rules.json` from it:

```bash
python skills/build-rules.py
```

## Daily use
1) Create dev docs for a new feature: `bash devdocs/scripts/devdocs-new.sh payments-api "Payments API"`
2) Paste a `/plan` prompt in your IDE, then save the output into `devdocs/<slug>-plan.md`
3) As you work, update `*-tasks.md` (Work Log) and `*-context.md` (Decision Log).
4) On commit, `hooks/pre-commit` prints which skills to load; adjust your session accordingly.
