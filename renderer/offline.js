const connectionDot = document.getElementById("connection-dot");
const connectionLabel = document.getElementById("connection-label");
const stationName = document.getElementById("station-name");
const apiStatus = document.getElementById("api-status");
const networkStatus = document.getElementById("network-status");
const failureDetail = document.getElementById("failure-detail");
const retryPosBtn = document.getElementById("retry-pos");
const openConfigBtn = document.getElementById("open-config");
const checkConnectionBtn = document.getElementById("check-connection");

const query = new URLSearchParams(window.location.search);
const failureReason = query.get("reason");
const failureCode = query.get("code");
const failureUrl = query.get("url");

const setConnectionState = (isOnline) => {
  if (connectionDot) {
    connectionDot.style.background = isOnline ? "#22c55e" : "#f59e0b";
    connectionDot.style.boxShadow = isOnline
      ? "0 0 0 6px rgba(34, 197, 94, 0.14)"
      : "0 0 0 6px rgba(245, 158, 11, 0.12)";
  }
  if (connectionLabel) {
    connectionLabel.textContent = isOnline ? "Con internet" : "Sin internet";
  }
  if (networkStatus) {
    networkStatus.textContent = isOnline ? "Disponible" : "No disponible";
  }
};

const setApiState = (message, tone = "idle") => {
  if (!apiStatus) return;
  apiStatus.textContent = message;
  apiStatus.style.color =
    tone === "good"
      ? "#86efac"
      : tone === "bad"
      ? "#fca5a5"
      : "#f8fafc";
};

const setFailureDetail = (message) => {
  if (!failureDetail) return;
  failureDetail.textContent = message;
};

const checkApi = async () => {
  if (!window.kensar?.getEnvConfig) {
    setApiState("No disponible", "bad");
    return false;
  }
  try {
    const config = await window.kensar.getEnvConfig();
    const apiBaseUrl = String(config?.apiBaseUrl || "").replace(/\/$/, "");
    if (!apiBaseUrl) {
      setApiState("API no configurada", "bad");
      return false;
    }
    const res = await fetch(`${apiBaseUrl}/health`, {
      method: "GET",
      cache: "no-store",
    });
    if (res.ok) {
      setApiState("API disponible", "good");
      return true;
    }
    setApiState(`API no responde (${res.status})`, "bad");
    return false;
  } catch (err) {
    setApiState("API no disponible", "bad");
    return false;
  }
};

const refreshStatus = async () => {
  setConnectionState(navigator.onLine);
  await checkApi();
};

const retryOpenPos = async () => {
  if (checkConnectionBtn) {
    checkConnectionBtn.disabled = true;
  }
  try {
    const apiOk = await checkApi();
    if (!apiOk && !navigator.onLine) {
      setFailureDetail(
        "El equipo sigue sin internet. Revisa router, cable o Wi-Fi antes de reintentar."
      );
      return;
    }
    if (window.kensar?.openPos) {
      await window.kensar.openPos();
      return;
    }
    setFailureDetail("No pudimos abrir el POS desde esta pantalla.");
  } catch (err) {
    setFailureDetail(
      err instanceof Error ? err.message : "No se pudo reintentar el POS."
    );
  } finally {
    if (checkConnectionBtn) {
      checkConnectionBtn.disabled = false;
    }
  }
};

const openConfig = async () => {
  if (window.kensar?.openConfig) {
    await window.kensar.openConfig();
  }
};

if (failureReason || failureCode || failureUrl) {
  const parts = [];
  if (failureCode) parts.push(`codigo ${failureCode}`);
  if (failureReason) parts.push(failureReason);
  if (failureUrl) parts.push(failureUrl);
  setFailureDetail(`Fallo de carga: ${parts.join(" | ")}`);
}

window.addEventListener("online", () => {
  setConnectionState(true);
  void checkApi();
});

window.addEventListener("offline", () => {
  setConnectionState(false);
  setApiState("Sin internet", "bad");
});

retryPosBtn?.addEventListener("click", () => {
  void retryOpenPos();
});

openConfigBtn?.addEventListener("click", () => {
  void openConfig();
});

checkConnectionBtn?.addEventListener("click", () => {
  void refreshStatus();
});

void (async () => {
  setConnectionState(navigator.onLine);
  if (window.kensar?.getConfig) {
    try {
      const config = await window.kensar.getConfig();
      if (config?.stationLabel) {
        stationName.textContent = config.stationLabel;
      } else if (config?.stationEmail) {
        stationName.textContent = config.stationEmail;
      } else if (config?.stationId) {
        stationName.textContent = config.stationId;
      } else {
        stationName.textContent = "Estacion no configurada";
      }
    } catch {
      stationName.textContent = "No pudimos leer la estacion";
    }
  } else {
    stationName.textContent = "No disponible";
  }

  if (!failureDetail?.textContent || failureDetail.textContent === "Sin detalle disponible.") {
    if (navigator.onLine) {
      setFailureDetail(
        "La red del equipo responde, pero el POS remoto no cargo correctamente."
      );
    } else {
      setFailureDetail(
        "No hay internet en este equipo. Revisa conexion fisica o Wi-Fi antes de reintentar."
      );
    }
  }

  await refreshStatus();
})();
