"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generic = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const utils_2 = require("../utils");
exports.generic = {
    name: 'generic',
    displayName: 'GENKIT.md file for generic use',
    async configure(options) {
        const files = [];
        utils_1.logger.info('Updating GENKIT.md...');
        const mdResult = await (0, utils_2.initGenkitFile)();
        files.push({ path: utils_2.GENKIT_PROMPT_PATH, updated: mdResult.updated });
        utils_1.logger.info('\n');
        utils_1.logger.info('GENKIT.md updated. Provide this file as context with your AI tool.');
        return { files };
    },
};
//# sourceMappingURL=generic.js.map