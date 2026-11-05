const { app, BrowserWindow, ipcMain, dialog, protocol, safeStorage, net, session } = require("electron");
const { createUpdateController } = require("./update-controller");
const { autoUpdater } = require("electron-updater");
const { exec } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const { LocalPosStore } = require("./local-store");
const { createMainDiagnostics } = require("./diagnostics");
const { createConnectivityState } = require("./connectivity-state");
const { fetchLoopbackHealth } = require("./health-probe");

const POS_ENV = process.env.POS_ENV || "prod";
// Permite arrancar contra una copia de los datos locales (pruebas y
// diagnóstico) sin tocar el SQLite ni la sesión del equipo.
if (process.env.POS_USER_DATA_DIR) app.setPath("userData", path.resolve(process.env.POS_USER_DATA_DIR));
const mainDiagnostics = createMainDiagnostics({
  enabled: POS_ENV === "local" || process.env.POS_DIAGNOSTICS === "1",
});
mainDiagnostics.instrumentIpc(ipcMain);
const POS_BASE_URL =
  process.env.POS_BASE_URL ||
  (POS_ENV === "local" ? "http://localhost:3000" : "https://www.metrikpos.com");
const POS_API_BASE_URL =
  process.env.POS_API_BASE_URL ||
  (POS_ENV === "local"
    ? "http://127.0.0.1:8000"
    : "https://api.metrikpos.com");
const POS_LOGIN_URL = `${POS_BASE_URL}/login-pos`;
const OFFLINE_SCREEN_PATH = path.join(__dirname, "renderer", "offline.html");
const LOCAL_POS_SCHEME = "metrik-pos";
const LOCAL_POS_HOST = "app";
const LOCAL_POS_ORIGIN = `${LOCAL_POS_SCHEME}://${LOCAL_POS_HOST}`;
const LOCAL_POS_DIR = path.join(__dirname, "pos-ui");
const CONFIG_FILE = "station.json";
const CONFIG_BACKUP_FILE = "station.json.bak";
const CONFIG_TMP_FILE = "station.json.tmp";

protocol.registerSchemesAsPrivileged([
  {
    scheme: LOCAL_POS_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

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

const buildLocalPosLoginUrl = (config) => {
  const params = new URLSearchParams();
  if (config?.stationId) params.set("station_id", config.stationId);
  if (config?.stationLabel) params.set("station_label", config.stationLabel);
  if (config?.stationEmail) params.set("station_email", config.stationEmail);
  if (config?.tenantName) params.set("tenant_name", config.tenantName);
  const query = params.toString();
  const origin = localPosServerOrigin || LOCAL_POS_ORIGIN;
  return `${origin}/login-pos/${query ? `?${query}` : ""}`;
};

const hasLocalPosBuild = () =>
  fs.existsSync(path.join(LOCAL_POS_DIR, "login-pos", "index.html"));

const getLocalPosContentType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    // El router de Next en `output: export` solo acepta los payloads RSC
    // (.txt) como text/plain. Con otro tipo abandona la navegación cliente y
    // recarga el documento completo, cancelando las peticiones en curso.
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  return types[extension] || "application/octet-stream";
};

const registerLocalPosProtocol = () => {
  protocol.handle(LOCAL_POS_SCHEME, (request) => {
    const url = new URL(request.url);
    if (url.hostname !== LOCAL_POS_HOST) {
      return new Response("Not found", { status: 404 });
    }

    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Bad request", { status: 400 });
    }

    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const requestedPath = path.resolve(path.join(LOCAL_POS_DIR, relativePath));
    const localRoot = `${path.resolve(LOCAL_POS_DIR)}${path.sep}`;

    // Next's client router may navigate to /pos (without a trailing slash),
    // even though the static export writes /pos/index.html.  Treat any local
    // directory as its index page instead of attempting to read the directory
    // as a file, which resulted in an empty dark renderer after login.
    let resolvedPath = requestedPath;
    try {
      if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isDirectory()) {
        resolvedPath = path.join(requestedPath, "index.html");
      }
    } catch {
      return new Response("Unable to resolve local POS asset", { status: 500 });
    }

    if (!resolvedPath.startsWith(localRoot) || !fs.existsSync(resolvedPath)) {
      return new Response("Not found", { status: 404 });
    }

    try {
      return new Response(fs.readFileSync(resolvedPath), {
        headers: { "content-type": getLocalPosContentType(resolvedPath) },
      });
    } catch {
      return new Response("Unable to read local POS asset", { status: 500 });
    }
  });
};

let localPosServer = null;
let localPosServerOrigin = null;

const resolveLocalPosAsset = (requestUrl) => {
  const url = new URL(requestUrl, "http://127.0.0.1");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const requestedPath = path.resolve(path.join(LOCAL_POS_DIR, relativePath));
  const localRoot = `${path.resolve(LOCAL_POS_DIR)}${path.sep}`;
  if (!requestedPath.startsWith(localRoot)) return null;
  try {
    if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isDirectory()) {
      return path.join(requestedPath, "index.html");
    }
    return requestedPath;
  } catch {
    return null;
  }
};

const startLocalPosServer = () => {
  if (localPosServerOrigin) return Promise.resolve(localPosServerOrigin);
  if (!hasLocalPosBuild()) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const filePath = resolveLocalPosAsset(request.url || "/");
      if (!filePath || !fs.existsSync(filePath)) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }
      try {
        response.writeHead(200, {
          "content-type": getLocalPosContentType(filePath),
          "cache-control": "no-store",
        });
        response.end(fs.readFileSync(filePath));
      } catch {
        response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        response.end("Unable to read local POS asset");
      }
    });
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.removeListener("error", reject);
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("No pudimos obtener el puerto local del POS"));
        return;
      }
      localPosServer = server;
      localPosServerOrigin = `http://127.0.0.1:${address.port}`;
      console.info("Interfaz POS servida localmente en", localPosServerOrigin);
      resolve(localPosServerOrigin);
    });
  });
};

