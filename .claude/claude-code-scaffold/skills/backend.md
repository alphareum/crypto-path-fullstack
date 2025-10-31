# Skill: Backend (Node/Fastify)

- Validate all inputs (zod/valibot); reject on first failure.
- Return typed errors; never leak stack traces in prod.
- Use async handlers; no floating promises.
- Log structure: level, msg, reqId, duration.
- Add integration tests per route; seed with realistic data.
