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
  const title = payload.title || (maintenance ? "Mantenimiento en curso" : "Problema de conexión");
  const message = payload.message || "Reintentando automáticamente.";
  element.style.background = maintenance ? "#fffbeb" : "#fff1f2";
  element.style.borderColor = maintenance ? "#fcd34d" : "#fda4af";
  element.style.color = maintenance ? "#78350f" : "#881337";
  element.replaceChildren();
  const titleNode = document.createElement("div");
  titleNode.textContent = title;
  Object.assign(titleNode.style, { fontWeight: "700", fontSize: "15px", marginBottom: "3px" });
  const messageNode = document.createElement("div");
  messageNode.textContent = message;
  messageNode.style.fontSize = "13px";
  const retryNode = document.createElement("div");
  retryNode.textContent = "Reintentando automáticamente";
  Object.assign(retryNode.style, { fontSize: "11px", opacity: "0.7", marginTop: "5px" });
  element.append(titleNode, messageNode, retryNode);
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
