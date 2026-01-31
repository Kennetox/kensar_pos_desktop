const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

const POS_ENV = process.env.POS_ENV || "prod";
const POS_BASE_URL =
  POS_ENV === "local" ? "http://localhost:3000" : "https://www.metrikpos.com";
const POS_LOGIN_URL = `${POS_BASE_URL}/login-pos`;
const CONFIG_FILE = "station.json";
const CONFIG_BACKUP_FILE = "station.json.bak";
const CONFIG_TMP_FILE = "station.json.tmp";

const getConfigPath = (name = CONFIG_FILE) =>
  path.join(app.getPath("userData"), name);

const readConfigFile = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const loadConfig = () => {
  const primary = readConfigFile(getConfigPath());
  if (primary) return primary;
  const backup = readConfigFile(getConfigPath(CONFIG_BACKUP_FILE));
  if (backup) {
    try {
      saveConfig(backup);
    } catch {
      // ignore restore failures
    }
    return backup;
  }
  return null;
};

const saveConfig = (config) => {
  const targetPath = getConfigPath();
  const tmpPath = getConfigPath(CONFIG_TMP_FILE);
  const backupPath = getConfigPath(CONFIG_BACKUP_FILE);
  const payload = JSON.stringify(config, null, 2);
  try {
    if (fs.existsSync(targetPath)) {
      try {
        fs.copyFileSync(targetPath, backupPath);
      } catch {
        // ignore backup failures
      }
    }
    fs.writeFileSync(tmpPath, payload);
    if (fs.existsSync(targetPath)) {
      try {
        fs.unlinkSync(targetPath);
      } catch {
        // ignore unlink failures
      }
    }
    fs.renameSync(tmpPath, targetPath);
  } finally {
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {
        // ignore cleanup failures
      }
    }
  }
};

const buildPosLoginUrl = (config) => {
  if (!config || !config.stationId) return POS_LOGIN_URL;
  const params = new URLSearchParams();
  params.set("station_id", config.stationId);
  if (config.stationLabel) params.set("station_label", config.stationLabel);
  if (config.stationEmail) params.set("station_email", config.stationEmail);
  return `${POS_LOGIN_URL}?${params.toString()}`;
};

const clampZoomFactor = (value) => {
  const min = 0.5;
  const max = 1.2;
  if (!Number.isFinite(value)) return 1;
  return Math.min(max, Math.max(min, value));
};

const getZoomFactor = () => {
  const config = loadConfig();
  if (config && typeof config.uiZoomFactor === "number") {
    return clampZoomFactor(config.uiZoomFactor);
  }
  return 1;
};

const applyZoomFactor = (value) => {
  if (!mainWindow) return;
  const next = clampZoomFactor(value);
  mainWindow.webContents.setZoomFactor(next);
  try {
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  } catch {
    // ignore
  }
};


const ensureDeviceInfo = () => {
  const existing = loadConfig() || {};
  if (existing && existing.deviceId) return existing;
  const deviceId = crypto.randomUUID
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
  const next = {
    ...existing,
    deviceId,
    deviceLabel: existing.deviceLabel || os.hostname(),
  };
  saveConfig(next);
  return next;
};

const hashAdminPin = (pin) =>
  crypto.createHash("sha256").update(String(pin)).digest("hex");

let mainWindow;
let autoRestartTimer;
let autoRestartInterval;

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#0b1020",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setFullScreen(true);
  const allowKiosk = process.platform === "win32" && POS_ENV !== "local";
  if (allowKiosk) {
    mainWindow.setKiosk(true);
  }

  const applyCurrentZoom = () => applyZoomFactor(getZoomFactor());
  applyCurrentZoom();

  mainWindow.webContents.on("did-finish-load", applyCurrentZoom);
  mainWindow.webContents.on("dom-ready", applyCurrentZoom);
  mainWindow.webContents.on("did-navigate", applyCurrentZoom);
  mainWindow.webContents.on("did-navigate-in-page", applyCurrentZoom);
  mainWindow.webContents.on("zoom-changed", () => {
    const desired = getZoomFactor();
    applyZoomFactor(desired);
  });

  mainWindow.webContents.on("before-input-event", (_event, input) => {
    if (input.type !== "keyDown") return;
    const isZoomKey =
      (input.control || input.meta) &&
      (input.key === "+" ||
        input.key === "-" ||
        input.key === "=" ||
        input.key === "0");
    if (isZoomKey) {
      _event.preventDefault();
    }
  });

  const config = loadConfig();
  if (config && config.stationId) {
    mainWindow.loadURL(buildPosLoginUrl(config));
  } else {
    mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  }
};