const stopLocalPosServer = () => {
  const server = localPosServer;
  localPosServer = null;
  localPosServerOrigin = null;
  if (server) server.close();
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

const initializeLocalPosStore = () => {
  try {
    const station = ensureDeviceInfo();
    localPosStore = new LocalPosStore(app.getPath("userData"));
    const status = localPosStore.initialize(station);
    localPosStoreError = null;
    console.info("Almacenamiento local POS inicializado:", status);
  } catch (error) {
    localPosStore?.close();
    localPosStore = null;
    localPosStoreError = error instanceof Error ? error.message : "Error desconocido";
    console.error("No pudimos inicializar el almacenamiento local POS:", error);
  }
};

const configureWindowsAutoStart = () => {
  if (process.platform !== "win32" || !app.isPackaged) return;
  const config = loadConfig() || {};
  app.setLoginItemSettings({
    openAtLogin: config.autoStartEnabled !== false,
    path: process.execPath,
  });
};

const hashAdminPin = (pin) =>
  crypto.createHash("sha256").update(String(pin)).digest("hex");

let mainWindow;
let isQuitting = false;
let unresponsivePromptOpen = false;
let systemStatusTimer = null;
let systemStatusCheckInFlight = false;
let lastOutboxRetryAt = 0;
let latestSystemStatus = { state: "checking", checkedAt: Date.now() };
let lastSystemStatusFailureSignature = null;
let lastSystemStatusFailureLoggedAt = 0;
let localPosStartupTimer = null;
let localPosStore = null;
let localPosStoreError = null;
let offlineSnapshotSync = { state: "idle" };
let offlineSnapshotSyncPromise = null;
let offlineSnapshotAbortController = null;
let offlineOutboxSync = { state: "idle", pendingSales: 0, pendingCustomers: 0 };
let offlineOutboxSyncPromise = null;
let offlineOutboxSyncTimer = null;
let offlineSyncAccessToken = null;
let quitPromptOpen = false;

const SYSTEM_STATUS_POLL_MS = 5000;
// El monitor decide si una caja puede operar en línea, no si una comprobación
// secundaria de la base de datos está momentáneamente ocupada. /healthz es el
// liveness HTTP del backend; /readyz abre SQLite y puede esperar durante un
// reload o un lock. Usar /readyz aquí convertía ese bloqueo en una falsa
// contingencia, aun cuando el backend seguía accesible para el POS.
const SYSTEM_STATUS_TIMEOUT_MS = 10_000;
// Tres lecturas consecutivas separadas por cinco segundos evitan que una
// oscilación efímera del equipo cambie una caja que estaba operando en línea.
const SYSTEM_STATUS_NETWORK_FAILURES_TO_OPEN = 3;
const SYSTEM_STATUS_SUCCESSES_TO_CLOSE = 2;
// Margen tras el cual un timeout que vence tarde delata un proceso bloqueado.
const SYSTEM_STATUS_LATE_TIMEOUT_GRACE_MS = 3_000;
const OFFLINE_OUTBOX_RETRY_MS = 60_000;
const connectivity = createConnectivityState({
  failuresToOpen: SYSTEM_STATUS_NETWORK_FAILURES_TO_OPEN,
  successesToClose: SYSTEM_STATUS_SUCCESSES_TO_CLOSE,
});
const LOCAL_POS_STARTUP_TIMEOUT_MS = 12_000;
const OFFLINE_OUTBOX_SYNC_DELAY_MS = 3_000;
const OFFLINE_OUTBOX_REQUEST_TIMEOUT_MS = 45_000;

const apiEndpoint = (pathname) => `${POS_API_BASE_URL.replace(/\/$/, "")}${pathname}`;

// The renderer uses Chromium's network service.  Use the same transport in
// the main process so the health monitor measures the same route that the POS
// itself uses (rather than Node/undici, which has a separate proxy, DNS and
// socket implementation).
const apiFetch = (url, init) => net.fetch(url, init);

const isLoopbackUrl = (value) => {
  try {
    const url = new URL(value);
    return url.hostname === "127.0.0.1" || url.hostname === "localhost" || url.hostname === "::1";
  } catch {
    return false;
  }
};

// Chromium is the right transport for the packaged application and its
// internet API. During local development, however, Chromium can leave a
// loopback request pending while the renderer is navigating. Probe the local
// FastAPI server through a direct Node socket instead; it is deliberately
// restricted to loopback and still reports the concrete socket failure.
const fetchSystemHealth = (url, signal) => {
  if (POS_ENV === "local" && isLoopbackUrl(url)) return fetchLoopbackHealth(url, signal);
  return apiFetch(url, { signal, headers: { Accept: "application/json" } });
};

const describeNetworkError = (error) => {
  const cause = error?.cause;
  return {
    name: error?.name || "Error",
    message: error?.message || "Sin detalle",
    causeName: cause?.name || null,
    causeMessage: cause?.message || null,
    code: cause?.code || error?.code || null,
    errno: cause?.errno || error?.errno || null,
    syscall: cause?.syscall || error?.syscall || null,
    address: cause?.address || error?.address || null,
    port: cause?.port || error?.port || null,
    phases: error?.phases || null,
  };
};

const logSystemStatusFailure = (details) => {
  const signature = JSON.stringify([
    details.error.code,
    details.error.message,
    details.error.causeMessage,
    details.state,
  ]);
  const now = Date.now();
  // Keep the first evidence of a failure and state transitions, but do not
  // flood the terminal every five seconds with the same socket error.
  if (signature === lastSystemStatusFailureSignature && now - lastSystemStatusFailureLoggedAt < 30_000) return;
  lastSystemStatusFailureSignature = signature;
  lastSystemStatusFailureLoggedAt = now;
  console.warn("[POS health] API no disponible", details);
};

const installApiNetworkDiagnostics = () => {
  const base = POS_API_BASE_URL.replace(/\/$/, "");
  let lastSignature = null;
  let lastLoggedAt = 0;
  session.defaultSession.webRequest.onErrorOccurred((details) => {
    if (!details.url.startsWith(`${base}/`)) return;
    // React cancels requests from the login route while navigating to /pos.
    // Those renderer aborts are expected and do not describe an API failure.
    if (details.error === "net::ERR_ABORTED" && details.webContentsId) return;
    const signature = `${details.error}|${details.resourceType}|${new URL(details.url).pathname}`;
    const now = Date.now();
    if (signature === lastSignature && now - lastLoggedAt < 30_000) return;
    lastSignature = signature;
    lastLoggedAt = now;
    console.warn("[POS network] Solicitud API fallida", {
      endpoint: `${base}${new URL(details.url).pathname}`,
      error: details.error,
      errorDescription: details.errorDescription || null,
      resourceType: details.resourceType,
      webContentsId: details.webContentsId || null,
    });
  });
};

const sendSystemStatus = (payload) => {
  if (payload?.state !== latestSystemStatus?.state) {
    console.info("[POS health] transición", { from: latestSystemStatus?.state, to: payload?.state, elapsedMs: payload?.elapsedMs ?? null });
  }
  latestSystemStatus = {
    ...payload,
    checkedAt: payload?.checkedAt || Date.now(),
  };
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send("system:status", latestSystemStatus);
};

const clearLocalPosStartupWatch = () => {
  if (!localPosStartupTimer) return;
  clearTimeout(localPosStartupTimer);
  localPosStartupTimer = null;
};

const sendOfflineSnapshotSync = (payload) => {
  offlineSnapshotSync = payload;
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send("offline:snapshot-sync", offlineSnapshotSync);
};

const sendOfflineOutboxSync = (payload) => {
  offlineOutboxSync = { ...offlineOutboxSync, ...payload, updatedAt: Date.now() };
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send("offline:outbox-sync", offlineOutboxSync);
};

const getOfflineOutboxCounts = () => {
  if (!localPosStore) return { pendingSales: 0, pendingCustomers: 0, pendingClosures: 0 };
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) return { pendingSales: 0, pendingCustomers: 0, pendingClosures: 0 };
  return {
    pendingSales: localPosStore.getOfflineSales(stationId).length,
    pendingCustomers: localPosStore.getOfflineCustomers(stationId).length,
    pendingClosures: localPosStore.getOfflineClosures(stationId).length,
  };
};

