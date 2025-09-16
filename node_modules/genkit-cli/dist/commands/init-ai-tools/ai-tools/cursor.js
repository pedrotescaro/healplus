"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursor = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path = __importStar(require("path"));
const utils_1 = require("../utils");
const CURSOR_MCP_PATH = path.join('.cursor', 'mcp.json');
const CURSOR_RULES_DIR = '.cursor/rules';
const GENKIT_MDC_PATH = path.join(CURSOR_RULES_DIR, 'GENKIT.mdc');
const CURSOR_RULES_HEADER = `---
description: Genkit project development guidelines
---
`;
exports.cursor = {
    name: 'cursor',
    displayName: 'Cursor',
    async configure(options) {
        const files = [];
        const mdResult = await (0, utils_1.initGenkitFile)();
        files.push({ path: utils_1.GENKIT_PROMPT_PATH, updated: mdResult.updated });
        let mcpUpdated = false;
        let existingConfig = {};
        try {
            const fileExists = (0, fs_1.existsSync)(CURSOR_MCP_PATH);
            if (fileExists) {
                existingConfig = JSON.parse((0, fs_1.readFileSync)(CURSOR_MCP_PATH, 'utf-8'));
            }
            else {
                await (0, promises_1.mkdir)('.cursor', { recursive: true });
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
            await (0, promises_1.writeFile)(CURSOR_MCP_PATH, JSON.stringify(existingConfig, null, 2));
            mcpUpdated = true;
        }
        files.push({ path: CURSOR_MCP_PATH, updated: mcpUpdated });
        await (0, promises_1.mkdir)(path.join('.cursor', 'rules'), { recursive: true });
        const genkitImport = '@' + path.join('..', '..', utils_1.GENKIT_PROMPT_PATH);
        const importContent = `# Genkit Context\n\n${genkitImport}\n`;
        const mdcContent = CURSOR_RULES_HEADER + '\n' + importContent;
        const { updated } = await (0, utils_1.initOrReplaceFile)(GENKIT_MDC_PATH, mdcContent);
        files.push({ path: GENKIT_MDC_PATH, updated: updated });
        return { files };
    },
};
//# sourceMappingURL=cursor.js.map