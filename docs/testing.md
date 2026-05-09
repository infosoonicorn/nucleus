# Testing and Verification

This project uses browser-level checks from the start so visible changes are proven in a real page, not only assumed from code edits.

## Local Smoke Test

```bash
pnpm test:e2e
```

The Playwright config starts `apps/web` automatically at `http://127.0.0.1:3000` unless `PLAYWRIGHT_BASE_URL` is provided.

## Preview or Production Check

Use the same tests against a deployed URL:

```bash
PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e
```

Later, each Vercel preview URL can be checked the same way before calling a change complete.

## Completion Standard

For visible website or web-app work, a change is not considered done until:

- the app builds or the relevant dev server starts successfully;
- Playwright verifies the changed page or flow;
- the result is checked in a browser locally or against the Vercel preview URL;
- any failures are reported with the exact command that failed.

When backend logic is added, keep this same pattern with `/api/health` and focused flow tests for auth, client access, tasks, billing, attendance, and newsletters.

## Agent Handoff

For non-trivial work, update `HANDOFF.md` before stopping. Include the active task, changed files, commands run, deployment/preview status, and the next concrete step. Clear it back to "No active task" when the work is complete.