app.whenReady().then(() => {
  ensureDeviceInfo();
  createWindow();
  if (app.isPackaged) {
    autoUpdater.logger = console;
    autoUpdater.autoDownload = true;
    autoUpdater.checkForUpdatesAndNotify();
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 6 * 60 * 60 * 1000);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const sendUpdateStatus = (payload) => {
  if (!mainWindow) return;
  mainWindow.webContents.send("update:status", payload);
};

if (app.isPackaged) {
  autoUpdater.on("checking-for-update", () => {
    sendUpdateStatus({ status: "checking" });
  });
  autoUpdater.on("update-available", (info) => {
    sendUpdateStatus({ status: "available", info });
  });
  autoUpdater.on("update-not-available", () => {
    sendUpdateStatus({ status: "none" });
  });
  autoUpdater.on("download-progress", (progress) => {
    sendUpdateStatus({ status: "downloading", progress });
  });
  autoUpdater.on("update-downloaded", (info) => {
    let remaining = 15;
    sendUpdateStatus({ status: "downloaded", info, countdownSeconds: remaining });
    if (autoRestartTimer) clearTimeout(autoRestartTimer);
    if (autoRestartInterval) clearInterval(autoRestartInterval);
    autoRestartInterval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(autoRestartInterval);
        autoRestartInterval = null;
        autoUpdater.quitAndInstall(false, true);
      } else {
        sendUpdateStatus({
          status: "downloaded",
          info,
          countdownSeconds: remaining,
        });
      }
    }, 1000);
  });
  autoUpdater.on("error", (err) => {
    sendUpdateStatus({ status: "error", message: String(err?.message || err) });
  });
}

ipcMain.handle("config:get", () => {
  return loadConfig();
});

ipcMain.handle("config:set", (_, payload) => {
  const current = loadConfig() || {};
  const next = { ...current, ...payload };
  saveConfig(next);
  return next;
});

ipcMain.handle("admin:has", () => {
  const config = loadConfig();
  return Boolean(config && config.adminPinHash);
});

ipcMain.handle("admin:set", (_, pin) => {
  const rawPin = String(pin ?? "").trim();
  if (!/^\d{4,8}$/.test(rawPin)) {
    return { ok: false, error: "PIN inválido." };
  }
  const current = loadConfig() || {};
  const next = { ...current, adminPinHash: hashAdminPin(rawPin) };
  saveConfig(next);
  return { ok: true };
});

ipcMain.handle("admin:verify", (_, pin) => {
  const rawPin = String(pin ?? "").trim();
  if (!/^\d{4,8}$/.test(rawPin)) return false;
  const config = loadConfig();
  if (!config?.adminPinHash) return false;
  return config.adminPinHash === hashAdminPin(rawPin);
});

ipcMain.handle("config:clear", () => {
  const current = loadConfig() || {};
  const device = ensureDeviceInfo();
  const next = {
    ...device,
    uiZoomFactor: typeof current.uiZoomFactor === "number" ? current.uiZoomFactor : undefined,
    adminPinHash: current.adminPinHash,
  };
  saveConfig(next);
  return next;
});

ipcMain.handle("config:open", () => {
  if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  }
  return true;
});

ipcMain.handle("device:get", () => {
  const device = ensureDeviceInfo();
  return {
    deviceId: device.deviceId,
    deviceLabel: device.deviceLabel || os.hostname(),
  };
});

ipcMain.handle("pos:open", () => {
  if (mainWindow) {
    mainWindow.loadURL(buildPosLoginUrl(loadConfig()));
  }
  return true;
});

ipcMain.handle("zoom:get", () => {
  return getZoomFactor();
});

ipcMain.handle("zoom:set", (_, value) => {
  const next = clampZoomFactor(Number(value));
  const current = loadConfig() || {};
  saveConfig({ ...current, uiZoomFactor: next });
  applyZoomFactor(next);
  return next;
});

ipcMain.handle("app:quit", () => {
  app.quit();
  return true;
});

ipcMain.handle("app:version", () => {
  return app.getVersion();
});

ipcMain.handle("app:shutdown", () => {
  if (process.platform !== "win32") {
    return false;
  }
  return new Promise((resolve) => {
    exec("shutdown /s /t 0", (error) => {
      if (error) {
        console.error("No pudimos apagar el equipo:", error);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
});
