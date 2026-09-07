# Portable UAT testing project

Copy this whole testing/ folder into your repository. Inspect it before running. All browser checks target UAT; no local sample website is included.

Open testing/ in VS Code. Inspect .vscode/mcp.json before starting its Playwright MCP connection. When opening the full repository instead, merge the server entry into repository-root .vscode/mcp.json and change its launcher argument to ${workspaceFolder}/testing/scripts/mcp.mjs. Do not overwrite an existing MCP configuration.

From testing/ run npm ci, install Chromium with node node_modules/@playwright/test/cli.js install chromium and node node_modules/playwright/cli.js install chromium, and configure your private .env using .env.example. On Windows use npm.cmd when needed. Never copy another person's credentials or generated authenticated content.

Expected outcomes and reviewed case actions live in docs/uat-cases.json. Executable tests live in tests/uat/customer-cases.spec.cjs. Human-readable scenarios live in docs/customer-cases.feature. Run npm run test:uat, then npm run report. Reports are generated into playwright-report/ and test-results/; they are not input test cases.

Copy .github/workflows/playwright.yml from this folder to the repository-root .github/workflows/uat-tests.yml. The template runs commands inside testing/. Configure approved network access and protected UAT credentials before enabling it. It does not deploy your application or call AI to execute tests.

The source-reference directory used by the workshop documentation exercise is separate from this reusable test project. When adopting the folder in another repository, point documentation prompts at that repository's own source.
