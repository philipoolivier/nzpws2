# AI-assisted UAT tests

## Testing

Use the existing Playwright framework. Tests are individual CommonJS files at testing/tests/uat/U01.spec.cjs etc, or tests/uat when this folder is the workspace. Import the shared support/address-finder.cjs helper. Use require('@playwright/test'). Do not create another framework or executable JSON review flags.

Before generating a test, observe UAT through Playwright MCP and record input, expected visible outcome and evidence in docs/test-plan.md. Record the exact seed state, including the route/query, selected quick search, and default filters. Repeat the same seed before making result counts or named locations fixed assertions; mark session-, data-, or geolocation-dependent observations as variable and obtain reviewer agreement on a stable seed. Generate only the requested case. Stop for human review before execution. Never change an expected business outcome just to obtain a pass.

UAT is read-only: search queries and service filters only. Never start transactions or create, edit or delete records, including attempted changes. Use the credential loader; never read or print .env, cookies or credential files.

Use visible UI assertions, scoped to the finder. A successful HTTP response alone does not prove the user result. Use the shared search helper's exact lookup response and Playwright assertions; avoid arbitrary delays and broad analytics-matching URL filters.

For a failure: classify preparation, setup/auth, locator/waiting, assertion or product behaviour. Explain evidence and propose a minimal change. Do not touch unrelated cases. Do not copy instructor-reference unless explicitly asked by the instructor.

TDD changes only testing/tdd: add test, run meaningful RED, then change implementation for GREEN, then refactor with tests unchanged. Source documentation must cite actual files and separate facts from uncertainty.