const syncFetch = async (url, init, timeoutMs = OFFLINE_OUTBOX_REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await apiFetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const syncHeaders = (requestId) => {
  const config = loadConfig() || {};
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${offlineSyncAccessToken}`,
    "X-Request-ID": String(requestId || "").slice(0, 64),
    ...(config.deviceId ? { "X-Metrik-Device-Id": config.deviceId } : {}),
  };
};

const responseError = async (response, fallback) => {
  const body = await response.json().catch(() => null);
  return String(body?.detail || fallback || `Error ${response.status}`);
};

const createSyncError = async (response, fallback) => {
  const error = new Error(await responseError(response, fallback));
  error.status = response.status;
  return error;
};

const reportOfflineReconciliation = async (payload) => {
  if (!offlineSyncAccessToken || !payload?.local_reference) return null;
  try {
    const response = await syncFetch(`${POS_API_BASE_URL.replace(/\/$/, "")}/pos/offline-reconciliations/report`, {
      method: "POST",
      headers: syncHeaders(`reconciliation_${payload.local_reference}`),
      body: JSON.stringify(payload),
    }, 12_000);
    if (!response.ok) {
      console.warn("No se pudo registrar la contingencia en el servidor:", await responseError(response));
      return null;
    }
    return await response.json().catch(() => null);
  } catch (error) {
    // El registro administrativo nunca debe impedir que la cola local se conserve o avance.
    console.warn("No se pudo registrar la contingencia en el servidor:", error?.message || error);
    return null;
  }
};

const reportSyncConflict = async ({ operationType, record, error, details }) => {
  const status = Number(error?.status);
  // Timeouts/transient 5xx do not create administrative noise. The local queue
  // keeps retrying them automatically; actionable business/auth errors do.
  if (![400, 401, 403, 404, 409, 422].includes(status)) return null;
  // El servidor rechaza cierres mientras haya contingencias sin resolver. Ese
  // rechazo es consecuencia de otro conflicto ya reportado: registrarlo como
  // conflicto propio bloqueaba también este cierre en cada reintento.
  if (String(error?.message || "").includes("contingencias offline por resolver")) return null;
  return reportOfflineReconciliation({
    operation_type: operationType,
    local_reference: String(record?.id || "").slice(0, 96),
    station_id: String(record?.stationId || loadConfig()?.stationId || "").trim() || null,
    status: "conflict",
    severity: status >= 500 ? "error" : "warning",
    message: String(error?.message || "No se pudo consolidar la operación offline.").slice(0, 2000),
    details: details || null,
  });
};

const syncOfflineCustomerRecord = async (record) => {
  const customer = {
    client_request_id: record.id,
    name: record.name,
    phone: record.phone || undefined,
    email: record.email || undefined,
    tax_id: record.tax_id || undefined,
    address: record.address || undefined,
  };
  const response = await syncFetch(`${POS_API_BASE_URL.replace(/\/$/, "")}/pos/customers/offline-sync`, {
    method: "POST",
    headers: syncHeaders(record.id),
    body: JSON.stringify(customer),
  }, 20_000);
  if (!response.ok) throw await createSyncError(response, "No se pudo sincronizar el cliente.");
  const saved = await response.json();
  if (!Number.isInteger(saved?.id) || saved.id <= 0) {
    throw new Error("El servidor no devolvió un cliente válido.");
  }
  return saved;
};

const syncOfflineSaleRecord = async (record) => {
  const payload = record?.payload && typeof record.payload === "object"
    ? { ...record.payload }
    : null;
  if (!payload) throw new Error("La venta pendiente no tiene un payload válido.");
  const offlineCustomer = payload.offline_customer;
  if (offlineCustomer?.client_request_id) {
    const savedCustomer = await syncOfflineCustomerRecord({
      id: offlineCustomer.client_request_id,
      ...offlineCustomer,
    });
    payload.customer_id = savedCustomer.id;
    delete payload.offline_customer;
    localPosStore.updateOfflineSale(record.id, { payload, summary: record.summary });
  }
  if (!payload.reservation_id) {
    const reserveResponse = await syncFetch(`${POS_API_BASE_URL.replace(/\/$/, "")}/pos/sales/reserve-number`, {
      method: "POST",
      headers: syncHeaders(`${record.id}_reserve`),
      body: JSON.stringify({
        pos_name: payload.pos_name ?? null,
        station_id: payload.station_id ?? null,
        min_sale_number: payload.sale_number_preassigned ?? null,
      }),
    }, 20_000);
    if (!reserveResponse.ok) throw await createSyncError(reserveResponse, "No se pudo reservar el número de venta.");
    const reservation = await reserveResponse.json();
    if (!Number.isInteger(reservation?.reservation_id) || !Number.isInteger(reservation?.sale_number)) {
      throw new Error("La reserva de número de venta no es válida.");
    }
    payload.reservation_id = reservation.reservation_id;
    payload.sale_number_preassigned = reservation.sale_number;
    localPosStore.updateOfflineSale(record.id, { payload, summary: { ...record.summary, saleNumber: reservation.sale_number } });
  }
  const response = await syncFetch(`${POS_API_BASE_URL.replace(/\/$/, "")}${record.endpoint || "/pos/sales"}`, {
    method: "POST",
    headers: syncHeaders(payload.client_request_id || record.id),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw await createSyncError(response, "No se pudo enviar la venta pendiente.");
  const sale = await response.json();
  localPosStore.completeOfflineSale(record.id, sale);
  return sale;
};

const syncOfflineClosureRecord = async (record) => {
  const unsyncedSales = (record.sales || []).filter((sale) => !Number.isInteger(sale.saleId));
  if (unsyncedSales.length > 0) {
    throw new Error("Aún hay ventas de este cierre pendientes de sincronizar.");
  }
  const summary = record.summary && typeof record.summary === "object" ? record.summary : {};
  const details = record.details && typeof record.details === "object" ? record.details : {};
  const response = await syncFetch(`${POS_API_BASE_URL.replace(/\/$/, "")}/pos/closures`, {
    method: "POST",
    headers: syncHeaders(`${record.id}_closure`),
    body: JSON.stringify({
      pos_name: details.posName || null,
      station_id: record.stationId,
      closed_at: record.closedAt,
      // Solo lo ocurrido hasta el cierre local; lo posterior del mismo día
      // pertenece al siguiente cierre (local u oficial).
      bound_to_closed_at: true,
      counted_cash: Number(summary.countedCash ?? summary.totalCash ?? 0),
      notes: [
        `Cierre de contingencia ${record.id} consolidado automáticamente.`,
        details.notes ? String(details.notes) : null,
      ].filter(Boolean).join(" "),
    }),
  });
  if (!response.ok) throw await createSyncError(response, "No se pudo consolidar el cierre de contingencia.");
  return response.json();
};

const runOfflineOutboxSync = async () => {
  if (offlineOutboxSyncPromise) return offlineOutboxSyncPromise;
  if (!offlineSyncAccessToken || connectivity.state !== "healthy" || !localPosStore) {
    const counts = getOfflineOutboxCounts();
    sendOfflineOutboxSync({ state: counts.pendingSales || counts.pendingCustomers || counts.pendingClosures ? "waiting" : "idle", ...counts });
    return null;
  }
  offlineOutboxSyncPromise = (async () => {
    const config = loadConfig() || {};
    const stationId = String(config.stationId || "").trim();
    if (!stationId) return null;
    let completedSales = 0;
    let completedCustomers = 0;
    const initial = getOfflineOutboxCounts();
    sendOfflineOutboxSync({ state: "syncing", ...initial, completedSales: 0, completedCustomers: 0, error: null });
    for (const customer of localPosStore.getOfflineCustomers(stationId)) {
      try {
        localPosStore.markOfflineCustomerSyncing(customer.id);
        const saved = await syncOfflineCustomerRecord(customer);
        localPosStore.completeOfflineCustomer(customer.id, saved.id);
        completedCustomers += 1;
        sendOfflineOutboxSync({ state: "syncing", ...getOfflineOutboxCounts(), completedSales, completedCustomers });
      } catch (error) {
        localPosStore.markOfflineCustomerPending(customer.id, error?.message || error);
        throw error;
      }
    }
    for (const sale of localPosStore.getOfflineSales(stationId)) {
      try {
        localPosStore.markOfflineSaleSyncing(sale.id);
        const synced = await syncOfflineSaleRecord(sale);
        await reportOfflineReconciliation({
          operation_type: "sale",
          local_reference: String(sale.id).slice(0, 96),
          station_id: stationId,
          status: "resolved",
          severity: "info",
          message: "Venta de contingencia consolidada automáticamente.",
          details: { total: sale.summary?.total ?? null, local_closure_id: sale.localClosureId || null },
          official_sale_id: synced?.id ?? null,
          official_sale_number: synced?.sale_number ?? null,
        });
        completedSales += 1;
        sendOfflineOutboxSync({ state: "syncing", ...getOfflineOutboxCounts(), completedSales, completedCustomers, lastSale: synced });
      } catch (error) {
        localPosStore.markOfflineSalePending(sale.id, error?.message || error);
        await reportSyncConflict({
          operationType: "sale",
          record: sale,
          error,
          details: { total: sale.summary?.total ?? null, local_closure_id: sale.localClosureId || null },
        });
        throw error;
      }
    }
    // Del más antiguo al más reciente: el servidor cierra todo lo pendiente
    // hasta `closed_at`, así que un cierre posterior consolidado primero se
    // quedaba con las ventas (y no con el efectivo contado) de los anteriores.
    const pendingClosures = [...localPosStore.getOfflineClosures(stationId)]
      .sort((a, b) => String(a.closedAt).localeCompare(String(b.closedAt)));
    for (const closure of pendingClosures) {
      try {
        localPosStore.markOfflineClosureSyncing(closure.id);
        const officialClosure = await syncOfflineClosureRecord(closure);
        localPosStore.completeOfflineClosure(closure.id, officialClosure);
        await reportOfflineReconciliation({
          operation_type: "closure",
          local_reference: String(closure.id).slice(0, 96),
          station_id: stationId,
          status: "resolved",
          severity: "info",
          message: "Cierre de contingencia consolidado automáticamente.",
          details: { closed_at: closure.closedAt, sales_count: closure.sales?.length ?? 0 },
          official_closure_id: officialClosure?.id ?? null,
          official_closure_consecutive: officialClosure?.consecutive ?? null,
        });
        sendOfflineOutboxSync({ state: "syncing", ...getOfflineOutboxCounts(), completedSales, completedCustomers, lastClosure: officialClosure });
      } catch (error) {
        localPosStore.markOfflineClosurePending(closure.id, error?.message || error);
        await reportSyncConflict({
          operationType: "closure",
          record: closure,
          error,
          details: { closed_at: closure.closedAt, sales_count: closure.sales?.length ?? 0 },
        });
        throw error;
      }
    }
    const counts = getOfflineOutboxCounts();
    sendOfflineOutboxSync({ state: "completed", ...counts, completedSales, completedCustomers, error: null });
    return { completedSales, completedCustomers, ...counts };
  })().catch((error) => {
    const counts = getOfflineOutboxCounts();
    sendOfflineOutboxSync({ state: "error", ...counts, error: String(error?.message || error) });
    throw error;
  }).finally(() => {
    offlineOutboxSyncPromise = null;
  });
  return offlineOutboxSyncPromise;
};

const scheduleOfflineOutboxSync = (delay = OFFLINE_OUTBOX_SYNC_DELAY_MS) => {
  if (offlineOutboxSyncTimer) clearTimeout(offlineOutboxSyncTimer);
  offlineOutboxSyncTimer = setTimeout(() => {
    offlineOutboxSyncTimer = null;
    void runOfflineOutboxSync().catch(() => {
      // La cola queda intacta y se reintentará al próximo ciclo de salud o sesión.
    });
  }, delay);
};

const readSnapshotResponse = async (response, startedAt, options = {}) => {
  if (!response.body) return response.text();
  const totalBytes = Number(response.headers.get("content-length")) || null;
  const reader = response.body.getReader();
  const chunks = [];
  let receivedBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedBytes += value.byteLength;
    const elapsedSeconds = Math.max(0.1, (Date.now() - startedAt) / 1000);
    const bytesPerSecond = receivedBytes / elapsedSeconds;
    sendOfflineSnapshotSync({
      state: "syncing",
      startedAt,
      receivedBytes,
      totalBytes,
      progress: totalBytes ? Math.min(99, Math.round((receivedBytes / totalBytes) * 100)) : null,
      estimatedRemainingSeconds: totalBytes && bytesPerSecond
        ? Math.max(0, Math.ceil((totalBytes - receivedBytes) / bytesPerSecond))
        : null,
      silent: Boolean(options?.silent),
    });
  }
  const totalLength = chunks.reduce((size, chunk) => size + chunk.byteLength, 0);
  const data = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(data);
};

const refreshOfflineSnapshot = async (token, options = {}) => {
  if (offlineSnapshotSyncPromise) return offlineSnapshotSyncPromise;
  // Los refrescos de fondo (login y POS) piden un intervalo mínimo: si la
  // última descarga completa es reciente, no se repite.
  const minIntervalMs = Number(options?.minIntervalMs) || 0;
  if (minIntervalMs > 0 && offlineSnapshotSync.state === "completed" && Date.now() - Number(offlineSnapshotSync.completedAt || 0) < minIntervalMs) {
    return Promise.resolve({ ...offlineSnapshotSync, skipped: true });
  }
  const silent = Boolean(options?.silent);
  offlineSnapshotSyncPromise = (async () => {
    if (!localPosStore) throw new Error("Almacenamiento local no disponible");
    const config = loadConfig();
    if (!config?.stationId || !config?.deviceId || typeof token !== "string" || !token.trim()) {
      throw new Error("Falta estación, dispositivo o sesión para sincronizar");
    }
    const startedAt = Date.now();
    offlineSnapshotAbortController = new AbortController();
    sendOfflineSnapshotSync({ state: "syncing", startedAt, progress: 0, estimatedRemainingSeconds: null, silent });
    try {
      const url = `${POS_API_BASE_URL.replace(/\/$/, "")}/pos/offline-snapshot?station_id=${encodeURIComponent(config.stationId)}`;
      const response = await apiFetch(url, {
        signal: offlineSnapshotAbortController.signal,
        headers: { Authorization: `Bearer ${token.trim()}`, "X-Metrik-Device-Id": config.deviceId, Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`No se pudo actualizar el snapshot (${response.status})`);
      const raw = await readSnapshotResponse(response, startedAt, { silent });
      mainDiagnostics.record("snapshot:download", Date.now() - startedAt, { bytes: raw.length });
      const parsed = mainDiagnostics.measure("snapshot:parse", () => JSON.parse(raw), { bytes: raw.length });
      const status = mainDiagnostics.measure("snapshot:replace", () => localPosStore.replaceOfflineSnapshot(parsed));
      sendOfflineSnapshotSync({ state: "completed", completedAt: Date.now(), progress: 100, estimatedRemainingSeconds: 0, silent, ...status });
      return status;
    } catch (error) {
      const cancelled = error?.name === "AbortError";
      sendOfflineSnapshotSync({ state: cancelled ? "cancelled" : "error", message: cancelled ? "Sincronización cancelada" : String(error?.message || error), silent });
      throw error;
    } finally {
      offlineSnapshotAbortController = null;
      offlineSnapshotSyncPromise = null;
    }
  })();
  return offlineSnapshotSyncPromise;
};

const SYSTEM_STATUS_CONTENT = {
  maintenance: {
    title: "Mantenimiento en curso",
    message: "Estamos actualizando Metrik. Algunas funciones pueden no estar disponibles.",
    retryAfterSeconds: 15,
  },
  degraded: {
    title: "Problema del servicio",
    message: "Metrik está teniendo dificultades internas. Continuaremos con la copia local.",
    retryAfterSeconds: 10,
  },
  connection: {
    title: "Conexión a internet inestable",
    message: "No logramos comunicarnos con Metrik. Revisa la conexión a internet de este equipo.",
    retryAfterSeconds: 10,
  },
  reconnecting: {
    title: "Reconectando con Metrik",
    message: "Detectamos una interrupción breve. Seguimos intentando sin cambiar la operación.",
    retryAfterSeconds: 5,
  },
  recovering: {
    title: "Conexión recuperándose",
    message: "Confirmando estabilidad antes de reanudar la operación en línea.",
  },
};

const hasPendingOutbox = () => {
  const counts = getOfflineOutboxCounts();
  return counts.pendingSales + counts.pendingCustomers + counts.pendingClosures > 0;
};

// /healthz no consulta la base de datos, así que no ve el mantenimiento que
// Render anuncia en system_status antes de cada despliegue. Tras una respuesta
// sana se consulta /readyz solo para detectarlo: si falla o tarda, se ignora y
// nunca provoca una falsa caída.
const SYSTEM_STATUS_MAINTENANCE_TIMEOUT_MS = 3_000;
const fetchAnnouncedMaintenance = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SYSTEM_STATUS_MAINTENANCE_TIMEOUT_MS);
  try {
    const response = await fetchSystemHealth(apiEndpoint("/readyz"), controller.signal);
    const payload = await response.json().catch(() => ({}));
    return payload?.status === "maintenance" || payload?.maintenance === true ? payload : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const checkSystemStatus = async () => {
  // Nunca permitimos que un sondeo viejo termine después de uno nuevo y
  // sobrescriba su estado.
  if (systemStatusCheckInFlight) return;
  systemStatusCheckInFlight = true;
  const startedAt = Date.now();
  const endpoint = apiEndpoint("/healthz");
  const transport = POS_ENV === "local" && isLoopbackUrl(endpoint) ? "node.http.loopback" : "electron.net.fetch";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SYSTEM_STATUS_TIMEOUT_MS);
  let event;
  let details = {};
  try {
    const response = await fetchSystemHealth(endpoint, controller.signal);
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }
    details = { httpStatus: response.status, serverMessage: payload.message || null, retryAfterSeconds: payload.retry_after_seconds || null };
    if (payload.status === "maintenance" || payload.maintenance === true) event = { type: "maintenance" };
    else if (!response.ok) event = { type: "failure", kind: "http" };
    else {
      const announced = await fetchAnnouncedMaintenance();
      if (announced) {
        details = { ...details, serverMessage: announced.message || null, retryAfterSeconds: announced.retry_after_seconds || null };
        event = { type: "maintenance" };
      } else {
        event = { type: "success" };
      }
    }
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    const networkError = describeNetworkError(error);
    details = { networkError };
    // Si el timeout venció mucho más tarde de lo programado, el proceso
    // principal estuvo bloqueado o suspendido (diálogo síncrono del sistema,
    // trabajo pesado, equipo suspendido). Eso no dice nada sobre la API: no lo
    // contamos como fallo y dejamos que el siguiente sondeo decida.
    const lateTimeout = error?.name === "AbortError" && elapsedMs > SYSTEM_STATUS_TIMEOUT_MS + SYSTEM_STATUS_LATE_TIMEOUT_GRACE_MS;
    event = lateTimeout ? { type: "inconclusive" } : { type: "failure", kind: "network" };
  } finally {
    clearTimeout(timeout);
    systemStatusCheckInFlight = false;
  }

  const result = connectivity.apply(event);
  if (details.networkError) {
    logSystemStatusFailure({
      attempt: event.type === "inconclusive" ? null : result.failures,
      state: event.type === "inconclusive" ? `${result.state} (sondeo inconcluso: timeout tardío, proceso principal bloqueado)` : result.state,
      endpoint,
      transport,
      elapsedMs: Date.now() - startedAt,
      timeoutMs: SYSTEM_STATUS_TIMEOUT_MS,
      error: details.networkError,
    });
  } else {
    lastSystemStatusFailureSignature = null;
  }
  if (event.type === "inconclusive") return;
  const content = SYSTEM_STATUS_CONTENT[result.state] || {};
  sendSystemStatus({
    state: result.state,
    ...(content.title ? { title: content.title } : {}),
    ...(content.message ? { message: details.serverMessage || content.message } : {}),
    ...(content.retryAfterSeconds ? { retryAfterSeconds: details.retryAfterSeconds || content.retryAfterSeconds } : {}),
    checkedAt: Date.now(),
    endpoint,
    transport,
    elapsedMs: Date.now() - startedAt,
    ...(details.httpStatus ? { httpStatus: details.httpStatus } : {}),
    ...(details.networkError ? { networkError: details.networkError } : {}),
  });
  if (result.state !== "healthy") return;
  // La cola se intenta al recuperar la conexión y, si quedó trabajo pendiente
  // (por ejemplo, un 5xx transitorio), con un ritmo moderado en vez de cada
  // sondeo de cinco segundos.
  const now = Date.now();
  if (result.changed || (now - lastOutboxRetryAt >= OFFLINE_OUTBOX_RETRY_MS && hasPendingOutbox())) {
    lastOutboxRetryAt = now;
    scheduleOfflineOutboxSync();
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
    await apiFetch(`${base}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore network/logout failures on exit
  }
};

