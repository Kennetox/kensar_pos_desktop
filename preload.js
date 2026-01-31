const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("kensar", {
  getConfig: () => ipcRenderer.invoke("config:get"),
  setConfig: (payload) => ipcRenderer.invoke("config:set", payload),
  clearConfig: () => ipcRenderer.invoke("config:clear"),
  openConfig: () => ipcRenderer.invoke("config:open"),
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
  onUpdateStatus: (handler) => {
    ipcRenderer.removeAllListeners("update:status");
    ipcRenderer.on("update:status", (_event, payload) => handler(payload));
  },
});
