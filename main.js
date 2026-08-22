const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

const POS_ENV = process.env.POS_ENV || "prod";
const POS_BASE_URL =
  process.env.POS_BASE_URL ||
  (POS_ENV === "local" ? "http://localhost:3000" : "https://www.metrikpos.com");
const POS_API_BASE_URL =
  process.env.POS_API_BASE_URL ||
  (POS_ENV === "local"
    ? "http://localhost:8000"
    : "https://api.metrikpos.com");
const POS_LOGIN_URL = `${POS_BASE_URL}/login-pos`;
const OFFLINE_SCREEN_PATH = path.join(__dirname, "renderer", "offline.html");
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
  if (config.tenantName) params.set("tenant_name", config.tenantName);
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
let isQuitting = false;
let unresponsivePromptOpen = false;
let systemStatusTimer = null;
let systemStatusState = "healthy";
let systemStatusHealthyChecks = 0;
let systemStatusNetworkFailures = 0;

const SYSTEM_STATUS_POLL_MS = 5000;
const SYSTEM_STATUS_TIMEOUT_MS = 2500;

const sendSystemStatus = (payload) => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send("system:status", payload);
};

const checkSystemStatus = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SYSTEM_STATUS_TIMEOUT_MS);
  try {
    const response = await fetch(`${POS_API_BASE_URL.replace(/\/$/, "")}/readyz`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (payload.status === "maintenance" || payload.maintenance === true) {
      systemStatusNetworkFailures = 0;
      systemStatusState = "maintenance";
      systemStatusHealthyChecks = 0;
      sendSystemStatus({
        state: "maintenance",
        title: "Mantenimiento en curso",
        message:
          payload.message ||
          "Estamos actualizando Metrik. Algunas funciones pueden no estar disponibles.",
        retryAfterSeconds: payload.retry_after_seconds || 15,
        checkedAt: payload.checked_at,
      });
      return;
    }

    if (!response.ok || payload.ready === false || payload.status === "degraded") {
      systemStatusNetworkFailures = 0;
      systemStatusState = "degraded";
      systemStatusHealthyChecks = 0;
      sendSystemStatus({
        state: "degraded",
        title: "Problema de conexión",
        message:
          payload.message ||
          "Metrik está teniendo dificultades para responder. Reintentando automáticamente.",
        retryAfterSeconds: payload.retry_after_seconds || 10,
        checkedAt: payload.checked_at,
      });
      return;
    }

    systemStatusHealthyChecks += 1;
    if (systemStatusState !== "healthy" && systemStatusHealthyChecks < 2) return;
    systemStatusState = "healthy";
    sendSystemStatus({ state: "healthy" });
  } catch {
    systemStatusNetworkFailures += 1;
    systemStatusHealthyChecks = 0;
    if (systemStatusState === "maintenance") {
      sendSystemStatus({
        state: "maintenance",
        title: "Mantenimiento en curso",
        message:
          "Estamos actualizando Metrik. Algunas funciones pueden no estar disponibles.",
        retryAfterSeconds: 15,
      });
    } else if (systemStatusNetworkFailures >= 2) {
      systemStatusState = "degraded";
      sendSystemStatus({
        state: "degraded",
        title: "Problema de conexión",
        message:
          "Metrik no está respondiendo en este momento. Reintentando automáticamente.",
        retryAfterSeconds: 10,
      });
    }
  } finally {
    clearTimeout(timeout);
  }
};

const startSystemStatusMonitor = () => {
  if (systemStatusTimer) clearInterval(systemStatusTimer);
  checkSystemStatus();
  systemStatusTimer = setInterval(checkSystemStatus, SYSTEM_STATUS_POLL_MS);
};