// Las decisiones de salida pertenecen a la interfaz de Metrik, no a un
// cuadro nativo de Windows. El proceso principal solo ejecuta una salida ya
// confirmada por el usuario.
const requestRendererClose = () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("app:close-requested");
  }
};

const finishConfirmedQuit = () => {
  if (isQuitting) return;
  isQuitting = true;
  Promise.race([bestEffortLogoutBeforeQuit(), wait(QUIT_LOGOUT_TIMEOUT_MS)]).finally(() => {
    localPosStore?.close();
    stopLocalPosServer();
    app.quit();
  });
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
      additionalArguments: [
        `--metrik-api-base-url=${POS_API_BASE_URL}`,
        `--metrik-print-agent-enabled=${process.env.POS_DISABLE_PRINT_AGENT === "1" ? "0" : "1"}`,
      ],
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.on("close", (event) => {
    if (isQuitting) return;
    event.preventDefault();
    requestRendererClose();
  });
  const allowKiosk = process.platform === "win32" && POS_ENV !== "local";
  if (allowKiosk) {
    // Kiosk already owns the fullscreen transition.  Requesting fullscreen a
    // second time made the local macOS renderer occasionally present a black
    // compositor surface even after did-finish-load had fired.
    mainWindow.setKiosk(true);
  }

  const applyCurrentZoom = () => applyZoomFactor(getZoomFactor());
  applyCurrentZoom();

  mainWindow.webContents.on("did-finish-load", applyCurrentZoom);
  mainWindow.webContents.on("did-start-loading", () => {
    console.info("[POS renderer] inició carga:", mainWindow?.webContents.getURL());
  });
  mainWindow.webContents.on("did-finish-load", () => {
    console.info("[POS renderer] terminó carga:", mainWindow?.webContents.getURL());
  });
  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    console.info("[POS renderer console]", { level, message, line, sourceId });
  });
  mainWindow.webContents.on("will-navigate", (_event, navigationUrl) => {
    console.info("[POS renderer] navegará a:", navigationUrl);
  });
  mainWindow.webContents.on("did-navigate", (_event, navigationUrl) => {
    console.info("[POS renderer] navegó a:", navigationUrl);
    applyCurrentZoom();
  });
  mainWindow.webContents.on("did-navigate-in-page", (_event, navigationUrl) => {
    console.info("[POS renderer] navegación interna:", navigationUrl);
    applyCurrentZoom();
  });
  mainWindow.webContents.on("dom-ready", applyCurrentZoom);
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
    clearLocalPosStartupWatch();
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

  const armLocalPosStartupWatch = () => {
    clearLocalPosStartupWatch();
    localPosStartupTimer = setTimeout(() => {
      console.error("La interfaz POS local no confirmó el arranque a tiempo.");
      loadOfflineScreen({
        reason: "La interfaz local tardó demasiado en iniciar.",
        code: -2,
      });
    }, LOCAL_POS_STARTUP_TIMEOUT_MS);
  };

  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      console.error("[POS renderer] fallo de carga", {
        errorCode,
        errorDescription,
        validatedURL,
        isMainFrame,
      });
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
    console.error("[POS renderer] proceso terminado", details);
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
  if (hasLocalPosBuild()) {
    armLocalPosStartupWatch();
    mainWindow.loadURL(buildLocalPosLoginUrl(config));
  } else {
    console.warn("No encontramos la build local del POS; usando la interfaz remota.");
    mainWindow.loadURL(buildPosLoginUrl(config));
  }
};

