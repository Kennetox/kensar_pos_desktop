// Sondeo HTTP directo por socket de Node, sin dependencias de Electron.
const http = require("http");
const https = require("https");

const fetchLoopbackHealth = (url, signal) => new Promise((resolve, reject) => {
  const client = url.startsWith("https:") ? https : http;
  const startedAt = Date.now();
  const phases = {};
  const mark = (name) => { phases[name] = Date.now() - startedAt; };
  let settled = false;
  const settle = (callback, value) => {
    if (settled) return;
    settled = true;
    signal?.removeEventListener("abort", abortRequest);
    if (value instanceof Error) value.phases = { ...phases, reusedSocket: Boolean(request.reusedSocket) };
    callback(value);
  };
  const abortRequest = () => {
    const error = new Error("This operation was aborted");
    error.name = "AbortError";
    request.destroy(error);
  };
  // Conexión nueva por sondeo. El agente global de Node (keepAlive desde
  // Node 19) reutiliza el socket del sondeo anterior; Uvicorn cierra los
  // sockets ociosos a los 5 s, justo el intervalo del monitor, y la reutilización
  // terminaba en `read ECONNRESET` aunque el backend estuviera sano.
  const request = client.request(url, {
    method: "GET",
    agent: false,
    headers: { Accept: "application/json", Connection: "close" },
  }, (response) => {
    mark("response");
    const chunks = [];
    response.on("data", (chunk) => chunks.push(chunk));
    response.on("error", (error) => settle(reject, error));
    response.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      settle(resolve, {
        ok: response.statusCode >= 200 && response.statusCode < 300,
        status: response.statusCode || 0,
        json: async () => (raw ? JSON.parse(raw) : {}),
      });
    });
  });
  request.once("error", (error) => settle(reject, error));
  request.once("socket", (socket) => {
    mark("socket");
    if (socket.connecting) socket.once("connect", () => mark("connect"));
  });
  if (signal?.aborted) return abortRequest();
  signal?.addEventListener("abort", abortRequest, { once: true });
  request.end();
});

module.exports = { fetchLoopbackHealth };
