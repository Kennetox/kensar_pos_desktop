// Estado persistente del actualizador; independiente de las recargas del renderer.
function createUpdateController({ updater, supported, version, publish, install, timers = globalThis }) {
  let state = { status: supported ? "idle" : "unsupported", currentVersion: version,
    message: supported ? null : "Las actualizaciones automáticas están disponibles en la aplicación instalada de Windows." };
  let checking = null;
  let countdown = null;
  const send = (patch) => { state = { ...state, ...patch }; publish(state); return state; };
  const fail = (error) => {
    if (countdown) { timers.clearInterval(countdown); countdown = null; }
    console.error("Actualización POS:", error);
    return send({ status: "error", countdownSeconds: null,
      message: "No se pudo completar la actualización. Comprueba internet y vuelve a intentarlo." });
  };
  updater.autoDownload = true;
  updater.autoInstallOnAppQuit = true;
  if (supported) {
    updater.on("checking-for-update", () => send({ status: "checking", message: null }));
    updater.on("update-available", (info) => send({ status: "available", version: info.version, percent: 0, message: null }));
    updater.on("update-not-available", () => send({ status: "none", lastCheckedAt: Date.now(), message: null }));
    updater.on("download-progress", (p) => send({ status: "downloading", percent: Math.min(100, Math.max(0, Number(p.percent) || 0)) }));
    updater.on("update-downloaded", (info) => send({ status: "downloaded", version: info.version, percent: 100, lastCheckedAt: Date.now(), message: null }));
    updater.on("error", fail);
  }
  return {
    getState: () => state,
    check: async () => {
      if (!supported || ["available", "downloading", "downloaded", "countdown", "installing"].includes(state.status)) return state;
      if (checking) return checking;
      checking = Promise.resolve().then(() => updater.checkForUpdates()).then(() => state).catch(fail).finally(() => { checking = null; });
      return checking;
    },
    scheduleInstall: () => {
      if (state.status !== "downloaded" || countdown) return state;
      send({ status: "countdown", countdownSeconds: 15 });
      countdown = timers.setInterval(() => {
        const seconds = state.countdownSeconds - 1;
        if (seconds > 0) return send({ countdownSeconds: seconds });
        timers.clearInterval(countdown); countdown = null;
        send({ status: "installing", countdownSeconds: 0 });
        Promise.resolve().then(install).catch(fail);
      }, 1000);
      return state;
    },
    cancelInstall: () => {
      if (countdown) { timers.clearInterval(countdown); countdown = null; send({ status: "downloaded", countdownSeconds: null }); }
      return state;
    },
  };
}
module.exports = { createUpdateController };
