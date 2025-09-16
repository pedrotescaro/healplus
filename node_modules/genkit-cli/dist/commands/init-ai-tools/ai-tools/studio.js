"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studio = void 0;
const utils_1 = require("../utils");
const RULES_PATH = '.idx/airules.md';
exports.studio = {
    name: 'studio',
    displayName: 'Firebase Studio',
    async configure(options) {
        const files = [];
        const content = (0, utils_1.getGenkitContext)();
        const { updated } = await (0, utils_1.updateContentInPlace)(RULES_PATH, content);
        files.push({ path: RULES_PATH, updated });
        return { files };
    },
};
//# sourceMappingURL=studio.js.map