app.whenReady().then(async () => {
  registerLocalPosProtocol();
  installApiNetworkDiagnostics();
  ensureDeviceInfo();
  initializeLocalPosStore();
  try {
    await startLocalPosServer();
  } catch (error) {
    console.error("No pudimos iniciar el servidor local de la interfaz POS:", error);
  }
  configureWindowsAutoStart();
  createWindow();
  mainDiagnostics.start();
  startSystemStatusMonitor();
  autoUpdater.logger = console;
  void desktopUpdates.check();
  setInterval(() => { void desktopUpdates.check(); }, 6 * 60 * 60 * 1000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", (event) => {
  if (isQuitting) return;
  event.preventDefault();
  requestRendererClose();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const desktopUpdates = createUpdateController({
  updater: autoUpdater,
  supported: app.isPackaged && process.platform === "win32",
  version: app.getVersion(),
  publish: (payload) => {
    if (payload.status === "error") isQuitting = false;
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("update:status", payload);
  },
  install: async () => {
    // La copia anterior del catálogo permanece válida si se cancela una descarga.
    offlineSnapshotAbortController?.abort();
    await Promise.race([bestEffortLogoutBeforeQuit(), wait(QUIT_LOGOUT_TIMEOUT_MS)]);
    isQuitting = true;
    autoUpdater.quitAndInstall(false, true);
  },
});
ipcMain.handle("update:get", () => desktopUpdates.getState());
ipcMain.handle("update:check", () => desktopUpdates.check());
ipcMain.handle("update:install", () => desktopUpdates.scheduleInstall());
ipcMain.handle("update:cancel", () => desktopUpdates.cancelInstall());

ipcMain.handle("config:get", () => {
  return loadConfig();
});

ipcMain.handle("system:status:get", () => latestSystemStatus);

ipcMain.handle("offline:storage-status", () => {
  const status = localPosStore?.getStatus() || { available: false, schemaVersion: 0 };
  return { ...status, error: localPosStoreError };
});

ipcMain.handle("offline:snapshot:get", () => {
  if (!localPosStore) return null;
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) return null;
  return mainDiagnostics.measure("snapshot:get", () => localPosStore.getOfflineSnapshot(stationId));
});

ipcMain.handle("offline:snapshot-sync-status", () => offlineSnapshotSync);

ipcMain.handle("offline:snapshot-refresh", async (_event, token, options) => {
  return refreshOfflineSnapshot(token, options);
});

// safeStorage es síncrono. En macOS puede abrir el diálogo del llavero y
// bloquear el proceso principal hasta que alguien responda; lo medimos.
const measureSafeStorage = (name, fn) => mainDiagnostics.measure(`safeStorage:${name}`, fn);

// El login y la pantalla del POS piden la renovación casi a la vez. Para un
// mismo token se reutiliza la renovación en curso o una reciente.
const OFFLINE_AUTHORIZATION_REUSE_MS = 10 * 60 * 1000;
let offlineAuthorizationRefresh = null;

ipcMain.handle("offline:authorization:refresh", (_event, token) => {
  const current = offlineAuthorizationRefresh;
  if (current?.token === token && (!current.completedAt || Date.now() - current.completedAt < OFFLINE_AUTHORIZATION_REUSE_MS)) {
    return current.promise;
  }
  const entry = { token, completedAt: null, promise: null };
  entry.promise = refreshOfflineAuthorization(token).then((result) => {
    entry.completedAt = Date.now();
    return result;
  }, (error) => {
    if (offlineAuthorizationRefresh === entry) offlineAuthorizationRefresh = null;
    throw error;
  });
  offlineAuthorizationRefresh = entry;
  return entry.promise;
});

const decodeOfflineGrant = (grant) => JSON.parse(Buffer.from(String(grant).split(".")[0], "base64url").toString("utf8"));

// Una sesión en línea de cualquier usuario renueva el acceso offline de todos
// los que pueden ingresar por PIN en esta estación (vigencia definida por el
// servidor). Con un backend anterior se conserva el permiso individual.
const refreshOfflineAuthorization = async (token) => {
  if (!measureSafeStorage("isEncryptionAvailable", () => safeStorage.isEncryptionAvailable())) throw new Error("El almacenamiento seguro del sistema no está disponible");
  const config = loadConfig();
  if (!config?.stationId || !config?.deviceId || !token) throw new Error("Falta estación, dispositivo o sesión");
  const init = { method: "POST", headers: { Authorization: `Bearer ${token}`, "X-Metrik-Device-Id": config.deviceId } };
  const query = `?station_id=${encodeURIComponent(config.stationId)}`;
  const response = await apiFetch(`${apiEndpoint("/auth/pos-offline-grants")}${query}`, init);
  if (response.status === 404 || response.status === 405) {
    const single = await apiFetch(`${apiEndpoint("/auth/pos-offline-grant")}${query}`, init);
    if (!single.ok) throw new Error(`No se pudo autorizar el modo offline (${single.status})`);
    const result = await single.json();
    const payload = decodeOfflineGrant(result.grant);
    const encryptedGrant = measureSafeStorage("encrypt", () => safeStorage.encryptString(String(result.grant))).toString("base64");
    localPosStore.saveOfflineAuthorization({ stationId: config.stationId, userId: payload.sub, encryptedGrant, expiresAt: result.expires_at });
    return { expiresAt: result.expires_at, users: 1 };
  }
  if (!response.ok) throw new Error(`No se pudo autorizar el modo offline (${response.status})`);
  const result = await response.json();
  const records = (Array.isArray(result?.grants) ? result.grants : []).map((item) => ({
    userId: decodeOfflineGrant(item.grant).sub,
    encryptedGrant: measureSafeStorage("encrypt", () => safeStorage.encryptString(String(item.grant))).toString("base64"),
    expiresAt: result.expires_at,
  }));
  const users = localPosStore.replaceOfflineAuthorizations(config.stationId, records);
  return { expiresAt: result.expires_at, users };
};

const pbkdf2Async = (pin, salt) => new Promise((resolve, reject) => {
  crypto.pbkdf2(pin, salt, 120000, 32, "sha256", (error, key) => (error ? reject(error) : resolve(key)));
});

ipcMain.handle("offline:authorization:verify", async (_event, pin) => {
  if (!measureSafeStorage("isEncryptionAvailable", () => safeStorage.isEncryptionAvailable()) || !localPosStore) return null;
  const config = loadConfig();
  const rawPin = String(pin || "").trim();
  if (!config?.stationId || !config?.deviceId || !/^\d{4,8}$/.test(rawPin)) return null;
  for (const row of localPosStore.getOfflineAuthorizations(config.stationId)) {
    try {
      const grant = measureSafeStorage("decrypt", () => safeStorage.decryptString(Buffer.from(row.encrypted_grant, "base64")));
      const payload = decodeOfflineGrant(grant);
      if (payload.kind !== "pos-offline-grant" || payload.station_id !== config.stationId || payload.device_id !== config.deviceId || payload.exp * 1000 <= Date.now()) continue;
      const [salt, digest] = String(payload.pin_hash).split(".");
      // Asíncrono: con todos los usuarios de la estación guardados, el PBKDF2
      // síncrono bloquearía el proceso principal en cada intento de PIN.
      const candidate = await pbkdf2Async(rawPin, Buffer.from(salt, "base64url"));
      if (!crypto.timingSafeEqual(candidate, Buffer.from(digest, "base64url"))) continue;
      return {
        user: { id: payload.sub, role: payload.role, name: payload.name || "Usuario POS", email: payload.email || "" },
        tenantId: payload.tenant_id,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        limits: payload.limits,
      };
    } catch { /* skip invalid protected record */ }
  }
  return null;
});

ipcMain.handle("offline:sales:enqueue", (_event, record) => {
  if (!localPosStore) throw new Error("Almacenamiento local no disponible");
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) throw new Error("No hay una estación configurada");
  const snapshotVersion = localPosStore.getOfflineSnapshotVersion(stationId);
  const payload = record?.payload && typeof record.payload === "object"
    ? { ...record.payload }
    : record?.payload;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    payload.offline_snapshot_version = snapshotVersion || "local-unknown";
    payload.offline_captured_at = new Date().toISOString();
  }
  const alreadyStored = localPosStore.hasOfflineSale(record?.id);
  const result = localPosStore.enqueueOfflineSale({ ...record, payload, stationId });
  // Reencolar una venta existente es un no-op y no debe emitir eventos: el
  // renderer reacciona a cada evento de la cola rehidratando su espejo, y un
  // eco aquí formaba un bucle exponencial que saturaba el proceso principal.
  if (alreadyStored) return result;
  sendOfflineOutboxSync({ state: "waiting", ...getOfflineOutboxCounts() });
  if (connectivity.state === "healthy") scheduleOfflineOutboxSync();
  return result;
});

