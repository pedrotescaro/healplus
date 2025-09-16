"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectCLIRuntime = detectCLIRuntime;
const fs_1 = require("fs");
const path_1 = require("path");
const RUNTIME_NODE = 'node';
const RUNTIME_BUN = 'bun';
const RUNTIME_COMPILED = 'compiled-binary';
const NODE_PATTERNS = ['node', 'nodejs'];
const BUN_PATTERNS = ['bun'];
const SCRIPT_EXTENSIONS = ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx'];
function safeExistsSync(path) {
    if (!path)
        return false;
    try {
        return (0, fs_1.existsSync)(path);
    }
    catch {
        return false;
    }
}
function isLikelyScriptFile(path) {
    if (!path)
        return false;
    const ext = (0, path_1.extname)(path).toLowerCase();
    return SCRIPT_EXTENSIONS.includes(ext);
}
function matchesPatterns(execName, patterns) {
    const lowerExecName = execName.toLowerCase();
    return patterns.some((pattern) => lowerExecName.includes(pattern));
}
function detectCLIRuntime() {
    const platform = process.platform;
    const execPath = process.execPath;
    if (!execPath || execPath.trim() === '') {
        throw new Error('Unable to determine CLI runtime executable path');
    }
    const argv0 = process.argv[0];
    const argv1 = process.argv[1];
    const execBasename = (0, path_1.basename)(execPath);
    const argv0Basename = argv0 ? (0, path_1.basename)(argv0) : '';
    const hasBunVersion = 'bun' in (process.versions || {});
    const hasNodeVersion = 'node' in (process.versions || {});
    const execMatchesBun = matchesPatterns(execBasename, BUN_PATTERNS);
    const execMatchesNode = matchesPatterns(execBasename, NODE_PATTERNS);
    const argv0MatchesBun = matchesPatterns(argv0Basename, BUN_PATTERNS);
    const argv0MatchesNode = matchesPatterns(argv0Basename, NODE_PATTERNS);
    const hasScriptArg = !!argv1;
    const scriptExists = hasScriptArg && safeExistsSync(argv1);
    let type;
    let scriptPath;
    let isCompiledBinary;
    if (hasBunVersion || execMatchesBun || argv0MatchesBun) {
        if (argv1 &&
            (argv1.startsWith('/$bunfs/') || /^[A-Za-z]:[\\/]+~BUN[\\/]+/.test(argv1))) {
            type = RUNTIME_COMPILED;
            scriptPath = undefined;
            isCompiledBinary = true;
        }
        else {
            type = RUNTIME_BUN;
            scriptPath = argv1;
            isCompiledBinary = false;
        }
    }
    else if (hasNodeVersion || execMatchesNode || argv0MatchesNode) {
        type = RUNTIME_NODE;
        scriptPath = argv1;
        isCompiledBinary = false;
    }
    else if (!hasScriptArg || !scriptExists) {
        type = RUNTIME_COMPILED;
        scriptPath = undefined;
        isCompiledBinary = true;
    }
    else {
        type = RUNTIME_NODE;
        scriptPath = argv1;
        isCompiledBinary = false;
    }
    return {
        type,
        execPath,
        scriptPath,
        isCompiledBinary,
        platform,
    };
}
//# sourceMappingURL=runtime-detector.js.map