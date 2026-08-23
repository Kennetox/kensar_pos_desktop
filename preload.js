const { contextBridge, ipcRenderer } = require("electron");

const STATUS_ELEMENT_ID = "kensar-native-system-status";

const renderSystemStatus = (payload) => {
  if (typeof document === "undefined") return;
  let element = document.getElementById(STATUS_ELEMENT_ID);
  if (payload && payload.state === "healthy") {
    if (element) element.remove();
    return;
  }
  if (!element) {
    element = document.createElement("div");
    element.id = STATUS_ELEMENT_ID;
    element.setAttribute("role", "alert");
    Object.assign(element.style, {
      position: "fixed",
      top: "12px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(720px, calc(100vw - 24px))",
      zIndex: "2147483647",
      boxSizing: "border-box",
      padding: "14px 18px",
      borderRadius: "12px",
      border: "1px solid",
      boxShadow: "0 8px 24px rgba(15, 23, 42, .18)",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      lineHeight: "1.35",
    });
    document.documentElement.appendChild(element);
  }
  const maintenance = payload.state === "maintenance";
  const connection = payload.state === "connection";
  const title = payload.title || (maintenance ? "Mantenimiento en curso" : connection ? "Conexión a internet inestable" : "Problema del servicio");
  const message = payload.message || "Reintentando automáticamente.";
  element.style.background = maintenance ? "#fffbeb" : connection ? "#f0f9ff" : "#fff1f2";
  element.style.borderColor = maintenance ? "#fcd34d" : connection ? "#7dd3fc" : "#fda4af";
  element.style.color = maintenance ? "#78350f" : connection ? "#0c4a6e" : "#881337";
  element.replaceChildren();
  const headerNode = document.createElement("div");
  Object.assign(headerNode.style, { display: "flex", alignItems: "center", gap: "8px" });
  const iconNode = document.createElement("span");
  iconNode.setAttribute("aria-hidden", "true");
  iconNode.innerHTML = connection
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.8a15.4 15.4 0 0 1 20 0"/><path d="M5 12.8a10.7 10.7 0 0 1 8-2.7"/><path d="M8.5 16.2a5.6 5.6 0 0 1 2.7-.9"/><path d="m3 3 18 18"/></svg>'
    : maintenance
      ? "↻"
      : "!";
  headerNode.appendChild(iconNode);
  const titleNode = document.createElement("div");
  titleNode.textContent = title;
  Object.assign(titleNode.style, { fontWeight: "700", fontSize: "15px", marginBottom: "3px" });
  const messageNode = document.createElement("div");
  messageNode.textContent = message;
  messageNode.style.fontSize = "13px";
  const retryNode = document.createElement("div");
  retryNode.textContent = "Reintentando automáticamente";
  Object.assign(retryNode.style, { fontSize: "11px", opacity: "0.7", marginTop: "5px" });
  headerNode.appendChild(titleNode);
  element.append(headerNode, messageNode, retryNode);
};

ipcRenderer.on("system:status", (_event, payload) => renderSystemStatus(payload));

contextBridge.exposeInMainWorld("kensar", {
  isNativePos: true,
  getConfig: () => ipcRenderer.invoke("config:get"),
  setConfig: (payload) => ipcRenderer.invoke("config:set", payload),
  clearConfig: () => ipcRenderer.invoke("config:clear"),
  openConfig: () => ipcRenderer.invoke("config:open"),
  openNetworkSettings: () => ipcRenderer.invoke("system:open-network-settings"),
  hasAdminPin: () => ipcRenderer.invoke("admin:has"),
  setAdminPin: (pin) => ipcRenderer.invoke("admin:set", pin),
  verifyAdminPin: (pin) => ipcRenderer.invoke("admin:verify", pin),
  getDeviceInfo: () => ipcRenderer.invoke("device:get"),
  openPos: () => ipcRenderer.invoke("pos:open"),
  getZoomFactor: () => ipcRenderer.invoke("zoom:get"),
  setZoomFactor: (value) => ipcRenderer.invoke("zoom:set", value),
  quitApp: () => ipcRenderer.invoke("app:quit"),
  shutdownSystem: () => ipcRenderer.invoke("app:shutdown"),
  getAppVersion: () => ipcRenderer.invoke("app:version"),
  getEnvConfig: () => ipcRenderer.invoke("env:get"),
  onUpdateStatus: (handler) => {
    ipcRenderer.removeAllListeners("update:status");
    ipcRenderer.on("update:status", (_event, payload) => handler(payload));
  },
});
