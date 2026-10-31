// Diagnóstico temporal del proceso principal. Solo registra anomalías:
// bloqueos del event loop, operaciones síncronas lentas e IPC lentos. No emite
// nada mientras el proceso funciona con normalidad.
const { monitorEventLoopDelay } = require("perf_hooks");

const STALL_PROBE_MS = 250;
const STALL_REPORT_MS = 400;
const SLOW_OPERATION_MS = 40;
const RECENT_OPERATIONS_LIMIT = 40;
const SUMMARY_INTERVAL_MS = 60_000;

const noop = () => {};
const passthrough = (_name, fn) => fn();

const createMainDiagnostics = ({ enabled, log = console.warn } = {}) => {
  if (!enabled) {
    return {
      enabled: false,
      start: noop,
      measure: passthrough,
      record: noop,
      instrumentIpc: noop,
    };
  }

  const recent = [];
  // Llamadas IPC por canal desde el último reporte: un bucle de eventos se ve
  // como un canal con cientos de llamadas aunque cada una sea rápida.
  let ipcCalls = {};
  const record = (name, durationMs, meta) => {
    const entry = { name, durationMs: Math.round(durationMs), endedAt: Date.now(), ...(meta || {}) };
    recent.push(entry);
    if (recent.length > RECENT_OPERATIONS_LIMIT) recent.shift();
    if (durationMs >= SLOW_OPERATION_MS) log("[POS diag] operación lenta en main", entry);
  };

  const measure = (name, fn, meta) => {
    const startedAt = performance.now();
    try {
      return fn();
    } finally {
      record(name, performance.now() - startedAt, typeof meta === "function" ? meta() : meta);
    }
  };

  const instrumentIpc = (ipcMain) => {
    const originalHandle = ipcMain.handle.bind(ipcMain);
    ipcMain.handle = (channel, handler) => originalHandle(channel, async (...args) => {
      ipcCalls[channel] = (ipcCalls[channel] || 0) + 1;
      const startedAt = performance.now();
      try {
        return await handler(...args);
      } finally {
        // Mide la duración total, incluida la parte asíncrona. Solo la parte
        // síncrona bloquea el loop; el detector de bloqueos permite separarlas.
        const durationMs = performance.now() - startedAt;
        if (durationMs >= SLOW_OPERATION_MS) record(`ipc:${channel}`, durationMs);
      }
    });
  };

  const start = () => {
    const histogram = monitorEventLoopDelay({ resolution: 20 });
    histogram.enable();
    let expectedAt = performance.now() + STALL_PROBE_MS;
    let lastStallLoggedAt = 0;
    const probe = setInterval(() => {
      const now = performance.now();
      const driftMs = now - expectedAt;
      expectedAt = now + STALL_PROBE_MS;
      if (driftMs < STALL_REPORT_MS) return;
      const windowStart = Date.now() - driftMs - STALL_PROBE_MS;
      const suspects = recent.filter((entry) => entry.endedAt >= windowStart);
      // Un bloqueo largo se reporta siempre; los cortos se agrupan para no
      // inundar la terminal cuando el equipo está bajo carga sostenida.
      if (driftMs < 2_000 && Date.now() - lastStallLoggedAt < 10_000) return;
      lastStallLoggedAt = Date.now();
      const topIpc = Object.fromEntries(Object.entries(ipcCalls).sort((a, b) => b[1] - a[1]).slice(0, 5));
      ipcCalls = {};
      log("[POS diag] event loop bloqueado", {
        driftMs: Math.round(driftMs),
        suspects,
        ipcCallsSinceLastReport: topIpc,
      });
    }, STALL_PROBE_MS);
    probe.unref?.();
    const summary = setInterval(() => {
      const maxMs = histogram.max / 1e6;
      if (maxMs >= STALL_REPORT_MS) {
        log("[POS diag] resumen event loop (60 s)", {
          p50Ms: Math.round(histogram.percentile(50) / 1e6),
          p99Ms: Math.round(histogram.percentile(99) / 1e6),
          maxMs: Math.round(maxMs),
        });
      }
      histogram.reset();
    }, SUMMARY_INTERVAL_MS);
    summary.unref?.();
  };

  return { enabled: true, start, measure, record, instrumentIpc };
};

module.exports = { createMainDiagnostics };