ipcMain.handle("offline:sales:list", () => {
  if (!localPosStore) return [];
  return localPosStore.getOfflineSales(String(loadConfig()?.stationId || "").trim());
});

ipcMain.handle("offline:sales:remove", (_event, id) => {
  localPosStore?.removeOfflineSale(id);
  return true;
});

ipcMain.handle("offline:sales:update", (_event, id, update) => {
  if (!localPosStore) throw new Error("Almacenamiento local no disponible");
  return localPosStore.updateOfflineSale(id, update || {});
});

ipcMain.handle("offline:sales:complete", (_event, id, sale) => {
  if (!localPosStore) throw new Error("Almacenamiento local no disponible");
  return localPosStore.completeOfflineSale(id, sale);
});

ipcMain.handle("offline:closures:create", (_event, closure) => {
  if (!localPosStore) throw new Error("Almacenamiento local no disponible");
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) throw new Error("No hay una estación configurada");
  return localPosStore.createOfflineClosure({ ...closure, stationId });
});

ipcMain.handle("offline:closures:preview", (_event, options) => {
  if (!localPosStore) throw new Error("Almacenamiento local no disponible");
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) throw new Error("No hay una estación configurada");
  return localPosStore.getOfflineClosurePreview(stationId, options?.closedAt);
});

