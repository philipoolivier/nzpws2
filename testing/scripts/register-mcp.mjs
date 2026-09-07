import { fileURLToPath } from 'node:url';
const launcher = fileURLToPath(new URL('./mcp.mjs', import.meta.url));
// Print instructions only. Never overwrite the participant's existing MCP configuration.
console.log('In Copilot CLI, enter /mcp add and configure:');
console.log('Server name: contoso-playwright');
console.log('Server type: Local or STDIO');
console.log(`Command: "${process.execPath}" "${launcher}" uat`);
console.log('Tools: *');
console.log('Save with Ctrl+S. Use /mcp to confirm tools are available.');
