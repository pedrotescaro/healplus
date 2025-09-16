"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claude = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const utils_2 = require("../utils");
const CLAUDE_MCP_PATH = '.mcp.json';
const CLAUDE_PROMPT_PATH = 'CLAUDE.md';
exports.claude = {
    name: 'claude',
    displayName: 'Claude Code',
    async configure(options) {
        const files = [];
        let existingConfig = {};
        let settingsUpdated = false;
        try {
            const fileExists = (0, fs_1.existsSync)(CLAUDE_MCP_PATH);
            if (fileExists) {
                existingConfig = JSON.parse((0, fs_1.readFileSync)(CLAUDE_MCP_PATH, 'utf-8'));
            }
        }
        catch (e) {
        }
        if (!existingConfig.mcpServers?.genkit) {
            if (!existingConfig.mcpServers) {
                existingConfig.mcpServers = {};
            }
            existingConfig.mcpServers.genkit = {
                command: 'npx',
                args: ['genkit', 'mcp'],
            };
            await (0, promises_1.writeFile)(CLAUDE_MCP_PATH, JSON.stringify(existingConfig, null, 2));
            settingsUpdated = true;
        }
        files.push({ path: CLAUDE_MCP_PATH, updated: settingsUpdated });
        utils_1.logger.info('Copying the Genkit context to GENKIT.md...');
        const mdResult = await (0, utils_2.initGenkitFile)();
        files.push({ path: utils_2.GENKIT_PROMPT_PATH, updated: mdResult.updated });
        utils_1.logger.info('Updating CLAUDE.md to include Genkit context...');
        const claudeImportTag = `\nGenkit Framework Instructions:\n - @./GENKIT.md\n`;
        const baseResult = await (0, utils_2.updateContentInPlace)(CLAUDE_PROMPT_PATH, claudeImportTag, { hash: (0, utils_2.calculateHash)(mdResult.hash) });
        files.push({ path: CLAUDE_PROMPT_PATH, updated: baseResult.updated });
        return { files };
    },
};
//# sourceMappingURL=claude.js.map