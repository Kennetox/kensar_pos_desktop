const API_BASE_URL = "https://api.metrikpos.com";

const form = document.getElementById("station-form");
const emailInput = document.getElementById("station-email");
const passwordInput = document.getElementById("station-password");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear-config");

const setStatus = (message, type = "info") => {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
};

const setLoading = (loading) => {
  form.querySelectorAll("input, button").forEach((el) => {
    el.disabled = loading;
  });
};

const promptForAdminPin = async (mode) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const label =
      mode === "set"
        ? "Crea un PIN admin (4-8 dígitos)."
        : "Ingresa el PIN admin.";
    const pin = window.prompt(label, "");
    if (pin === null) return null;
    const trimmed = pin.trim();
    if (!/^\d{4,8}$/.test(trimmed)) {
      window.alert("PIN inválido. Usa 4 a 8 dígitos.");
      continue;
    }
    if (mode === "set") {
      const confirm = window.prompt("Confirma el PIN admin.", "");
      if (confirm === null) return null;
      if (confirm.trim() !== trimmed) {
        window.alert("Los PIN no coinciden.");
        continue;
      }
    }
    return trimmed;
  }
  return null;
};

const ensureAdminPin = async () => {
  const hasPin = await window.kensar.hasAdminPin();
  if (hasPin) return true;
  const pin = await promptForAdminPin("set");
  if (!pin) return false;
  const result = await window.kensar.setAdminPin(pin);
  if (!result?.ok) {
    window.alert(result?.error || "No pudimos guardar el PIN admin.");
    return false;
  }
  return true;
};

const verifyAdminPin = async () => {
  const pin = await promptForAdminPin("verify");
  if (!pin) return false;
  const ok = await window.kensar.verifyAdminPin(pin);
  if (!ok) {
    window.alert("PIN admin incorrecto.");
  }
  return ok;
};

const loadExisting = async () => {
  const config = await window.kensar.getConfig();
  if (config?.stationEmail) {
    emailInput.value = config.stationEmail;
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const stationEmail = emailInput.value.trim();
  const stationPassword = passwordInput.value.trim();
  if (!stationEmail || !stationPassword) {
    setStatus("Ingresa correo y contraseña.", "error");
    return;
  }
  setLoading(true);
  setStatus("Validando estacion...", "info");
  try {
    const device = await window.kensar.getDeviceInfo();
    const res = await fetch(`${API_BASE_URL}/auth/pos-station-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        station_email: stationEmail,
        station_password: stationPassword,
        device_id: device.deviceId,
        device_label: device.deviceLabel,
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = payload?.detail || "No pudimos validar la estacion.";
      setStatus(detail, "error");
      return;
    }

    await window.kensar.setConfig({
      stationId: payload.station_id,
      stationLabel: payload.station_label,
      stationEmail: payload.station_email,
    });

    const adminReady = await ensureAdminPin();
    if (!adminReady) {
      setStatus("Configura el PIN admin para continuar.", "error");
      return;
    }

    setStatus("Estacion configurada. Abriendo POS...", "success");
    setTimeout(() => {
      window.kensar.openPos();
    }, 500);
  } catch (err) {
    setStatus("Error de red al configurar la estacion.", "error");
  } finally {
    setLoading(false);
  }
});

clearBtn.addEventListener("click", async () => {
  const ok = await verifyAdminPin();
  if (!ok) return;
  await window.kensar.clearConfig();
  emailInput.value = "";
  passwordInput.value = "";
  setStatus("Configuracion reiniciada.", "info");
});

loadExisting();
