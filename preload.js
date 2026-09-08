const { contextBridge, ipcRenderer } = require("electron");

const STATUS_ELEMENT_ID = "kensar-native-system-status";
const STATUS_STYLE_ID = "kensar-native-system-status-style";
const STATUS_TRANSITION_MS = 320;
let statusRemovalTimer = null;

const STATUS_CONTENT = {
  maintenance: {
    title: "Actualización en curso",
    badge: "Mantenimiento",
    message:
      "Estamos aplicando mejoras a Metrik. El sistema volverá a estar disponible en unos minutos.",
    detail:
      "Puedes mantener esta ventana abierta; reintentaremos automáticamente.",
    background: "#fffbeb",
    border: "#fde68a",
    text: "#451a03",
    accentBackground: "#fde68a",
    accentText: "#92400e",
  },
  connection: {
    title: "Conexión a internet inestable",
    badge: "Conexión",
    message:
      "No logramos comunicarnos con Metrik. Revisa la conexión a internet de este equipo.",
    detail:
      "Comprueba el Wi-Fi o el cable de red; reintentaremos automáticamente.",
    background: "#f0f9ff",
    border: "#bae6fd",
    text: "#082f49",
    accentBackground: "#bae6fd",
    accentText: "#075985",
  },
  degraded: {
    title: "Problema del servicio",
    badge: "Incidente",
    message:
      "Metrik está teniendo dificultades internas. El equipo técnico ya está revisando el problema.",
    detail: "Evita repetir operaciones mientras restablecemos el servicio.",
    background: "#fef2f2",
    border: "#fecaca",
    text: "#450a0a",
    accentBackground: "#fecaca",
    accentText: "#991b1b",
  },
};

