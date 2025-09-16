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
exports.getCurrentVersion = getCurrentVersion;
exports.getLatestVersionFromNpm = getLatestVersionFromNpm;
exports.showUpdateNotification = showUpdateNotification;
const manager_1 = require("@genkit-ai/tools-common/manager");
const utils_1 = require("@genkit-ai/tools-common/utils");
const axios_1 = __importDefault(require("axios"));
const clc = __importStar(require("colorette"));
const os_1 = require("os");
const semver_1 = __importDefault(require("semver"));
const config_1 = require("../commands/config");
const runtime_detector_1 = require("../utils/runtime-detector");
const version_1 = require("../utils/version");
const GCS_BUCKET_URL = 'https://storage.googleapis.com/genkit-assets-cli';
const CLI_DOCS_URL = 'https://genkit.dev/docs/devtools/';
const AXIOS_INSTANCE = axios_1.default.create({
    timeout: 3000,
});
function getCurrentVersion() {
    return normalizeVersion(version_1.version);
}
function normalizeVersion(version) {
    return version.replace(/^v/, '');
}
async function getGCSLatestData() {
    const response = await AXIOS_INSTANCE.get(`${GCS_BUCKET_URL}/latest.json`);
    if (response.status !== 200) {
        throw new manager_1.GenkitToolsError(`Failed to fetch GCS latest.json: ${response.statusText}`);
    }
    return response.data;
}
async function getLatestVersionFromNpm(ignoreRC = true) {
    try {
        const response = await AXIOS_INSTANCE.get(`https://registry.npmjs.org/${version_1.name}`);
        if (response.status !== 200) {
            throw new manager_1.GenkitToolsError(`Failed to fetch npm versions: ${response.statusText}`);
        }
        const data = response.data;
        const latest = data['dist-tags']?.latest;
        if (latest) {
            const clean = normalizeVersion(latest);
            if (semver_1.default.valid(clean) && (!ignoreRC || !semver_1.default.prerelease(clean))) {
                return clean;
            }
        }
        const versions = Object.keys(data.versions)
            .map(normalizeVersion)
            .filter((v) => semver_1.default.valid(v) && (!ignoreRC || !semver_1.default.prerelease(v)));
        if (versions.length === 0) {
            return null;
        }
        versions.sort(semver_1.default.rcompare);
        return versions[0];
    }
    catch (error) {
        if (error instanceof manager_1.GenkitToolsError) {
            throw error;
        }
        throw new manager_1.GenkitToolsError(`Failed to fetch npm versions: ${error?.message ?? String(error)}`);
    }
}
function isUpdateNotificationsDisabled() {
    if (process.env.GENKIT_CLI_DISABLE_UPDATE_NOTIFICATIONS === 'true') {
        return true;
    }
    const userSettings = (0, utils_1.getUserSettings)();
    return Boolean(userSettings[config_1.UPDATE_NOTIFICATIONS_OPT_OUT_CONFIG_TAG]);
}
async function getBinaryUpdateInfo() {
    const gcsLatestData = await getGCSLatestData();
    const machine = `${os_1.platform}-${os_1.arch}`;
    const platformData = gcsLatestData.platforms[machine];
    if (!platformData) {
        utils_1.logger.debug(`No update information for platform: ${machine}`);
        return null;
    }
    const latestVersion = normalizeVersion(gcsLatestData.latestVersion);
    return latestVersion;
}
async function getNpmUpdateInfo() {
    const latestVersion = await getLatestVersionFromNpm();
    if (!latestVersion) {
        utils_1.logger.debug('No available versions found from npm.');
        return null;
    }
    return latestVersion;
}
async function showUpdateNotification() {
    try {
        if (isUpdateNotificationsDisabled()) {
            return;
        }
        const { isCompiledBinary } = (0, runtime_detector_1.detectCLIRuntime)();
        const updateInfo = isCompiledBinary
            ? await getBinaryUpdateInfo()
            : await getNpmUpdateInfo();
        if (!updateInfo) {
            return;
        }
        const latestVersion = updateInfo;
        const current = normalizeVersion(version_1.version);
        if (!semver_1.default.valid(latestVersion) || !semver_1.default.valid(current)) {
            utils_1.logger.debug(`Invalid semver: current=${current}, latest=${latestVersion}`);
            return;
        }
        if (!semver_1.default.gt(latestVersion, current)) {
            return;
        }
        const installMethod = isCompiledBinary
            ? 'installer script'
            : 'your package manager';
        const updateCommand = isCompiledBinary
            ? 'curl -sL cli.genkit.dev | uninstall=true bash'
            : 'npm install -g genkit-cli';
        const updateNotificationMessage = `Update available ${clc.gray(`v${current}`)} → ${clc.green(`v${latestVersion}`)}\n` +
            `To update to the latest version using ${installMethod}, run\n${clc.cyan(updateCommand)}\n` +
            `For other CLI management options, visit ${CLI_DOCS_URL}\n` +
            `${clc.dim('Run')} ${clc.bold('genkit config set updateNotificationsOptOut true')} ${clc.dim('to disable these notifications')}\n`;
        utils_1.logger.info(`\n${updateNotificationMessage}`);
    }
    catch (e) {
        utils_1.logger.debug('Failed to show update notification', e);
    }
}
//# sourceMappingURL=updates.js.map