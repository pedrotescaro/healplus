"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExecutablePath = validateExecutablePath;
exports.buildServerHarnessSpawnConfig = buildServerHarnessSpawnConfig;
const promises_1 = require("fs/promises");
const server_harness_1 = require("../commands/server-harness");
async function validateExecutablePath(path) {
    try {
        const normalizedPath = path.startsWith('"') && path.endsWith('"') ? path.slice(1, -1) : path;
        await (0, promises_1.access)(normalizedPath, promises_1.constants.F_OK | promises_1.constants.X_OK);
        return true;
    }
    catch {
        return false;
    }
}
function isValidPort(port) {
    return Number.isInteger(port) && port >= 0 && port <= 65535;
}
function buildServerHarnessSpawnConfig(cliRuntime, port, logPath) {
    if (!cliRuntime) {
        throw new Error('CLI runtime info is required');
    }
    if (!cliRuntime.execPath) {
        throw new Error('CLI runtime execPath is required');
    }
    if (!isValidPort(port)) {
        throw new Error(`Invalid port number: ${port}. Must be between 0 and 65535`);
    }
    if (!logPath) {
        throw new Error('Log path is required');
    }
    let command = cliRuntime.execPath;
    let args;
    if (cliRuntime.type === 'compiled-binary') {
        args = [server_harness_1.SERVER_HARNESS_COMMAND, port.toString(), logPath];
    }
    else {
        args = cliRuntime.scriptPath
            ? [
                cliRuntime.scriptPath,
                server_harness_1.SERVER_HARNESS_COMMAND,
                port.toString(),
                logPath,
            ]
            : [server_harness_1.SERVER_HARNESS_COMMAND, port.toString(), logPath];
    }
    const options = {
        stdio: ['ignore', 'ignore', 'ignore'],
        detached: false,
        shell: cliRuntime.platform === 'win32',
    };
    if (cliRuntime.platform === 'win32') {
        command = `"${command}"`;
        args = args.map((arg) => `"${arg}"`);
    }
    return {
        command,
        args,
        options,
    };
}
//# sourceMappingURL=spawn-config.js.map