const QUIT_LOGOUT_TIMEOUT_MS = 1500;

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const readRendererAuthToken = async () => {
  if (!mainWindow || mainWindow.isDestroyed()) return null;
  try {
    const token = await mainWindow.webContents.executeJavaScript(
      `(() => {
        try {
          const sessionRaw = window.sessionStorage.getItem("kensar_auth");
          if (sessionRaw) {
            const parsed = JSON.parse(sessionRaw);
            if (parsed && typeof parsed.token === "string" && parsed.token.trim()) {
              return parsed.token.trim();
            }
          }
          const localRaw = window.localStorage.getItem("kensar_auth");
          if (localRaw) {
            const parsedLocal = JSON.parse(localRaw);
            if (parsedLocal && typeof parsedLocal.token === "string" && parsedLocal.token.trim()) {
              return parsedLocal.token.trim();
            }
          }
        } catch {
          return null;
        }
        return null;
      })()`,
      true
    );
    return typeof token === "string" && token.trim() ? token.trim() : null;
  } catch {
    return null;
  }
};

const bestEffortLogoutBeforeQuit = async () => {
  const token = await readRendererAuthToken();
  if (!token) return;
  const base = String(POS_API_BASE_URL || "").replace(/\/$/, "");
  if (!base) return;
  try {
    await fetch(`${base}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore network/logout failures on exit
  }
};

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
    backgroundColor: "#111827",
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

  const loadOfflineScreen = (details = {}) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const search = new URLSearchParams();
    if (typeof details.reason === "string" && details.reason.trim()) {
      search.set("reason", details.reason.trim());
    }
    if (typeof details.code === "number") {
      search.set("code", String(details.code));
    }
    if (typeof details.url === "string" && details.url.trim()) {
      search.set("url", details.url.trim());
    }
    mainWindow.loadFile(OFFLINE_SCREEN_PATH, {
      search: search.toString() ? `?${search.toString()}` : "",
    });
  };

  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (!isMainFrame) return;
      if (!validatedURL || validatedURL.startsWith("file://")) return;
      if (errorCode === -3) return;
      loadOfflineScreen({
        code: errorCode,
        reason: errorDescription,
        url: validatedURL,
      });
    }
  );

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    if (!details || details.reason === "clean-exit") return;
    loadOfflineScreen({
      reason: `Renderizador detenido (${details.reason})`,
      code: -1,
    });
  });

  mainWindow.on("unresponsive", async () => {
    if (unresponsivePromptOpen || !mainWindow || mainWindow.isDestroyed()) return;
    unresponsivePromptOpen = true;
    try {
      const result = await dialog.showMessageBox(mainWindow, {
        type: "warning",
        title: "Metrik POS no responde",
        message: "La interfaz está tardando más de lo normal.",
        detail:
          "Puedes esperar o recargar el POS. El carrito guardado se recuperará al volver a abrir.",
        buttons: ["Esperar", "Recargar POS"],
        defaultId: 0,
        cancelId: 0,
        noLink: true,
      });
      if (
        result.response === 1 &&
        mainWindow &&
        !mainWindow.isDestroyed()
      ) {
        mainWindow.webContents.reload();
      }
    } finally {
      unresponsivePromptOpen = false;
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
  startSystemStatusMonitor();
  if (app.isPackaged) {
    autoUpdater.logger = console;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.checkForUpdatesAndNotify();
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 6 * 60 * 60 * 1000);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", (event) => {
  if (isQuitting) return;
  event.preventDefault();
  isQuitting = true;
  Promise.race([
    bestEffortLogoutBeforeQuit(),
    wait(QUIT_LOGOUT_TIMEOUT_MS),
  ]).finally(() => {
    app.quit();
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
    sendUpdateStatus({ status: "downloaded", info });
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
    deviceId: device.deviceId,
    deviceLabel: device.deviceLabel || os.hostname(),
    uiZoomFactor:
      typeof current.uiZoomFactor === "number" ? current.uiZoomFactor : undefined,
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

ipcMain.handle("system:open-network-settings", () => {
  if (process.platform !== "win32") {
    return false;
  }
  return new Promise((resolve) => {
    exec('cmd /c start "" ms-settings:network-status', (error) => {
      if (error) {
        console.error("No pudimos abrir la configuracion de red:", error);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
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

ipcMain.handle("env:get", () => {
  return {
    posEnv: POS_ENV,
    posBaseUrl: POS_BASE_URL,
    apiBaseUrl: POS_API_BASE_URL,
  };
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
