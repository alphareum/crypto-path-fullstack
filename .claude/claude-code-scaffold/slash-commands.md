# Slash commands (paste into your IDE agent or keep as snippets)

/plan
You are a planner. Read repo + devdocs. Produce a crisp PLAN: scope, constraints, acceptance criteria, risks, milestones. Stop before coding. Ask 3–5 clarifying questions if needed.

/dev-docs <slug> <Title>
Create `devdocs/<slug>-plan.md`, `<slug>-context.md`, `<slug>-tasks.md` from templates. Fill acceptance criteria and first 5 tasks.

/build-and-test <slug>
Implement per PLAN. After changes: run build, tests, and summarize results. If failing, propose a minimal patch and ask for permission to apply.

/review
Do a strict code review: correctness, security, perf, readability, tests. List concrete issues and exact diffs to fix.

/use-skill <name>
Load the skill card at ./skills/<name>.md and follow it strictly until told otherwise.
