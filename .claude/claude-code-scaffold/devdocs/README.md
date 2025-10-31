# Dev Docs (Plan–Context–Tasks)

This folder is the single source of truth. Chat sessions are *scratchpads* only.

## Files per feature (slug = kebab-case)
- `slug-plan.md` — Why, constraints, acceptance criteria, risks, milestones.
- `slug-context.md` — System/architecture context, affected modules, decision log.
- `slug-tasks.md` — Granular tasks, statuses, and work log.

## Update rules
- **Before coding:** create/refresh the Plan; get explicit acceptance criteria.
- **While coding:** append to Tasks; for any decision, add a Decision entry.
- **After PR merge:** update Plan status; mark Tasks done; summarize lessons.
- **When chats drift:** re-upload these three docs; never rely on prior chats.