const ensureSystemStatusStyles = () => {
  if (document.getElementById(STATUS_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STATUS_STYLE_ID;
  style.textContent = `
    @keyframes kensar-native-status-spin {
      to { transform: rotate(360deg); }
    }
    #${STATUS_ELEMENT_ID} .kensar-native-status-spinner {
      animation: kensar-native-status-spin 0.8s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      #${STATUS_ELEMENT_ID} {
        transition: opacity 160ms ease-out !important;
      }
    }
  `;
  (document.head || document.documentElement).appendChild(style);
};

const formatStatusTime = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const animateStatusSpinner = (spinnerNode) => {
  if (!spinnerNode) return;
  spinnerNode.style.animation =
    "kensar-native-status-spin 0.8s linear infinite";
  spinnerNode.style.transformOrigin = "50% 50%";
  spinnerNode.style.willChange = "transform";
  if (!spinnerNode || typeof spinnerNode.animate !== "function") return;
  spinnerNode.animate(
    [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    {
      duration: 800,
      iterations: Infinity,
      easing: "linear",
    }
  );
};

const createStatusIcon = (state, content) => {
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  Object.assign(icon.style, {
    marginTop: "2px",
    display: "flex",
    width: "32px",
    height: "32px",
    flexShrink: "0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    background: content.accentBackground,
    color: content.accentText,
    fontSize: "14px",
    fontWeight: "700",
  });
  if (state === "connection") {
    icon.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.8a15.4 15.4 0 0 1 20 0"/><path d="M5 12.8a10.7 10.7 0 0 1 8-2.7"/><path d="M8.5 16.2a5.6 5.6 0 0 1 2.7-.9"/><path d="m3 3 18 18"/></svg>';
  } else {
    icon.textContent = state === "maintenance" ? "↻" : "!";
  }
  return icon;
};

const renderSystemStatus = (payload) => {
  if (typeof document === "undefined") return;
  let element = document.getElementById(STATUS_ELEMENT_ID);
  if (payload && payload.state === "healthy") {
    if (element) {
      if (statusRemovalTimer) clearTimeout(statusRemovalTimer);
      element.style.transform = "translate(-50%, -120%)";
      element.style.opacity = "0";
      element.style.pointerEvents = "none";
      statusRemovalTimer = setTimeout(() => {
        if (element?.isConnected) element.remove();
        statusRemovalTimer = null;
      }, STATUS_TRANSITION_MS);
    }
    return;
  }

  const state =
    payload?.state === "maintenance" || payload?.state === "connection"
      ? payload.state
      : "degraded";
  const content = STATUS_CONTENT[state];
  if (statusRemovalTimer) {
    clearTimeout(statusRemovalTimer);
    statusRemovalTimer = null;
  }
  ensureSystemStatusStyles();

  if (!element) {
    element = document.createElement("div");
    element.id = STATUS_ELEMENT_ID;
    element.setAttribute("role", "alert");
    element.setAttribute("aria-live", "assertive");
    Object.assign(element.style, {
      position: "fixed",
      top: "12px",
      left: "50%",
      transform: "translate(-50%, -120%)",
      opacity: "0",
      width: "min(768px, calc(100vw - 24px))",
      zIndex: "2147483647",
      boxSizing: "border-box",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid",
      boxShadow:
        "0 20px 25px -5px rgba(15, 23, 42, .14), 0 8px 10px -6px rgba(15, 23, 42, .12)",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      lineHeight: "1.35",
      transition: "transform 320ms ease-out, opacity 240ms ease-out",
      pointerEvents: "auto",
    });
    document.documentElement.appendChild(element);
  }

  element.style.background = content.background;
  element.style.borderColor = content.border;
  element.style.color = content.text;
  element.style.pointerEvents = "auto";
  element.replaceChildren();

  const layout = document.createElement("div");
  Object.assign(layout.style, {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  });
  layout.appendChild(createStatusIcon(state, content));

  const body = document.createElement("div");
  Object.assign(body.style, { minWidth: "0", flex: "1" });
  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "8px",
    rowGap: "4px",
  });
  const titleNode = document.createElement("p");
  titleNode.textContent = content.title;
  Object.assign(titleNode.style, {
    margin: "0",
    fontWeight: "700",
    fontSize: "14px",
  });
  const badgeNode = document.createElement("span");
  badgeNode.textContent = content.badge;
  Object.assign(badgeNode.style, {
    borderRadius: "9999px",
    padding: "2px 8px",
    background: content.accentBackground,
    color: content.accentText,
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  });
  header.append(titleNode, badgeNode);

  const messageNode = document.createElement("div");
  messageNode.textContent = content.message;
  Object.assign(messageNode.style, {
    marginTop: "2px",
    fontSize: "14px",
    lineHeight: "20px",
  });
  const detailNode = document.createElement("div");
  detailNode.textContent = content.detail;
  Object.assign(detailNode.style, {
    marginTop: "4px",
    fontSize: "12px",
    opacity: "0.75",
  });
  const statusNode = document.createElement("div");
  Object.assign(statusNode.style, {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "4px",
    marginTop: "4px",
    fontSize: "11px",
    opacity: "0.6",
  });
  const checkedAt = formatStatusTime(payload?.checkedAt);
  const checkedNode = document.createElement("span");
  checkedNode.textContent = checkedAt
    ? `Última comprobación: ${checkedAt}`
    : "Comprobando el servicio...";
  const retryNode = document.createElement("span");
  Object.assign(retryNode.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  });
  const spinnerNode = document.createElement("span");
  spinnerNode.className = "kensar-native-status-spinner";
  spinnerNode.setAttribute("aria-hidden", "true");
  Object.assign(spinnerNode.style, {
    display: "inline-block",
    width: "12px",
    height: "12px",
    boxSizing: "border-box",
    borderRadius: "9999px",
    border: "2px solid currentColor",
    borderTopColor: "transparent",
    opacity: "0.8",
  });
  retryNode.append(spinnerNode, document.createTextNode("Reintentando automáticamente"));
  animateStatusSpinner(spinnerNode);
  statusNode.append(checkedNode, retryNode);
  body.append(header, messageNode, detailNode, statusNode);
  layout.appendChild(body);
  element.appendChild(layout);

  requestAnimationFrame(() => {
    if (!element?.isConnected) return;
    element.style.transform = "translate(-50%, 0)";
    element.style.opacity = "1";
  });
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
