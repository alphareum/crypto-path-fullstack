# Slash commands (agnostic)

/plan
Planner mode. Read repo + devdocs. Produce PLAN with scope, constraints, acceptance criteria, risks, milestones. Stop before coding.

/dev-docs <slug> <Title>
Create plan/context/tasks files from templates. Fill acceptance criteria and first tasks.

/build-and-test <slug>
Implement per PLAN. After changes: run build/tests (`stack.config.json` commands). Summarize results. If failing, propose minimal patch.

/review
Strict code review: correctness, security, perf, readability, tests. Provide exact diffs to fix.

/use-skill <name>
Load ./skills/<name>.md and follow it strictly until told otherwise.
