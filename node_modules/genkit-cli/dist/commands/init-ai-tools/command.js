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
exports.initAiTools = exports.AI_TOOLS = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const prompts_1 = require("@inquirer/prompts");
const clc = __importStar(require("colorette"));
const commander_1 = require("commander");
const claude_1 = require("./ai-tools/claude");
const cursor_1 = require("./ai-tools/cursor");
const gemini_1 = require("./ai-tools/gemini");
const generic_1 = require("./ai-tools/generic");
const studio_1 = require("./ai-tools/studio");
exports.AI_TOOLS = {
    gemini: gemini_1.gemini,
    studio: studio_1.studio,
    claude: claude_1.claude,
    cursor: cursor_1.cursor,
    generic: generic_1.generic,
};
const AGENT_CHOICES = Object.values(exports.AI_TOOLS).map((tool) => ({
    value: tool.name,
    name: tool.displayName,
    checked: false,
}));
exports.initAiTools = new commander_1.Command('init:ai-tools')
    .description('initialize AI tools in a workspace with helpful context related to the Genkit framework (EXPERIMENTAL, subject to change)')
    .option('-y', '--yes', 'Run in non-interactive mode')
    .action(async (options) => {
    utils_1.logger.info('\n');
    utils_1.logger.info('This command will configure AI coding assistants to work with your Genkit app by:');
    utils_1.logger.info('• Configuring the Genkit MCP server for direct Genkit operations');
    utils_1.logger.info('• Installing context files that help AI understand:');
    utils_1.logger.info('  - Genkit app structure and common design patterns');
    utils_1.logger.info('  - Common Genkit features and how to use them');
    utils_1.logger.info('\n');
    const selections = await (0, prompts_1.checkbox)({
        message: 'Which tools would you like to configure?',
        choices: AGENT_CHOICES,
        validate: (choices) => {
            if (choices.length === 0) {
                return 'Must select at least one tool.';
            }
            return true;
        },
        loop: true,
    });
    utils_1.logger.info('\n');
    utils_1.logger.info('Configuring selected tools...');
    await configureTools(selections, options);
});
async function configureTools(tools, options) {
    let anyUpdates = false;
    for (const toolName of tools) {
        const tool = exports.AI_TOOLS[toolName];
        if (!tool) {
            utils_1.logger.warn(`Unknown tool: ${toolName}`);
            continue;
        }
        const result = await tool.configure(options);
        const updatedCount = result.files.filter((f) => f.updated).length;
        const hasChanges = updatedCount > 0;
        if (hasChanges) {
            anyUpdates = true;
            utils_1.logger.info('\n');
            utils_1.logger.info(clc.green(`${tool.displayName} configured - ${updatedCount} file${updatedCount > 1 ? 's' : ''} updated:`));
        }
        else {
            utils_1.logger.info('\n');
            utils_1.logger.info(`${tool.displayName} - all files up to date`);
        }
        for (const file of result.files) {
            const status = file.updated ? '(updated)' : '(unchanged)';
            utils_1.logger.info(`•  ${file.path} ${status}`);
        }
    }
    utils_1.logger.info('\n');
    if (anyUpdates) {
        utils_1.logger.info(clc.green('AI tools configuration complete!'));
        utils_1.logger.info('\n');
        utils_1.logger.info('Next steps:');
        utils_1.logger.info('•  Restart your AI tools to load the new configuration');
        utils_1.logger.info('•  Your AI tool should have access to Genkit documentation and tools for greater access and understanding of your app.');
    }
    else {
        utils_1.logger.info(clc.green('All AI tools are already up to date.'));
    }
}
//# sourceMappingURL=command.js.map