ipcMain.handle("offline:closures:record-sale", (_event, record) => {
  if (!localPosStore) return false;
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) return false;
  return localPosStore.recordClosureLedgerSale({ ...record, stationId });
});

ipcMain.handle("offline:closures:list", (_event, options) => {
  if (!localPosStore) return [];
  return localPosStore.getOfflineClosures(
    String(loadConfig()?.stationId || "").trim(),
    { includeFinalized: Boolean(options?.includeFinalized) }
  );
});

ipcMain.handle("offline:closures:get", (_event, id) => {
  if (!localPosStore) return null;
  return localPosStore.getOfflineClosure(id);
});

ipcMain.handle("offline:customers:enqueue", (_event, record) => {
  if (!localPosStore) throw new Error("Almacenamiento local no disponible");
  const stationId = String(loadConfig()?.stationId || "").trim();
  if (!stationId) throw new Error("No hay una estación configurada");
  const result = localPosStore.enqueueOfflineCustomer({ ...record, stationId });
  sendOfflineOutboxSync({ state: "waiting", ...getOfflineOutboxCounts() });
  if (connectivity.state === "healthy") scheduleOfflineOutboxSync();
  return result;
});

ipcMain.handle("offline:customers:list", (_event, options) => {
  if (!localPosStore) return [];
  return localPosStore.getOfflineCustomers(
    String(loadConfig()?.stationId || "").trim(),
    { includeSynced: Boolean(options?.includeSynced) }
  );
});

ipcMain.handle("offline:sync:status", () => ({ ...offlineOutboxSync, ...getOfflineOutboxCounts() }));

ipcMain.handle("offline:sync:session", (_event, token) => {
  const value = typeof token === "string" ? token.trim() : "";
  // El token permanece solo en memoria del proceso principal. Un reinicio de
  // Electron exige que el renderer registre la sesión otra vez.
  offlineSyncAccessToken = value && !value.startsWith("offline:") ? value : null;
  if (offlineSyncAccessToken && connectivity.state === "healthy") scheduleOfflineOutboxSync();
  return { registered: Boolean(offlineSyncAccessToken) };
});

ipcMain.handle("offline:sync:request", async () => runOfflineOutboxSync());

ipcMain.handle("pos-ui:ready", () => {
  clearLocalPosStartupWatch();
  return true;
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
    const config = loadConfig();
    mainWindow.loadURL(
      hasLocalPosBuild() ? buildLocalPosLoginUrl(config) : buildPosLoginUrl(config)
    );
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
  finishConfirmedQuit();
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
