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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENKIT_PROMPT_PATH = void 0;
exports.deepEqual = deepEqual;
exports.initOrReplaceFile = initOrReplaceFile;
exports.updateContentInPlace = updateContentInPlace;
exports.calculateHash = calculateHash;
exports.getGenkitContext = getGenkitContext;
exports.initGenkitFile = initGenkitFile;
const fs_1 = require("fs");
const crypto = __importStar(require("crypto"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
exports.GENKIT_PROMPT_PATH = 'GENKIT.md';
const CONTEXT_DIR = path_1.default.resolve(__dirname, '..', '..', 'context');
const GENKIT_TAG_REGEX = /<genkit_prompts(?:\s+hash="([^"]+)")?>([\s\S]*?)<\/genkit_prompts>/;
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== 'object' ||
        a === null ||
        typeof b !== 'object' ||
        b === null) {
        return false;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
async function initOrReplaceFile(filePath, content) {
    const fileExists = (0, fs_1.existsSync)(filePath);
    if (fileExists) {
        const currentConfig = (0, fs_1.readFileSync)(filePath, 'utf-8');
        if (!deepEqual(currentConfig, content)) {
            await (0, promises_1.writeFile)(filePath, content);
            return { updated: true };
        }
    }
    else {
        await (0, promises_1.writeFile)(filePath, content);
        return { updated: true };
    }
    return { updated: false };
}
async function updateContentInPlace(filePath, content, options) {
    const newHash = options?.hash ?? calculateHash(content);
    const newSection = `<genkit_prompts hash="${newHash}">
<!-- Genkit Context - Auto-generated, do not edit -->
${content}
</genkit_prompts>`;
    let currentContent = '';
    const fileExists = (0, fs_1.existsSync)(filePath);
    if (fileExists) {
        currentContent = (0, fs_1.readFileSync)(filePath, 'utf-8');
    }
    const match = currentContent.match(GENKIT_TAG_REGEX);
    if (match && match[1] === newHash) {
        return { updated: false };
    }
    let finalContent;
    if (!currentContent) {
        finalContent = newSection;
    }
    else if (match) {
        finalContent =
            currentContent.substring(0, match.index) +
                newSection +
                currentContent.substring(match.index + match[0].length);
    }
    else {
        const separator = currentContent.endsWith('\n') ? '\n' : '\n\n';
        finalContent = currentContent + separator + newSection;
    }
    await (0, promises_1.writeFile)(filePath, finalContent);
    return { updated: true };
}
function calculateHash(content) {
    return crypto
        .createHash('sha256')
        .update(content.trim())
        .digest('hex')
        .substring(0, 8);
}
function getGenkitContext() {
    const contextPath = path_1.default.resolve(CONTEXT_DIR, 'GENKIT.md');
    const content = (0, fs_1.readFileSync)(contextPath, 'utf8');
    return content;
}
async function initGenkitFile() {
    const genkitContext = getGenkitContext();
    const result = await initOrReplaceFile(exports.GENKIT_PROMPT_PATH, genkitContext);
    return { updated: result.updated, hash: calculateHash(genkitContext) };
}
//# sourceMappingURL=utils.js.map