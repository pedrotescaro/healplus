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
exports.uiStart = void 0;
const manager_1 = require("@genkit-ai/tools-common/manager");
const utils_1 = require("@genkit-ai/tools-common/utils");
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const clc = __importStar(require("colorette"));
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const get_port_1 = __importStar(require("get-port"));
const open_1 = __importDefault(require("open"));
const path_1 = __importDefault(require("path"));
const runtime_detector_1 = require("../utils/runtime-detector");
const spawn_config_1 = require("../utils/spawn-config");
exports.uiStart = new commander_1.Command('ui:start')
    .description('start the Developer UI which connects to runtimes in the same directory')
    .option('-p, --port <number>', 'Port to serve on (defaults to 4000)')
    .option('-o, --open', 'Open the browser on UI start up')
    .action(async (options) => {
    let port;
    if (options.port) {
        port = Number(options.port);
        if (isNaN(port) || port < 0) {
            utils_1.logger.error(`"${options.port}" is not a valid port number`);
            return;
        }
    }
    else {
        port = await (0, get_port_1.default)({ port: (0, get_port_1.makeRange)(4000, 4099) });
    }
    const serversDir = await (0, utils_1.findServersDir)(await (0, utils_1.findProjectRoot)());
    const toolsJsonPath = path_1.default.join(serversDir, 'tools.json');
    try {
        const toolsJsonContent = await promises_1.default.readFile(toolsJsonPath, 'utf-8');
        const serverInfo = JSON.parse(toolsJsonContent);
        if ((0, utils_1.isValidDevToolsInfo)(serverInfo)) {
            try {
                await axios_1.default.get(`${serverInfo.url}/api/__health`);
                utils_1.logger.info(clc.green(`\n  Genkit Developer UI is already running at: ${serverInfo.url}`));
                utils_1.logger.info(`  To stop the UI, run \`genkit ui:stop\`.\n`);
                return;
            }
            catch (error) {
                utils_1.logger.debug('Found UI server metadata but server is not healthy. Starting a new one...');
            }
        }
    }
    catch (error) {
        utils_1.logger.debug('No UI running. Starting a new one...');
    }
    utils_1.logger.info('Starting...');
    try {
        await startAndWaitUntilHealthy(port, serversDir);
    }
    catch (error) {
        utils_1.logger.error(`Failed to start Genkit Developer UI: ${error}`);
        return;
    }
    try {
        await promises_1.default.mkdir(serversDir, { recursive: true });
        await promises_1.default.writeFile(toolsJsonPath, JSON.stringify({
            url: `http://localhost:${port}`,
            timestamp: new Date().toISOString(),
        }, null, 2));
    }
    catch (error) {
        utils_1.logger.error(`Failed to write UI server metadata. UI server will continue to run.`);
    }
    utils_1.logger.info(`\n  ${clc.green(`Genkit Developer UI started at: http://localhost:${port}`)}`);
    utils_1.logger.info(`  To stop the UI, run \`genkit ui:stop\`.\n`);
    try {
        await axios_1.default.get(`http://localhost:${port}/api/trpc/listActions`);
    }
    catch (error) {
        utils_1.logger.info('Set env variable `GENKIT_ENV` to `dev` and start your app code to interact with it in the UI.');
    }
    if (options.open) {
        (0, open_1.default)(`http://localhost:${port}`);
    }
});
async function startAndWaitUntilHealthy(port, serversDir) {
    const cliRuntime = (0, runtime_detector_1.detectCLIRuntime)();
    utils_1.logger.debug(`Detected CLI runtime: ${cliRuntime.type} at ${cliRuntime.execPath}`);
    if (cliRuntime.scriptPath) {
        utils_1.logger.debug(`Script path: ${cliRuntime.scriptPath}`);
    }
    const logPath = path_1.default.join(serversDir, 'devui.log');
    const spawnConfig = (0, spawn_config_1.buildServerHarnessSpawnConfig)(cliRuntime, port, logPath);
    const isExecutable = await (0, spawn_config_1.validateExecutablePath)(spawnConfig.command);
    if (!isExecutable) {
        throw new manager_1.GenkitToolsError(`Unable to execute command: ${spawnConfig.command}. ` +
            `The file does not exist or is not executable.`);
    }
    utils_1.logger.debug(`Spawning: ${spawnConfig.command} ${spawnConfig.args.join(' ')}`);
    const child = (0, child_process_1.spawn)(spawnConfig.command, spawnConfig.args, spawnConfig.options);
    return new Promise((resolve, reject) => {
        child.on('error', (error) => {
            utils_1.logger.error(`Failed to start UI process: ${error.message}`);
            reject(new manager_1.GenkitToolsError(`Failed to start UI process: ${error.message}`, {
                cause: error,
            }));
        });
        child.on('exit', (code) => {
            const msg = `UI process exited unexpectedly with code ${code}`;
            utils_1.logger.error(msg);
            reject(new manager_1.GenkitToolsError(msg));
        });
        (0, utils_1.waitUntilHealthy)(`http://localhost:${port}`, 10000)
            .then((isHealthy) => {
            if (isHealthy) {
                child.unref();
                resolve(child);
            }
            else {
                const msg = 'Timed out while waiting for UI to become healthy. ' +
                    'To view full logs, set DEBUG environment variable.';
                utils_1.logger.error(msg);
                reject(new manager_1.GenkitToolsError(msg));
            }
        })
            .catch((error) => {
            utils_1.logger.error(`Health check failed: ${error.message}`);
            reject(new manager_1.GenkitToolsError(`Health check failed: ${error.message}`, {
                cause: error,
            }));
        });
    });
}
//# sourceMappingURL=ui-start.js.map