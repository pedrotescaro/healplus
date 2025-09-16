"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gemini = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const prompts_1 = require("@inquirer/prompts");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const utils_2 = require("../utils");
const GEMINI_DIR = '.gemini';
const GEMINI_SETTINGS_PATH = path_1.default.join(GEMINI_DIR, 'settings.json');
const GEMINI_MD_PATH = path_1.default.join('GEMINI.md');
const GENKIT_EXT_DIR = path_1.default.join(GEMINI_DIR, 'extensions', 'genkit');
const GENKIT_MD_REL_PATH = path_1.default.join('..', '..', '..', utils_2.GENKIT_PROMPT_PATH);
const GENKIT_EXTENSION_CONFIG = {
    name: 'genkit',
    version: '1.0.0',
    mcpServers: {
        genkit: {
            command: 'npx',
            args: ['genkit', 'mcp'],
            cwd: '.',
            timeout: 30000,
            trust: false,
            excludeTools: [
                'run_shell_command(genkit start)',
                'run_shell_command(npx genkit start)',
            ],
        },
    },
    contextFileName: GENKIT_MD_REL_PATH,
};
const EXT_INSTALLATION = 'extension';
const MD_INSTALLATION = 'geminimd';
exports.gemini = {
    name: 'gemini',
    displayName: 'Gemini CLI',
    async configure(options) {
        let installationMethod = EXT_INSTALLATION;
        if (!options?.yesMode) {
            installationMethod = await (0, prompts_1.select)({
                message: 'Select your preferred installation method',
                choices: [
                    {
                        name: 'Gemini CLI Extension',
                        value: 'extension',
                        description: 'Use Gemini Extension to install Genkit context in a modular fashion',
                    },
                    {
                        name: 'GEMINI.md',
                        value: 'geminimd',
                        description: 'Incorporate Genkit context within the GEMINI.md file',
                    },
                ],
            });
        }
        if (installationMethod === EXT_INSTALLATION) {
            utils_1.logger.info('Installing as part of GEMINI.md');
            return await installAsExtension();
        }
        else {
            utils_1.logger.info('Installing as Gemini CLI extension');
            return await installInMdFile();
        }
    },
};
async function installInMdFile() {
    const files = [];
    utils_1.logger.info('Installing the Genkit MCP server for Gemini CLI');
    let existingConfig = {};
    let settingsUpdated = false;
    try {
        const fileExists = (0, fs_1.existsSync)(GEMINI_SETTINGS_PATH);
        if (fileExists) {
            existingConfig = JSON.parse((0, fs_1.readFileSync)(GEMINI_SETTINGS_PATH, 'utf-8'));
        }
        else {
            await (0, promises_1.mkdir)(GEMINI_DIR, { recursive: true });
        }
    }
    catch (e) {
    }
    if (!existingConfig.mcpServers?.genkit) {
        if (!existingConfig.mcpServers) {
            existingConfig.mcpServers = {};
        }
        existingConfig.mcpServers.genkit =
            GENKIT_EXTENSION_CONFIG.mcpServers.genkit;
        await (0, promises_1.writeFile)(GEMINI_SETTINGS_PATH, JSON.stringify(existingConfig, null, 2));
        settingsUpdated = true;
    }
    files.push({ path: GEMINI_SETTINGS_PATH, updated: settingsUpdated });
    utils_1.logger.info('Copying the GENKIT.md file...');
    const baseResult = await (0, utils_2.initGenkitFile)();
    files.push({ path: utils_2.GENKIT_PROMPT_PATH, updated: baseResult.updated });
    utils_1.logger.info('Updating GEMINI.md to include Genkit context');
    const geminiImportTag = `\nGenkit Framework Instructions:\n - @./GENKIT.md\n`;
    const { updated: mdUpdated } = await (0, utils_2.updateContentInPlace)(GEMINI_MD_PATH, geminiImportTag, { hash: baseResult.hash });
    files.push({ path: GEMINI_MD_PATH, updated: mdUpdated });
    return { files };
}
async function installAsExtension() {
    const files = [];
    const baseResult = await (0, utils_2.initGenkitFile)();
    files.push({ path: utils_2.GENKIT_PROMPT_PATH, updated: baseResult.updated });
    utils_1.logger.info('Configuring extentions files in user workspace');
    await (0, promises_1.mkdir)(GENKIT_EXT_DIR, { recursive: true });
    const extensionPath = path_1.default.join(GENKIT_EXT_DIR, 'gemini-extension.json');
    let extensionUpdated = false;
    try {
        const { updated } = await (0, utils_2.initOrReplaceFile)(extensionPath, JSON.stringify(GENKIT_EXTENSION_CONFIG, null, 2));
        extensionUpdated = updated;
        if (extensionUpdated) {
            utils_1.logger.info(`Genkit extension for Gemini CLI initialized at ${extensionPath}`);
        }
    }
    catch (err) {
        utils_1.logger.error(err);
        process.exit(1);
    }
    files.push({ path: extensionPath, updated: extensionUpdated });
    return { files };
}
//# sourceMappingURL=gemini.js.map